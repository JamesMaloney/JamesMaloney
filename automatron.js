//iOS Device Checker
/* is_ios = (navigator.userAgent.match(/iPad/i) != null) || (navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null);
var funfunfun = 'Add this repo to Cydia'
if(is_ios)
	document.getElementById('idevice').innerHTML = funfunfun;
else {
	document.getElementById('idevice').style.color = "red";
	document.getElementById('idevice').innerHTML = 'Only available through iDevice!';
} */

//apt_package object constructor, used for repo listing
function aptPackage() {
	this.Package;
	this.Description;
	this.Name;
}

function findPackage(packagesFile, packageToFind) { 
	//Remove all carriage returns, which should not be there, anyways.
	while(packagesFile.indexOf('\r') >= 0)
		packagesFile = packagesFile.replace('\r', '');
	var packages = packagesFile.split('\n\n');
	for(var c = 0; c < packages.length; ++c) {
		var singlePackage = parsePackage(packages[c]);
		if(singlePackage == undefined)
			continue;
		if(singlePackage.Package === packageToFind)
			break;
	}
    return singlePackage;
}

function parsePackage(packageString) {
	var singlePackage = new aptPackage();
	var lines = packageString.split('\n');
	for(var c = 0; c < lines.length; ++c) {
		if(lines[c].search(':') == -1)
			continue;
		//Quick and dirty.
		var components = lines[c].split(':');
		var key = components.shift();
		var value = components.join(':').trim();
		switch(key) {
			case 'Package':
				singlePackage.Package = value;
				break;
			case 'Description':
				singlePackage.Description = value;
				break;
			case 'Name':
				singlePackage.Name = value;
				break;
			default:
				break;
		}
	}
	if(singlePackage.Package == undefined)
		return undefined;
	return singlePackage;
}

//Starts by getting the package id
var url = new URL(window.location.href);
var id = url.searchParams.get("id");

var xhr;
if(window.XMLHttpRequest)
	xhr = new XMLHttpRequest();
else if (window.ActiveXObject)
	xhr = new ActiveXObject('Microsoft.XMLHTTP');

xhr.onreadystatechange = function() {
	if (!(xhr.readyState == 4)) return;
	var pack = findPackage(xhr.responseText, id);
	document.getElementById('title').innerHTML = document.getElementById('title').innerHTML
	+ 'The REPOster - ' + pack.Name;
	document.getElementById('description').innerHTML = document.getElementById('description').innerHTML
	+ pack.Description;
};

xhr.open("GET","Packages");
xhr.send();