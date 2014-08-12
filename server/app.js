// Pre-render d3 force-directed graph at server side
// Call node pre_render_d3_graph.js to generate d3_graph.html
// Original idea and framework borrowed from https://gist.github.com/mef/7044786

var d3 = require('d3')
    , jsdom = require('jsdom')
    , fs = require('fs')
    , request = require('request');

var htmlStub = '<html><head> ' +
	'</head><body><div id="dataviz-container"></div><script src="d3.min.js"></script></body></html>';

// Timing
var start = process.hrtime();
var elapsed_time = function(note){
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(process.hrtime(start)[0] + "s, " + elapsed.toFixed(0) + "ms - " + note); // print message + time
    start = process.hrtime(); // reset the timer
}

jsdom.env({
    features : { QuerySelector : true }
    , html : htmlStub
    , scripts: ["http://code.jquery.com/jquery.js"]
    , done : function(errors, window) {
        var $ = window.jQuery;
        // this callback function pre-renders the dataviz inside the html document, then export result into a static html file

        var el = window.document.querySelector('#dataviz-container')
            , body = window.document.querySelector('body')
            , dataset = {};

        console.log('Getting data...');

        request('http://jbs-data.dev/sybil-logic-bomb/stage-1.json', function(error, response, body) {
            if (error || response.statusCode != 200) {
                console.log(response.statusCode);
                process.exit(1);
            }

            var data = JSON.parse(body);
            var dataset = {};
            dataset.nodes = data.modules.graphs.graph1.data.graphdump.nodes;
            dataset.links = data.modules.graphs.graph1.data.graphdump.links;

            var links = [];
            var nodes = dataset.nodes.slice();
            var bilinks = [];

            links.forEach(function(link) {
                link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
                link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
            });

            // generate the graph
            var width = 2000,
                height = 1500;

            var force = d3.layout.force()
                .charge(-15)
                .linkDistance(20)
                .size([width, height])
                .on("tick", tick);

            function tick() {
                link.attr('d', function(d) {
                    return "M" + d[0].x + "," + d[0].y
                        + " S" + d[1].x + "," + d[1].y
                        + " " + d[2].x + "," + d[2].y;
                });
                node.attr('transform', function(d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                });
            }

            // Loop through the dataset and construct the nodes and links
            dataset.links.forEach(function(link) {
                var s = nodes[link.source],
                    t = nodes[link.target],
                    i = {};

                nodes.push(i);
                links.push({source: s, target: i}, {source: i, target: t});
                bilinks.push([s, i, t, {opacity: 0.01 * (link.weight / 50)}]);
            });

            var svg = d3.select(el)
                .append('svg:svg')
                .attr('width', width)
                .attr('height', height);

            svg.append("rect")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr('fill', '#023d45');

            var color = d3.scale.category20();

            force.nodes(nodes)
                .links(links)
                .start();

            // Create the links
            var link = svg.selectAll('.link')
                .data(bilinks)
                .enter().append('path')
                .attr('class', 'link')
                .attr('fill', 'none')
                .attr('stroke', '#fff')
                .attr('opacity', function(d) {
                    return d[3].opacity;
                });

            // Create the blank node
            var node = svg.selectAll('.node')
                .data(dataset.nodes)
                .enter().append('g')
                .attr('class', 'node')
                .attr('fill', '#fff')
                .call(force.drag);

            // Add the circle to the node
            node.append('circle')
                .attr('r', function (d) { return 3 * (d.size * 1.5); });

            // Here is the key. Without calling force.tick(), the simulation will not start and the nodes and links
            // will not have coordinates.
            for (var i = 0; i<200; i++) {
                force.tick();
            }

            // save result in an html file
            fs.writeFile('d3_graph.html', window.d3.select("body").html(), function(err) {
                if(err) {
                    console.log('error saving document', err);
                } else {
                    console.log('d3_graph.html was saved!');
                }
                elapsed_time('Time taken to run');

                process.exit(0);
            });
        });
    } // end jsDom done callback
});