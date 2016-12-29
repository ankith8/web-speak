(function(){
  'use strict';

  angular.module('app')
    .factory('speechRecognitionService',speechRecognitionService);

  speechRecognitionService.$inject = ['$window','_','$rootScope'];

  function speechRecognitionService($window, _, $rootScope) {
    var SpeechRecognition = $window.SpeechRecognition || $window.webkitSpeechRecognition;

    var recogniser;
    var isRecognising = false;
    var autoRestart = false;

    var commands = [];

    var noMatchCallback;
    var unRecognisedCallback;

    var service = {
      startRecognition: startRecognition,
      stopRecognition: stopRecognition,
      addCommand: addCommand,
      clearCommands: clearCommands,
      setNoMatchCallback: setNoMatchCallback,
      setUnrecognisedCallBack: setUnrecognisedCallBack
    };

    activate();

    function activate(){
      if(SpeechRecognition){
        recogniser = new SpeechRecognition();

        recogniser.continuous = true;
        recogniser.maxAlternatives = 3;

        recogniser.onstart = startHandler;
        recogniser.onend = endHandler;
        recogniser.onresult = resultHandler;
      }
    }

    function addCommand(commandText,cb){
      commands.push({text:_.toLower(commandText),callback:cb});
    }

    function clearCommands(){
      commands.length = 0;
    }

    function setNoMatchCallback(callback){
      noMatchCallback = callback;
    }

    function setUnrecognisedCallBack(callback){
      unRecognisedCallback = callback;
    }

    function resultHandler(event){
      if(event.results){
        var result = event.results[event.resultIndex];
        var transcript = result[0].transcript;

        if(result.isFinal){
          if(result[0].confidence < 0.5){
            if(unRecognisedCallback){
              unRecognisedCallback(transcript);
            }else {
              console.log("Unrecognised result"+transcript);
            }

          }
          else {
            var match = _.find(commands,{ text:_.toLower(_.trim(transcript)) });

            if(match){
                match.callback();
            }else if (noMatchCallback) {
              noMatchCallback(transcript);
            }else {
              console.log("no matching commands was foound for '"+transcript+"'");
            }

          }
        }

        $rootScope.$apply();
      }
    }

    function startHandler(){
      isRecognising = true;
    }

    function endHandler(){
      isRecognising = false;
      if(autoRestart){
        startRecognition();
      }
    }

    function startRecognition(){
      if(recogniser){
        if(!isRecognising){
            autoRestart = true;
            recogniser.start();
        }
      } else {
        throw new Error('speech recognition is not supported');
      }

    }

    function stopRecognition(){
      if(recogniser){
        autoRestart = true;
        recogniser.stop();
      }
    }

    return service;
  }
})();
