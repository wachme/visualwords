var app = angular.module('app', [
    'ngRoute',
    'Defer',
    'controllers',
    'services',
    'directives',
    'config'
]);

app
    .config(function($routeProvider, TPL_URL) {
        $routeProvider
            .when('/', {
                templateUrl: TPL_URL+'/wordlist-list.html',
                controller: 'WordlistsCtrl'
            })
            .when('/:id', {
                templateUrl: TPL_URL+'/wordlist-detail.html',
                controller: 'WordlistCtrl'
            });
    })

var config = angular.module('config', [])
    .constant('API_URL', '/api');