// Get the shoe name
var url = new URL(window.location.href);
var shoe_name = url.searchParams.get("name");

console.log(shoe_name)