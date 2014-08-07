/**
 * Network Main Controller
 */
angular.module('DataVisualisationNetwork').controller('NetworkMainCtrl', function($scope, $routeParams, $injector) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});

    $scope.$parent.currentSection = 'network';

    var scenario = $routeParams.scenario;
    var variant = 1;
    var stage = 1;

    $scope.$parent.loadData(scenario, variant, stage, function() {
//        S24.Charts.createForceDirectedGraphCanvas('.svg', $scope.getData().network, {
//
//        });
    });
});