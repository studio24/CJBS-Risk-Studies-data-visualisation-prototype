var JBS = JBS || {};

/**
 * Configuration variables that can be pulled into the main
 * application. Namespaced in here to prevent conflicts
 */
JBS.Config = function() {
    var serverUrl = 'http://jbs-data.dev/';

    /**
     * The paths to find the elements in the JSON files. See:
     * http://oboejs.com/api
     */
    var jsonPaths = {
        'forceDirected' : {
            'nodes' : 'modules.graphs.graph1.data.graphdump.nodes[*]',
            'links' : 'modules.graphs.graph1.data.graphdump.links[*]'
        }
    };

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
            'map' : {},
            'charts' : {}
        };
    };

    return {
        serverUrl: serverUrl,
        jsonPaths: jsonPaths,
        emptyDataObject: emptyDataObject
    };
}();