//
// 3sketch_display contains the logic for creating the 3d scenes and sliders
// that are the result of running the design code.
//

var http = require('http');
var express = require('express');

var app = express();
app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');                     // make Jade templating engine available
app.use(express.bodyParser());                      // be able to get key-values from request body
app.use(express.static(__dirname + '/client'));     // serve static files from the /client directory

// Makes sure the data coming in over the wire is proper.
function cleanUpParams( params ) {
    var p;
    for ( var i = 0; i < params.length; i++ ) {
        p = params[i];
        p.min = parseFloat( p.min );
        p.max = parseFloat( p.max );
        p.step = parseFloat( p.step );
        p.value = p.min + ( p.max - p.min ) / 2 ;
    }
    return params;
}

app.post('/_display', function(req, res) {
    var jsCode = new Buffer( req.body.js_code, 'base64' ).toString().replace(/\n/g,"\\n"),
        geoParams = req.body.geo_params;
    geoParams = JSON.stringify( cleanUpParams( JSON.parse( geoParams ) ) );
    res.render('scene', { jsCode: jsCode, geoParams: geoParams });
});

var server = app.listen( process.env.PORT, function() {
    console.log('listening on port ' + process.env.PORT );
});