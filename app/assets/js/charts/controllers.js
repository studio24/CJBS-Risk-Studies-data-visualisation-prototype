angular.module('DataVisualisationCharts').controller('ChartsMainCtrl', function($scope, $injector, $routeParams) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});

    $scope.$parent.currentSection = 'charts';

    var scenario = $routeParams.scenario;
    var variant = 1;
    var stage = 1;

    $scope.$parent.loadData(scenario, variant, stage, function($data) {

    });
});