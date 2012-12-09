'use strict';

/*
 * Bauble services
 */

angular.module('BaubleApp.services', ['ngResource'])
    .factory("globals", function() {
        return {
            apiRoot: "/api/v1"
        };
    })

    .factory("Search", ['$http', function($http) {
        return function(value, callback) {
            return $http({method: 'GET', url: '/search', params: {'q': value}})
                .then(callback);
    };
    }])

    // Family service for CRUD family types
    .factory('Family', ['globals', '$http', '$resource', function(globals, $http, $resource) {
        var resourceRoot = globals.apiRoot + '/family';
        return {
            get: function(id, callback) {
                    return $http({ method: 'GET', url: resourceRoot + '/' + id })
                                .then(callback);
                },
            save: function (data, callback) {
                    // create if there's no id in data else update
                    // create or update??
                    var url = resourceRoot;
                    // if(data && (data.id !== undefined))
                    //     url = resourceRoot + '/' + data.id;
                    return $http({ method: 'POST', url: url, data: $.param(data),
                                   headers: { 'Content-Type': 'application/x-www-form-urlencoded',
                                              'Accept': 'application/json'}})
                                .then(callback);
                },
            del: function(id, callback) {
                return $http({ method: 'DELETE', url: resourceRoot + '/' + id })
                            .then(callback);
                }
        };
        // return $resource(globals.apiRoot + '/family/:familyId', {}, {
        //     'get': {method: 'GET'}, //params: {familyId: '999'}}
        //     'save': {
        //             method: 'POST',
        //         },
        //     'delete': {method: 'DELETE'}
        // });
    }]);


