<div class="screen clients row">
  <div class="left-navigation col-md-2">
    <ul class="aside-nav">
      <li class="aside-buttons">
        <a href="" data-toggle="modal" data-target="#new-client-modal"><i class="material-icons">chevron_left</i> Atras</a>
      </li>
    </ul>

  </div>
  <?php 
    $client_data = get_client_data();
    $nombre_completo = $client_data['nombres']." ".$client_data['apellidos'];
    $iniciales =  $client_data['nombres'][0].$client_data['apellidos'][0];
  
  
  ?>
  <div class="main-content col-md-10">

    <div class="row">
      <div class="col-xs-6 col-md-3">
        <div class="page-header">
          <h3>Detalles del Cliente <small><?php echo $nombre_completo ?></small></h3>
        </div>

        <div class="client-profile">
          <span><?php echo $iniciales ?></span>
        </div>
        <p><i class="material-icons">timeline</i>
          <?php echo $client_data['estado'] ?>
        </p>

      </div>
      <div class="col-md-9">
        <div>

          <!-- Nav tabs -->
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Personales</a></li>
            <li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Contratos</a></li>
            <li role="presentation"><a href="#messages" aria-controls="messages" role="tab" data-toggle="tab">Pagos</a></li>
            <li role="presentation"><a href="#settings" aria-controls="settings" role="tab" data-toggle="tab">Observaciones</a></li>
          </ul>

          <!-- Tab panes -->
          <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="home">
              <form action="" class="watch-in-detail special">
                <div class="row">


                  <div class="col-md-6">
                    <div class="input-group col-md-4">
                      <span class="input-group-addon" id="addon">ID</span>
                      <input type="text" class="form-control small-id" value="<?php echo $client_data['id_cliente'] ?>" disabled>
                    </div>
                    <div class="input-group">
                      <span class="input-group-addon" id="addon">Nombre</span>
                      <input type="text" class="form-control" value="<?php echo $nombre_completo; ?>" disabled>
                    </div>

                    <div class="input-group">
                      <span class="input-group-addon" id="addon">Fecha de Registro</span>
                      <input type="text" class="form-control" value="<?php  echo $client_data['fecha_registro']?>" disabled>
                    </div>
                    <h4 class="placeholder"> ...</h4>
                    <h4>Dirección</h4>
                    <div class="input-group">
                      <span class="input-group-addon" id="addon">Provincia</span>
                      <input type="text" class="form-control" value="<?php  echo $client_data['provincia']?>" disabled>


                    </div>
                    <div class="input-group">
                      <span class="input-group-addon" id="addon">Sector</span>
                      <input class="form-control" value="<?php  echo $client_data['sector']?>" disabled="6">
                    </div>
                    <div class="input-group">
                      <span class="input-group-addon" id="addon">Telefono</span>
                      <input type="tel" class="form-control" value="<?php  echo $client_data['telefono']?>" disabled>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <h4 class="placeholder"> ...</h4>
                    <div class="input-group">
                      <span class="input-group-addon" id="addon">Cedula</span>
                      <input type="text" class="form-control" value="<?php  echo $client_data['cedula']?>" disabled>
                    </div>
                    <div class="input-group">
                      <span class="input-group-addon" id="addon">Celular</span>
                      <input type="text" class="form-control" value="<?php  echo $client_data['celular']?>" disabled>
                    </div>
                    <h4 class="placeholder"> ...</h4>
                    <h4 class="placeholder"> ...</h4>
                    <div class="input-group">
                      <span class="input-group-addon" id="addon">Calle</span>
                      <input type="text" class="form-control" value="<?php  echo $client_data['calle']?>" disabled>
                    </div>

                    <div class="input-group">
                      <span class="input-group-addon" id="addon">Casa #</span>
                      <input type="text" class="form-control" value="<?php  echo $client_data['casa']?>" disabled>
                    </div>
                  </div>
                </div>
              </form>


            </div>


            <!---->
            <div role="tabpanel" class="tab-pane detail-panel" id="profile">

              <table class="table d-contratos" id="d-contracts">
                <thead>
                  <tr>
                    <th>ID #</th>
                    <th>Fecha</th>
                    <th>(meses)</th>
                    <th>Ultimo Pago</th>
                    <th>Proximo Pago</th>
                    <th>Monto Pagado</th>
                    <th>Monto Total</th>
                    <th>estado</th>
                  </tr>
                </thead>
                <tbody>
                  <?php $this->contract_model->get_all_of_client($client_data['id_cliente']) ?>
                </tbody>
                <tfoot>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>

                  </tr>

                </tfoot>
              </table>

            </div>


            <!---->
            <div role="tabpanel" class="tab-pane detail-panel" id="messages">
              <div class="row">
                <div class="col-md-3">
                  <div class="input-group">
                    <span class="input-group-addon" id="addon">Contrato </span>
                    <select name="select-contract form-control" id="select-contract">
                      <?php $this->contract_model->get_contracts_dropdown($client_data['id_cliente']) ?>
                    </select>
                  </div>
                </div>
                <div class="col-md-7 col-md-offset-1"><button class="btn" id="btn-pay">Registrar Pago </button></div>
              </div>
              
              <table class="table t-pagos" id="t-pagos">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Cuota</th>
                    <th>Mora</th>
                    <th>Monto</th>
                    <th>Fecha de Pago</th>
                    <th>Estado</th>
                    <th>Vence En</th>
                    <th>Recibo</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
                <tfoot>
                  <tr>
                  <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>

                  </tr>

                </tfoot>
              </table>
            </div>

            <!---->
            <div role="tabpanel" class="tab-pane" id="settings">...</div>
          </div>

        </div>

      </div>
    </div>


  </div>


</div>