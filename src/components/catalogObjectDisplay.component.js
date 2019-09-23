(function () {
    angular
        .module('catalogManager')
        .component('catalogObjectDisplay', {
            templateUrl: './catalogObjectDisplay.tmpl.html',
            controller: CatalogObjectDisplay,
            bindings: {
                element: '<',
                fields: '<',
                onElementSelect: '&'
            }
        });

    function CatalogObjectDisplay($window, $log) {
        var vm = this;
        //Functions
        vm.elementSelection = elementSelection;
        vm.downloadFile = downloadFile;

        function activate() {
            treatObjectPropertyFields();
        }

        activate();

        //File downloading into new window
        function downloadFile(url) {
            $window.open(url);
        }

        function elementSelection(element) {
            vm.onElementSelect({ element: element });
        }

        //Treat the object fields and convert the desired property to a root property of the main object
        function treatObjectPropertyFields() {
            for (var element in vm.fields) {
                if (vm.fields[element].type === 'object_property') {
                    var nested_properties = vm.fields[element]
                        .model
                        .split('__');
                    var actualProperty;
                    if (vm.element.hasOwnProperty(nested_properties[0])) {
                        actualProperty = vm.element[nested_properties[0]];
                    } else {
                        $log.error("The property" + nested_properties[0]
                            + " of " + vm.element
                            + " is null or undefined @function treatObjectPropertyFields @CatalogObjectDisplay component");
                    }
                    if (actualProperty) {
                        for (var i = 1; i < nested_properties.length; i++) {
                            if (actualProperty[nested_properties[i]]) {
                                actualProperty = actualProperty[nested_properties[i]];
                            }
                        }
                    }
                    vm.element[vm.fields[element]
                        .model] = actualProperty;
                }
            }
        }
    }
})();
