var filters = angular.module('filters', []);

filters
    .filter('trGroups', function() {
        return function(input, value) {
            console.log(arguments);
            if(!input || !input.length) return;

            var groups = [];
            input.forEach(function(group) {
                var newGroup = [];
                group.forEach(function(tr) {
                    if(tr.indexOf(value) == 0)
                        newGroup.push(tr);
                });
                if(newGroup.length)
                    groups.push(newGroup);
            });
            return groups;
        };
    });