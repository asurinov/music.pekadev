module App {

    class CreateAlbumCtrl {
        static $inject = ['$uibModalInstance'];

        albumName = '';

        constructor(private $uibModalInstance){}

        ok(){
            this.$uibModalInstance.close(this.albumName);
        }

        cancel(){
            this.$uibModalInstance.dismiss('cancel');
        }
    }

    angular.module('app').controller('CreateAlbumCtrl', CreateAlbumCtrl);
}