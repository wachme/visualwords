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
    .controller('WordlistCtrl', function($scope, $routeParams, $route, Wordlist, Word) {
        function addNewWord() {
            $scope.newWord = new Word();
            $scope.words.push($scope.newWord);
        }
        
        $scope.$watch('newWord.word', function(w) {
            if(w) addNewWord();
        });
        
        $scope.wordlist = Wordlist.get({id: $routeParams.id}, function() {
            $scope.words = $scope.wordlist.words;
        });
        
        $scope.edit = false;
        
        $scope.toggleEdit = function() {
            if($scope.edit) {
                $scope.words.pop();
                $scope.wordlist.$save(function() {
                    $scope.words = $scope.wordlist.words;
                });
            }
            else {
                addNewWord();
            }
            
            $scope.edit = !$scope.edit;
        };
        
        $scope.discardEdit = function() {
            $route.reload();
        };
        
        $scope.remove = function(word) {
            var words = $scope.wordlist.words,
                i = words.indexOf(word);
            if(i != -1 && i != words.length-1)
                words.splice(i, 1);
        };
    });