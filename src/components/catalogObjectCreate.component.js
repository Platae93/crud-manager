(function () {
    angular
        .module('catalogManager')
        .component('catalogObjectCreate', {
            templateUrl: './catalogObjectCreate.tmpl.html',
            controller: CatalogObjectCreateController,
            controllerAs: 'vm',
            bindings: {
                element: '=', //Bidirectional bindings
                fields: '<'
            }
        });
    function CatalogObjectCreateController($log) {
        var vm = this;

        vm.objectToCreate = vm.element;

        activate();

        function activate() {
            angular.forEach(vm.fields, function (field) {
                if (field.type === 'array') {
                    vm.objectToCreate[field.model] = [];
                }
                if (field.type === 'object') {
                    vm.objectToCreate[field.model] = {};
                }
                //The field is any of the HTML5 types
                if (field['type'] !== 'fileUploader'
                    //&& field['type'] !== 'catalog'
                    //&& field['type'] !== 'options'
                    //&& field['type'] !== 'color'
                    //&& field['type'] !== 'array'
                    && field['type'] !== 'catalog_array'
                    && field['type'] !== 'object'
                    && field['type'] !== 'array_object'
                ) {
                    if (field.hasOwnProperty('initial_value')) {
                        //Loading initial values
                        vm.objectToCreate[field.model] = field.initial_value;
                    }
                    else {
                        field.lock = false;
                    }
                }
            });
        }

        vm.filesSelected = function filesSelected(files, field) {
            //fileProcessing MUST be a function in case it exists
            var fileProcessing = field.fileUploader['filesSelected'];
            if (fileProcessing) {
                files = fileProcessing(files);
            }
            vm.objectToCreate[field.model] = files;
        };

        vm.onElementSelect = function onElementSelect(element, field) {
            if (element) {
                vm.objectToCreate[field.model] = element;
                loadCatalogDependance(element, field.model);
            }
        };

        //Internal function
        //It loads the catalogues dependance on every catalogue select
        function loadCatalogDependance(element, fieldName) {
            //Validating that a element has been provided
            if (element) {
                vm.fields.forEach(function loadCataloguesDependanceFieldIterator(field) {
                    //Validating it's a catalog
                    if (field.hasOwnProperty('catalog')) {
                        //Validating it's a dependable catalog
                        if (field.catalog.hasOwnProperty('requires')) {
                            //Validating that this catalog indeed requires of the previously
                            //selected catalog.
                            if (fieldName === field.catalog.requires) {
                                //Validating that a query is provided
                                if (field.catalog.hasOwnProperty('query')) {
                                    field.catalog.query = field.catalog.query;
                                    field.catalog.query_value = element;
                                }
                                else {
                                    $log.error('No query has been provided in the catalog object of the field:'
                                        + field.model + ' @function loadCatalogDependance'
                                        + '@controller CatalogCreateDialogController');
                                }
                            }
                        }
                    }
                });
            }
            else {
                //Unreachable unless code changes are done
                $log.error('No element has been provided for querying,'
                    + '@function loadCatalogDependance @controller CatalogCreateDialogController');
            }
        }

        vm.onArrayElementSelect = function onArrayElementSelect(element, field) {
            if (field.hasOwnProperty('validations')
                && field.validations.hasOwnProperty('max')
                && !(field.validations.max <= vm.objectToModify[field.model].length)) {
                $log.error('Maximum quantity of "catalog_array" objects has been reached'
                    + '@function onArrayElementSelect @controller CatalogModifyDialogController');
            }
            else {
                vm.objectToCreate[field.model] = element;
            }

        };

        vm.onArrayElementRemove = function onArrayElementRemove(index, field) {
            vm.objectToCreate[field.model].splice(index, 1);
        };

        vm.addObjectToArray = function addObjectToArray(field) {
            if (!vm.objectToCreate[field.model]) {
                vm.objectToCreate[field.model] = [];
            }
            vm.objectToCreate[field.model].push({});
        };

        vm.removeObjectToArray = function removeObjectToArray(field, index) {
            vm.objectToCreate[field.model].splice(index, 1);
        };

    }
})();
