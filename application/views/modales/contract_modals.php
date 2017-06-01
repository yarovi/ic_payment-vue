<div class="modal fade" tabindex="-1" role="dialog" id="add-extra-modal">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Servicio Extra</h4>
      </div>
      <div class="modal-body">
        <div>
          <!-- Nav tabs -->
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#extra-contract" aria-controls="contract" role="tab" data-toggle="tab">Contrato</a></li>
            <li role="presentation"><a href="#extra-service" aria-controls="service" role="tab" data-toggle="tab">Servicio</a></li>
            <li role="presentation"><a href="#extra-extension" aria-controls="extension" role="tab" data-toggle="tab">Extender Contrato</a></li>
          </ul>

          <!-- Tab panes -->
          <div class="tab-content">
            <div role="tabpanel" class="tab-pane active fade in" id="extra-contract">
              <form action="">
                <div class="row">
                  <div class="col-md-6">
                    <h4>Datos Del Contrato</h4>
                    <div class="form-group">
                      <label for="client-name">Cedula</label>
                      <input type="text" class="form-control" id="client-name" tabindex="1">
                    </div>
                    <div class="form-group">
                      <label for="client-dni">Nombres</label>
                      <input type="text" class="form-control" id="client-dni" tabindex="3">
                    </div>
                    <div class="form-group">
                      <label for="client-telephone">celular</label>
                      <input type="tel" class="form-control" id="client-telephone" tabindex="8">
                    </div>
                  </div>

                  <div class="col-md-6">
                    <h4 class="placeholder">... </h4>
                    <div class="form-group">
                      <label for="client-lastname">Codigo del contrato</label>
                      <input type="text" class="form-control" id="client-lastname" tabindex="2">
                    </div>
                    <div class="form-group">
                      <label for="client-phone">Apellidos</label>
                      <input type="text" class="form-control" id="client-phone" tabindex="4">
                    </div>

                  </div>
                </div>
              </form>
            </div>

            <!--Direction pane-->
            <div role="tabpanel" class="tab-pane fade in" id="extra-service">
              <form action="">
                <div class="row">
                  <div class="col-md-6">
                    <h4>Dirección</h4>
                    <div class="form-group">
                      <label for="client-provincia">Provincia</label>
                      <input type="text" class="form-control password-confirm" id="client-provincia" list="provincias" tabindex="5">
                      <datalist id="provincias">
                        <option value="La Romana">
                          <option value="Santo Domingo">
                            <option value="La Altagracia">
                      </datalist>

                    </div>
                    <div class="form-group">
                      <label for="cient-sector">Sector</label>
                      <input class="form-control" id="client-sector" tabindex="6">
                    </div>
                  </div>

                  <div class="col-md-6">
                    <h4 class="placeholder"> ...</h4>
                    <div class="form-group">
                      <label for="client-street">Calle</label>
                      <input type="text" class="form-control" id="client-street" tabindex="6">
                    </div>

                    <div class="form-group">
                      <label for="client-house">Casa #</label>
                      <input type="text" class="form-control" id="client-house" tabindex="7">
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
                    <h4>Datos Personales +</h4>
                    <div class="form-group">
                      <label for="client-job">Lugar de Trabajo</label>
                      <input type="text" class="form-control" id="client-job">
                    </div>
                    <div class="form-group">
                      <label for="client-salary">Salario</label>
                      <input type="number" class="form-control password" id="client-salary" value="0">
                    </div>
                  </div>

                  <div class="col-md-6">
                    <h4 class="placeholder">...</h4>
                    <div class="form-group">
                      <label for="client-job-number">Telefono del trabajo</label>
                      <input type="tel" class="form-control" id="client-job-telephone">
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
        <button type="button" class="btn save" id="btn-save-client" tabindex="10">Guardar</button>
      </div>

    </div>
    <!-- /.modal-content -->
  </div>
  <!-- /.modal-dialog -->
</div>
<!-- /.modal -->
