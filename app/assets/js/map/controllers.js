angular.module('DataVisualisationMap').controller('MapMainCtrl', function($scope, $routeParams, $injector) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});

    $scope.$parent.currentSection = 'map';

    var scenario = $routeParams.scenario;
    var variant = 1;
    var stage = 1;

    $scope.$parent.loadData(scenario, variant, stage, function() {
        var layer = L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
            attribution: 'Tiles by <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 12,
            minZoom: 2
        });

        $scope.map = L.map('map', { layers: layer }).setView([51.505, -0.09], 2);
    });
});