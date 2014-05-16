var directives = angular.module('directives', []);

directives
    .directive('createWordlistModal', function(Wordlist, Languages, TPL_URL) {
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
                
                scope.newWordlist = {};
                Languages.$promise.success(function(langs) {
                    angular.extend(scope.newWordlist,{
                        s_lang: langs[0].value,
                        t_lang: langs[1].value
                    });
                });
                
                scope.submit = function(data) {
                    var wordlist = new Wordlist(data);
                    scope.create(wordlist, close);
                };
            },
            templateUrl: TPL_URL+'/create-wordlist-modal.html'
        };
    })
    .directive('languageInput', function(Languages) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                opposed: '=?'
            },
            link: function(scope, el, attrs) {
                scope.languages = Languages;
                if(attrs.opposed == undefined)
                    scope.opposed = '!';
            },
            template: '<select ng-options="l.value as l.name+\' (\'+l.value+\')\' for l in languages'
                + ' | filter:{value:\'!\'+opposed}"></select>',
        };
    });