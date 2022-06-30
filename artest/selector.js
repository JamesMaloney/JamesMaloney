// Get the shoe name
var url = new URL(window.location.href);
var shoe_name = url.searchParams.get("name");

document.getElementById("model").setAttribute("src", shoe_name + ".glb");
document.getElementById("model").setAttribute("ios-src", shoe_name + ".usdz");