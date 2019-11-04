//aptPackage object constructor, used for repo listing
function aptPackage() {
	this.Package;
	this.Depends;
	this.Description;
	this.Name;
}

//Latest jailbreakable iOS version, used for compatibility
const latestjb = 12.4;

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
	document.getElementById('title').innerHTML += 'The REPOster - ' + pack.Name;
	
	//Give custom compatibility
	var fwdepends = pack.Depends.split('firmware (');
	
	//The default compatibility is "incompatible"
	var compstring = 'This package has <strong style="color: #BF9000;;">unknown compatibility';
	if(fwdepends.length > 1) {
		if(fwdepends[1].charAt(0) == '=') {
			//The package is only compatible with one iOS version
			compstring = 'This package is <strong style="color: #38761E;">only compatible with iOS '
			+ fwdepends[1].substring(fwdepends[1].indexOf(' '), fwdepends[1].indexOf(')'));
		} else {
			var ispresent = false;
			compstring = 'This package is <strong style="color: #38761E;">compatible with iOS ';
			//The package has a minumum iOS version
			for(var fd = 1; fd < fwdepends.length; ++fd) {
				if(fwdepends[fd].charAt(0) == '>') {
					compstring += fwdepends[fd].substring(fwdepends[fd].indexOf(' '), fwdepends[fd].indexOf(')'));
					ispresent = true;
					break;
				}
			}
			if(!ispresent)
				compstring += 'up to ';
			else
				compstring += ' to ';
			ispresent = false;
			//The package has a maximum iOS version
			for(var fd = 1; fd < fwdepends.length; ++fd) {
				if(fwdepends[fd].charAt(0) == '<')
					//Maximum iOS version is indicated as <=
					if(fwdepends[fd].charAt(1) == '=') {
						compstring += fwdepends[fd].substring(fwdepends[fd].indexOf(' '), fwdepends[fd].indexOf(')'));
						ispresent = true;
						break;
					}
					//Maximum iOS version is indicated as << (indicated version is excluded)
					else {
						compstring += fwdepends[fd].substring(fwdepends[fd].indexOf(' '), fwdepends[fd].indexOf(')'));
						compstring += ' excluded';
						ispresent = true;
						break;
					}
			}
			if(!ispresent)
				compstring += '(possibly) ' + latestjb;
		}
	}	
	compstring += '</strong>.';
	
	//Final print
	document.getElementById('compatibility').innerHTML += compstring;
	
	//Give custom Cydia opener (only on iOS, otherwise red text with error)
	var opencydia = '<a href="cydia://package/' + pack.Package + '">' + '<img class="icon" src="/theme/jonyive/resources/cydia.png" width="58" height="58">';
	if(is_ios) {
		opencydia += '<div><label>View in Cydia</label></div></a>';
	} else {
		opencydia += '<div><label style="color: red">Only available through iDevice!</label></div></a>';
	}
	document.getElementById('opencydia').innerHTML += opencydia;
	
	//Give custom description
	document.getElementById('description').innerHTML += pack.Description;
};

xhr.open("GET","Packages");
xhr.send();