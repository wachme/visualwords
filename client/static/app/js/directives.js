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
                var imgI;
                
                function setImage(i) {
                    scope.ngModel = scope.images[i].preview;
                    scope.prevBtnDisabled = imgI == 0;
                    scope.nextBtnDisabled = imgI == scope.images.length - 1;
                }
                
                function loadImages() {
                    scope.images = images(scope.word, wordsN);
                    
                    scope.prevBtnDisabled = true;
                    scope.nextBtnDisabled = false;
                    
                    imgI = 0;
                    
                    scope.images.$promise.then(function(images) {
                        scope.ngModel = images[0].preview;
                    });
                }
                
                scope.prevImg = function() {
                    setImage(--imgI);
                };
                scope.nextImg = function() {
                    setImage(++imgI)
                };
                
                scope.$watch('word', loadImages);
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
    })
    .directive('translationInput', function($timeout, TPL_URL, translations) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=',
                word: '@',
                sLang: '@',
                tLang: '@'
            },
            require: 'ngModel',
            templateUrl: TPL_URL+'/translation-input.html',
            link: function(scope, element, attrs, ngModel) {
                var $element = $(element);
                var groups;
                
                function loadTranslations() {
                    groups = translations(scope.word, scope.sLang, scope.tLang);
                    groups.$promise.then(function(resp) {
                        if(resp == 'false')
                            groups = undefined;
                        scope.list.init();
                    });
                }

                scope.list = {
                    $el: $('.tr-list', $element),
                    visible: false,
                    mouseover: false,
                    groups: undefined,
                    onMouseenter: function() {
                        scope.list.mouseover = true;
                    },
                    onMouseleave: function() {
                        scope.list.mouseover = false;
                    },
                    show: function() {
                        if(scope.list.groups)
                            scope.list.visible = true;
                    },
                    hide: function() {
                        scope.list.visible = false;
                    },
                    getItems: function() {
                        return $('.tr-list-item', scope.list.$el);
                    },
                    getItem: function(index) {
                        return scope.list.getItems().eq(index);
                    },
                    getActiveItem: function() {
                        return $('.tr-list-item.active', scope.list.$el);
                    },
                    setActiveItem: function(item) {
                        var active = scope.list.getActiveItem();
                        if(active.size())
                            active.removeClass('active');
                        if(item)
                            item.addClass('active');
                    },
                    onItemMouseenter: function(index) {
                        scope.list.setActiveItem(scope.list.getItem(index));
                    },
                    onItemMouseleave: function(index) {
                        scope.list.setActiveItem();
                    },
                    setNextActive: function() {
                        var active = scope.list.getActiveItem();
                        if(active.size()) {
                            var index = scope.list.getItems().index(active);
                            if(index < scope.list.getItems().size()-1)
                                scope.list.setActiveItem(scope.list.getItem(index+1));
                        }
                        else 
                            scope.list.setActiveItem(scope.list.getItem(0));
                    },
                    setPrevActive: function() {
                        var active = scope.list.getActiveItem();
                        if(active.size()) {
                            var index = scope.list.getItems().index(active);
                            if(index > 0)
                                scope.list.setActiveItem(scope.list.getItem(index-1));
                        }
                    },
                    init: function() {
                        if(!groups) {
                            scope.list.groups = undefined;
                            scope.list.hide();
                            return;
                        }
                        scope.list.groups = [];
                        
                        groups.forEach(function(group) {
                            var newGroup = [];
                            group.forEach(function(tr) {
                                if(tr.indexOf(scope.ngModel) == 0)
                                    newGroup.push(tr);
                            });
                            if(newGroup.length)
                                scope.list.groups.push(newGroup);
                        });
                        
                        if(scope.input.$el.is(':focus'))
                            scope.list.show();
                    }
                };
                
                scope.input = {
                    $el: $('input[type="text"]', $element),
                    onFocus: function() {
                        scope.list.show();
                    },
                    onBlur: function() {
                        if(!scope.list.mouseover)
                            scope.list.hide();
                    },
                    onKeydown: function(e) {
                        if([13, 38, 40].indexOf(e.keyCode) != -1)
                            e.preventDefault();
                        if(e.keyCode == 38) {
                            scope.list.setPrevActive();
                        }
                        else if(e.keyCode == 40)
                            scope.list.setNextActive();
                        else if(e.keyCode == 13 && scope.list.getActiveItem().size())
                            scope.input.setValue();
                    },
                    setValue: function() {
                        var value = scope.list.getActiveItem().data('value');
                        scope.ngModel = value;
                        scope.list.hide();
                        $timeout(function() {
                            scope.input.$el.blur();
                        });
                    }
                };
                
                scope.$watch('word', loadTranslations);
                scope.$watch('ngModel', scope.list.init);
            }
        };
    });