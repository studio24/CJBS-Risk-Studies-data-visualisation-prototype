// Add the config object to the window
window.config = JBS.Config;

/**
 * Sub module declaration
 */
angular.module('DataVisualisationNetwork', []);
angular.module('DataVisualisationMap', []);
angular.module('DataVisualisationCharts', []);

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
app.controller('MainCtrl', function($scope, $http) {
    // Initialise the application variables
    $scope.currentSection = '';
    $scope.currentStage = 0;
    $scope.currentVariant = 0;

    // Create a blank data object
    $scope.currentData = JBS.Config.emptyDataObject();

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
        $scope.currentData = config.emptyDataObject();

        // Create the JSON URL
        var jsonUrl = config.serverUrl + scenario + '/stage-' + stage + '.json';

        // Load the JSON data in
        $http({ url: jsonUrl, method: 'GET' })
            .success(function(data) {
                console.log('Data Downloaded');

                // Scenario Data
                $scope.currentData.scenario.title = data.title;
                $scope.currentData.scenario.subtitle = data.subtitle;
                $scope.currentData.scenario.narrativedescription = data.narrativedescription;
                $scope.currentData.scenario.narrativeheading = data.narrativeheading;
                $scope.currentData.scenario.narrativesubheading = data.narrativesubheading;
                $scope.currentData.scenario.iconurl = data.iconurl;
                $scope.currentData.scenario.variants = data.variants;
                $scope.currentData.scenario.stages = data.stages;

                // Network
                $scope.currentData.network.nodes = data.modules.graphs.graph1.data.graphdump.nodes;
                $scope.currentData.network.links = data.modules.graphs.graph1.data.graphdump.links;

                console.log($scope.currentData);
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

/**
 * Base controller which is invoked by the other scope controllers. This contains global
 * elements, such as getting Scenario data
 *
 * @param $scope
 * @constructor
 */
var BaseCtrl = function($scope) {
    $parent = $scope.$parent;

    /**
     * Get the scenario title
     *
     * @returns {string}
     */
    $scope.getTitle = function() {
        return $parent.currentData.scenario.title;
    };

    /**
     * Get the scenario subtitle
     *
     * @returns {string}
     */
    $scope.getSubtitle = function() {
        return $parent.currentData.scenario.subtitle;
    };

    /**
     * Get the scenario icon
     *
     * @returns {string}
     */
    $scope.getIcon = function() {
        return $parent.currentData.scenario.iconurl;
    };

    /**
     * Get the scenario variants
     *
     * @returns {object}
     */
    $scope.getVariants = function() {
        return $parent.currentData.scenario.variants;
    };

    /**
     * Get the scenario stages
     *
     * @returns {object}
     */
    $scope.getStages = function() {
        return $parent.currentData.scenario.stages;
    };
};