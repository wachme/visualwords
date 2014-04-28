var visualwordsServices = angular.module('visualwordsServices', ['ngResource']);

visualwordsServices.factory('Wordlist', function($resource) {
    return $resource('/api/');
});