angular.module('DataVisualisationMap').controller('MapMainCtrl', function($scope, $routeParams, $injector) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});

    $scope.$parent.currentSection = 'map';

    var scenario = $routeParams.scenario;
    var variant = 1;
    var stage = 1;

    $scope.$parent.loadData(scenario, variant, stage, function($data) {
        var mapData = $data.map;

        // Setup the main tile/background layer
        var layer = L.tileLayer(mapData.backgroundLayer.url, {
            attribution: mapData.backgroundLayer.attribution,
            maxZoom: 12,
            minZoom: 2
        });

        // Create the leaflet map
        $scope.map = L.map('map', { layers: layer }).setView([0, 0], 2);

        // Setup the WMS layer
        L.tileLayer.wms(mapData.wmsLayer.url, mapData.wmsLayer).addTo($scope.map);

        // Setup the cluster layer
        var clusterLayer = L.markerClusterGroup({
            showCoverageOnHover: true,
            removeOutsideVisibleBounds: true
        });
        var geoJsonLayer = L.geoJson();

        // Loop through all layer data from the JSON file
        for (var primaryLayer in mapData.primaryLayers) {
            if (mapData.primaryLayers.hasOwnProperty(primaryLayer)) {
                // Loop through each feature in the layer
                mapData.primaryLayers[primaryLayer].geojson.features.forEach(function(feature) {
                    var newProperties;

                    // Check if the feature is a node, or a link
                    if (typeof(feature.properties.nodestyle) != 'undefined') {
                        newProperties = mapData.nodeStyles[feature.properties.nodestyle];
                    } else {
                        newProperties = mapData.linkStyles[feature.properties.linkstyle] || {};
                        newProperties.opacity = 0.2;
                    }

                    // Add the feature to the map
                    L.geoJson(feature, {style: newProperties}).addTo($scope.map);
                });
            }
        }

        //clusterLayer.addLayer(geoJsonLayer);
        $scope.map.addLayer(geoJsonLayer);
    });
});