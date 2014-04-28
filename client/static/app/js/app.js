var visualwordsApp = angular.module('visualwordsApp', [
    'ngRoute',
    'visualwordsControllers',
    'visualwordsServices'
]);

visualwordsApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/static/app/partials/wordlist-list.html',
            controller: 'WordlistsCtrl'
        })
});