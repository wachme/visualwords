var directives = angular.module('directives', []);

directives.directive('createWordlistModal', function(Wordlist, Languages, TPL_URL) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            create: '='
        },
        link: function(scope, element) {
            function close() {
                $(element).modal('hide');
            };
            
            scope.languages = Languages;

            scope.newWordlist = { s_lang: scope.languages[0].value, t_lang: scope.languages[1].value };
            
            scope.submit = function(data) {
                var wordlist = new Wordlist(data);
                scope.create(wordlist, close);
            };
        },
        templateUrl: TPL_URL+'/create-wordlist-modal.html'
    };
});