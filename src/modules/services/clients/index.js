import handler from './handlers'
export default class clients {
  constructor() {
    handler(this)
  }

  add() {
    const self = this
    const nombres = $("#client-name").val();
    const apellidos = $("#client-lastname").val();
    const cedula = getVal($("#client-dni"));
    const celular = getVal($("#client-phone"));
    const provincia = $("#client-provincia").val();
    const sector = $("#client-sector").val();
    const calle = $("#client-street").val();
    const casa = $('#client-house').val();
    const detallesDireccion = $('#client-direction-details').val();
    const telefono = getVal($('#client-telephone'));
    const lugarTrabajo = $('#client-job').val();
    const telTrabajo = getVal($('#client-job-telephone'));
    const ingresos = $('#client-salary').val();
    const fechaRegistro = moment().format("YYYY-MM-DD");
    const estado = "no activo";
    let form

    const is_empty = isEmpty([nombres, apellidos, cedula, celular, provincia, sector, calle, casa, telefono]);
    if (!is_empty) {
      form = 'nombres=' + nombres + "&apellidos=" + apellidos + "&cedula=" + cedula + "&celular=" + celular;
      form += "&provincia=" + provincia + "&sector=" + sector + "&calle=" + calle + "&casa=" + casa + "&telefono=" + telefono;
      form += "&lugar_trabajo=" + lugarTrabajo + "&tel_trabajo=" + telTrabajo + "&ingresos=" + ingresos + "&fecha_registro=" + fechaRegistro;
      form += "&estado=" + estado + "&detalles_direccion=" + detallesDireccion + "&tabla=clientes";

      this.send('add', form)
      then((res) => {
        self.getAll()
        displayMessage(res)
      })
    } else {
      displayAlert("Revise", "LLene todos los campos por favor", "error");
    }
  }

  getAll() {
    const form = "tabla=clientes";
    this.send('getall', form)
    .then((res)=> {
      clientTable.refresh(res)
    })
  }

  getOne(id) {
    const self;
    const form = "tabla=clientes&id=" + id;
    this.send('getone', form)
    then((res) => {
      self.receiveForEdit(res);
    })
  }

  search(word) {
    const form = "tabla=" + "clientes" + "&word=" + word;
    this.send('search', form)
    then((res) => {
      fillCurrentTable(res);
    })
  }

  receiveForEdit(content) {
    var client = JSON.parse(content);
    this.id = client['id_cliente'];
    var $nombres = $("#u-client-name");
    var $apellidos = $("#u-client-lastname");
    var $cedula = $("#u-client-dni");
    var $celular = $("#u-client-phone");
    var $provincia = $("#u-client-provincia");
    var $sector = $("#u-client-sector");
    var $calle = $("#u-client-street");
    var $casa = $('#u-client-house');
    var $detallesDireccion = $('#u-client-direction-details');
    var $telefono = $('#u-client-telephone');
    var $lugarTrabajo = $('#u-client-job');
    var $telTrabajo = $('#u-client-job-telephone');
    var $ingresos = $('#u-client-salary');

    $nombres.val(client['nombres']);
    $apellidos.val(client['apellidos']);
    $cedula.val(client['cedula']);
    $celular.val(client['celular']);
    $provincia.val(client['provincia']);
    $sector.val(client['sector']);
    $calle.val(client['calle']);
    $casa.val(client['casa']);
    $detallesDireccion.val(client['detalles_direccion']);
    $telefono.val(client['telefono']);
    $lugarTrabajo.val(client['lugar_trabajo']);
    $telTrabajo.val(client['tel_trabajo']);
    $ingresos.val(client['salario']);

    $("#update-client-modal").modal();
    $("#btn-update-client").on('click', function () {
      updateClient();
    });

    function updateClient() {
      var is_empty = isEmpty([$nombres.val(), $apellidos.val(), $cedula.val(), $celular.val(), $provincia.val(), $sector.val(), $calle.val(),
        $casa.val(), $telefono.val()
      ]);

      if (!is_empty) {
        form = 'id=' + id + '&nombres=' + $nombres.val() + "&apellidos=" + $apellidos.val() + "&cedula=" + getVal($cedula);
        form += "&celular=" + getVal($celular) + "&provincia=" + $provincia.val() + "&sector=" + $sector.val() + "&calle=" + $calle.val();
        form += "&casa=" + $casa.val() + "&detalles_direccion=" + $detallesDireccion.val() + "&telefono=" + getVal($telefono) + "&lugar_trabajo=" + $lugarTrabajo.val() + "&tel_trabajo=";
        form += getVal($telTrabajo) + "&tabla=clientes";
        form += "&ingresos=" + $ingresos.val();

        this.send('update', form)
        then((res) => {
          self.getAll()
          displayMessage(res)
        })
      } else {
        displayAlert("Revise", "LLene todos los campos por favor", "error");
      }
    }
  }

  saveObservations() {
    const observations = $("#text-observations").val();
    const idCliente = $("#detail-client-id").val();
    const form = 'observaciones=' + observations + "&tabla=observaciones&id_cliente=" + idCliente;

    this.send('update', form)
    then((res) => {
      displayMessage(res);
    })
  }

  updateState(client) {
    const form = 'data=' + JSON.stringify(client) + '&module=clientes&action=update';
    this.send('getjson', form)
    then((res) => {
      displayMessage(res)
    })
  }

  send(endpoint, data) {
    return axios.post(`${BASE_URL}process/${endpoint}`, data)
  }
}
