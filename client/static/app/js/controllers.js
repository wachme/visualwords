var controllers = angular.module('controllers', []);

controllers
    .controller('WordlistsCtrl', function($scope, Wordlist) {
        $scope.wordlists = Wordlist.query();
        $scope.create = function(wordlist, done) {
            wordlist.$create(function(resp) {
                $scope.wordlists.push(resp);
                done();
            });
        };
    })
    .controller('WordlistCtrl', function($scope, $routeParams, Word, Wordlist) {
        $scope.wordlist = Wordlist.get({id: $routeParams.id});
        $scope.edit = false;
        
        $scope.toggleEdit = function() {
            if($scope.edit)
                $scope.wordlist.$save();
            $scope.edit = !$scope.edit;
        };
    });