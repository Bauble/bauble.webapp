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

    .factory('ViewMeta', ['FamilyView', 'GenusView', function(FamilyView, GenusView) {
        return {
            'family': FamilyView,
            'genus': GenusView
        };
    }])

    .factory('FamilyView', [function(Family, Genus) {
        return {
            editor: "partials/family_editor.html",
            view: "partials/family_view.html",

            buttons: {
                "Edit": "#/edit/family",
                "Add Genus": "#/new/genus", // add genus to selected Family,
                "Delete": "#/delete" // delete the selected Family
            }
        };
    }])

    .factory('GenusView', [function(Family, Genus) {
        return {
            editor: "partials/genus_editor.html",
            view: "partials/genus_view.html",

            buttons: {
                "Edit": "#/edit/genus",
                "Add Taxon": "#/new/taxon", // add genus to selected Family,
                "Delete": "#delete" // delete the selected Family
            }
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
            query: function(q, callback) {
                    return $http({ method: 'GET', url: resourceRoot, params: { q: q } , isArray: true })
                                .then(callback);
                },
            save: function (data, callback) {
                    // create if there's no id in data else update
                    // create or update??
                    var url = resourceRoot;
                    var method = 'POST';
                    if(data.ref) {
                        method = 'PUT';
                    }

                    // if(data && (data.id !== undefined))
                    //     url = resourceRoot + '/' + data.id;
                    return $http({ method: method, url: url, data: $.param(data),
                                   headers: { 'Content-Type': 'application/x-www-form-urlencoded',
                                              'Accept': 'application/json'}})
                                .then(callback);
                },
            del: function(id, callback) {
                return $http({ method: 'DELETE', url: resourceRoot + '/' + id })
                            .then(callback);
                },
            details: function(id, callback) {
                return $http({ method: 'GET', url: resourceRoot + '/' + id,
                               headers: { 'Accept': 'application/json;depth=2' }})
                            .then(callback);
                },
            stats: function(ref, callback) {
                // return the calculated status for this resource
                console.log('this.family: ', this.family);
                return $http({ method: 'GET', url:  ref + "/stats" })
                            .then(callback);
                },
            synonyms: function(ref, callback) {
                return $http({ method: 'GET', url:  ref + "/synonyms" })
                            .then(callback);
            }
        };
    }])

    // Genus service for CRUD genus types
    .factory('Genus', ['globals', '$http', '$resource', function(globals, $http, $resource) {
        var resourceRoot = globals.apiRoot + '/genus';
        return {
            get: function(id, callback) {
                    return $http({ method: 'GET', url: resourceRoot + '/' + id })
                                .then(callback);
                },
            query: function(q, callback) {
                    return $http({ method: 'GET', url: resourceRoot, params: { q: q } })
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
    }]);



