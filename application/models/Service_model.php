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
    $this->load->database();
    $this->load->helper('users_helper');
  }

  /**
  *
  *@param array $data array with the data of the user
  *@param string $mode "normal" for save it in an insert, "full" to storage all the data
  *@return void
  */

  function organize_data($data,$mode){

    if($mode == "full"){
      $this->id_cliente = $data['id_servicio'];
    }
    $this->nombre          = $data['nombre'];      
    $this->descripcion     = $data['descripcion'];     
    $this->mensualidad     = $data['mensualidad'];
    $this->tipo            = $data['tipo'];
  }

  public function add($data){
    $this->organize_data($data,"normal");
    $result = $this->db->query("SELECT * FROM servicios WHERE nombre = '". $this->nombre . "'");
    $result = $result->result_array();
    $result = count($result);
    if($result){
      echo "&#10006; Este nombre ya está registrado";
    }else{
      if($this->db->insert('servicios',$this)){
        echo "&#10004; Servicio Agregado con exito";
      }else{
       echo "No pudo guardarse el servicio";
      } 
    }  
   
  }

  public function update_user($data){
    $this->organize_data($data,"normal");
    $sql = "UPDATE users SET name ='".$this->name."', lastname ='".$this->lastname."', password ='".$this->password."',";
    $sql .= " dni ='".$this->dni."', type=".$this->type." WHERE nickname ='".$this->nickname."'";

    if($result = $this->db->query($sql)){
      return "&#10004; Usuario Actualizado Con Exito!";
    }else{
     return "&#10006; No pudo guardarse el usuario " . $sql;
    }   
  }

  public function get_all_services(){
    $sql = "SELECT * FROM servicios LIMIT 5";
    $result = $this->db->query($sql);
    $result = make_service_table($result->result_array(),0);
    echo $result;
  }

  public function count_clients(){
    $result = $this->db->count_all("clientes");
    echo $result;
  }

  public function get_clients_paginate($offset,$perpage){
    $sql = "SELECT * FROM clientes LIMIT ".$offset.", ".$perpage;
    $result = $this->db->query($sql);
    $result = make_client_table($result->result_array(),$offset);
    echo $result;
  }

  public function search_clients($word){
    $word = "'%".$word."%'";
    $sql = "SELECT * FROM clientes WHERE id_cliente LIKE $word || cedula LIKE $word || nombres LIKE $word || apellidos LIKE $word";
    $sql .= "|| sector LIKE $word LIMIT 5";
    $result = $this->db->query($sql);
    $result = make_client_table($result->result_array(),0);
    echo $result;

  }
  
  public function get_client($id){
    $sql = "SELECT * FROM clientes WHERE id_cliente=". $id;
    $result = $this->db->query($sql);
    $result =$result->row_array();
    return $result;
  }

  public function delete_client($id){
    $sql = "DELETE FROM clientes WHERE id_cliente= $id";
    if($this->db->query($sql)){
      echo "&#10004; Usuario Eliminado";
    }else{
      echo "error";
    }
  }

  //functions
}