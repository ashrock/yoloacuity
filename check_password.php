<?php
	$json_array = array('status' => FALSE);
	if($_POST)
	{
		if(array_key_exists('password', $_POST) && ($_POST['password'] == "duHcycsHbHM92yNR" OR $_POST['password'] == "AcuityAI"))
		{
			$json_array = array('status' => TRUE);
		}
	}

	echo json_encode($json_array);
?>