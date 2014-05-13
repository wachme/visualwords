var controllers = angular.module('controllers', []);

controllers.controller('WordlistsCtrl', function($scope, Wordlist) {
    $scope.wordlists = Wordlist.query();
    $scope.create = function(wordlist, done) {
        wordlist.$create(function(resp) {
            $scope.wordlists.push(resp);
            done();
        });
    };
});