(function(){
  'use strict';

  angular.module('app')
    .factory('speechSynthesisService',speechSynthesisService);

  speechSynthesisService.$inject = ['$window','_'];

  function speechSynthesisService($window,_){
    var synthesiser = $window.speechSynthesis;

    var service = {
      speak: speak,
      getVoices: getVoices
    };

    return service;

    function speak(text, settings){
      if(synthesiser){
        if(synthesiser.speaking || synthesiser.pending){
          synthesiser.cancel();
        }

        var utterance = new SpeechSynthesisUtterance(text);

        utterance.onerror = errorHandler;

        if(settings){
            var voice = _.find(getVoices(),{name:settings.voice});

            if(voice){
              utterance.voice = voice;
            }
            utterance.rate = settings.rate;
            utterance.pitch = settings.pitch;
            utterance.volume = settings.volume;
        }

        synthesiser.speak(utterance);
      }
    }

    function errorHandler(err){
      console.log(err);
    }

    function getVoices(){
      if(synthesiser){
        return synthesiser.getVoices();
      }
      return [];
    }
  }
})();
