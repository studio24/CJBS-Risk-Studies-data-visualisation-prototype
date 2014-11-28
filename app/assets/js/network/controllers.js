/**
 * Network Main Controller
 */
angular.module('DataVisualisationNetwork').controller('NetworkMainCtrl', function($scope, $rootScope, $routeParams, $injector) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});

    $scope.$parent.currentSection = 'network';

    var scenario = $routeParams.scenario;
    var variant = $routeParams.variant;
    var stage = $routeParams.stage;

    // Chart drawing logic goes here
    $scope.loadCharts = function($data) {
        d3.select('svg').remove();
        S24.Charts.createForceDirectedGraph('.svg', $data.network, {
            width: '100%',
            height: 800
        }, $scope);
    };

    // Initial data loading
    $scope.$parent.loadData(scenario, variant, stage, function($data) {
        $scope.loadCharts($data);
        $scope.nodeLegend = $data.network.nodeStyles;
        $scope.linkLegend = $data.network.linkStyles;
        $scope.$parent.bodyClass = '';
    });
});
