var visualwordsControllers = angular.module('visualwordsControllers', []);

visualwordsControllers.controller('WordlistsCtrl', function($scope, Wordlist) {
    $scope.wordlists = Wordlist.query();
});