window.onload = function() {
		// var fileInput = document.getElementById('fileInput');
		// var fileDisplayArea = document.getElementById('fileDisplayArea');
    //
		// fileInput.addEventListener('change', function(e) {
		// 	var file = fileInput.files[0];
		// 	var reader = new FileReader();
    //
		// 	reader.onload = function(e) {
		// 		fileDisplayArea.innerText = reader.result;
		// 	}
    //
		// 	reader.readAsText(file);
		// });

    var request = new XMLHttpRequest();
    request.open('GET', "https://raw.githubusercontent.com/keldenl/foodie-map/master/README.md", true);
    request.responseType = 'blob';
    request.onload = function() {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload =  function(e){
            console.log('DataURL:', e.target.result);
        };
    };
    request.send();
}
