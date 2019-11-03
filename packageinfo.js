//aptPackage object constructor, used for repo listing
function aptPackage() {
	this.Package;
	this.Depends;
	this.Description;
	this.Name;
}

//Latest jailbreakable iOS version, used for compatibility
const latestjb = 12.4;
const latestiossupported = "(possibly) " + latestjb;

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
			case 'Depends':
			case 'Pre-Depends':
				singlePackage.Depends = value;
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

//iOS Device Checker
is_ios = (navigator.userAgent.match(/iPad/i) != null) || (navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null);

var xhr;
if(window.XMLHttpRequest)
	xhr = new XMLHttpRequest();
else if (window.ActiveXObject)
	xhr = new ActiveXObject('Microsoft.XMLHTTP');

xhr.onreadystatechange = function() {
	if (!(xhr.readyState == 4)) return;
	var pack = findPackage(xhr.responseText, id);
	
	//Give custom title
	document.getElementById('title').innerHTML = document.getElementById('title').innerHTML
	+ 'The REPOster - ' + pack.Name;
	
	//Give custom compatibility
	/* var fwdepends = pack.Depends.split('firmware (');
	if(pack.Depends == undefined || fwdepends.length == 1) {
		//No firmware dependecies (or no dependecies at all) specified: unknown compatibility
		document.getElementById('compatibility').innerHTML = document.getElementById('compatibility').innerHTML
		+ 'This package has <strong style="color: #BF9000;;">unknown compatibility'</strong>.'
	} else if(fwdepends.length == 2) {
		//One firmware dependency specified
		
		document.getElementById('compatibility').innerHTML = document.getElementById('compatibility').innerHTML
		+ 'This package has <strong style="color: #BF9000;;">unknown compatibility'</strong>.'
	} else {
		//Two firmware dependecies specified: both min and max iOS versions known
		if(fwdepends[0]
	} */
	
	document.getElementById('compatibility').innerHTML = document.getElementById('compatibility').innerHTML
	+ 'This package is <strong style="color: #38761E;">compatible with iOS ' + 'miniosplaceholder' + ' to ' + latestjb + '</strong>.'
	+ pack.Depends + latestiossupported;
	
	//Give custom Cydia opener (only on iOS, otherwise red text with error)
	if(is_ios) {
		document.getElementById('opencydia').innerHTML = document.getElementById('opencydia').innerHTML
		+ '<a href="cydia://package/' + pack.Package + '">'
		+ '<img class="icon" src="/theme/jonyive/resources/cydia.png" width="58" height="58">'
		+ '<div><label>View in Cydia</label></div></a>';
	} else {
		document.getElementById('opencydia').innerHTML = document.getElementById('opencydia').innerHTML
		+ '<a href="cydia://package/' + pack.Package + '">'
		+ '<img class="icon" src="/theme/jonyive/resources/cydia.png" width="58" height="58">'
		+ '<div><label style="color: red">Only available through iDevice!</label></div></a>';
	}
	
	//Give custom description
	document.getElementById('description').innerHTML = document.getElementById('description').innerHTML
	+ pack.Description;
};

xhr.open("GET","Packages");
xhr.send();