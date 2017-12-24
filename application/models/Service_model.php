<?php
/**
* IC Payment
*@author Jesus Guerrero
*@copyright Copyright (c) 2017 Insane Code
*@version 1.0.0
*
*/
defined('BASEPATH') OR exit('No direct script access allowed');

class Service_model extends CI_MODEL{

  public $id_servicio = null;
  public $nombre;
  public $descripcion;
  public $mensualidad;
  public $tipo;


  public function __construct(){
    parent::__construct();

    $this->load->helper('lib_helper');
  }

  /**
  *
  *@param array $data array with the data of the user
  *@param string $mode "normal" for save it in an insert, "full" to storage all the data
  *@return void
  */

  function organize_data($data,$mode){

    if($mode == "full"){
      $this->id_servicio   = $data['id_servicio'];
    }
    $this->nombre          = $data['nombre'];
    $this->descripcion     = $data['descripcion'];
    $this->mensualidad     = $data['mensualidad'];
    $this->tipo            = $data['tipo'];
  }

  public function add($data){
    $this->organize_data($data, "normal");
    $result = $this->db->query("SELECT * FROM ic_servicios WHERE nombre = '". $this->nombre . "'");
    $result = $result->result_array();
    $result = count($result);
    if($result){
      return ['message' => "Este nombre ya está registrado"];
    }else{
      return $this->db->insert('ic_servicios', $this);
    }
  }

  public function update_service($data){
    $data_for_update = array(
      'nombre'      => $data['nombre'],
      'descripcion' => $data['descripcion'],
      'mensualidad' => $data['mensualidad'],
      'tipo'        => $data['tipo']
    );
    $this->db->where('id_servicio', $data['id_servicio']);
    if ($this->db->update('ic_servicios', $data_for_update)) {
      return $this->update_contracts_of_service($data);
    }
  }

  public function get_all_services(){
    $this->db->order_by('tipo, mensualidad');
    $result = $this->db->get('ic_servicios');
    return make_service_table($result->result_array(),0);
  }

  public function search_services($word){
    $fields = array(
     'id_servicio'  => $word,
     'nombre'       => $word,
     'descripcion'  => $word
    );
    $this->db->or_like($fields);
    $this->db->order_by('tipo, mensualidad');
    if($result = $this->db->get('ic_servicios')){
      echo  make_service_table($result->result_array(),0);
    }
  }

  public function get_services_shortcuts(){
    $sql    = "SELECT * FROM ic_servicios WHERE tipo= 'internet' order by mensualidad";
    $result = $this->db->query($sql);
    echo make_service_shortcuts($result->result_array());
  }

  public function get_services_dropdown(){
    $sql = "SELECT * FROM ic_servicios WHERE tipo= 'reparacion'";
    $result = $this->db->query($sql);
    echo make_other_services_dropdown($result->result_array());
  }

  public function count_services(){
    $result = $this->db->count_all("ic_servicios");
    echo $result;
  }

  public function get_service($id){
    $this->db->where('id_servicio', $id);
    $this->db->or_where('nombre', $id);
    if($result = $this->db->get('ic_servicios',1)){
      return $result->row_array();
    }
  }

  public function delete_service($id){
    $this->db->where('id_servicio', $id);
    return $this->db->delete('ic_servicios');
  }


  private function update_contracts_of_service($data_cambio){
    $this->load->model('contract_view_model');
    $this->load->model('payment_model');
    $service_id = $data_cambio['id_servicio'];
    $contracts = $this->contract_view_model->get_contract_view_of_service($service_id);
    $count = 0;
    $contratos_a_cambiar = count($contracts);

    foreach ($contracts as $contract) {
      $contract_id = $contract['id_contrato'];
      $pagos_restantes = $this->payment_model->count_unpaid_per_contract($contract_id);
      $monto_total = $contract['monto_pagado'] + ($data_cambio['mensualidad'] * $pagos_restantes);

      $data_contract = array(
        'monto_total'   => $monto_total,
      );

      $this->db->where('id_contrato',$contract_id);
      $payments = $this->payment_model->get_unpaid_per_contract($contract_id);

      foreach ($payments as $payment) {
        $total = $data_cambio['mensualidad'] + $payment['mora'] + $payment['monto_extra'];

        $data_pago = array(
          'cuota' => $data_cambio['mensualidad'],
          'cuota' => $data_cambio['mensualidad'],
          'total' => $total
        );

        $this->db->where('id_pago',$payment['id_pago']);
      }
      $count++;
    }

    return "$count de $contratos_a_cambiar contratos actualizados";
  }
}
