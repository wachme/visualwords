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
                Languages.$promise.then(function(langs) {
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
    })
    .directive('imageSearchTab', function(TPL_URL, images) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=',
                word: '@'
            },
            templateUrl: TPL_URL+'/image-search-tab.html',
            link: function(scope) {
                const wordsN = 20;
                
                scope.images = images(scope.word, wordsN);
                scope.prevBtnDisabled = true;
                scope.nextBtnDisabled = false;
                
                var imgI = 0;
                
                function checkBtns() {
                    scope.prevBtnDisabled = imgI == 0;
                    scope.nextBtnDisabled = imgI == scope.images.length - 1;
                }
                
                scope.prevImg = function() {
                    scope.ngModel = scope.images[--imgI].preview;
                    checkBtns();
                };
                scope.nextImg = function() {
                    scope.ngModel = scope.images[++imgI].preview;
                    checkBtns();
                };
                
                scope.images.$promise.then(function(images) {
                    scope.ngModel = images[0].preview;
                });
            }
        };
    })
    .directive('imageUrlTab', function(TPL_URL) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '='
            },
            templateUrl: TPL_URL+'/image-url-tab.html'
        };
    })
    .directive('imageInput', function(TPL_URL, images) {
        return {
            restrict: 'E',
            replace: true,
            require: 'ngModel',
            scope: {
                ngModel: '=',
                word: '@'
            },
            templateUrl: TPL_URL+'/image-input.html',
            link: function(scope, element, attrs, ngModel) {
                scope.tabs = {
                    search: {
                        image: '',
                        active: false
                    },
                    url: {
                        image: scope.ngModel,
                        active: false
                    }
                };

                scope.showSearchTab = function(tab) {
                    scope.tabs.search.active = true;
                    scope.tabs.url.active = false;
                    scope.$watch('tabs.search.image', ngModel.$setViewValue);
                };
                scope.showUrlTab = function() {
                    scope.tabs.url.active = true;
                    scope.tabs.search.active = false;
                    scope.$watch('tabs.url.image', ngModel.$setViewValue);
                };
                
                scope.ngModel ? scope.showUrlTab() : scope.showSearchTab();
            }
        };
    });