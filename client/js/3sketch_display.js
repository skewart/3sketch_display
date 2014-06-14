
/*
 *  THREE.JS FUNCTIONS
 */

// Module-wide object to hold some data and state
var S = {},
    U = {};


function animate() {
	S.controls.update();
	S.renderer.render( S.scene, S.camera );
	requestAnimationFrame( animate );
}


// Sets up the function (and possibly any other stuff needed) for the User data function
function setupU() {
    // TODO Check and handle bad state in U object
    var p,
        args = [];
    U.params = {};
    
    for ( var i = 0; i < _paramslist.length; i++ ) {
        p = _paramslist[i].name
        args.push( p );
        U.params[ p ] = _paramslist[i].value;
    }
    
    U.func = (function() {
        var window = {},
            document = {};
        var uf = function() { return new THREE.CubeGeometry(10,10,10) } // Default behavior - TODO change to some 3d error message
        eval( "uf = function( " + args.join(",") + ") { " + _functext + " }" )
        return uf;
    })()
    
}


// Does initial canvas setup
function setupCanvas() {

	var containerID = 'canvasGoesHere';
	S.container = document.getElementById( containerID );

	// Create the scene object
	S.scene = new THREE.Scene();

	// Renderer setup
	S.renderer = new THREE.WebGLRenderer( { antialias: true } );
	
	if (S.renderer) {
		S.container.innerHTML = '';
	} else {
		return;
	}
    
    S.renderer.setSize( S.container.offsetWidth, S.container.offsetHeight );
    
    // HTML element container
	S.container.appendChild( S.renderer.domElement );

	// Camera setup
	//S.camera = new THREE.PerspectiveCamera( 45, S.container.innerHeight / S.container.innerWidth, 1, 1000 );
	S.camera = new THREE.PerspectiveCamera( 45, S.container.offsetHeight / S.container.offsetWidth, 1, 10000 );
	S.camera.position.z = 400;
	S.camera.position.x = -400;
	S.camera.position.y = 400;

	// Controls setup
	S.controls = new THREE.OrbitControls( S.camera, S.container );

}



// Updates the THREE.js mesh to be in sync with the geometry-making function
function updateMesh() {
    
    var pname,
        argVals = [];
	
    for ( var i = 0, len = _paramslist.length; i < len; i++ ) {
        pname = _paramslist[i].name;
        argVals.push( U.params[ pname ] );
    }
	
	if (S.mesh) {
		S.scene.remove( S.mesh );
	}
    
    var userGeo = U.func.apply( this, argVals );
    // TODO Check that userGeo is actually a THREE.Geometry object
	S.mesh = new THREE.Mesh( userGeo, new THREE.MeshNormalMaterial() );
	S.scene.add( S.mesh );
	
}


function processGeometry() {
    
    var controller, 
        gui = new dat.GUI();

	for ( var i = 0; i <  _paramslist.length; i++ ) {
		p = _paramslist[ i ];
		controller = gui.add( U.params, p.name, p.min, p.max );
		controller.onFinishChange( function(value) {
		    updateMesh();
		})
	}

}


window.onload = function() {
    setupU();
	setupCanvas();
	updateMesh();
	processGeometry();
	animate();
};
