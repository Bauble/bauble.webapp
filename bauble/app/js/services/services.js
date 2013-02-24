'use strict';

/*
 * Bauble services
 */

// TODO: should rename services to Bauble.service_name, eg. Bauble.Search or Bauble.search

angular.module('BaubleApp.services', [])
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

    .factory('ViewMeta',
        ['FamilyView', 'GenusView', 'TaxonView', 'AccessionView', 'PlantView', 'LocationView',
            function(FamilyView, GenusView, TaxonView, AccessionView, PlantView, LocationView) {
                return {
                    'family': FamilyView,
                    'genus': GenusView,
                    'taxon': TaxonView,
                    'accession': AccessionView,
                    'plant': PlantView,
                    'location': LocationView
                };
    }])

    .factory('FamilyView', [function() {
        return {
            editor: "partials/family_editor.html",
            view: "partials/family_view.html",

            buttons: [
                { name: "Edit", event: "family-edit" },
                { name: "Add Genus", event: "family-addgenus" }, // add genus to selected Family,
                { name: "Delete", event: "family-delete"} // delete the selected Family
            ]
        };
    }])

    .factory('GenusView', [function() {
        return {
            editor: "partials/genus_editor.html",
            view: "partials/genus_view.html",

            buttons: [
                { name: "Edit", event: "genus-edit" },
                { name: "Add Taxon", event: "genus-addtaxon" }, // add Taxon to selected Genus
                { name: "Delete", event: "genus-delete" }  // delete the selected Genus
            ]
        };
    }])

    .factory('TaxonView', [function() {
        return {
            editor: "partials/taxon_editor.html",
            view: "partials/taxon_view.html",

            buttons: [
                { name: "Edit", event: "taxon-edit" },
                { name: "Add Accession", event: "taxon-addaccession" }, // add accession to selected Taxon
                { name: "Delete", event: "taxon-delete" } // delete the selected Taxon
            ]
        };
    }])

    .factory('AccessionView', [function() {
        return {
            editor: "partials/accession_editor.html",
            view: "partials/accession_view.html",

            buttons: [
                { name: "Edit", event: "acc-edit" },
                { name: "Add Plant", event: 'acc-addplant' }, // add plant to selected Accession,
                { name: "Delete",  event: 'acc-delete' } // delete the selected Accession
            ]
        };
    }])

    .factory('PlantView', [function() {
        return {
            editor: "partials/plant_editor.html",
            view: "partials/plant_view.html",
            buttons: [
                { name: "Edit", event: 'plant-edit' },
                { name: "Delete", event: 'plant-delete' } // delete the selected Plant
            ]
        };
    }])

    .factory('LocationView', [function() {
        return {
            editor: "partials/location_editor.html",
            view: "partials/location_view.html",
            buttons: [
                { name: "Edit", event: 'location-edit' },
                { name: "Delete", event: 'location-delete' } // delete the selected Location
            ]
        };
    }])

    .factory('Bauble.$resource', ['globals', '$http', function(globals, $http) {
        return function(resourceRoot) {
            var resourceUrl = globals.apiRoot + resourceRoot;
            return {
                get: function(resource, callback) {
                    var url = resourceUrl + '/' + resource; // if an ID
                    if(isNaN(Number(resource))) {
                        // if an object then use the ref
                        url = resource.ref.indexOf(globals.apiRoot) === 0 ? resource.ref : globals.apiRoot + resource.ref;
                    }
                    return $http({ method: 'GET', url: url }).then(callback);
                },
                query: function(q, relations, callback) {
                    relations = (typeof relations === "undefined") ? "" : relations;
                    q = (typeof q === "undefined") ? "" : q;
                    return $http({ method: 'GET', url: resourceUrl,
                                params: { q: q, relations: relations }})
                        .then(callback);
                },
                save: function (data, callback) {
                    // if the data has a ref then it already exists in the database
                    // and should be updated instead of creating a new one
                    var url = data.ref ? data.ref : resourceUrl;
                    var method = data.ref ? 'PUT' : 'POST';

                    // make sure the url has the api root on it
                    url = url.indexOf(globals.apiRoot) === 0 ? url : globals.apiRoot + url;
                    return $http({ method: method, url: url, data: data,
                                   headers: { 'Content-Type': 'application/json',
                                              'Accept': 'application/json'}})
                                .then(callback);
                },
                del: function(resource, callback) {
                    var url = resourceUrl + '/' + resource; // if an ID
                    if(isNaN(Number(resource))) {
                        // if an object then use the ref
                        url = resource.ref.indexOf(globals.apiRoot) === 0 ? resource.ref : globals.apiRoot + resource.ref;
                    }
                    return $http({ method: 'DELETE', url: url }).then(callback);
                },
                details: function(resource, callback) {
                    // resource can be an id or an JSON object with a ref property
                    var url = resourceUrl + '/' + resource; // if an ID
                    if(isNaN(Number(resource))) {
                        // if an object then use the ref
                        url = resource.ref.indexOf(globals.apiRoot) === 0 ? resource.ref : globals.apiRoot + resource.ref;
                    }
                    return $http({ method: 'GET', url: url,
                               headers: { 'Accept': 'application/json;depth=2' }})
                            .then(callback);
                },
                get_schema: function(scalars_only, callback) {
                    var url = resourceUrl + '/schema',
                        params = scalars_only ? { flags: 'scalars_only' } : undefined,
                        callback = typeof scalars_only == 'function' ? scalars_only : callback;
                    return $http({ method: 'GET', url: url, params: params }).then(callback);
                }
            };
        };
    }])

    .factory('Family', ['Bauble.$resource', function($resource) {
        return $resource('/family');
    }])

    // Family service for CRUD family types
    .factory('FamilyOld', ['globals', '$http', function(globals, $http) {
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
    .factory('Genus', ['Bauble.$resource', function($resource) {
        return $resource('/genus');
    }])

    // Taxon service for CRUD taxon types
    .factory('Taxon', ['Bauble.$resource', function($resource) {
        return $resource('/taxon');
    }])

    // Accession service for CRUD accession types
    .factory('Accession', ['Bauble.$resource', function($resource) {
        return $resource('/accession');
    }])

    // Plant service for CRUD plant types
    .factory('Plant', ['Bauble.$resource', function($resource) {
        return $resource('/plant');
    }])

    // Location service for CRUD location types
    .factory('Location', ['Bauble.$resource', function($resource) {
        return $resource('/location');
    }]);
