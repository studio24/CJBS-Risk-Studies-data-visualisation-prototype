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
        })
        .when('/:scenario/', {
            redirectTo: '/'
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
        stage: -1,
        variant: -1
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
        var networkId = 20;

        // Check whether we are trying to reload the same data
        if (previousLoaded.scenario == scenario && previousLoaded.variant == variant && previousLoaded.stage == stage) {
            if (typeof(callback) !== 'undefined') {
                callback($scope.currentData);
            }
            return false;
        }

        // Empty the current data
        $scope.currentData = config.emptyDataObject();

        // URL Format: http://dev.cambridgeriskframework.com/ijsrequest/n/v/s
        // where: n = network id (always 20, for the Sybil Cyber Scenario), v = variant id, s = stage id

        // Create the JSON URL
        var jsonUrl = config.serverUrl + networkId + '/' + variant + '/' + stage; // New format (testing)
        console.log('getting data from: ' + jsonUrl);

        // Load the JSON data in
        $http({ url: jsonUrl, method: 'GET' })
            .success(function(data) {
                // Log data
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
                if (typeof data.modules.graphs != 'undefined' && typeof data.modules.graphs.graph1 != 'undefined') {
                    $scope.currentData.network.nodes = data.modules.graphs.graph1.data.graphdump.nodes;
                    $scope.currentData.network.links = data.modules.graphs.graph1.data.graphdump.links;
                    $scope.currentData.network.nodeStyles = data.modules.graphs.graph1.styledefinition.nodestyles;
                    $scope.currentData.network.linkStyles = data.modules.graphs.graph1.styledefinition.linkstyles;
                }

                // Map
                if (typeof data.modules.maps != 'undefined' && typeof data.modules.maps.map1 != 'undefined') {
                    $scope.currentData.map.defaultBackgroundLayer = data.modules.maps.map1.defaultbackgroundlayer;
                    $scope.currentData.map.backgroundLayers = [];

                    // Get all background layers
                    for (var backgroundLayer in data.modules.maps.map1.backgroundlayers) {
                        if (data.modules.maps.map1.backgroundlayers.hasOwnProperty(backgroundLayer)) {
                            $scope.currentData.map.backgroundLayers.push(data.modules.maps.map1.backgroundlayers[backgroundLayer]);
                        }
                    }

                    $scope.currentData.map.primaryLayers = data.modules.maps.map1.primarylayers;
                    $scope.currentData.map.wmsLayer = data.modules.maps.map1.wmslayers[1];
                    $scope.currentData.map.nodeStyles = data.modules.maps.map1.styledefinition.nodestyles;
                    $scope.currentData.map.linkStyles = data.modules.maps.map1.styledefinition.linkstyles;
                }

                // Charts
                if (typeof data.modules.charts != 'undefined') {
                    // Line chart
                    if (typeof data.modules.charts.linechart1 != 'undefined') {
                        $scope.currentData.charts.options.type = data.modules.charts.linechart1.type;
                        $scope.currentData.charts.options.title = data.modules.charts.linechart1.options.title;
                        $scope.currentData.charts.options.series = data.modules.charts.linechart1.options.series;
                        $scope.currentData.charts.data = data.modules.charts.linechart1.data;
                    }
                }

                // Cassandra
                if (typeof data.narrativeheading != 'undefined' && typeof data.narrativedescription != 'undefined') {
                    $scope.currentData.cassandra = {};
                    $scope.currentData.cassandra.heading = data.narrativeheading;
                    $scope.currentData.cassandra.subheading = data.narrativesubheading;
                    $scope.currentData.cassandra.description = data.narrativedescription;
                }

                // Data list
                if (Object.keys(data.layers).length > 0) {
                    // Comapny data (data list)
                    var companyData = data.layers[Object.keys(data.layers)[0]].nodeattributes.data,
                        c,
                        columnList = [],
                        dataColumnList = data.layers[Object.keys(data.layers)[0]].nodeattributes.columnlist;

                    for (var prop in dataColumnList) {
                        if (dataColumnList.hasOwnProperty(prop)) {
                            // Check if we are showing the column
                            columnList.push({
                                "id": prop,
                                "title": dataColumnList[prop].title,
                                "description": dataColumnList[prop].description,
                                "show": dataColumnList[prop].show
                            });
                        }
                    }

                    $scope.currentData.companies = [];

                    // Loop through all companies to get the data
                    for (var company in companyData) {
                        if (companyData.hasOwnProperty(company)) {
                            // Refer to country as "c" for ease
                            c = companyData[company].fields;

                            // Check if data is not undefined
                            if (typeof(c) != 'undefined') {
                                var companyObject = {
                                    'name': '',
                                    'properties': [],
                                    'hiddenProperties' : {}
                                };

                                // Loop through all columns and set the property based on the column name
                                var propId = 0;
                                var hPropId = 0;
                                for (var i = 0; i < columnList.length; i++) {
                                    var column = columnList[i];
                                    // Check if the column needs to be shown
                                    console.log(column);
                                    if (column.show === true) {
                                        if (column.id != 'name') {
                                            // Assign properties to a properties array
                                            companyObject.properties[propId] = {};
                                            companyObject.properties[propId].name = column.title;
                                            companyObject.properties[propId].value = c[i].v;
                                            propId++;
                                        } else {
                                            // Assign the name directly to the object
                                            companyObject.name = c[i].v;
                                        }
                                    } else {
                                        companyObject.hiddenProperties[column.id] = c[i].v;
                                    }

                                    if (column.id == 'guid') {
                                        companyObject.hiddenProperties.guid = c[i].v;
                                    }
                                }
                                console.log(companyObject);

                                // Add the closed class to the companyObject
                                companyObject.class = 'closed';

                                // Push a new country object into the countries array
                                $scope.currentData.companies.push(companyObject);
                            }
                        }
                    }

                    if (typeof(callback) !== 'undefined') {
                        callback($scope.currentData);
                    }

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

    /**
     * Get the title for the HTML <title> element. Uses $scope rather than $parent
     *
     * @returns {string}
     */
    $scope.getPageTitle = function() {
        return $scope.currentData.scenario.title;
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

    $scope.formInput = {
        "company" : ""
    };

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
        $parent.loadData(current.scenario, variant, current.stage, function($data) {
            $scope.loadCharts($data);
        });
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

    /**
     * Get the cassandra data
     *
     * @returns {{}|*|$scope.currentData.cassandra}
     */
    $scope.getCassandra = function() {
        return $parent.currentData.cassandra;
    };

    /**
     * Get an array of all companies
     *
     * @returns {Array}
     */
    $scope.getCompanies = function() {
        // Change the input to uppercase to match the data
        var formInput = $scope.formInput.company.toUpperCase();
        if (formInput !== '') {
            // Return a filtered array with the values which match the indexOf
            return $parent.currentData.companies.filter(function(item) {
                return item.name.indexOf(formInput) > -1;
            });
        } else {
            // Or, return all of the data
            return $parent.currentData.companies;
        }
    };

    /**
     * Toggle the open/closed class from the companies array
     *
     * @param index
     */
    $scope.toggleCompany = function(index) {
        // Check which class the company already has on it
        if ($parent.currentData.companies[index].class == 'closed') {
            $parent.currentData.companies[index].class = 'open';
        } else {
            $parent.currentData.companies[index].class = 'closed';
        }
    };

    /**
     * Check which company has the GUID that has been entered and then run
     * $scope.toggleCompany on the index of that company
     *
     * @param id
     */
    $scope.toggleCompanyById = function(id) {
        // Loop around all companies
        for (var i = 0; i < $parent.currentData.companies.length; i++) {
            var company = $parent.currentData.companies[i];

            // Check the guid against the given id
            if (company.hiddenProperties.guid == id) {
                // Scroll to selected company
                var element = document.getElementById(company.hiddenProperties.guid);
                var scrollable = document.getElementById('company-scrollable');
                scrollable.scrollTop = element.offsetTop;

                // Run $scope.toggleCompany
                $scope.toggleCompany(i);
            }
        }
    };
};