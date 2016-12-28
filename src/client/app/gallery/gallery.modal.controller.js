(function(){
  'use strict';

  angular.module('app')
    .controller('GalleryModalController',GalleryModalController);

  GalleryModalController.$inject = ['data','$uibModalInstance'];

  function GalleryModalController(data,$uibModalInstance) {
      var vm = this;
      vm.caption = data.caption;
      vm.cancel = cancel;
      vm.ok = ok;

      function cancel(){
        $uibModalInstance.dismiss();
      }

      function ok(){
        $uibModalInstance.close(vm.caption);
      }
    }
})();
