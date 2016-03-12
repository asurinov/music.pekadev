/**
 * Created by Machete on 12.03.2016.
 */
(function(){
    angular.module('app').controller('CreateAlbumCtrl', CreateAlbumCtrl);

    CreateAlbumCtrl.$inject = ['$uibModalInstance'];

    function CreateAlbumCtrl($uibModalInstance){
        var vm = this;

        vm.albumName = '';

        vm.ok = ok;
        vm.cancel = cancel;

        function ok() {
            $uibModalInstance.close(vm.albumName);
        };

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();