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
		switch(lines[c].split(':').shift()) {
			case 'Package':
				singlePackage.Package = lines[c].split(':').join(':').trim();
				break;
			case 'Name':
				singlePackage.Name = lines[c].split(':').join(':').trim();
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
	var packagesList = parsePackages(xhr.responseText);
	if (!packagesList)
		return;
	for(key in packagesList) {
		var pack = packagesList[key];
		//The following code is very messy. You have been warned.
		document.getElementById('tweaks').innerHTML = document.getElementById('tweaks').innerHTML
		+ '<a href="pages/' + pack.Package + '"> <); e.style.display = e.style.display= (e.style.display == \'block\' ? \'none\' : \'block\');">' +
			pack.Name + ' (' + pack.Version + ')</a><br>' +
			'<div id="u_' + pack.Package + '" style="display:none;">' +
			'&nbsp;&nbsp;' + pack.Description + '<br>' +
			(is_ios ? '&nbsp;&nbsp;<a href="' +  'cydia://url/https://cydia.saurik.com/api/share#?source=http://h6nry.github.io/repo/&package=' + pack.Package + '" target="_blank">Show in Cydia.</a><br>' : '') +
			'&nbsp;&nbsp;<a href="' + pack.Depiction + '" target="_blank">Show more info.</a><br>' +
			'&nbsp;&nbsp;<a href="' + pack.Filename + '" target="_blank">Download the .deb package.</a><br><br>' +
			'</div>';
	}
};


/* <a href="pages/com.pul.hotspotcrack">
	<img class="icon" src="icons/default.png" width="58" height="58"><div>
				<label>Hotspot Shield++</label>
			</div></a> */


xhr.open("GET","Packages");
xhr.send();