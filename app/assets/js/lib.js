var JBS = JBS || {};

/**
 * Configuration variables that can be pulled into the main
 * application. Namespaced in here to prevent conflicts
 */
JBS.Config = function() {
    var serverUrl = 'http://dev.studio24.net/data-visualisation-data/';

    /**
     * This is an empty data object, which is used to reset the data for all of the charts
     * and scenario data. It also gives an obvious structure for how the data should look
     */
    var emptyDataObject = function() {
        return {
            'scenario' : {
                'title' : '',
                'subtitle' : '',
                'iconurl' : '',
                'narrativedescription' : '',
                'narrativeheading' : '',
                'narrativesubheading' : '',
                'variants' : [],
                'stages' : []
            },
            'network' : {
                'nodes' : [],
                'links' : []
            },
            'map' : {

            },
            'charts' : {
                options: {
                    title: '',
                    type: '',
                    series: {}
                },
                data: {}
            },
            'companies' : []
        };
    };

    return {
        serverUrl: serverUrl,
        emptyDataObject: emptyDataObject
    };
}();