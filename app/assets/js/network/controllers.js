/**
 * Network Main Controller
 */
angular.module('DataVisualisationNetwork').controller('NetworkMainCtrl', function($scope, $routeParams, $injector) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});

    $scope.$parent.currentSection = 'network';

    var scenario = $routeParams.scenario;
    var variant = 0;
    var stage = 1;

    // Chart drawing logic goes here
    $scope.loadCharts = function($data) {
        d3.select('svg').remove();
        S24.Charts.createForceDirectedGraph('.svg', $data.network, {
            width: '100%',
            height: 800
        });
    };

    // Initial data loading
    $scope.$parent.loadData(scenario, variant, stage, function($data) {
        $scope.loadCharts($data);
    });
});