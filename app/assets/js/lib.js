var JBS = JBS || {};

/**
 * Configuration variables that can be pulled into the main
 * application. Namespaced in here to prevent conflicts
 */
JBS.Config = function() {
    var serverUrl = 'http://jbs-data.dev/';
    var jsonPaths = {
        'forceDirected' : {
            'nodes' : 'modules.graphs.graph1.data.graphdump.nodes[*]',
            'links' : 'modules.graphs.graph1.data.graphdump.links[*]'
        }
    };

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