var services = angular.module('services', ['ngResource']);

function model_stringify(model) {
    return JSON.stringify(model, function(k, v) {
        return k[0] == '$' ? undefined : v;
    });
}

services
    .config(function($resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    })
    .factory('Word', function($resource, API_URL) {
        return $resource(API_URL+'/words/:id', {'id': '@id'});
    })
    .factory('Wordlist', function($resource, Word, API_URL) {
        function transformRequest(obj) {
            delete obj.words;
            return model_stringify(obj);
        }
        return $resource(API_URL+'/wordlists/:id', {'id': '@id'}, {
            get: {
                method: 'GET',
                transformResponse: function(data) {
                    obj = JSON.parse(data);
                    obj.words = obj.words.map(function(w) { return new Word(w); });
                    return obj;
                }
            },
            create: {
                method: 'POST',
                transformRequest: transformRequest
            },
            save: {
                method: 'PUT',
                transformRequest: transformRequest
            }
        });
    })
    
    .factory('Languages', function($http, API_URL) {
        return (result = angular.extend([], {
            $promise: $http.get(API_URL+'/provider/languages/').success(function(data) {
                angular.extend(result, data);
            })
        }));
    });