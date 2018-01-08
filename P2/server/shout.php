<?php
	/*
	* File: main.js
	* Date: 11/29/2017
	* Author: Class Instructor
	* Modified By: Sherwin Fong
	*
	* JS-project, P2
	* Description: PHP code to handle AJAX requests. The file
	* location had to be changed depending on whether or not I was
	* testing at home or on school servers. The rest is unchanged
	*/

  # figure out the location of the json file written out
	# only done when testing on school servers
  //$path = preg_replace('/\/swe2017\/(\w+)\/.*/', '/\1/read-write/', getcwd());
  //$data_file = $path . 'shout.json';
   
  # when testing on localhost, use this
	$data_file = 'shout.json';

  # NOTE: if you need to remove your data file, you can temporarily
  # uncomment the next line, pull up the script in a browser, then
  # recomment it back out.

  # unlink($data_file);

  # GET - list messages
  if($_SERVER['REQUEST_METHOD'] == 'GET') {

    json(array('result' => 'success', 'data' => get_data()));

  # POST - commit a message
  } else if($_SERVER['REQUEST_METHOD'] == 'POST') {

    if($_REQUEST['name'] && $_REQUEST['message']) {
      $data = get_data();
      if(count($data) == 10) {
        array_pop($data);
      }
      $msg = array(
        'name' => stripslashes($_REQUEST['name']), 
        'message' => stripslashes($_REQUEST['message']), 
        'time' => date('M j g:i:s a')
      );
      array_unshift($data, $msg);
      if(file_put_contents($data_file, json_encode($data), LOCK_EX)) {
        json(array('result' => 'success', 'data' => $data));
      } else {
        json(array('result' => 'error', 'message' => 'Unable to save file'));
      }
    } else {
      json(array('result' => 'error', 'message' => 'Missing name and message arguments'));
    }

  # ANYTHING ELSE - error
  } else {

    json(array('result' => 'error', 'message' => 'Unrecognized request method'));

  }

  # utility to return array or messages (or empty if non-existent)
  function get_data() {
    global $data_file;
    $data = json_decode(file_get_contents($data_file), true);
    return $data == NULL ? array() : $data;
  }

  # utility to dump output as json response with good headers
  function json($data) {
    header('Content-type: application/json; charset=utf-8');
    header('Pragma: no-cache');
    header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    print json_encode($data);
  }

?>
