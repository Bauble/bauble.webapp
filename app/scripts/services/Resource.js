'use strict';

angular.module('BaubleApp')

    .factory('Resource', function (globals, $http) {
        return function(resourceRoot) {
            var resourceUrl = globals.apiRoot + resourceRoot,
                depth = 1;

            function get_url_from_resource(resource) {
                var url = resourceUrl + '/' + resource; // if an ID
                if(isNaN(Number(resource))) {
                    if(angular.isObject(resource)) {
                        // if an object then use the ref
                        url = resource.ref.indexOf(globals.apiRoot) === 0 ? resource.ref : globals.apiRoot + resource.ref;
                    } else {
                        // assume it a string and a ref
                        url = globals.apiRoot + resource;
                    }
                }
                return url;
            }

            return {
                /*
                 * resource can be an ID, a ref or an object with a ref
                 */
                get: function(resource) {
                    var config = {
                        method: 'GET',
                        url: get_url_from_resource(resource),
                        headers: globals.getAuthHeader()
                    };
                    config.headers.Accept = 'application/json;depth=' + depth;
                    return $http(config);

                },

                query: function(q, relations) {
                    q = (typeof q === "undefined") ? "" : q;
                    relations = (typeof relations !== "object") ? "" : relations;
                    var headers = globals.getAuthHeader();
                    headers.Accept = 'application/json;depth=' + depth;

                    var config = {
                        url: resourceUrl,
                        method: 'GET',
                        params: { q: q, relations: relations },
                        headers: headers
                    };
                    return $http(config);
                },

                save: function (data) {
                    // if the data has a ref then it already exists in the database
                    // and should be updated instead of creating a new one
                    var url = data.ref ? data.ref : resourceUrl,
                        headers = angular.extend(globals.getAuthHeader(), {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json;depth=' + depth
                        }),
                        config = {
                            // make sure the url has the api root on it
                            url: url.indexOf(globals.apiRoot) === 0 ?
                                url : globals.apiRoot + url,
                            method: data.ref ? 'PUT' : 'POST',
                            data: data,
                            headers: headers
                        };
                    return $http(config);
                },

                del: function(resource) {
                    var config = {
                        url: get_url_from_resource(resource),
                        method: 'DELETE'
                    };
                    return $http(config);
                },

                /*
                 * resource can be an ID, a ref or an object with a ref
                 */
                details: function(resource, callback) {
                    var config = {
                        url: get_url_from_resource(resource),
                        method: 'GET',
                        headers: { 'Accept': 'application/json;depth=2' }
                    };
                    return $http(config);
                },

                get_schema: function(scalars_only) {
                    var config = {
                        method: 'GET',
                        url: resourceUrl + '/schema',
                        params: scalars_only ?
                            { flags: 'scalars_only' } : undefined
                    };
                    return $http(config);
                },

                count: function(resource, relation, callback) {
                    var config = {
                        method: 'GET',
                        url: get_url_from_resource(resource) +
                            relation + "/count"
                    };
                    return $http(config);
                },

                setDepth: function(newDepth) {
                    depth = newDepth;
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
    }])

    // Organization service for CRUD location types
    .factory('Organization', ['Resource', function($resource) {
        return $resource('/organization');
    }])

    // Location service for CRUD location types
    .factory('User', ['Resource', function($resource) {
        return $resource('/user');
    }]);
;
