var defer = angular.module('Defer', []);

defer.factory('defer', function($q) {
    return function(func, result) {
        if(result == undefined)
            result = {};
        else if(typeof result != 'object')
            throw 'result must be an object';
        
        var defer = $q.defer();
        
        angular.extend(result, {
            $promise: defer.promise,
            $resolved: false
        });
        
        defer.promise.then(function(value) {
            result.$resolved = true;
            angular.extend(result, value);
        });
        
        func(defer);
        
        return result;
    };
});