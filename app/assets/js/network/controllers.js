/**
 * Network Main Controller
 */
angular.module('DataVisualisationNetwork').controller('NetworkMainCtrl', function($scope, $routeParams, $http) {
    $scope.$parent.currentSection = 'network';

    var scenario = $routeParams.scenario;
    var variant = 1;
    var stage = 1;

    $scope.$parent.loadData(scenario, variant, stage);


//    $http({method: 'GET', url: jsonUrl})
//        .success(function(data, status, headers, config) {
//            console.log(data.modules.graphs.graph1.data.graphdump.nodes);
//        })
//        .error(function(data, status, headers, config) {
//            console.log(status);
//        });
});