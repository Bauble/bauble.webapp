'use strict';

angular.module('BaubleApp')

    .factory('Resource', function (globals, $http) {
        return function(resourceRoot) {
            var resourceUrl = globals.apiRoot + resourceRoot;

            return {

                get_url_from_resource: function(resource) {
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
                },


                /*
                 * resource can be an ID, a ref or an object with a ref
                 */
                get: function(resource, depth) {
                    var config = {
                        method: 'GET',
                        url: this.get_url_from_resource(resource),
                        headers: globals.getAuthHeader()
                    };
                    depth = depth || 1;
                    config.headers.Accept = 'application/json;depth=' + depth;
                    return $http(config);

                },

                query: function(options) {
                    options = angular.extend({
                        q: "",
                        relations: "",
                        depth: 1
                    }, options);
                    var config = {
                        url: resourceUrl,
                        method: 'GET',
                        params: {
                            q: options.q || "",
                            relations: options.relations || ""
                        },
                        headers: angular.extend(globals.getAuthHeader(), {
                            'Accept': 'application/json;depth=' + options.depth || 1
                        })
                    };
                    return $http(config);
                },

                save: function (data, depth) {
                    // if the data has a ref then it already exists in the
                    // database and should be updated instead of creating a new
                    // one
                    depth = depth || 2;
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
                        url: this.get_url_from_resource(resource),
                        method: 'DELETE'
                    };
                    return $http(config);
                },

                /*
                 * resource can be an ID, a ref or an object with a ref
                 */
                details: function(resource) {
                    // TODO: this method is obsolete now that we pass depth to
                    // get()
                    var config = {
                        url: this.get_url_from_resource(resource),
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

                count: function(resource, relation) {
                    var config = {
                        method: 'GET',
                        url: this.get_url_from_resource(resource) +
                            relation + "/count"
                    };
                    return $http(config);
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
    .factory('Organization', ['$http', 'globals', 'Resource', function($http, globals, $resource) {
        var resource = $resource('/organization');
        resource.get_admin = function(resource) {
            var config = {
                url: this.get_url_from_resource(resource) + "/admin",
                headers: angular.extend(globals.getAuthHeader(), {

                }),
                method: 'GET'
            };
            return $http(config);
        };
        return resource;
    }])

    // Location service for CRUD location types
    .factory('User', ['$http', 'globals', 'Resource', function($http, globals, $resource) {
        var resource = $resource('/user');
        resource.setPassword = function(resource, password) {
            var config = {
                url: this.get_url_from_resource(resource) + "/password",
                headers: angular.extend(globals.getAuthHeader(), {
                    'Content-Type': 'application/json'
                }),
                method: 'POST',
                data: { password: password }
            };
            return $http(config);
        };
        return resource;
    }]);
