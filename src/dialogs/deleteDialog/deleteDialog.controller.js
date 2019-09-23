/* 
 *      dialog:{              //Labels to use in the creation dialog
 *          title: string,          (Optional) Title for the creation dialog, default is 'Search element'
 *          searchButton: string,   (Optional) Label for the Search button, default is 'Search'
 *          loadingText: string     (Optional) Text to show in the Loading, default is "Please wait..."
 *      },
 *      url:string,                 URL of the API for creation.
 *      id: string            //Object identifier to be removed
*/


(function () {
    angular
        .module('catalogManager')
        .controller('CatalogDeleteDialogController', CatalogDeleteDialogController);
    function CatalogDeleteDialogController(
        $mdDialog,
        dialog,
        id,
        CATALOG,
        url
    ) {
        var vm = this;

        vm.dialog = dialog;
        vm.id = id;
        vm.url = url;
        vm.CatalogProvider = CATALOG;

        //Functions
        vm.confirm = confirm;
        vm.cancel = cancel;

        function createProvider() {
            if (vm.hasOwnProperty('url')) {
                vm.CatalogProvider.url = vm.url;
            }
            else {
                $mdDialog.cancel('"url" parameter was not provided');
            }
        }

        function confirm() {
            createProvider();
            vm.removeLoader = vm.CatalogProvider
                .remove(vm.id)
                .then(function () {
                    $mdDialog.hide();
                })
                .catch(function (removeError) {
                    $mdDialog.cancel(removeError);
                });
        }

        function cancel() {
            $mdDialog.cancel(null);
        }

    }

})();
