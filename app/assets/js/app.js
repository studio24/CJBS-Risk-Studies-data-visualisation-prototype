/**
 * Sub module declaration
 */
angular.module('DataVisualisationNetwork', ['DataService']);
angular.module('DataVisualisationMap', ['DataService']);
angular.module('DataVisualisationCharts', ['DataService']);

/**
 * Main App declaration
 */
var app = angular.module('DataVisualisationApp', [
    'ngRoute',
    'DataVisualisationNetwork',
    'DataVisualisationMap',
    'DataVisualisationCharts'
]);

/**
 * Routing
 */
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'templates/home.html',
            controller : 'MainCtrl'
        });
});

/**
 * Network Routing
 */
angular.module('DataVisualisationNetwork').config(function($routeProvider, $provide) {
    $routeProvider
        .when('/:scenario/network', {
            templateUrl : 'templates/network.html',
            controller : 'NetworkMainCtrl'
        });

    $provide.factory('DataService', function() {
        var dataService;
    });
});

/**
 * Map Routing
 */
angular.module('DataVisualisationMap').config(function($routeProvider) {
    $routeProvider
        .when('/:scenario/map', {
            templateUrl : 'templates/network.html',
            controller : 'MapMainCtrl'
        });
});

/**
 * Charts Routing
 */
angular.module('DataVisualisationCharts').config(function($routeProvider) {
    $routeProvider
        .when('/:scenario/charts', {
            templateUrl : 'templates/network.html',
            controller : 'ChartsMainCtrl'
        });
});

/**
 * Main wrapping controller
 */
app.controller('MainCtrl', function($scope) {
    // Initialise the application variables
    $scope.currentSection = '';
    $scope.currentStage = 0;
    $scope.currentVariant = 0;

    // Create a blank data object
    $scope.currentData = {
        'network' : {},
        'map' : {},
        'charts' : {}
    };

    // Start with a blank loadedDataType
    $scope.loadedDataType = {
        scenario: '',
        stage: 0,
        variant: 0
    };

    /**
     * Load the data into memory from an external JSON file. This uses oboe.js to progressively
     * and additively concatenate data to create a better loading experience for the user
     *
     * @param scenario
     * @param variant
     * @param stage
     * @returns {boolean}
     */
    $scope.loadData = function(scenario, variant, stage) {
        // Setup some easy to access variables
        var config = JBS.Config;
        var previousLoaded = $scope.loadedDataType;

        // Check whether we are trying to reload the same data
        if (previousLoaded.scenario == scenario && previousLoaded.variant == variant && previousLoaded.stage == stage) {
            return false;
        }

        // Empty the current data
        $scope.currentData = {
            'network' : {},
            'map' : {},
            'charts' : {}
        };

        // Create the JSON URL
        var jsonUrl = config.serverUrl + scenario + '/stage-' + stage + '.json';

        // Load the data using oboe
        oboe(jsonUrl)
            .node({
                'modules.graphs.graph1.data.graphdump.nodes[*]' : function(dataSoFar) {

                },
                'modules.graphs.graph1.data.graphdump.links[*]' : function(dataSoFar) {

                }
            })
            .done(function() {
                console.log('Completed download of data file');
            });

        // Set the new loadedDataType
        $scope.loadedDataType = {
            scenario: scenario,
            stage: stage,
            variant: variant
        };

        return true;
    };

    /**
     * Check whether the currentSection is the one passed in, returns active if true
     *
     * @param id
     * @returns {string}
     */
    $scope.getSelectedNav = function(id) {
        if (id == $scope.currentSection) {
            return 'active';
        } else {
            return '';
        }
    };
});