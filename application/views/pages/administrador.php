<div class="screen clients row">
  <div class="left-navigation administrador col-md-2">
    <ul class="aside-nav">
      <li class="aside-buttons"><a href="#company-section"><i class="material-icons">description</i> Empresa</a></li>
      <li class="aside-buttons"><a href="#user-section"><i class="material-icons">person_pin</i> Usuarios</a></li>
      <li class="aside-buttons"><a href="#caja-section"><i class="material-icons">person_pin</i> Caja Chica</a></li>
      <li class="aside-buttons"><a href="#settings-section"><i class="material-icons">settings</i> Ajustes</a></li>
    </ul>
  </div>

  <div class="main-content col-md-10">
    <div class="section-player">

      <!-- *******************************
      *     Sección de la compa;ia     *
      *                                *
    **********************************-->

      <div class="company-details" id="company-section">
        <?php 
          $empresa = $this->company_model->get_empresa();
          $settings = $this->settings_model->get_settings();
         ?>
        <h3> Detalles de la Empresa</h3>
        <form action="">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="company-name">Nombre de la Empresa</label>
                <input type="text" class="form-control" id="company-name" value="<?php echo $empresa['nombre'] ?>">
              </div>
              <div class="form-group">
                <label for="company-phrase">Lema</label>
                <input type="text" class="form-control" id="company-statement" value="<?php echo $empresa['lema'] ?>">
              </div>
              <div class="form-group">
                <label for="company-phone1">Telefono1</label>
                <input type="text" class="form-control" id="company-phone1" value="<?php echo $empresa['telefono1'] ?>">
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label for="company-name">Direccion</label>
                <input type="text" class="form-control" id="company-direction" value="<?php echo $empresa['direccion'] ?>">
              </div>
              <div class="form-group">
                <label for="company-name">Descripción</label>
                <input type="text" class="form-control" id="company-description" value="<?php echo $empresa['descripcion'] ?>">
              </div>
              <div class="form-group">
                <label for="company-name">Telefono2</label>
                <input type="text" class="form-control" id="company-phone2" value="<?php echo $empresa['telefonos'] ?>">
              </div>
              <div class="right">
                <input id="update-company-data" type="submit" value="Guardar Datos">
              </div>

            </div>
        </form>
        </div>
      </div>

    <!-- ******************************
      *     Sección de los usuarios   *
      *                               *
    ********************************-->

      <div class="company-details" id="user-section">
        <h3> Usuarios </h3>
        <div class="searcher-container clearfix">
        <h4 class="search-criteria">Todos los Usuarios :<span class="presentado"></h4>
          <button class="btn" id="caller-user" data-toggle="modal" data-target="#new-user-modal">Agregar <i class="material-icons">add</i></button>
        </div>
        <div class="table" id="t-users">
        <table class="table t-users innertable" >
          <thead>
            <tr>
              <th>No.</th>
              <th>ID</th>
              <th>Nick</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cedula</th>
              <th>Tipo</th>
              <th></th>
              <th>Acción</th>
            </tr>
          </thead>
            <tbody> <?php $this->user_model->get_all_users() ?></tbody>
        </table>
         <div class="table-foot">
          <div class="pagination-labels">
            <div>
              <select name="perpage" id="per-page" class="per-page">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>  
            </select>
            </div>
            <div><span class="min-limit">1</span>-<span class="max-limit-visible">5</span><span class="max-limit">5</span> de
              <span
                class="total-rows">
                <?php $this->user_model->count_users(); ?>
                </span>
            </div>
            <div> Registros</div>
          </div>
        
          <div class="pagination-controllers">
            <div><i class="material-icons previous-page">keyboard_arrow_left</i> <i class="material-icons next-page">keyboard_arrow_right</i></div>
          </div>
      </div>
      </div>
      </div>

    <!-- ******************************
      *     Sección de los usuarios   *
      *                               *
    ********************************-->

      <div class="company-details" id="caja-section">
        <h3> Caja Chica </h3>
        <div class="searcher-container clearfix">
        <h4 class="search-criteria">Historial de caja chica:<span class="presentado"></h4>
          <a data-toggle="modal" data-target="#retire-money-modal" class="btn"><i class="material-icons">remove</i></a>
          <button class="btn" data-toggle="modal" data-target="#add-money-modal"><i class="material-icons">add</i></button>
          <select name="" class="form-control" id="caja-user">
            <?php $this->user_model->get_users_list(); ?>
          </select>
          <input type="date" class="form-control caja-for-date" id="caja-date">
        </div>
        <div class="table" id="caja">
        <table class="table caja innertable">
          <thead>
            <tr>
              <th>COD</th>
              <th>Fecha de Trasaccion</th>
              <th>Descripcion</th>
              <th>Ingreso</th>
              <th>Salida</th>
              <th>Saldo de Caja</th>
              <th>Hecha Por</th>
            </tr>
          </thead>
            <tbody> <?php $this->caja_chica_model->get_rows(); ?></tbody>
        </table>
        <div class="table-foot">
          <div class="pagination-labels">
            <div>
              <select name="perpage" id="per-page" class="per-page">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>  
            </select>
            </div>
            <div><span class="min-limit">1</span>-<span class="max-limit-visible">5</span><span class="max-limit">5</span> de
              <span
                class="total-rows">
                <?php $this->caja_chica_model->count();?>
                </span>
            </div>
            <div> Registros</div>
          </div>

          <div class="pagination-controllers">
            <div><i class="material-icons previous-page">keyboard_arrow_left</i> <i class="material-icons next-page">keyboard_arrow_right</i></div>
          </div>
      </div>
      </div>
      </div>

      


    <!-- ******************************
      *     Sección de los usuarios   *
      *                               *
    ********************************-->
    <div class="company-details" id="settings-section">
        <?php $empresa = $this->company_model->get_empresa();
         ?>
        <h3> Ajustes del Programa</h3>
        <form action="">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="company-name">Monto de la mora</label>
                <div class="input-group">
                  <div class="input-group-addon"><i class="material-icons">&percnt;</i></div>
                  <input type="number" class="form-control" id="settings-mora" value="<?php echo $settings['cargo_mora'] ?>">
                  <div class="input-group-addon"> pc</div>
                </div>
              </div>
              <div class="form-group">
                <label for="company-phrase">Fecha de Corte</label>
                <div class="input-group">
                  <div class="input-group-addon"><i class="material-icons">event</i> </div>
                  <input type="number" class="form-control" id="settings-fecha-corte" value="<?php echo $settings['fecha_corte'] ?>">
                  <div class="input-group-addon">De Cada Mes </div>
                </div>
              </div>
              <div class="form-group">
                <label for="company-phone1">Apertura de Caja Chica</label>
                <div class="input-group">
                  <div class="input-group-addon"><i class="material-icons">attach_money</i></div>
                  <input type="number" class="form-control" id="settings-apertura-caja" value="<?php echo $settings['apertura_caja'] ?>">
                  <div class="input-group-addon">Pesos </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label for="company-name">Penalizacion Por Cancelacion:</label>
                <div class="input-group">
                  <div class="input-group-addon"><i class="material-icons">&percnt;</i></div>
                  <input type="number" class="form-control" id="settings-penalizacion-cancelacion" value="<?php echo $settings['penalizacion_cancelacion'] ?>">
                  <div class="input-group-addon"> pc</div>
                </div>
              </div>
              <div class="form-group">
                <label for="company-name">Meses Por defecto de un contrato:</label>
                <div class="input-group">
                  <div class="input-group-addon"><i class="material-icons">event_note</i></div>
                  <input type="number" class="form-control" id="settings-meses-por-defecto" value="<?php echo $settings['meses_por_defecto'] ?>">
                  <div class="input-group-addon">Meses </div>
                </div>
              </div>
              <div class="form-group">
                <label for="company-name"> Split Day </label>
              <div class="input-group">
                  <div class="input-group-addon"><i class="material-icons">event</i></div>
                  <input type="number" class="form-control" id="settings-split-day" value="<?php echo $settings['split_day'] ?>">
                  <div class="input-group-addon">Dia</div>
                </div>
              </div>
              <div class="right">
                <input id="btn-update-settings" type="submit" value="Guardar Datos">
              </div>

            </div>
        </form>
        </div>
      </div>
    </div>

  </div>

</div>