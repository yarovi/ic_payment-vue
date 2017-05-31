<?php
/**
* IC Payment
*@author Jesus Guerrero
*@copyright Copyright (c) 2017 Insane Code
*@version 1.0.0
*
*/
defined('BASEPATH') OR exit('No direct script access allowed');

class Report_model extends CI_MODEL{

  public function __construct(){
    parent::__construct();
    $this->load->database();
    $this->load->library('table');
  }


  public function get_payments_report($status){
    $sql = "SELECT id_pago,id_contrato,cliente,concepto,servicio ,total, complete_date,time(complete_date) as hora FROM v_recibos where day(fecha_pago) = day(now()) order by complete_date";
    if($result = $this->db->query($sql)):
      $result = $result->result_array();
      make_payment_report($result,"Reporte De Pagos Del Dia",$this);
    else:
      echo $this->db->last_query();
    endif;
  }

  public  function get_total_payments($date){
    $sql = "SELECT SUM(total) as total from v_recibos where fecha_pago = $date";
    if($result = $this->db->query($sql)):
      $result = $result->row_array()['total'];
      return $result;
    else:
      echo $this->db->last_query();
    endif;
  }

  
}