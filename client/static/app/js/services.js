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
            obj.words = obj.words.map(function(w) {
                return new Word(w);
            });
            obj.$_words = obj.words.map(function(w) {
                return w.id;
            });
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
                var i = self.$_words.indexOf(word.id);
                if(i != -1) {
                    promises.push(word.$save());
                    self.$_words.splice(i, 1);
                }
                else {
                    word.wordlist = self.id;
                    promises.push(word.$create());
                }
            });
            this.$_words.forEach(function(id) {
                promises.push(Word.prototype.$remove.call({ id: id }));
            });
            
            return $q.all(promises)['finally'](function() {
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
    
    .factory('findImages', function(providerFactory, API_URL) {
        return providerFactory('images', API_URL+'/provider/images/', ['word', 'n'], true);
    })
   
    .factory('findTranslations', function(providerFactory, API_URL) {
        return providerFactory('translations', API_URL+'/provider/translations/', ['word', 's_lang', 't_lang'], true);
    })
    
    .factory('promiseDefer', function($q) {
        return function(promise) {
            var defer = $q.defer();
            promise.then(function(result) {
                defer.resolve(result);
            });
            return defer;
        }
    });