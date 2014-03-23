'use strict';

angular.module('BaubleApp')
  .factory('Resource', ['$http', 'apiRoot', 'User',
    function ($http, apiRoot, User) {
        return function(resourceRoot) {
            var resourceUrl = apiRoot + resourceRoot;

            return {

                resourceUrl: apiRoot + resourceRoot,

                _getAuthHeader: function() {
                    var user = User.local();
                    return user ? user.getAuthHeader() : {};
                },

                /*
                 * resource can be an ID, a ref or an object with a ref
                 */
                get: function(resource, config) {
                    var params = config ? _.pick(config, ['pick', 'embed']) : null;
                    return $http({
                        url: [resourceUrl, resource.id || resource].join('/'),
                        method: 'GET',
                        headers: this._getAuthHeader(),
                        params: params
                    });
                },

                list: function(config) {
                    var params = config ? _.pick(config, ['embed']) : null;
                    var url = resourceUrl;
                    if(config && angular.isDefined(config.filter)) {
                        url += '?filter=' + encodeURIComponent(JSON.stringify(config.filter));
                    }

                    return $http({
                        url: url,
                        method: 'GET',
                        headers: this._getAuthHeader(),
                        params: params || null
                    });
                },

                query: function(options) {
                    options = angular.extend({
                        q: "",
                        relations: ""
                    }, options);
                    var config = {
                        url: resourceUrl,
                        method: 'GET',
                        params: {
                            q: options.q || "",
                            relations: options.relations || ""
                        },
                        headers: this._getAuthHeader()
                    };
                    return $http(config);
                },

                save: function (data) {
                    // if the data has a ref then it already exists in the
                    // database and should be updated instead of creating a new
                    // one
                    return $http({
                        url: data.id ? [resourceUrl, data.id].join('/') : resourceUrl,
                        method: data.id ? 'PATCH' : 'POST',
                        data: data,
                        headers: this._getAuthHeader()
                    });
                },

                remove: function(resource) {
                    var config = {
                        method: 'DELETE',
                        url: resourceUrl + (resource.id || resource),
                        headers: this._getAuthHeader()
                    };
                    return $http(config);
                },

                get_schema: function(scalars_only) {
                    var config = {
                        method: 'GET',
                        url: resourceUrl + '/schema',
                        headers: this._getAuthHeader(),
                        params: scalars_only ?
                            { flags: 'scalars_only' } : undefined
                    };
                    return $http(config);
                },

                count: function(resource, relation) {
                    return $http({
                        url: [resourceUrl, resource.id || resource, 'count'].join('/'),
                        method: 'GET',
                        headers: this._getAuthHeader(),
                        params: {
                            relation: relation
                        }
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
    }])

    .factory('Family', ['Resource', '$http', function($resource, $http) {
        var resource = $resource('/family');

        resource.getSynonym = function(family, synonym){
            return $http({
                url: [resource.resourceUrl, family.id || family, 'synonyms', synonym.id||synonym].join('/'),
                method: 'GET',
                headers: this._getAuthHeader()
            });
        };

        resource.listSynonyms = function(family){
            return $http({
                url: [resource.resourceUrl, family.id || family, 'synonyms'].join('/'),
                method: 'GET',
                headers: this._getAuthHeader()
            });
        };

        resource.addSynonym = function(family, synonym){
            return $http({
                url: [resource.resourceUrl, family.id || family, 'synonyms'].join('/'),
                method: 'POST',
                data: synonym,
                headers: this._getAuthHeader()
            });
        };

        resource.removeSynonym = function(family, synonym){
            return $http({
                url: [resource.resourceUrl, family.id || family, 'synonyms',
                      synonym.id || synonym].join('/'),
                method: 'DELETE',
                headers: this._getAuthHeader()
            });
        };
        return resource;
    }])

    // Genus service for CRUD genus types
    .factory('Genus', ['Resource', '$http', function($resource, $http) {
        var resource =  $resource('/genus');

        resource.getSynonym = function(genus, synonym){
            return $http({
                url: [resource.resourceUrl, genus.id || genus, 'synonyms', synonym.id||synonym].join('/'),
                method: 'GET',
                headers: this._getAuthHeader()
            });
        };

        resource.listSynonyms = function(genus){
            return $http({
                url: [resource.resourceUrl, genus.id || genus, 'synonyms'].join('/'),
                method: 'GET',
                headers: this._getAuthHeader()
            });
        };

        resource.addSynonym = function(genus, synonym){
            return $http({
                url: [resource.resourceUrl, genus.id || genus, 'synonyms'].join('/'),
                method: 'POST',
                data: synonym,
                headers: this._getAuthHeader()
            });
        };

        resource.removeSynonym = function(genus, synonym){
            return $http({
                url: [resource.resourceUrl, genus.id || genus, 'synonyms',
                      synonym.id || synonym].join('/'),
                method: 'DELETE',
                headers: this._getAuthHeader()
            });
        };

        return resource;

    }])

// Taxon service for CRUD taxon types
    .factory('Taxon', ['Resource', '$http', function($resource, $http) {
        var resource =  $resource('/taxon');

        resource.getSynonym = function(taxon, synonym){
            return $http({
                url: [resource.resourceUrl, taxon.id || taxon, 'synonyms', synonym.id||synonym].join('/'),
                method: 'GET',
                headers: this._getAuthHeader()
            });
        };

        resource.listSynonyms = function(taxon){
            return $http({
                url: [resource.resourceUrl, taxon.id || taxon, 'synonyms'].join('/'),
                method: 'GET',
                headers: this._getAuthHeader()
            });
        };

        resource.addSynonym = function(taxon, synonym){
            return $http({
                url: [resource.resourceUrl, taxon.id || taxon, 'synonyms'].join('/'),
                method: 'POST',
                data: synonym,
                headers: this._getAuthHeader()
            });
        };

        resource.removeSynonym = function(taxon, synonym){
            return $http({
                url: [resource.resourceUrl, taxon.id || taxon, 'synonyms',
                      synonym.id || synonym].join('/'),
                method: 'DELETE',
                headers: this._getAuthHeader()
            });
        };

        resource.listNames = function(taxon){
            return $http({
                url: [resource.resourceUrl, taxon.id || taxon, 'names'].join('/'),
                method: 'GET',
                headers: this._getAuthHeader()
            });
        };

        resource.saveName = function(taxon, name){
            var url = [resource.resourceUrl, taxon.id || taxon, 'names'].join('/');
            url += name.id ? ('/' + name.id) : '';
            console.log('name: ', name);
            return $http({
                url: url,
                method: name.id ? 'PATCH' : 'POST',
                data: name,
                headers: this._getAuthHeader()
            });
        };

        resource.removeName = function(taxon, name){
            return $http({
                url: [resource.resourceUrl, taxon.id || taxon, 'names',
                      name.id || name].join('/'),
                method: 'DELETE',
                headers: this._getAuthHeader()
            });
        };

        return resource;
    }])

// Accession service for CRUD accession types
    .factory('Accession', ['Resource', function($resource) {
        return $resource('/accession');
    }])

// Source service for CRUD source types
    .factory('Source', ['Resource', function($resource) {
        return $resource('/source');
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
    .factory('Organization', ['$http', 'Resource', function($http, $resource) {
        var resource = $resource('/organization');
        angular.extend(resource, {
            // get_admin: function(resource) {
            //     var config = {
            //         url: this.get_url_from_resource(resource) + "/admin",
            //         headers: angular.extend(globals.getAuthHeader(), {

            //         }),
            //         method: 'GET'
            //     };
            //     return $http(config);
            // },

            // approve: function(resource) {
            //     var config = {
            //         url: this.get_url_from_resource(resource) + "/approve",
            //         headers: angular.extend(globals.getAuthHeader(), {}),
            //         method: 'POST'
            //     };
            //     return $http(config);
            // }
        });
        return resource;
    }])

// User service for CRUD location types
  .factory('User2', ['$http', 'apiRoot', 'Resource',
    function($http, apiRoot, $resource) {
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
