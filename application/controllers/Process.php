<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Process extends CI_Controller {

	public function __construct(){
		parent::__construct();
		$this->load->model('user_model');
		$this->load->model("client_model");
		$this->load->model("service_model");
		$this->load->model("contract_model");
		$this->load->model("contract_view_model");
		$this->load->model("payment_model");
		$this->load->model("company_model");
		$this->load->model("report_model");
		$this->load->model("settings_model");
		$this->load->model("averia_model");
		$this->load->helper(array('report','payment'));
	}

	public function add(){ 
		$data = $_POST;
		$tabla = $_POST['tabla'];
		switch ($tabla) {
			case "clientes":
				$this->client_model->add($data);
				break;
			case "servicios":
				$this->service_model->add($data);
				break;
			case "averias":
				$this->averia_model->add($data);
				break;
			case "caja":
				$this->caja_model->add($data);
				break;
			case "contratos":
				 $this->db->trans_start();
				 $is_saved = $this->contract_model->add($data);
				 if($is_saved){
					$this->client_model->is_active(true,$data);
				 	$contract_id = $this->contract_model->get_last_Id();
				 	create_payments($contract_id,$data,$this);
				 }
				 $this->db->trans_complete();
				 if($this->db->trans_status()){

				 }
				 else{
					 echo "No guardado";
				 }
				break;
		}

	}

	public function update(){
		$data = $_POST;
		$tabla = $_POST['tabla'];
		switch ($tabla) {
			case "clientes":
				$this->client_model->update_client($data);
				break;
			case "observaciones":
				$this->client_model->update_observations($data);
				break;
			case "servicios":
				$this->service_model->update_service($data);
				break;
			case "pagos":
				$was_correct = $this->payment_model->check_for_update($data);
				if($was_correct){
					$id_contrato = $data['id_contrato'];
					refresh_contract($id_contrato,$this,$data);
				}
				break;
			case "empresa":
				$this->company_model->update($data);
				break;
			case "settings":
				$this->settings_model->update_settings($data);
				break;
		}
	}

	public function upgrade(){
		$data_cambio = $_POST;
		upgrade_contract($this,$data_cambio);
	}
	public function getall(){
		$tabla = $_POST['tabla'];
		switch ($tabla) {
			case "users":
				$this->user_model->get_all_users();
				break;
			case "clientes":
				$this->client_model->get_all_clients();
				break;
			case "servicios":
				$this->service_model->get_all_services();
				break;
			case "pagos":
				$this->payment_model->get_all_of_contract($_POST['id']);
				break;
			case "v_proximos_pagos":
				$this->payment_model->get_next_payments($_POST);
				break;
			case "v_pagos_pendientes":
				$this->payment_model->get_moras_home();
				break;
		}
	}

	public function lastpage(){
				$tabla = $_POST['tabla'];
		switch ($tabla){
			case "pagos":
				$this->payment_model->last_page();
				break;
			case "clientes":
				$this->client_model->last_page();
				break;

		}

	}

	public function getone(){
		$tabla = $_POST['tabla'];
		switch ($tabla) {
			case "clientes":
				$result = $this->client_model->get_clientjson($_POST['id'],true);
				if($result){
					 $dataJson = json_encode($result);
					 echo $dataJson;
				}else{
					echo "nada";
				}
			break;
		}
	}

	public function paginate(){
		$offset = $_POST['offset'];
		$perpage = $_POST['perpage'];
		$table = $_POST['table'];
		if($offset == 1) $offset = 0;
		switch ($table) {
			case "clientes":
				$this->client_model->get_clients_paginate($offset,$perpage);
				break;
			case "servicios":
				$this->service_model->get_services_paginate($offset,$perpage);
				break;
			case "v_contratos":
				$this->contract_view_model->get_contracts_paginate($offset,$perpage);
			break;
			case "pagos_por_contrato":
				$this->payment_model->get_payments_paginate($offset,$perpage);
			break;
		}
	}

	public function delete(){
		$id = $_POST['id'];
		$tabla = $_POST['tabla'];

		switch ($tabla) {
			case 'clientes':
				$this->client_model->delete_client($id);
				break;
			case 'servicios':
				$this->service_model->delete_service($id);
				break;
			default:
				# code...
				break;
		}
	}

	public function count(){
		$tabla = $_POST['tabla'];
		switch ($tabla) {
			case 'users':
				$this->user_model->count_users();
				break;
			case 'clientes':
				$this->client_model->count_clients();
				break;
			case 'servicios':
				$this->service_model->count_services();
				break;
			case 'pagos':
				$this->payment_model->count_payments();
				break;
			case 'pagos_por_contratos':
				$this->payment_model->count_per_contract();
			default:
				# code...
				break;
		}
	}

	public function search(){
		$tabla = $_POST['tabla'];
		$word = $_POST['word'];
		switch ($tabla) {
			case 'clientes':
				$this->client_model->search_clients($word);
				break;
			case 'v_contratos':
				 $this->contract_view_model->search_contracts($word);
				break;
		} 
	}

	public function details($id,$active_window){

		$_SESSION['client_data'] = $this->client_model->get_client($id);
		$this->session->set_flashdata('active_window',$active_window);
		redirect(base_url('app/admin/detalles'));
	}

	public function newcontract($id){

		$_SESSION['client_data'] = $this->client_model->get_client($id);
		redirect(base_url('app/admin/nuevo_contrato'));
	}

	public function getrecibo($id){
		$recibo_info = $this->payment_model->get_recibo($id);
		$this->session->set_flashdata('recibo_info',$recibo_info);
		redirect(base_url('app/imprimir/recibo'));
	}

	public function getreport($table,$type){
		switch ($table) {
			case 'payment':
					$this->report_model->get_payments_report($type);
					redirect(base_url('app/imprimir/reporte'));
				break;
			case 'installations':
					$this->report_model->get_installations(null,true);
					redirect(base_url('app/imprimir/reporte'));
				break;
			
			default:
				# code...
				break;
		}
	
	}
	
	public function cancel(){
		$data_cancel = $_POST;
		cancel_contract($this,$data_cancel);
	}

	public function data_for_extra(){
		$dni = $_POST['dni'];
		$data;
		$client = $this->client_model->get_clientjson($dni);
		if($client){
			$data['cliente'] = $client;
			$data["contratos"]  = $this->contract_model->get_all_of_clientjson($client->id_cliente);
			$dataJson = json_encode($data);
			echo $dataJson;
		}else{
			echo "nada";
		}
		
	}

	public function extend_contract(){
		$data = $_POST;
		$this->db->trans_start();
		extend_contract($data,$this);
		$this->db->trans_complete();
		if($this->db->trans_status()){
			echo MESSAGE_SUCCESS." Contrato extendido con exito";
		}
		else{
			echo MESSAGE_ERROR."No guardado".$this->db->last_query();
		}
	}

	public function addextra(){
		$data = $_POST;
		add_extra($this,$data);
	}

}