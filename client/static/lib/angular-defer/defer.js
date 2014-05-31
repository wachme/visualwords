var defer = angular.module('Defer', []);

defer.factory('defer', function($q) {
    return function(func, result) {
        if(result == undefined)
            result = {};
        else if(typeof result != 'object')
            throw 'result must be an object';
        
        var defer = $q.defer();
        var promise = defer.promise.then(function(value) {
            result.$resolved = true;
            angular.extend(result, value);
            return value;
        });
        
        angular.extend(result, {
            $promise: promise,
            $resolved: false
        });
        
        func(defer);
        
        return result;
    };
});