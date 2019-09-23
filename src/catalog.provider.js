(function () {
    'use strict';

    angular
        .module('catalogManager')
        .factory('CATALOG', CatalogProvider);

    function CatalogProvider(
        $http,
        $q
    ) {
        var vm = this;

        vm.genericCatalog = {
            url: null,
            getByID: function (id) {
                var deferred = $q.defer();
                $http.get(
                    vm.genericCatalog.url + '/' + id)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function (errorResponse) {
                        deferred.reject(errorResponse);
                    });
                return deferred.promise;
            },
            list: function (queries) {
                var deferred = $q.defer();
                //Copying the url
                var url = angular.fromJson(angular.toJson(vm.genericCatalog.url));

                if (queries) {
                    //Adding the queries array, if exists
                    url = url + buildQueryString(queries);
                }
                $http.get(url)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function (errorResponse) {
                        deferred.reject(errorResponse);
                    });
                return deferred.promise;
            },
            create: function (object) {
                var deferred = $q.defer();
                $http.post(
                    vm.genericCatalog.url, object)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function (errorResponse) {
                        deferred.reject(errorResponse);
                    });
                return deferred.promise;
            },
            update: function (id, object) {
                var deferred = $q.defer();
                $http.put(
                    vm.genericCatalog.url + '/' + id, object)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function (errorResponse) {
                        deferred.reject(errorResponse);
                    });
                return deferred.promise;
            },
            patch: function (id, object) {
                var deferred = $q.defer();
                $http.patch(
                    vm.genericCatalog.url + '/' + id, object)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function (errorResponse) {
                        deferred.reject(errorResponse);
                    });
                return deferred.promise;
            },
            remove: function (id) {
                var deferred = $q.defer();
                $http.delete(
                    vm.genericCatalog.url + '/' + id)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function (errorResponse) {
                        deferred.reject(errorResponse);
                    });
                return deferred.promise;
            },
            search: function (queries) {
                var deferred = $q.defer();
                var queryString = buildQueryString(queries);
                $http.get(
                    vm.genericCatalog.url + queryString)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function (errorResponse) {
                        deferred.reject(errorResponse);
                    });
                return deferred.promise;
            }
        };

        //Locals

        var service = vm.genericCatalog;

        //Internal functions

        var buildQueryString = function builQueryString(queries) {
            var queryString;
            if (queries) {
                if (queries.length > 0) {
                    queryString = '?';
                    angular.forEach(queries, function queriesIterator(query, index) {
                        if (index === 0) {
                            //First iteration
                            queryString = queryString + query;
                        }
                        else {
                            //Any other iteration
                            queryString = queryString + '&' + query;
                        }
                    });
                }
            }
            return queryString;
        };

        return service;

    }

})();
