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
    .directive('imageSearchTab', function($timeout, TPL_URL, promiseDefer, findImages) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=',
                word: '@'
            },
            templateUrl: TPL_URL+'/image-search-tab.html',
            link: function(scope) {
                const wordsN = 20,
                      timeout = 1000;
                var images,
                    imgI,
                    defer;
                
                function setImage(i) {
                    scope.ngModel = images[i].preview;
                    scope.prevBtnDisabled = imgI == 0;
                    scope.nextBtnDisabled = imgI == images.length - 1;
                }
                
                function loadImages() {
                    if(defer)
                        defer.reject();
                    
                    if(!scope.word) {
                        scope.visible = false;
                        return;
                    }
                    images = findImages(scope.word, wordsN);
                    defer = promiseDefer(images.$promise);
                    
                    scope.prevBtnDisabled = true;
                    scope.nextBtnDisabled = false;
                    
                    imgI = 0;
                    
                    defer.promise.then(function(images) {
                        scope.ngModel = images[0].preview;
                        scope.visible = true;
                    });
                }
                scope.visible = false;
                scope.prevImg = function() {
                    setImage(--imgI);
                };
                scope.nextImg = function() {
                    setImage(++imgI)
                };
                
                scope.$watch('word', function() {
                    loadImages();
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
    .directive('imageInput', function(TPL_URL) {
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
    .directive('translationInput', function($timeout, TPL_URL, promiseDefer, findTranslations) {
        
        var List = function(el) {
            var visible = false,
                loading = false,
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
            
            this.getEl = function() {
                return el;
            };
            this.onMouseenter = function() {
                mouseover = true;
            };
            this.onMouseleave = function() {
                mouseover = false;
            };
            this.isVisible = function() {
                return (groups || loading) && visible;
            };
            this.isLoading = function() {
                return loading;
            };
            this.show = function() {
                visible = true;
            };
            this.hide = function(force) {
                if(force || !mouseover)
                    visible = false;
            };
            this.startLoading = function() {
                loading = true;
            };
            this.stopLoading = function() {
                loading = false;
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
                        if(value == undefined || tr.indexOf(value) == 0)
                            newGroup.push(tr);
                    });
                    if(newGroup.length)
                        groups.push(newGroup);
                });
                if(!groups.length)
                    groups = undefined;

                this.stopLoading();
            };
        };
        
        var Input = function(el, list, setValue) {
            list.getEl().width(el.outerWidth());
            
            this.getEl = function() {
                return el;
            };
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
                    data,
                    defer;

                scope.list = new List($('.tr-box', $element));
                scope.input = new Input($('input[type="text"]', $element), scope.list,
                                        ngModel.$setViewValue);

                scope.$watchGroup(['word', 'sLang', 'tLang'], function() {
                    if(defer)
                        defer.reject();
                    
                    scope.list.refresh(undefined, scope.ngModel);
                    if(!scope.word)
                        return;
                    
                    scope.list.startLoading();
                    data = findTranslations(scope.word, scope.sLang, scope.tLang);
                    defer = promiseDefer(data.$promise);

                    defer.promise.then(function(resp) {
                        if(resp == 'false')
                            resp = undefined;
                        
                        scope.list.refresh(resp, scope.ngModel);
                    });
                });
                scope.$watch('ngModel', function(value) {
                    scope.list.refresh(data, value);
                });
            }
        };
    });