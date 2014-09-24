angular.module('DataVisualisationMap').controller('MapMainCtrl', function($scope, $routeParams, $injector) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});

    $scope.$parent.currentSection = 'map';

    var scenario = $routeParams.scenario;
    var variant = 0;
    var stage = 1;

    // Chart drawing logic goes in here
    $scope.loadCharts = function($data) {
        // D3
        d3.selectAll('#map').remove();
        d3.select('.chart').append('div')
            .attr('id', 'map');

        var mapData = $data.map;

        // Base background layers
        var baseLayers = {};
        for (var property in mapData.backgroundLayers) {
            if (mapData.backgroundLayers.hasOwnProperty(property)) {

                var backgroundLayer = mapData.backgroundLayers[property];

                // Set options
                var options = {
                    maxZoom: 12,
                    minZoom: 2
                };
                if (backgroundLayer.maxzoom != undefined) {
                    options.maxZoom = backgroundLayer.maxzoom;
                }
                if (backgroundLayer.minzoom != undefined) {
                    options.minZoom = backgroundLayer.minzoom;
                }
                if (backgroundLayer.attribution != undefined) {
                    options.attribution = backgroundLayer.attribution;
                }

                var newTile = L.tileLayer(backgroundLayer.url, options);
                baseLayers[backgroundLayer.title] = newTile;

                // Set first layer as default
                // @todo Needs work, since property is reset to zero-indexed key when iterating over object in JS
                if (property == 0) {
                    var defaultMap = newTile;
                }
            }
        }

        // Create the leaflet map
        $scope.map = L.map('map', {
            layers: [defaultMap]
        }).setView(mapData.center, mapData.zoom);

        // Disable zoom on double-click
        $scope.map.doubleClickZoom.disable();

        // WMS overlay layers
        var overlayLayers = {};
        if (typeof(mapData.wmsLayers) != 'undefined') {

            for (var property in mapData.wmsLayers) {
                if (mapData.wmsLayers.hasOwnProperty(property)) {

                    var wmsLayer = mapData.wmsLayers[property];

                    // Set options
                    var options = {};
                    if (wmsLayer.maxzoom != undefined) {
                        options.maxZoom = wmsLayer.maxzoom;
                    }
                    if (wmsLayer.minzoom != undefined) {
                        options.minZoom = wmsLayer.minzoom;
                    }
                    if (wmsLayer.attribution != undefined) {
                        options.attribution = wmsLayer.attribution;
                    }

                    // Setup the WMS layer
                    overlayLayers[wmsLayer.title] = L.tileLayer.wms(wmsLayer.url, options);
                }
            }
        }

        var geoJsonLayerLinks = L.geoJson();
        var geoJsonLayerNodes = L.geoJson();

        // Loop through all layer data from the JSON file
        for (var primaryLayer in mapData.primaryLayers) {
            if (mapData.primaryLayers.hasOwnProperty(primaryLayer)) {

                var primaryLayer = mapData.primaryLayers[primaryLayer];

                // Loop through each feature in the layer
                primaryLayer.geojson.features.forEach(function(feature) {
                    var newProperties;

                    // Check if the feature is a node, or a link
                    if (typeof(feature.properties.nodestyle) != 'undefined') {
                        newProperties = mapData.nodeStyles[feature.properties.nodestyle] || {};
                        newProperties.opacity = 1;
                        newProperties.fillOpacity = 1;
                        newProperties.stroke = 0;

                        // Add the feature to the map
                        L.geoJson(feature, {
                            style: newProperties,
                            pointToLayer: function(feature, latlng) {
                                var marker = new L.CircleMarker(latlng, {radius: feature.properties.size * 3, fillOpacity: 0.85});
                                marker.on('click', function() {
                                    var guid = this.feature.id;
                                    $scope.$apply(function() {
                                        $scope.toggleCompanyById(guid);
                                    });
                                });

                                return marker;
                            }
                        }).addTo(geoJsonLayerNodes);

                    } else {
                        newProperties = mapData.linkStyles[feature.properties.linkstyle] || {};
                        newProperties.opacity = 0.2;
                        newProperties.weight = 1;

                        // Add the feature to the map
                        L.geoJson(feature, {
                            style: newProperties
                        }).addTo(geoJsonLayerLinks);
                    }
                });

                var nodesLayer = L.layerGroup([geoJsonLayerLinks, geoJsonLayerNodes]).addTo($scope.map);

                // Add layer controls
                overlayLayers[primaryLayer.title] = nodesLayer;
            }
        }

        // Add layer controls
        L.control.layers(baseLayers, overlayLayers).addTo($scope.map);
    };



    // Start loading the data into the page
    $scope.$parent.loadData(scenario, variant, stage, function($data) {
        $scope.loadCharts($data);
    });
});