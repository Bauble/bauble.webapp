'use strict';

angular.module('BaubleApp')
  .factory('Search', function ($http, globals) {
    return function(value, callback) {
        return $http({method: 'GET', url: globals.apiRoot + '/search', params: {'q': value}})
            .then(callback);
    };
  });
