<?php
 	require_once("Rest.inc.php");
	
	class API extends REST {
	
		public $data = "";
		
		const DB_SERVER = "Please see the dbConnect method for this variable constant";
		const DB_USER = "missusw";
		const DB_PASSWORD = "two@AT1me";
		const DB = "missusw";

		private $db = NULL;
		private $mysqli = NULL;
		public function __construct(){	
			parent::__construct();				// Init parent contructor
			$this->dbConnect();					// Initiate Database connection
		}
		
		/*
		 *  Connect to Database
		*/
		private function dbConnect(){
		  $DB_SERVER = getenv('DB_PORT_3306_TCP_ADDR');
			$this->mysqli = new mysqli($DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
		}
		
		/*
		 * Dynmically call the method based on the query string
		 */
		public function processApi(){
			$func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
			if((int)method_exists($this,$func) > 0)
				$this->$func();
			else
				$this->response('',404); // If the method not exist with in this class "Page not found".
		}
				
		private function login(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$email = $this->_request['email'];		
			$password = $this->_request['pwd'];
			if(!empty($email) and !empty($password)){
				if(filter_var($email, FILTER_VALIDATE_EMAIL)){
					$query="SELECT uid, name, email FROM users WHERE email = '$email' AND password = '".md5($password)."' LIMIT 1";
					$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

					if($r->num_rows > 0) {
						$result = $r->fetch_assoc();	
						// If success everythig is good send header as "OK" and user details
						$this->response($this->json($result), 200);
					}
					$this->response('', 204);	// If no records "No Content" status
				}
			}
			
			$error = array('status' => "Failed", "msg" => "Invalid Email address or Password");
			$this->response($this->json($error), 400);
		}
		
		private function appointments(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT a.appointment_id, a.appointment_date, a.day_of_week, a.customer_name, a.appointment_time, a.appointment_duration, a.therapy_type, a.therapist, a.payment_amount, a.location FROM appointment a ";
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		private function filteredAppointments() {
		
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$filter_date = $this->_request['effective_date'];		
			$filter_date_string = "'";
			$filter_date_string = $filter_date_string.$filter_date;
			$filter_date_string = $filter_date_string."'";
			if($filter_date_string != ''){	
				$query="SELECT a.appointment_id, a.appointment_date, a.day_of_week, a.customer_name, a.appointment_time, 
													a.appointment_duration, a.therapy_type, a.therapist, a.payment_amount, a.location 
													FROM appointment a 
													where DATE_FORMAT(a.appointment_date,'%Y-%m-%d')= $filter_date_string
													ORDER BY a.appointment_time asc";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = array();
                
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		private function appointment(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
				$query="SELECT a.appointment_id, a.appointment_date, a.day_of_week, a.customer_name, a.appointment_time, a.appointment_duration, a.therapy_type, a.therapist, a.payment_amount, a.location FROM appointment a where a.appointment_id=$id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}		
		private function insertAppointment(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$appointment = json_decode(file_get_contents("php://input"),true);
			//Clean up the appointment time for the fussy old database			
			$appointment_time = $appointment['appointment_time'];
			$new_appointment_time = str_replace(".", ":", $appointment_time);	
			$appointment['appointment_time'] = $new_appointment_time;

			$column_names = array('appointment_date', 'day_of_week', 'customer_name', 'appointment_time', 'appointment_duration', 'therapy_type', 'therapist', 'payment_amount', 'location');
			$keys = array_keys($appointment);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the appointment received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $appointment[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			$query = "INSERT INTO appointment(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($appointment)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Appointment Created Successfully.", "data" => $appointment);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}
		private function updateAppointment(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$appointment = json_decode(file_get_contents("php://input"),true);	
            //Clean up the appointment time for the fussy old database    		
			$appointment_time = $appointment['appointment_time'];
			$new_appointment_time = str_replace(".", ":", $appointment_time);	
			$appointment['appointment_time'] = $new_appointment_time;
			$id = (int)$appointment['id'];
			$column_names = array('appointment_date', 'day_of_week', 'customer_name', 'appointment_time', 'appointment_duration', 'therapy_type', 'therapist', 'payment_amount', 'location');
			$keys = array_keys($appointment['appointment']);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the appointment received. If key does not exist, insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $appointment['appointment'][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE appointment SET ".trim($columns,',')." WHERE appointment_id=$id";
			if(!empty($appointment)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Appointment ".$id." Updated Successfully.", "data" => $appointment);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		}
		
		private function deleteAppointment(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){				
				$query="DELETE FROM appointment WHERE appointment_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Successfully deleted one record.");
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// If no records "No Content" status
		}
		
		/*
		 *	Encode array into JSON
		*/
		private function json($data){
			if(is_array($data)){
				return json_encode($data);
			}
		}
	}
	
	// Initiate Library
	$api = new API;
	$api->processApi();
?>
