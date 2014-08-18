// Add the config object to the window
window.config = JBS.Config;

/**
 * Main App declaration
 */
var app = angular.module('DataVisualisationApp', ['DataVisualisationNetwork', 'DataVisualisationMap', 'DataVisualisationCharts','ngRoute']);

/**
 * Sub module declaration
 */
angular.module('DataVisualisationNetwork', ['DataVisualisationApp', 'ngRoute']);
angular.module('DataVisualisationMap', ['DataVisualisationApp', 'ngRoute']);
angular.module('DataVisualisationCharts', ['DataVisualisationApp', 'ngRoute']);

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
angular.module('DataVisualisationNetwork').config(function($routeProvider) {
    $routeProvider
        .when('/:scenario/network', {
            templateUrl : 'templates/network.html',
            controller : 'NetworkMainCtrl'
        });
});

/**
 * Map Routing
 */
angular.module('DataVisualisationMap').config(function($routeProvider) {
    $routeProvider
        .when('/:scenario/map', {
            templateUrl : 'templates/map.html',
            controller : 'MapMainCtrl'
        });
});

/**
 * Charts Routing
 */
angular.module('DataVisualisationCharts').config(function($routeProvider) {
    $routeProvider
        .when('/:scenario/charts', {
            templateUrl : 'templates/charts.html',
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
     * @param callback
     * @returns {boolean}
     */
    $scope.loadData = function(scenario, variant, stage, callback) {
        // Setup some easy to access variables
        var config = JBS.Config;
        var previousLoaded = $scope.loadedDataType;

        // Check whether we are trying to reload the same data
        if (previousLoaded.scenario == scenario && previousLoaded.variant == variant && previousLoaded.stage == stage) {
            if (typeof(callback) !== 'undefined') {
                callback($scope.currentData);
            }
            return false;
        }

        // Empty the current data
        $scope.currentData = config.emptyDataObject();

        // Create the JSON URL
        var jsonUrl = config.serverUrl + scenario + '/stage-' + stage + '.json';

        // Load the JSON data in
        $http({ url: jsonUrl, method: 'GET' })
            .success(function(data) {
                console.log(data);

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
                $scope.currentData.network.nodeStyles = data.modules.graphs.graph1.styledefinition.nodestyles;
                $scope.currentData.network.linkStyles = data.modules.graphs.graph1.styledefinition.linkstyles;

                // Map
                $scope.currentData.map.backgroundLayer = data.modules.maps.map1.backgroundlayers[data.modules.maps.map1.defaultbackgroundlayer];
                $scope.currentData.map.primaryLayers = data.modules.maps.map1.primarylayers;
                $scope.currentData.map.wmsLayer = data.modules.maps.map1.wmslayers[1];
                $scope.currentData.map.nodeStyles = data.modules.maps.map1.styledefinition.nodestyles;
                $scope.currentData.map.linkStyles = data.modules.maps.map1.styledefinition.linkstyles;

                // Charts
                // data.modules.charts.X.data.rows[X].c.[0]
                // data.modules.charts.X.data.rows[X].c.[X]
                $scope.currentData.charts.options.type = data.modules.charts.linechart1.type;
                $scope.currentData.charts.options.title = data.modules.charts.linechart1.options.title;
                $scope.currentData.charts.options.series = data.modules.charts.linechart1.options.series;
                $scope.currentData.charts.data = data.modules.charts.linechart1.data;

                // Country data
                // data.layers.X.nodeattributes.columnList => data.layers.X.nodeattributes.data
                var companyData = data.layers[Object.keys(data.layers)[0]].nodeattributes.data, c;

                $scope.currentData.companies = [];

                // Loop through all companies to get the data
                for (var company in companyData) {
                    if (companyData.hasOwnProperty(company)) {
                        // Refer to country as "c" for ease
                        c = companyData[company].fields;

                        if (typeof(c) != 'undefined') {
                            // Push a new country object into the countries array
                            $scope.currentData.companies.push({
                                "guid" : c[0].v,
                                "name" : c[1].v,
                                "description" : c[2].v,
                                "locationwkt" : c[3].v,
                                "country": c[4],
                                "place" : c[5].v,
                                "url" : c[6].v,
                                "image1" : c[7].v,
                                "gics_industry_group" : c[8].v,
                                "current_market_cap" : c[9].v,
                                "revenue" : c[10].v
                            });
                        }
                    }
                }

                console.log($scope.currentData.companies);


                if (typeof(callback) !== 'undefined') {
                    callback($scope.currentData);
                }
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
     * Returns an object with the current type of loaded application data
     *
     * @returns {{scenario: string, stage: number, variant: number}|*|$scope.loadedDataType}
     */
    $scope.getLoadedDataType = function() {
        return $parent.loadedDataType;
    };

    /**
     * Load the stage
     *
     * @param stage
     */
    $scope.loadStage = function(stage) {
        var current = $parent.loadedDataType;
        $parent.loadData(current.scenario, current.variant, stage, function($data) {
            $scope.loadCharts($data);
        });
    };

    /**
     * Load the variant
     *
     * @param variant
     */
    $scope.loadVariant = function(variant) {
        var current = $parent.loadedDataType;
        $parent.loadData(current.scenario, variant, current.stage);
    };

    /**
     * Gets the complete data object
     *
     * @returns {*|$scope.currentData}
     */
    $scope.getData = function() {
        return $parent.currentData;
    };

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