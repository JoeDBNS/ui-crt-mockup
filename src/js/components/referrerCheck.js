window.addEventListener('load', function() {
    var referrer_core = document.referrer.replace('https://', '').replace('http://', '').split('/')[0];
	if (referrer_core.indexOf('.michigan.gov') === -1 && referrer_core.indexOf('.state.mi.us') === -1) {
        // $('main section').hide();
        // $('#incorrect-referrer').show();
    }
});