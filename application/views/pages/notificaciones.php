<?php $user_data = get_user_data() ?>
<div class="screen reports row">
  <div class="col-md-12">
    <!-- main tab -->
    <div>

      <!-- Nav tabs -->
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active"><a href="#ingresos" aria-controls="home" role="tab" data-toggle="tab">Lista de Averías</a></li>
        <li role="presentation"><a href="#pagos" aria-controls="profile" role="tab" data-toggle="tab">Instalaciones</a></li>
        <li role="presentation"><a href="#balance" aria-controls="messages" role="tab" data-toggle="tab">Deudores</a></li>
        <?php if($user_data['type'] == 0):?>
        <li role="presentation"><a href="#recibos" aria-controls="messages" role="tab" data-toggle="tab">Pagos</a></li>
        <?php endif;?>
      </ul>

      <!-- Tab panes -->
      <div class="tab-content mylists">
        <div role="tabpanel" class="tab-pane active" id="ingresos">
          <div class="searcher-container clearfix">
            <h4 class="search-criteria">Presentado:<span class="presentado"> Todos </span> (<span class="total-rows"></span>)</h4>
            <a target="_blank" href="<?php echo base_url('process/getreport/averias') ?>" class="btn">Imprimir Reporte</a>
            <select name="" id="averias-view-mode">
            <option value="todos">Todos</option>
            <option value="por reparar">Por Reparar</option>
            <option value="en proceso">En Proceso</option>
            <option value="reparado">Reparados</option>
            <option value="actuales">En Proceso y Por Reparar</option>
          </select>
          </div>

          <div class="averia-item-list">

            <?php $this->averia_model->get() ?>
          </div>

        </div>
        <div role="tabpanel" class="tab-pane" id="pagos">
          <div class="searcher-container clearfix">
            <h4 class="search-criteria">Instalaciones de Hoy </span> (
              <?php echo $this->report_model->count_installations(); ?>)</h4>
            <a target="_blank" href="<?php echo base_url('process/getreport/installations') ?>" type="button" class="btn">Imprimir Reporte</a>
          </div>
          <div class="instalation-controls">

          </div>
          <?php $this->report_model->get_installations(); ?>
        </div>
        <div role="tabpanel" class="tab-pane" id="balance">
          <div class="searcher-container clearfix">
            <h4 class="search-criteria">Clientes en fecha de corte </span> (
              <?php echo $this->report_model->count_moras_view(); ?>)</h4>
            <a target="_blank" href="<?php echo base_url('process/getreport/deudores') ?>" type="button" class="btn">Imprimir Reporte</a>
          </div>
          <?php $this->report_model->get_moras_view() ?>
        </div>
         <?php if($user_data['type'] == 0):?>
        <div role="tabpanel" class="tab-pane" id="recibos">
          <table data-toggle="table" class="innertable" data-sort-name="num" data-sort-order="asc" data-search="true" data-show-refresh="true"
            data-show-columns="true" data-show-export="true" data-minimum-count-columns="2" data-show-pagination-switch="true"
            data-pagination="true" data-id-field="payment" data-page-size="5" data-page-list="[5]" data-show-footer="false">
            <thead>
              <tr>
                <th data-field="num" data-sortable="true">Num</th>
                <th data-field="payment" data-sortable="true">Pago</th>
                <th data-field="contract" data-sortable="true">Cont</th>
                <th data-field="client" data-sortable="true">Cliente</th>
                <th data-field="service" data-sortable="true">Servicio</th>
                <th data-field="concept" data-sortable="true">Concepto</th>
                <th data-field="total" data-sortable="true">Total</th>
                <th data-field="total" data-sortable="true">Fecha</th>
                <th data-field="hours" data-sortable="true">Hora</th>
              </tr>
            </thead>
            <tbody>
              <?php $this->report_model->get_recibos(); ?>
            </tbody>
          </table>
        </div>
        <?php endif;?>
      </div>
    </div>

  </div>

  <!-- end of main tab-->
</div>
</div>