// Get the shoe name
var url = new URL(window.location.href);
var shoe_name = url.searchParams.get("name");

if(shoe_name != null) {
    document.getElementById("model").setAttribute("src", "https://raw.githubusercontent.com/santoniconfigurator/ARTest/main/Test/" + shoe_name + ".glb");
    document.getElementById("model").setAttribute("ios-src", "https://raw.githubusercontent.com/santoniconfigurator/ARTest/main/Test/" + shoe_name + ".usdz");
}
else {
    document.getElementById("model").setAttribute("src", "sneaker.glb");
    document.getElementById("model").setAttribute("ios-src", "sneaker.usdz");
}