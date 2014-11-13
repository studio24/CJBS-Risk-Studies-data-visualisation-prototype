var app = angular.module('DataVisualisationApp');

app.directive('stage', function() {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'templates/directives/stage.html',
        scope: true
    };
});

app.directive('variant', function() {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'templates/directives/variant.html',
        scope: true
    };
});

app.directive('companies', function() {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'templates/directives/companies.html',
        scope: true
    };
});

app.directive('cassandra', function() {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'templates/directives/cassandra.html',
        scope: true
    };
});

app.directive('graphlegend', function() {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        replace: true,
        templateUrl: 'templates/directives/graph-legend.html'
    };
});
