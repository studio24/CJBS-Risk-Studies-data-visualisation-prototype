angular.module('DataVisualisationCharts').controller('ChartsMainCtrl', function($scope, $routeParams, $injector) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});

    $scope.$parent.currentSection = 'charts';

    var scenario = $routeParams.scenario;
    var variant = $routeParams.variant;
    var stage = $routeParams.stage;

    // Chart drawing logic goes here
    $scope.loadCharts = function($data) {

        var chartDiv = document.getElementById('chart');

        switch ($data.charts.options.type) {
            case "BarChart":
                var chart = new google.visualization.BarChart(chartDiv);
                break;
            case "LineChart":
                var chart = new google.visualization.LineChart(chartDiv);
                break;
        }

        if (chart != undefined) {
            // @todo fix chart drawing, go through and fix all data from JSON object
            var chartData = new google.visualization.DataTable(
                {
                    cols: $data.charts.data.cols,
                    rows: $data.charts.data.rows
                }
            );

            // Get size of container
            var containerWidth = document.getElementById('data-area').offsetWidth;
            var containerHeight = document.getElementById('data-area').offsetHeight;

            var chartOptions = {
                width: containerWidth,
                height: containerHeight,
                legend: $data.charts.options.legend,
                title: $data.charts.options.title,
                series: $data.charts.options.series
            };

            if ($data.charts.options.isStacked === "true") {
                chartOptions.isStacked = true;
            }

            chart.draw(chartData, chartOptions);
        }
    };

    // Initial data load
    $scope.$parent.loadData(scenario, variant, stage, function($data) {
        $scope.loadCharts($data);
    });
});