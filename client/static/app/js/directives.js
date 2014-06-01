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
        
        var List = function(el) {
            var visible = false,
                mouseover = false,
                groups = undefined;
            
            function getActiveItem() {
                return $('.tr-list-item.active', el);
            }
            function getItems() {
                return $('.tr-list-item', el);
            }
            function activateItem(item) {
                var active = getActiveItem();
                if(active.size())
                    active.removeClass('active');
                if(item)
                    item.addClass('active');
            }
            
            this.onMouseenter = function() {
                mouseover = true;
            };
            this.onMouseleave = function() {
                mouseover = false;
            };
            this.isVisible = function() {
                return visible;
            };
            this.show = function() {
                if(groups)
                    visible = true;
            };
            this.hide = function(force) {
                if(force || !mouseover)
                    visible = false;
            };
            this.getGroups = function() {
                return groups;
            };
            this.getValue = function() {
                return getActiveItem().data('value')
            };
            this.activateNext = function() {
                var active = getActiveItem();
                if(active.size()) {
                    var index = getItems().index(active);
                    if(index < getItems().size()-1)
                        activateItem(getItems().eq(index+1));
                }
                else 
                    activateItem(getItems().eq(0));
            };
            this.activatePrev = function() {
                var active = getActiveItem();
                if(active.size()) {
                    var index = getItems().index(active);
                    if(index > 0)
                        activateItem(getItems().eq(index-1));
                }
            };
            this.onItemMouseenter = function(e) {
                activateItem($(e.target));
            };
            this.onItemMouseleave = function() {
                activateItem();
            };
            this.refresh = function(data, value) {
                if(!data || !data.length) {
                    groups = undefined;
                    this.hide();
                    return;
                }
                groups = [];
                
                data.forEach(function(group) {
                    var newGroup = [];
                    group.forEach(function(tr) {
                        if(tr.indexOf(value) == 0)
                            newGroup.push(tr);
                    });
                    if(newGroup.length)
                        groups.push(newGroup);
                });
            };
        };
        
        var Input = function(el, list, setValue) {
            this.setValue = function() {
                var value = list.getValue();
                setValue(value);
                list.hide(true);
                $timeout(function() {
                    el.blur();
                });
            }
            this.onFocus = function() {
                list.show();
            };
            this.onBlur = function() {
                list.hide();
            };
            this.onKeydown = function(e) {
                if([13, 38, 40].indexOf(e.keyCode) != -1)
                    e.preventDefault();
                if(e.keyCode == 38) {
                    list.activatePrev();
                }
                else if(e.keyCode == 40)
                    list.activateNext();
                else if(e.keyCode == 13 && list.getValue())
                    this.setValue();
            };
        };
        
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
                var $element = $(element),
                    data;

                scope.list = new List($('.tr-list', $element));
                scope.input = new Input($('input[type="text"]', $element), scope.list,
                                        ngModel.$setViewValue);

                scope.$watchGroup(['word', 'sLang', 'tLang'], function() {
                    data = translations(scope.word, scope.sLang, scope.tLang);
                    data.$promise.then(function(resp) {
                        if(resp == 'false')
                            data = undefined;
                        scope.list.refresh(data, scope.ngModel);
                    });
                });
                scope.$watch('ngModel', function(value) {
                    scope.list.refresh(data, value);
                });
            }
        };
    });