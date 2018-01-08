<?php
/*
* File: wiki.php
* Date: 11/29/2017
* Author: Class Instructor
*
* Project 4, P3
* Description: This is provided php file to handle AJAX requests every
	time the map is moved. Note that curl had to be installed for curl_init
	to work
*/
$lat = $_GET['lat'];
$long = $_GET['long'];
$radius= (int) $_GET['rad'];
if($radius > 10000){
	$radius = 10000;
}
$curl = curl_init("https://en.wikipedia.org/w/api.php?action=query&prop=coordinates|pageimages|pageterms|info|extracts&colimit=100&piprop=thumbnail&pithumbsize=144&pilimit=50&wbptterms=description&generator=geosearch&ggscoord=${lat}|${long}&ggsradius=${radius}&ggslimit=100&ggsprop=type&format=json&inprop=url");
curl_setopt($curl, CURLOPT_USERAGENT, 'UMBC_CMSC_433_Project/1.0 (https://www.csee.umbc.edu/~bwilk1/433/; bwilk1@umbc.edu)');
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$data = curl_exec($curl);
echo $data;
curl_close($curl);
exit();
