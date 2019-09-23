(function () {
    angular
        .module('catalogManager')
        .component('catalogObjectModify', {
            templateUrl: 'app/mainApp/components/catalogManager/components/catalogObjectModify.tmpl.html',
            controller: CatalogObjectModifyController,
            controllerAs: 'vm',
            bindings: {
                element: '=', //Bidirectional bindings
                fields: '<'
            }
        });
    function CatalogObjectModifyController($log) {
        var vm = this;

        vm.objectToModify = vm.element;
        vm.array_objects = {};

        function activate() {
            //Handle aditional information loading
            angular.forEach(vm.fields, function (field) {
                if (field.type === 'array_object') {
                    vm.array_objects[field.model] = {};
                }
            });
            bindData();
            //loadCatalogues();
            //Functionality delegated to the catalog-select Component
            loadCatalogArrays();
        }

        activate();

        vm.filesSelected = function filesSelected(files, field) {
            //fileProcessing MUST be a function in case it exists
            var fileProcessing = field.fileUploader['filesSelected'];
            if (fileProcessing) {
                files = fileProcessing(files);
            }
            vm.objectToModify[field.model] = files;
        };

        vm.onElementSelect = function onElementSelect(element, field) {
            if (element) {
                vm.objectToModify[field.model] = element;
                loadCatalogDependance(element, field.model);
            }
        };

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
                                        + field.model + ' @function loadCatalogDependance @controller CatalogModifyDialogController');
                                }
                            }
                        }
                    }
                });
            }
            else {
                //Unreachable unless code changes are done
                $log.error('No element has been provided for querying, @function loadCatalogDependance @controller CatalogModifyDialogController');
            }
        }

        function bindData() {
            var catalogElement;
            angular.forEach(
                vm.fields,
                function bindDataRepeater(field) {
                    if (
                        field.type !== 'catalog'
                        && field.type !== 'catalog_array'
                        //&& field.type !== 'array_object'
                        && field.type !== 'fileUploader') {
                        if (field.bindTo) {
                            vm.objectToModify[field.model] = angular.fromJson(
                                angular.toJson(
                                    vm.objectToModify[field.bindTo]
                                ));
                            delete (vm.objectToModify[field.bindTo]);
                        }
                    }
                    if (field.type === 'catalog') {
                        if (field.bindTo) {
                            if (vm.objectToModify[field.bindTo]) {
                                catalogElement = angular.fromJson(
                                    angular.toJson(
                                        vm.objectToModify[field.bindTo]
                                    ))[field.catalog.model];
                                vm.objectToModify[field.model] = catalogElement;
                                delete (vm.objectToModify[field.bindTo]);
                            }
                            else {
                                $log.error('@CatalogObjectModify Component, @bindData function, vm.objectToModify[field.bindTo] is undefined',
                                    field.bindTo,
                                    vm.objectToModify);
                            }
                        }
                        else {
                            if (vm.objectToModify[field.model]) {
                                catalogElement = angular.fromJson(
                                    angular.toJson(
                                        vm.objectToModify[field.model]
                                    ));
                                vm.objectToModify[field.model] = catalogElement;
                            }
                            else {
                                $log.error('@CatalogObjectModify Component, @bindData function, vm.objectToModify[field.model] is undefined',
                                    field.model,
                                    vm.objectToModify);
                            }
                        }
                    }
                }
            );
        }

        function loadCatalogArrays() {
            angular.forEach(
                vm.fields,
                function loadCatalogArraysRepeater(field) {
                    if (field.type === 'catalog_array') {
                        if (
                            vm.objectToModify[field.model]
                            || vm.objectToModify[field.bindTo]
                        ) {
                            var tempCatalogArray;
                            if (field.bindTo) {
                                tempCatalogArray = angular.fromJson(
                                    angular.toJson(
                                        vm.objectToModify[field.bindTo]
                                    ));
                                delete (vm.objectToModify[field.bindTo]);
                            }
                            else {
                                tempCatalogArray = angular.fromJson(
                                    angular.toJson(
                                        vm.objectToModify[field.model]
                                    ));
                            }

                            if (!vm.objectToModify[field.model]) {
                                vm.objectToModify[field.model] = [];
                            }

                            vm[field.model + '_initial'] = angular.fromJson(
                                angular.toJson(
                                    tempCatalogArray
                                ));

                            for (
                                var catalogIndex = 0;
                                catalogIndex < tempCatalogArray.length;
                                catalogIndex++
                            ) {
                                vm.objectToModify[field.model].push(
                                    tempCatalogArray[catalogIndex][field.catalog.model]
                                );
                            }
                        }
                    }
                }
            );
        }

        vm.onArrayElementSelect = function onArrayElementSelect(element, field) {
            if (field.hasOwnProperty('validations')
                && field.validations.hasOwnProperty('max')
                && !(field.validations.max <= vm.objectToModify[field.model].length)) {
                $log.error('Maximum quantity of "catalog_array" objects has been reached'
                    + '@function onArrayElementSelect @controller CatalogModifyDialogController');
            }
            else {
                vm.objectToModify[field.model] = element;
            }

        };

        vm.addObjectToArray = function addObjectToArray(field) {
            if (!vm.objectToModify[field.model]) {
                vm.objectToModify[field.model] = [];
            }
            vm.objectToModify[field.model].push({});
        };

        vm.removeObjectToArray = function removeObjectToArray(field, index) {
            vm.objectToModify[field.model].splice(index, 1);
        };
    }
})();
