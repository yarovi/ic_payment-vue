
            <!--Direction pane-->
            <div role="tabpanel" class="tab-pane fade in" id="extra-service">
              <form action="">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="client-provincia">Servicio</label>
                      <select class="form-control" id="select-extra-service">
                        <option value="">--Seleccione--</option>
                        <?php $this->service_model->get_services(); ?>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="cient-sector">Equipo</label>
                      <input class="form-control" id="extra-equipo" tabindex="6">
                    </div>
                    <div class="form-group">
                      <label for="cient-sector">Router</label>
                      <input class="form-control" id="extra-router" tabindex="6">
                    </div>
                    <div class="form-group">
                      <label for="cient-sector">Modo de Pago</label>
                      <select class="form-control" id="select-payment-mode">
                        <option value="">-- Seleccione un modo de pago--</option>
                        <option value="1">Cargar al proximo pago</option>
                        <option value="2">Factura aparte</option>
                        <option value="3">Mensualidad Fija - seguro</option>
                      </select>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="client-street">Costo</label>
                      <input type="text" class="form-control" id="extra-service-cost" tabindex="6">
                    </div>

                    <div class="form-group">
                      <label for="client-house">Mac</label>
                      <input type="text" class="form-control" id="extra-e-mac" tabindex="7">
                    </div>

                    <div class="form-group">
                      <label for="client-house">Mac</label>
                      <input type="text" class="form-control" id="extra-r-mac" tabindex="7">
                    </div>

                    <div class="form-group">
                      <label for="client-street">Seguro</label>
                      <div class="input-group normal-height">
                        <input type="text" class="form-control" tabindex="6" id="contract-ensurance" disabled>
                        <span class="input-group-btn">
                          <button class="btn btn-danger icon" type="button" id="delete-extra">
                            <i class="material-icons">delete</i>
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

            </div>
            <!--end of direction pane-->

            <div role="tabpanel" class="tab-pane fade in" id="extra-extension">
              <form action="">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="client-job">Meses de extension</label>
                      <input type="number" class="form-control" id="extra-extension-months" value="<?php echo $settings['meses_por_defecto'] ?>">
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <!-- end of pane -->
            <div role="tabpanel" class="tab-pane fade in" id="extra-upgrade">

              <h4>Seleccione Plan: </h4>
              <div class="row shortcuts-container for-services">
                <?php $this->service_model->get_services_items(); ?>
              </div>


            </div>
            <!-- end of pane-->

          </div>

        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" data-dismiss="modal" tabindex="9">Cancelar</button>
        <button type="button" class="btn save dynamic-controls" id="extra-controls" tabindex="10">Guardar
          <button/>
      </div>



    </div>
    <!-- /.modal-content -->
  </div>
  <!-- /.modal-dialog -->
</div>
<!-- /.modal -->

<!--*********************************************************************
*
*                                 Cancel Contract Modal
*
**************************************************************************-->
<div class="modal fade" tabindex="-1" role="dialog" id="cancel-contract-modal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title">Estas seguro?</h4>
      </div>

      <div class="alert alert-danger">
        <p>Esta accion no tiene marcha atras si cancelas el contrato se tendra que crear otro en caso de que sea una equivocación
          asi que asegurate de que realmente quieres cancelar el contrato de
          <b class="cancel-name">Contrato</b>
        </p>
        <p>Para asegurarnos, escribe el nombre del cliente</p>
      </div>

      <div class="modal-body">

        <div class="form-group">
          <input type="text" class="form-control confirmed-data uppercase" id="" placeholder="nombre del cliente">
        </div>

        <div class="form-group">
          <label for="u-service-description">Motivo</label>
          <textarea class="form-control " cols="30" rows="5" id="cancelation-reason"></textarea>
        </div>

        <div class="form-group">
          <label for="check-change-ip">Aplica Penalidad?</label>
          <br>
          <input class="form-control" id="check-penalty" type="checkbox">
        </div>
      </div>
      <div class="modal-footer">
        <a href="" target="printframe" class="btn" id="cancel-print">Imprimir
          <a/>
          <button type="button" class="btn save" id="cancel-permanently" tabindex="10" disabled>Cancelar Contrato
            <button/>
      </div>



    </div>
    <!-- /.modal-content -->
  </div>
  <!-- /.modal-dialog -->
</div>
<!-- /.modal -->

