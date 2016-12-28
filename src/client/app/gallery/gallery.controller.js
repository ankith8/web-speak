(function(){
  'use strict';

  angular.module('app')
    .controller('GalleryController',GalleryController);

  GalleryController.$inject = ['$window','galleryService','$interval','$scope','galleryModalService'];

  function GalleryController($window, galleryService, $interval,$scope,galleryModalService){
    var vm = this;
    vm.alert = [];
    vm.addAlert = addAlert;
    vm.closeAlert = closeAlert;
    vm.selectImage = selectImage;
    vm.isSelected = isSelected;
    vm.next = next;
    vm.previous = previous;
    vm.startSlideShow = startSlideShow;
    vm.stopSlideShow = stopSlideShow;
    vm.editCaption = editCaption;

    vm.album;

    vm.selectedIndex = -1;
    vm.isSlideShowRunning = false;

    activate();

    function activate(){
      getImages();
    }

    function editCaption(){
      if(vm.album.images && vm.album.images.length > 0){
        if(vm.selectedIndex < 0){
          selectImage(0);
        }

        stopSlideShow();

        var selectedImage = vm.album.images[vm.selectedIndex];
        galleryModalService.editCaption(selectedImage.caption)
          .then(
            function(newCaption){
              if(selectedImage.caption !== newCaption){
                selectedImage.caption = newCaption;
                galleryService.saveImageData(angular.toJson(vm.album))
                  .then(function(){
                    addAlert('success','caption saved');
                  });
              }
            },
            function(){
              console.log('Modal Dismissed');
            }
          );
      }

    }

    $scope.$on('$locationChangeStart',function(){
      stopSlideShow();
    });

    var slideShowPromise;

    function startSlideShow(){
      if(!angular.isDefined(slideShowPromise)){
        next();
        slideShowPromise = $interval(next,3000);
        vm.isSlideShowRunning = true;
      }
    }

    function stopSlideShow(){
      if(angular.isDefined(slideShowPromise)){
        $interval.cancel(slideShowPromise);
        slideShowPromise = undefined;
        vm.isSlideShowRunning = false;
      }
    }

    function previous(){
      var index = vm.selectedIndex;
      index--;
      if(index < 0){
        index = vm.album.images.length - 1;
      }
      selectImage(index);
    }

    function next(){
      var index = vm.selectedIndex;
      index++;
      if(index >= vm.album.images.length){
        index = 0;
      }
      selectImage(index);
    }

    function getImages(){
      galleryService.getImageData()
        .then(function (response){
          vm.album = response.data;
        });
    }

    function isSelected(index){
      return vm.selectedIndex === index;
    }

    function selectImage(index) {
      $window.scrollTo(0,0);
      vm.selectedIndex = index;
    }

    function addAlert(type,msg){
      vm.alerts.push({type:type,message:msg});
    }

    function closeAlert(index){
      vm.alerts.splice(index,1);
    }

  }
})();
