angular.module('DataVisualisationCharts').controller('ChartsMainCtrl', function($scope, $injector, $routeParams) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});

    $scope.$parent.currentSection = 'charts';

    var scenario = $routeParams.scenario;
    var variant = 0;
    var stage = 1;

    // Chart drawing logic goes here
    $scope.loadCharts = function($data) {
        S24.Charts.createLineChart('.svg', $data.charts.data, {

        });
    };

    // Initial data load
    $scope.$parent.loadData(scenario, variant, stage, function($data) {
        $scope.loadCharts($data);
    });
});