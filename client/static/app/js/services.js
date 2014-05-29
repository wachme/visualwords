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
        return $resource(API_URL+'/words/:id', {'id': '@id'}, {
            create: {
                method: 'POST'
            },
            save: {
                method: 'PUT'
            }
        });
    })
    .factory('Wordlist', function($resource, $q, Word, API_URL) {
        function transformRequest(obj) {
            delete obj.words;
            return model_stringify(obj);
        }
        function transformResponse(data) {
            obj = JSON.parse(data);
            obj.words = obj.words.map(function(w) { return new Word(w); });
            return obj;
        }
        var resource = $resource(API_URL+'/wordlists/:id', {'id': '@id'}, {
            get: {
                method: 'GET',
                transformResponse: transformResponse
            },
            create: {
                method: 'POST',
                transformRequest: transformRequest
            },
            save: {
                method: 'PUT',
                transformRequest: transformRequest,
                transformResponse: transformResponse
            }
        });
        var $save = resource.prototype.$save;
        
        resource.prototype.$save = function() {
            var self = this,
                args = arguments,
                promises = [];
            this.words.forEach(function(word) {
                promises.push(word.$save());
            });
            return $q.all(promises).then(function() {
                return $save.apply(self, args);
            });
        };
        
        return resource;
    })
    
    .factory('Languages', function($http, API_URL, defer) {
        return defer(function(d) {
            $http.get(API_URL+'/provider/languages/').success(function(data) {
                d.resolve(data);
            });
        }, []);
    })
    
    .factory('providerFactory', function($http, $cacheFactory, defer) {
        return function(name, url, params, collection) {
            var cache = $cacheFactory(name);
            
            return function() {
                var args = Array.prototype.slice.call(arguments);
                
                return defer(function(d) {
                    var cacheId = args.join(':'),
                    cached = cache.get(cacheId);
                    if(cached) {
                        d.resolve(cached);
                        return;
                    }
                    var data = {};
                    params.forEach(function(param, i) {
                        data[param] = args[i];
                    });
                    $http.post(url, data).success(function(resp) {
                        cache.put(cacheId, resp);
                        d.resolve(resp);
                    });
                }, collection ? [] : {});
            };
        };
    })
    
    .factory('images', function(providerFactory, API_URL) {
        return providerFactory('images', API_URL+'/provider/images/', ['word', 'n'], true);
    })
   
    .factory('translations', function(providerFactory, API_URL) {
        return providerFactory('translations', API_URL+'/provider/translations/', ['word', 's_lang', 't_lang'], true);
    });