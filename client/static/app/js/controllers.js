var controllers = angular.module('controllers', []);

controllers.controller('WordlistsCtrl', function($scope, Wordlist) {
    $scope.wordlists = Wordlist.query();
});