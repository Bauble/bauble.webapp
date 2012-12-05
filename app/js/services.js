'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('BaubleApp.services', []).
  value('version', '0.1');

var Query = angular.module("Query", ['ngResource']);
Query.factory = function(){
    return $resource('/search', {}, {
	query: {
	    method: 'GET',
	    params: {query: 'query'},
	}
    });
}
