if (isCurrentPage("detalles")) {
  (function(){
    var listExtras = '';
    var reciboReset = {
      id_pago: 0,
      id_contrato: 0,
      id_servicio: 0,
      id_empleado: 0,
      fecha_pago : '',
      concepto : 'extra',
      detalles_extra : '',
      cuota: '',
      mora : '',
      monto_extra: '',
      total: '',
      estado: '',
      fecha_limite: '',
      complete_date : '',
      descuento: '',
      razon_descuento: '',
      deuda: '',
      abono_a: '',
      tipo: '',
      generado: ''
    }
    
    var appPagoExtra = new Vue({
      el: "#app-pago-extra",
      data: {
        recibo:{
           id_pago: 0,
           id_contrato: 0,
           id_servicio: 0,
           id_empleado: 0,
           fecha_pago : 'dd/mm/yyyy',
           concepto : 'extra',
           detalles_extra : '',
           cuota: '',
           mora : '',
           monto_extra: '',
           total: '',
           estado: '',
           fecha_limite: '',
           complete_date : '',
           descuento: '',
           razon_descuento: '',
           deuda: '',
           abono_a: '',
           tipo: '',
           generado: ''
        },
    
        visible: false,
        pagado: false,
        extra:{
          "controls": '',
          "id_extra": '',
          "id_servicio": '',
          "checkbox": '',
          "fecha": '',
          "concepto": '',
          "ultimo_pago": '',
          "monto_pagado": '',
          "monto_total": '',
          "estado": ''
        },
        firstControls: {
          hide: false
        },
      },
      filters: {
    
      },
      computed: {
        url_recibo: function () {
          return BASE_URL + 'process/getrecibo/' + this.recibo.id_pago;
        },
    
        hide_recibo: function () {
          if(this.recibo.estado == "pagado"){
            return false
          }
           return this.hide_recibo = true; 
        },
    
        isPagado: function () {
          this.pagado = (this.recibo.estado == 'pagado');
          return this.pagado;
        }
      },
    
      methods:{
    
        goBack: function () {
          extraTable.el.parents(".bootstrap-table").removeClass("hide");
          this.visible = false
          this.extra = {concepto: ''}
          extraTable.refresh(listExtras);
        },
    
        generatePayment: function () {
          if (this.pagado || this.recibo.id_pago == 0) {
            var form = 'data=' + JSON.stringify(this.extra);
            var send = axios.post( BASE_URL + 'extra/generate_extra_payment',form);
            send.then(function(res){
              var data = res.data;
              displayMessage(data.mensaje);
              selectExtraPayment.html(data.pagos).change();
            });
            send.catch(function(){
              
            })
          } else {
            displayMessage( MESSAGE_INFO + ' Debe realizar este pago antes de crear uno nuevo');
          }
        },
    
        getPayment: function (id_pago) {
          var form = "data=" + JSON.stringify({id_pago: id_pago});
          var self = this
          var send = axios.post( BASE_URL + 'extra/get_payment',form);
          send.then(function(res){
            var data = res.data 
            if(data.recibo){
              self.recibo = data.recibo
            }
          })
        },
    
        applyPayment: function () {
          if (this.recibo.id_pago != 0) {
            this.sender('extra/apply_payment');
          } else {
            displayMessage( MESSAGE_INFO + ' Debe generar un pago primero');
          }
        },
    
        editPayment: function () {
          this.sender('extra/edit_payment');
        },
    
        sender: function(endpoint) {
          var self = this;
          var preparedData = this.prepareData()
          var info = preparedData.info;
          var data = preparedData.data;
    
          var form = 'data='+ JSON.stringify(data) + '&info='+ JSON.stringify(info)
          var send = axios.post(BASE_URL + endpoint,form)
    
          send.then(function (res) {
            var data = res.data
            if (data.extras) {
              listExtras = data.extras;
            }

            if (data.mensaje){
              displayMessage(data.mensaje);
            }

            self.getPayments(self.extra.id_extra);
          })
          
          send.catch(function(error){
            console.log(error);
          })
        },
    
        prepareData: function (recibo) {
          var recibo = this.recibo;
          
          var data = {
            concepto: 'extra -', 
            detalles_extra: recibo.detalles_extra,
            fecha_pago: recibo.fecha_pago,
            cuota: recibo.cuota,
            total: recibo.cuota,
            estado: 'pagado',
            tipo: recibo.tipo,
            generado: true
          };
          
          var info = {
            id_extra: recibo.id_extra,
            id_pago: recibo.id_pago
          };
        
          return {data: data, info: info};
        },
        
        getPayments: function (id_extra) {
          var self = this;
          var form = "data="+ JSON.stringify({id_extra: id_extra})
          var send = axios.post(BASE_URL + 'extra/get_extra_payment_of', form)
          send.then(function(res){
            var data = res.data;
    
            if(!data.pagos){
              self.recibo = reciboReset
            }
    
            selectExtraPayment.html(data.pagos).change()
    
          })
        },
    
        deletePayment: function () {
          var self = this;
          var recibo = this.recibo
          var data = {
            'id_extra': recibo.id_extra,
            'id_pago': recibo.id_pago
          }
    
          var form = 'data='+ JSON.stringify(data)
          var send = axios.post(BASE_URL + 'extra/delete_payment',form)
    
          send.then(function (res) {
            var data = res.data
            displayMessage(data.mensaje);
            self.getPayments(self.extra.id_extra);
          })
          send.catch(function(error){
            console.log(error);
          })
        }
      }
    });
    
    bus.$on('row-selected',function (row) {
      extraTable.el.parents(".bootstrap-table").addClass("hide");
      appPagoExtra.visible = true
      appPagoExtra.extra = row
      listExtras = extraTable.el.find('tbody').html();
      appPagoExtra.getPayments(row.id_extra);
    })
    
    var selectExtraPayment = $("#select-extra-payment");
    selectExtraPayment.on('change',function(){
      var id_pago = selectExtraPayment.val()
      appPagoExtra.getPayment(id_pago)
    })
  })()
}