<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Messages extends MY_Controller {
  public function __construct(){
    parent::__construct();
    $this->load->model("company_model");
    $this->load->model('message_model');
    $this->load->model('client_model');
    $this->load->library('messagegate');
    $this->my_auth->authenticate();
  }

  public function send_message(){
    $data = $this->get_post_data('data');
    $message_settings = $this->message_model->get_config('message_settings');

    if ($data) {
      if ($message_settings['email'] && $message_settings['password'] && $message_settings['country_id']) {

        $status = $this->messagegate->send_message($data);
        if(!isset($status['error']) && $status['response']){
          $this->set_message('Mensajes enviados correctamente');
        }else{
          $this->set_message('Mensajes no enviados, revise la configuracion de mensajes', 'error');
        }
        $this->res['status'] = $status;
      } else {
        $this->set_message('Mensajes no enviados, revise la configuracion de mensajes', 'error');
      }
      $this->response_json();
    }
  }

  public function save_config(){
    $data = $this->get_post_data('data');
    if ($data) {
      $status = $this->message_model->add_config($data);
      if ($status ){
        $this->set_message('Configuracion Agregada');
      } else{
        $this->set_message('No se ha guardar la configuracion, revise los datos');
      }
      $this->response_json();
    }
  }

  public function get_config(){
    $res['config'] = $this->message_model->get_config();
    $this->response_json($res);
  }

  public function search_clients(){
    $query = $_GET['q'];
    if($query){
      $res['items'] = $this->client_model->search_clients_for_message($query);
      $this->response_json($res);
    }
  }
}
