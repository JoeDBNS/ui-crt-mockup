var dependencies = {
	'jquery': {
		src: 'https://code.jquery.com/jquery-3.4.1.min.js',
        integrity: 'sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=',
		crossorigin: 'anonymous'
	},
	'popper': {
		src: 'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
		integrity: 'sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo',
		crossorigin: 'anonymous'
	},
	'bootstrap':{
		src: 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js',
		integrity: 'sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6',
		crossorigin: 'anonymous'
	}
};

function importScript(name){

	return new Promise(function(resolve, reject) {
    var dependency = dependencies[name];

  	var js = document.createElement("script");

  	js.type = "text/javascript";
  	js.src = dependency.src;

  	if (dependency.integrity) {
  		js.integrity = dependency.integrity
  	}
  	if (dependency.crossorigin) {
  		js.crossOrigin = dependency.crossorigin
  	}

  	//js.onload = resolve;

  	js.onload = function(){

  		//console.log(name + " loaded");

  		resolve();

  	}

  	document.body.appendChild(js);


  });

};

