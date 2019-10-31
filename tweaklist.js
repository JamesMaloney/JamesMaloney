//iOS Device Checker
is_ios = (navigator.userAgent.match(/iPad/i) != null) || (navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null);
var funfunfun = 'Add this repo to Cydia'
if(is_ios)
	document.getElementById('idevice').innerHTML = funfunfun;
else {
	document.getElementById('idevice').style.color = "red";
	document.getElementById('idevice').innerHTML = 'Only available through iDevice!';
}

//apt_package object constructor, used for repo listing
function aptPackage() {
	this.Package;
	this.Name;
}

function parsePackagesFile(packagesFile) {
	var packagesList = {};
	//Remove all carriage returns, which should not be there, anyways.
	while(packagesFile.indexOf('\r') >= 0)
		packagesFile = packagesFile.replace('\r', '');
	var packages = packagesFile.split('\n\n');
	for(var c = 0; c < packages.length; ++c) {
		var singlePackage = parsePackage(packages[c]);
		if(singlePackage == undefined)
			continue;
		var packageID = singlePackage.Package;
		//Only keep the latest version.
		if(packagesList[packageID] && (parseFloat(singlePackage.Version) >= parseFloat(packagesList[packageID].Version)))
			packagesList[packageID] = singlePackage;
		else if(packagesList[packageID] == undefined)
			packagesList[packageID] = singlePackage;
	}
    return packagesList;
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

var xhr;
if(window.XMLHttpRequest)
	xhr = new XMLHttpRequest();
else if (window.ActiveXObject)
	xhr = new ActiveXObject('Microsoft.XMLHTTP');

xhr.onreadystatechange = function() {
	if (!(xhr.readyState == 4)) return;
	var packagesList = parsePackagesFile(xhr.responseText);
	if (!packagesList)
		return;
	for(key in packagesList) {
		var pack = packagesList[key];
		//The following code is very messy. You have been warned.
		document.getElementById('tweaks').innerHTML = document.getElementById('tweaks').innerHTML
		+ '<a href="pages/' + pack.Package + '">'
		+ '<img class="icon" src="icons/' + pack.Package + '.png" onerror="this.src=\'icons/default.png\';" width="58" height="58">'
		+ '<div><label>' + pack.Name + '</label></div></a>';
	}
};

xhr.open("GET","Packages");
xhr.send();