<?php 
  $settings = $this->settings_model->get_settings();
 ?>
<!--*********************************************************************
*
*                                New Averia
*
**************************************************************************-->

<div class="modal fade" tabindex="-1" role="dialog" id="new-averia-modal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Agregar Averia</h4>
      </div>
      <div class="modal-body">

        <form action="">
          <div class="row">
            <div class="col-md-12">
            <input type="text" class="form-control hidden" id="averias-client-id">
            <div class="form-group">
                <label for="user-nickname">Cedula(sin guiones)</label>
                <input type="text" class="form-control" id="a-client-dni">
              </div>
              <div class="form-group">
                <label for="user-nickname">Cliente</label>
                <input type="text" class="form-control" id="a-client" disabled>
              </div>
              <div class="form-group">
                <label for="service-description">Descripción</label>
                <textarea  class="form-control "cols="30" rows="5"  id="a-description"></textarea>
              </div>              
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" data-dismiss="modal">Cancelar</button>
        <button type="button" class="btn save" id="btn-save-averia">Guardar</button>
      </div>
    </div>
    <!-- /.modal-content -->
  </div>
  <!-- /.modal-dialog -->
</div>
<!-- /.modal -->


<!--*********************************************************************
*
*                                 Retire Money
*
**************************************************************************-->

<div class="modal fade" tabindex="-1" role="dialog" id="retire-money-modal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Registrar Retiro De Caja</h4>
      </div>
      <div class="modal-body">

        <form action="">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="e-nickname">Cantidad</label>
                <input type="number" class="form-control" id="caja-r-amount">
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label for="income-description">Descripción</label>
                <textarea  class="form-control "cols="30" rows="5"  id="caja-r-description"></textarea>
              </div>

            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" data-dismiss="modal">Cancelar</button>
        <button type="button" class="btn save" id="btn-retire-money">Actualizar</button>
      </div>
    </div>
    <!-- /.modal-content -->
  </div>
  <!-- /.modal-dialog -->
</div>
<!-- /.modal -->

<!--*********************************************************************
*
*                                 Payment Extra Options
*
**************************************************************************-->

<div class="modal fade" tabindex="-1" role="dialog" id="advanced-payment">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Opciones De Pago Avanzadas</h4>
      </div>
      <div class="modal-body">
        <div>

          <!-- Nav tabs -->
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#detalles-de-pago" aria-controls="required" role="tab" data-toggle="tab">Detalles de pago</a></li>
            <li role="presentation"><a href="#descuentos" aria-controls="direction" role="tab" data-toggle="tab">Descuentos</a></li>
          </ul>

          <!-- Tab panes -->
          <div class="tab-content">
            <div role="tabpanel" class="tab-pane fade in active" id="detalles-de-pago">
              <form action="">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group hide">
                      <label for="payment-id">ID Pago</label>
                      <input type="text" class="form-control" id="payment-id" tabindex="1" disabled>
                    </div>
                    <div class="form-group">
                      <label for="payment-concept">Concepto</label>
                      <input type="text" class="form-control" id="payment-concept" tabindex="3" disabled>
                    </div>
                    <div class="form-group">
                      <label for="payment-limit-date">Fecha</label>
                      <input type="date" class="form-control" id="payment-limit-date" tabindex="8" disabled>
                    </div>
                    <div class="form-group">
                      <label for="payment-cuota">Cuota</label>
                      <input type="number" class="form-control payment-sumandos" id="payment-cuota"  tabindex="8">
                    </div>
                    <div class="form-group">
                      <label for="payment-extra">Monto Extra</label>
                      <input type="number" class="form-control payment-sumandos" id="payment-extra"   tabindex="8">
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group hide">
                      <label for="payment-contract-id-edit">ID Contrato</label>
                      <input type="text" class="form-control" id="payment-id-cliente" tabindex="2" disabled>
                    </div>
                    <div class="form-group">
                      <label for="payment-extra-services">Servicios Extra</label>
                      <input type="text" class="form-control" id="payment-extra-services" tabindex="4" disabled>
                    </div>
                    <h4 class="placeholder">...</h4>
                    <h4 class="placeholder">...</h4>
                     <div class="form-group">
                      <label for="payment-mora">Mora</label>
                      <input type="number" class="form-control payment-sumandos" id="payment-mora"   tabindex="4">
                    </div>
                    <div class="form-group">
                      <label for="payment-total">Total</label>
                      <input type="number" class="form-control payment-sumandos" id="payment-total"   tabindex="8">
                    </div>
                  </div>
                </div>
              </form>

            </div>
            <div role="tabpanel" class="tab-pane fade in" id="descuentos">
              <form action="">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="payment-discount-amount">Monto de Descuento</label>
                      <input type="number" class="form-control payment-sumandos" id="payment-discount-amount" tabindex="5">
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="u-client-street">Razon de descuento</label>
                       <textarea  class="form-control "cols="30" rows="5"  id="payment-discount-reason"></textarea>
                    </div>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" data-dismiss="modal" tabindex="9">Cancelar</button>
        <button type="button" class="btn save" id="btn-apply-discount" tabindex="10">Aplicar Descuento</button>
      </div>
    </div>
    <!-- /.modal-content -->
  </div>
  <!-- /.modal-dialog -->
</div>
<!-- /.modal -->

<!--*********************************************************************
*
*                                 reconnect modal
*
**************************************************************************-->
<div class="modal fade" tabindex="-1" role="dialog" id="reconnect-modal">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Reconectar</h4>
      </div>
      <div class="modal-body">
        <div>
          <!-- Nav tabs -->
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#month-and-date" aria-controls="extender" role="tab" data-toggle="tab">Meses y Fecha</a></li>
            <li role="presentation"><a href="#reconnect-service" aria-controls="Mejorar" role="tab" data-toggle="tab">Tipo de Servicio</a></li>
          </ul>

          <div class="tab-content">
            <div role="tabpanel" class="tab-pane fade in active" id="month-and-date">
              <form action="">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="client-job">Meses de extension</label>
                      <input type="number" class="form-control" id="reconnection-months" value="<?php echo $settings['meses_por_defecto'] ?>">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="client-job">Fecha</label>
                      <input type="date" class="form-control" id="reconnection-date">
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <!-- end of pane -->
            <div role="tabpanel" class="tab-pane fade in" id="reconnect-service">
              
              <h4>Seleccione Plan: </h4>
              <div class="row shortcuts-container for-services">
                <?php $this->service_model->get_services_shortcuts(); ?>
              </div>
              
                
            </div>
            <!-- end of pane-->

          </div>

        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" data-dismiss="modal" tabindex="9">Cancelar</button>
        <button type="button" class="btn save" id="btn-reconnect" tabindex="10">Reconectar<button/>       
      </div>

    </div>
    <!-- /.modal-content -->
  </div>
  <!-- /.modal-dialog -->
</div>
<!-- /.modal -->