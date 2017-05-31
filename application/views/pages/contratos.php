<div class="screen clients row">
  <div class="left-navigation col-md-2">
    <ul class="aside-nav">
      <li class="aside-buttons"><a href="" data-toggle="modal" data-target="#search-client-modal"><i class="material-icons">description</i>  Nuevo Contrato</a></li>
      <li class="aside-buttons"><a href="" id="btn-edit-contract"><i class="material-icons">edit</i>Editar Contrato</a></li>
      <li class="aside-buttons"><a href="" id="btn-cancel-contract"><i class="material-icons" >delete</i>Cancelar Contrato</a></li>
      <li class="aside-buttons"><a href="" id="btn-see-in-detail"><i class="material-icons" >find_in_page</i>Ver Detalles</a></li>
      <li class="aside-buttons"><a href="" id="btn-pay"><i class="material-icons" >monetization_on</i>Registrar Pago</a></li>
      <li class="aside-buttons"><a href="" id="btn-pay"><i class="material-icons" >monetization_on</i>Extender Contrato</a></li>
    </ul>

  </div>
  <div class="main-content col-md-10">
    <div class="searcher-container">
    <input type="text" class="searcher" id="contract-searcher">
  </div>

    <div class="busquedas">
      <button class="tab-buttons" href="">Activos</button>
      <button class="tab-buttons" href="">Morosos</button>
      <button class="tab-buttons" href="">Cancelados</button>
      <button class="tab-buttons" href="">Ver Todos</button>
    </div>

    <table class="table table-hovered t-contracts" id="t-contracts">
      <thead>
      <tr>
          <th>Cod</th>
          <th>Cliente</th>
          <th>Fecha Inicio</th>
          <th>Meses</th>
          <th>Ultimo Pago</th>
          <th>Proximo Pago</th>
          <th>Monto Pagado</th>
          <th>Monto Total</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <?php $this->contract_view_model->get_contract_view('activo'); ?>
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>Filas Por Pagina</td>
          <td>
            <select name="perpage" id="per-page" class="per-page">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>  
            </select>

          </td>
          <td><span class="min-limit">1</span>-<span class="max-limit-visible">5</span><span class="max-limit">5</span> de <span class="total-rows"><?php $this->contract_view_model->count_contracts()?></span></td>
          <td><i class="material-icons previous-page">keyboard_arrow_left</i> <i class="material-icons next-page">keyboard_arrow_right</i></td>

        </tr>

      </tfoot>
    </table>
  
  </div>


</div>