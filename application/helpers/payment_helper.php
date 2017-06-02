<?php
/**
* IC Payment
*@author Jesus Guerrero
*@copyright Copyright (c) 2017 Insane Code
*@version 1.0.0
*
*/

$client_details;

defined('BASEPATH') OR exit('No direct script access allowed');

if ( ! function_exists('create_payments')){
  /**
  * Genera los pagos de un contrato automaticamente
  * @param array $data the result of an select in a query 
  * @param int the number for start counting the rows the that is for my custom pagination
  *@return string the tbody with rows of a table 
  */ 

  function create_payments($id,$data,$context){
    $time_zone = new DateTimeZone('America/Santo_Domingo');
    $contract_date = new DateTime($data['fecha']);
    $next_payment_date = $contract_date;
    $one_month = new DateInterval('P1M');
    $duration = $data['duracion'];
    $concepto = "Instalación";
    
    for ($i=0; $i < $duration + 1; $i++) {
      if($i > 0) $concepto = $i."º pago de mensualidad"; 
      $new_data = array(
        'id_contrato' => $id,
        'id_servicio' => $data['id_servicio'],
        'fecha_pago'  => null,
        'concepto'    => $concepto,
        'cuota'       => $data['mensualidad'],
        'mora'        => 0,
        'total'       => $data['mensualidad'],
        'estado'      => "no pagado",
        'fecha_limite'=> $next_payment_date->format("Y-m-d")
      );
      $context->payment_model->add($new_data);
      $next_payment_date->add($one_month);
    }
  }
}

if (! function_exists('refresh_contract')){
  /**
  * Actualiza los pagos de un contrato automaticamente
  * @param array $data the result of an select in a query 
  * @param int the number for start counting the rows the that is for my custom pagination
  *@return string the tbody with rows of a table 
  */ 

  function refresh_contract($id,$context,$data_pago){
    $time_zone = new DateTimeZone('America/Santo_Domingo');
    $one_month = new DateInterval('P1M');
    $dateYMD = null;

    $contract = $context->contract_model->get_contract_view($id);
    $monto_pagado = $contract['monto_pagado'] + $contract['cuota'];
    $next_payment_date = new DateTime($contract['proximo_pago']);

    if($monto_pagado == $contract['monto_total']){
      $estado = "saldado";
      $next_payment_date = null;
    }else{
      $estado = "activo";
      $next_payment_date->add($one_month);
      $dateYMD = $next_payment_date->format("Y-m-d");
    }
    
    $data_contract = array(
      'id_contrato'   => $id,
      'monto_pagado'  => $monto_pagado,
      'ultimo_pago'   => $data_pago['fecha_pago'],
      'proximo_pago'  => $dateYMD,
      'estado'        => $estado
    );
      $context->contract_model->refresh_contract($data_pago,$data_contract,$contract); 
  }
}

if (! function_exists('upgrade_contract')){
  /**
  * Actualiza los pagos de un contrato automaticamente
  * @param array $data the result of an select in a query 
  * @param int the number for start counting the rows the that is for my custom pagination
  *@return string the tbody with rows of a table 
  */ 

  function upgrade_contract($context,$data_cambio){
    $contract_id = $data_cambio['id_contrato'];
    $contract = $context->contract_model->get_contract_view($contract_id);
    $pagos_restantes = $context->payment_model->count_unpaid_per_contract($contract_id);

    $monto_total = $contract['monto_pagado'] + ($data_cambio['cuota'] * $pagos_restantes);
    
    $data_contract = array(
      'id_contrato'   => $contract_id,
      'monto_total'   => $monto_total,
      'id_servicio'   => $data_cambio['id_servicio']
    );

    $data_pago = array(
      'id_contrato'   => $contract_id,
      'id_servicio'   => $data_cambio['id_servicio'],
      'cuota'         => $data_cambio['cuota'],
      'monto_total'   => $data_cambio['cuota']
    );
      $context->contract_model->upgrade_contract($data_pago,$data_contract); 
  }
}




/**
* Update_moras and Prepare_moras
* update_moras se informa de la ultima vez que corrió la función (ella misma), si fue hoy no hace nada, pero si ha pasado un dia
* se ejecuta prepare_moras que prepara los datos para actualizar los pagos
*
*/

function update_moras($context){ 
  $today = date('Y-m-d');
  $settings = $context->settings_model->get_settings();

  $next_check = $settings['next_check'];
  if($next_check == $today){
    $data = $context->payment_model->get_moras_view();
    if($data){
			prepare_moras($data,$context);
		}
    $result = $context->settings_model->update('last_check_moras',$today);
    echo $result;
  }
  
		 
}

function prepare_moras($data,$context){
  foreach ($data as $line) {
    $fecha = date($line['fecha_limite']);
    $cuota = $line['cuota'];
    $mora = $line['mora'];
    $monto_extra = $line['monto_extra'];
    $total = $line['total'];
    $mora = 200.00;
    $total = $cuota + $monto_extra + $mora;
    $updated_data = array(
      'id_pago' => $line['id_pago'],
      'mora'    => $mora,
      'total'   => $total
    );
    $context->payment_model->update_moras($updated_data);
  }
}

if (! function_exists('cancel_contract')){

  function cancel_contract($context,$data_cancel){
    $id_empleado = $_SESSION['user_data']['user_id'];
    $contract_id = $data_cancel['id_contrato'];
    $contract = $context->contract_model->get_contract_view($contract_id);
    $settings = $context->settings_model->get_settings();
    $penalizacion = ($settings['penalizacion_cancelacion'] / 100) * $contract['monto_total'];

    $monto_total = $contract['monto_pagado'] + $penalizacion;
    
    $data_contract = array(
      'id_contrato'   => $contract_id,
      'monto_total'   => $monto_total,
      'monto_pagado'  => $monto_total,
      'proximo_pago'   => null,
      'ultimo_pago'   => $data_cancel['fecha']
    );

    $data_pago = array(
        'id_contrato' => $data_cancel['id_contrato'],
        'id_empleado' => $id_empleado,
        'id_servicio' => $contract['id_servicio'],
        'fecha_pago'  => $data_cancel['fecha'],
        'concepto'    => 'Cancelación de Contrato',
        'cuota'       => 0,
        'mora'        => 0,
        'total'       => $penalizacion,
        'estado'      => "pagado",
        'fecha_limite'=> $data_cancel['fecha']
    );
    $context->contract_model->cancel_contract($data_pago,$data_contract,$contract); 
  }
}

