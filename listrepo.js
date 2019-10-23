//iOS Device Checker
is_ios = (navigator.userAgent.match(/iPad/i) != null) || (navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null);
if(is_ios)
	document.getElementById('idevice').innerHTML = 'Add this repo to Cydia';
else {
	document.getElementById('idevice').style.color = "red";
	document.getElementById('idevice').innerHTML = 'Only available through iDevice!';
}