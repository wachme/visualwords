var app = angular.module('app', [
    'ngRoute',
    'controllers',
    'services',
    'config'
]);

app
    .config(function($routeProvider, TPL_URL) {
        $routeProvider
            .when('/', {
                templateUrl: TPL_URL+'/wordlist-list.html',
                controller: 'WordlistsCtrl'
            })
    })

var config = angular.module('config', [])
    .constant('API_URL', '/api');