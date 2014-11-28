angular.module('DataVisualisationMap').controller('MapMainCtrl', function($scope, $routeParams, $injector) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});

    $scope.$parent.currentSection = 'map';

    var scenario = $routeParams.scenario;
    var variant = $routeParams.variant;
    var stage = $routeParams.stage;

    // Chart drawing logic goes in here
    $scope.loadCharts = function($data) {
        // D3
        d3.selectAll('#map').remove();
        d3.select('.chart').append('div')
            .attr('id', 'map');

        var mapData = $data.map;

        // Base background layers
        var baseLayers = {};
        if (mapData.backgroundLayers.defaultbackgroundlayer != undefined) {
            var defaultBaseLayer = mapData.backgroundLayers.defaultbackgroundlayer;
        } else {
            var defaultBaseLayer = 0;
        }
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

                // Set default background layer
                if (property == defaultBaseLayer) {
                    var defaultMap = newTile;
                }
            }
        }

        // Create the leaflet map
        $scope.map = L.map('map', {
            layers: [defaultMap],
            keyboard: false
        }).setView(mapData.center, mapData.zoom);


        // WMS overlay layers
        var overlayLayers = {};
        if (typeof(mapData.wmsLayers) != 'undefined') {

            for (var property in mapData.wmsLayers) {
                if (mapData.wmsLayers.hasOwnProperty(property)) {

                    var wmsLayer = mapData.wmsLayers[property];

                    // Set options
                    var options = {
                        'layers': wmsLayer.layers
                    };
                    if (wmsLayer.maxzoom != undefined) {
                        options.maxZoom = wmsLayer.maxzoom;
                    }
                    if (wmsLayer.minzoom != undefined) {
                        options.minZoom = wmsLayer.minzoom;
                    }
                    if (wmsLayer.attribution != undefined) {
                        options.attribution = wmsLayer.attribution;
                    }
                    if (wmsLayer.format != undefined) {
                        options.format = wmsLayer.format;
                    }
                    if (wmsLayer.opacity != undefined) {
                        options.opacity = wmsLayer.opacity;
                    }
                    if (wmsLayer.styles != undefined) {
                        options.styles = wmsLayer.styles;
                    }
                    if (wmsLayer.transparent != undefined) {
                        options.transparent = (wmsLayer.transparent === "true");
                    }
                    if (wmsLayer.zindex != undefined) {
                        options.zIndex = wmsLayer.zindex;
                    }

                    // Setup the WMS layer
                    var wmsTile = L.tileLayer.wms(wmsLayer.url, options);
                    overlayLayers[wmsLayer.title] = wmsTile;

                    // Add to map by default?
                    if (wmsLayer.display === "true") {
                        wmsTile.addTo($scope.map);
                    }

                }
            }
        }


        // Disable zoom on double-click
        $scope.map.doubleClickZoom.disable();

        // Loop through all layer data from the JSON file
        for (var primaryLayer in mapData.primaryLayers) {
            if (mapData.primaryLayers.hasOwnProperty(primaryLayer)) {
                var layer = L.geoJson();

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
                        var marker;
                        var guid = feature.id;
                        L.geoJson(feature, {
                            style: newProperties,
                            pointToLayer: function(feature, latlng) {
                                marker = new L.CircleMarker(latlng, {radius: feature.properties.size * 3, fillOpacity: 0.85});
                                marker._id = 'guid' + guid;
                                marker.on('click', function(e) {
                                    var markerId = e.target._id;
                                    $scope.$apply(function() {
                                        $scope.toggleCompanyById(markerId);
                                    });
                                });
                                $scope.allMapMarkers = $scope.allMapMarkers || [];
                                $scope.allMapMarkers.push(marker);
                                if (feature.properties.title !== undefined) {
                                    marker.bindLabel('<span style="color:' + newProperties.titleColor + '">' + feature.properties.title + '</span>', { noHide: true });
                                }
                                return marker;
                            }
                        }).addTo(layer);
                    } else {
                        newProperties = mapData.linkStyles[feature.properties.linkstyle] || {};
                        newProperties.opacity = 0.2;
                        newProperties.weight = 1;
                        // Add the feature to the map
                        L.geoJson(feature, {
                            style: newProperties
                        }).addTo(layer);
                    }

                });
                var nodesLayer = L.layerGroup([layer]).addTo($scope.map);

                // Add layer controls
                overlayLayers[primaryLayer.title] = nodesLayer;


            }
        }

        // Add layer controls
        L.control.layers(baseLayers, overlayLayers).addTo($scope.map);
    };


    // Start loading the data into the page
    $scope.$parent.loadData(scenario, variant, stage, function($data) {
        if ($scope.displayMap()) {
            $scope.loadCharts($data);
            $scope.nodeLegend = $scope.currentData.map.nodeStyles;
            $scope.lineLegend = $scope.currentData.map.linkStyles;
            $scope.syncMapNodes();
        }
    });
});
