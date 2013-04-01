'use strict';

angular.module('BaubleApp')

    .factory('Resource', function (globals, $http) {
        return function(resourceRoot) {
            var resourceUrl = globals.apiRoot + resourceRoot;
            return {
                get: function(resource, callback) {
                    var url = resourceUrl + '/' + resource; // if an ID
                    if(isNaN(Number(resource))) {
                        // if an object then use the ref
                        url = resource.ref.indexOf(globals.apiRoot) === 0 ? resource.ref : globals.apiRoot + resource.ref;
                    }
                    return $http({ method: 'GET', url: url }).then(callback, callback);
                },
                query: function(q, relations, callback) {
                    callback = (typeof relations === "function") ? relations : callback;
                    relations = (typeof relations !== "object") ? "" : relations;
                    q = (typeof q === "undefined") ? "" : q;
                    return $http({ method: 'GET', url: resourceUrl,
                                params: { q: q, relations: relations }})
                        .then(callback, callback);
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
                                .then(callback, callback);
                },
                del: function(resource, callback) {
                    var url = resourceUrl + '/' + resource; // if an ID
                    if(isNaN(Number(resource))) {
                        // if an object then use the ref
                        url = resource.ref.indexOf(globals.apiRoot) === 0 ? resource.ref : globals.apiRoot + resource.ref;
                    }
                    return $http({ method: 'DELETE', url: url }).then(callback, callback);
                },
                details: function(resource, callback) {
                    // resource can be an id or an JSON object with a ref property
                    var url = resourceUrl + '/' + resource; // if an ID
                    if(isNaN(Number(resource)) && typeof resource != "undefined") {
                        // if an object then use the ref
                        url = resource.ref.indexOf(globals.apiRoot) === 0 ? resource.ref : globals.apiRoot + resource.ref;
                    }
                    return $http({ method: 'GET', url: url,
                               headers: { 'Accept': 'application/json;depth=2' }})
                            .then(callback, callback);
                },
                get_schema: function(scalars_only, callback) {
                    var url = resourceUrl + '/schema',
                        params = scalars_only ? { flags: 'scalars_only' } : undefined,
                        callback = typeof scalars_only == 'function' ? scalars_only : callback;
                    return $http({ method: 'GET', url: url, params: params }).then(callback, callback);
                }
            };
        };
    })

    .factory('Family', ['Resource', function($resource) {
        return $resource('/family');
    }])

    // Genus service for CRUD genus types
    .factory('Genus', ['Resource', function($resource) {
        return $resource('/genus');
    }])

    // Taxon service for CRUD taxon types
    .factory('Taxon', ['Resource', function($resource) {
        return $resource('/taxon');
    }])

    // Accession service for CRUD accession types
    .factory('Accession', ['Resource', function($resource) {
        return $resource('/accession');
    }])

    // Plant service for CRUD plant types
    .factory('Plant', ['Resource', function($resource) {
        return $resource('/plant');
    }])

    // Location service for CRUD location types
    .factory('Location', ['Resource', function($resource) {
        return $resource('/location');
    }]);

