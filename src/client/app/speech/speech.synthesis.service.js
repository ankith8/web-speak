(function(){
  'use strict';

  angular.module('app')
    .factory('speechSynthesisService',speechSynthesisService);

  speechSynthesisService.$inject = ['$window'];

  function speechSynthesisService($window){
    var synthesiser = $window.speechSynthesis;

    var service = {
      speak: speak
    };

    return service;

    function speak(text){
      if(synthesiser){
        if(synthesiser.speaking || synthesiser.pending){
          synthesiser.cancel();
        }

        var utterance = new SpeechSynthesisUtterance(text);

        utterance.onerror = errorHandler;

        synthesiser.speak(utterance);
      }
    }

    function errorHandler(err){
      console.log(err);
    }
  }
})();
