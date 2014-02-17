'use strict';

angular.module('BaubleApp')

    .factory('Resource', function (globals, apiRoot, $http, User) {
        return function(resourceRoot) {
            var resourceUrl = apiRoot + resourceRoot;

            return {

                get_url_from_resource: function(resource) {
                    var url = resourceUrl + '/' + resource; // if an ID
                    if(isNaN(Number(resource))) {
                        if(angular.isObject(resource)) {
                            // if an object then use the ref
                            url = resource.ref.indexOf(apiRoot) === 0 ? resource.ref : apiRoot + resource.ref;
                        } else {
                            // assume it a string and a ref
                            url = apiRoot + resource;
                        }
                    }
                    return url;
                },
                _getAuthHeader: function() {
                    var user = User.local();
                    return user ? user.getAuthHeader() : {};
                },

                /*
                 * resource can be an ID, a ref or an object with a ref
                 */
                get: function(resource, config) {
                    var params = null;
                    return $http({
                        url: [resourceUrl, resource.id || resource].join('/'),
                        method: 'GET',
                        headers: this._getAuthHeader(),
                        params: params
                    });
                    // var config = {
                    //     method: 'GET',
                    //     url: [resourceUrl, ]
                    //     headers: angular.extend(globals.getAuthHeader(), {
                    //         'Accept': 'application/json;depth=' + depth
                    //     })
                    // };
                    // return $http(config);
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

                save: function (data) {
                    // if the data has a ref then it already exists in the
                    // database and should be updated instead of creating a new
                    // one
                    console.log('data: ', data);
                    var user = User.local();
                    return $http({
                        url: data.id ? [resourceUrl, data.id].join('/') : resourceUrl,
                        method: data.id ? 'PATCH' : 'POST',
                        data: data,
                        headers: user ? user.getAuthHeader() : null
                    });


                    var url = data.ref ? data.ref : resourceUrl,
                        headers = angular.extend(globals.getAuthHeader(), {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json;depth=' + depth
                        }),
                        config = {
                            // make sure the url has the api root on it
                            url: url.indexOf(apiRoot) === 0 ?
                                url : apiRoot + url,
                            method: data.ref ? 'PUT' : 'POST',
                            data: data,
                            headers: headers
                        };
                    return $http(config);
                },

                del: function(resource) {
                    var config = {
                        method: 'DELETE',
                        url: this.get_url_from_resource(resource),
                        headers: globals.getAuthHeader()
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
                        headers: angular.extend(globals.getAuthHeader(), {
                            'Accept': 'application/json;depth=2'
                        })
                    };
                    return $http(config);
                },

                get_schema: function(scalars_only) {
                    var config = {
                        method: 'GET',
                        url: resourceUrl + '/schema',
                        headers: angular.extend(globals.getAuthHeader(), {
                            'Accept': 'application/json;depth=1'
                        }),
                        params: scalars_only ?
                            { flags: 'scalars_only' } : undefined
                    };
                    return $http(config);
                },

                count: function(resource, relation) {
                    return $http({
                        url: [resourceUrl, 'count'].join('/'),
                        method: 'GET',
                        headers: this._getAuthHeader()
                    });
                    // var config = {
                    //     method: 'GET',
                    //     url: this.get_url_from_resource(resource) +
                    //         relation + "/count",
                    //     headers: globals.getAuthHeader()
                    // };
                    // return $http(config);
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

    // Source service for CRUD source types
    .factory('Source', ['Resource', function($resource) {
        return $resource('/sourcedetail');
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
        angular.extend(resource, {
            get_admin: function(resource) {
                var config = {
                    url: this.get_url_from_resource(resource) + "/admin",
                    headers: angular.extend(globals.getAuthHeader(), {

                    }),
                    method: 'GET'
                };
                return $http(config);
            },

            approve: function(resource) {
                var config = {
                    url: this.get_url_from_resource(resource) + "/approve",
                    headers: angular.extend(globals.getAuthHeader(), {}),
                    method: 'POST'
                };
                return $http(config);
            }
        });
        return resource;
    }])

    // User service for CRUD location types
    .factory('User2', ['$http', 'globals', 'apiRoot', 'Resource',
        function($http, globals, apiRoot, $resource) {
            var resource = $resource('/user');

            function AuthorizedUser(user) {

                var _user = {
                    getAuthHeader: function() {
                        return {'Authorization': 'Basic ' +
                                btoa(this.email + ':' + this.access_token)};
                    }
                };

                return _.extend(user, _user);
            }

            resource.extend = function(user) {
                return new AuthorizedUser(user);
            };

            resource.login = function(email, password) {
                return $http({
                    url: [apiRoot, 'login'].join('/'),
                    method: 'GET',
                    headers: {'Authorization': 'Basic ' + btoa(email + ':' + password)}
                });
            };

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

            resource.local = function(user) {
                var key = 'user';

                if(user === null) {
                    // deleter
                    localStorage.removeItem(key);
                } else {
                    if(user) {
                        // setter
                        localStorage.setItem(key, JSON.stringify(user));
                    } else {
                        // getter
                        var data = localStorage.getItem(key);
                        return data === null ? data : this.extend(JSON.parse(data));
                    }
                }
            };

            return resource;
        }])

    // Report service
    .factory('Report', ['Resource', function($resource) {
        return $resource('/report');
    }]);
