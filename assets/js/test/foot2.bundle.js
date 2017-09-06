var BASE_URL = window.location.origin + "/";
if(BASE_URL.includes("localhost") || BASE_URL.includes('ngrok.io')){
  BASE_URL += 'icpayment/';
}

var MESSAGE_SUCCESS = '<i class="material-icons">done_all</i>';
var MESSAGE_ERROR   = '<i class="material-icons">error_outline</i>';
var MESSAGE_INFO    = '<i class="material-icons">info_outline</i>';
var SUMMER_SKY      = '#1FA1D0'

/**
 * Connect And Send
 * Conecta al servidor via ajax y muestra el mensaje de respuesta
 * @param {string} url Url a donde se va a mandar la el formulario, sin la base_url
 * @param {boolean} is_message Si se espera un mensaje o no como respuesta 
 * @param {callback} recognizeElements Funcion para reconocer los elementos autogenerados
 * @param {?callback} action callback que recibe los datos desde el servidor para hacer algo con ellos
 * @param {string} form formulario a ser enviado al servidor
 * @param {callback} callback funcion a ser ejecutada despues que todo se cumpla, como get users
 * @param {function} loading function for loading
 * @return {void}
 */

function connectAndSend(url,is_message,recognizeElements,action,form,callback,loading){
  if(!loading) loading = lineLoad
  var connect = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'); 
    connect.onreadystatechange = function() {
        
        if (connect.readyState == 4 && connect.status == 200) {
          if(loading)loading(true);
          if (action != null)  {
              action(connect.responseText,recognizeElements);          
          }
          else{
            if(is_message){
              displayMessage(connect.responseText);                            
            }              
          }
          if(callback != null)callback();
        } 

        else if (connect.readyState != 4) {
          if(loading)loading(false);      
        }
    }

    connect.open("POST",BASE_URL + url, true);
    connect.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    connect.send(form);
}
/********************************************************
*         Funciones de mensajes y notificaciones                            
*                                                       *
********************************************************/
/**
 * Display Message
 * Muestra una notificacion del resultado de la consulta
 * @param {string} message string to be displayed 
 * @return {void}
 */

function displayMessage(message){
  var color = "rgba(102,187,106,1)";
  var toast,span;

    if(message.includes(MESSAGE_ERROR)){
      color = "rgba(244,67,54,1)";
    }else if(message.includes(MESSAGE_INFO)){
      color = "rgba(2,136,209,1)";
    }

    toast = $(".toast")
    span = toast.find("span").html(message);
    span.css({background:color});
    toast.css({display:"flex"});
    
    toast.animate({opacity:"1"},500,function(){
      setTimeout(function() {
        toast.animate({opacity:"0"});
        toast.css({display:"none"});
      }, 2000);
    });
}

function displayAlert(title,message,type){
  if(!title) title = "Revise";
  if(!message) message = "Asegurate de llenar todos los campos"
  if(!type) type = "error"
  swal({
      title: title,
      text: message,
      type: type,
      confirmButtonClass: 'btn',
      buttonsStyling: false
    });
}

/********************************************************
*        fucniones para Llenar tablas                                        
*                                                       *
********************************************************/

/**
 * Llena la tabla actual con los datos que vienen del servidor
 * @param {string} $content El html con los datos a ser mostrados, vienen siempre desde el servidor
 * @param {function} callback El callback para reconocer a los nuevos items
 * @return {void}
 */
function fillCurrentTable($content,callback,tableID){
  var $table
  $("html").removeClass("gr__icpayment-soft_com")
  if(tableID != undefined){
    $table = $('#'+tableID + " tbody");
  }else{
    $table = $('[class*="t-"] tbody');
  }
  $table.html($content);
  if(callback) callback();
}

/**
 * Llena la tabla clientes utilizando la funcion fillCurrentTable pasandole la tabla clientes como valor
 * @return {void}
 */
function fillClientTable($content,callback){
  fillCurrentTable($content,callback,"t-clients");
}

/**
 * Llena la tabla caja utilizando la funcion fillCurrentTable pasandole la tabla clientes como valor
 * @return {void}
 */
function fillCajaTable($content,callback){
  fillCurrentTable($content,callback,"caja");
  if(callback)callback();
}
/**
 * Llena la Lista de pagos/notificaciones con los datos que vienen del servidor
 * @param {string} $content El html con los datos a ser mostrados, vienen siempre desde el servidor
 * @param {function} callback El callback para reconocer a los nuevos items
 * @return {void}
 */

function fillPaymentsList($content,callback){
  var $container = $(".list-nextpayments");
  $container.html($content);
}

function fillAveriasList($content,callback){
  var $container = $("#averias-list");
  $container.html($content);
  callback();
}

function fillInstallationsList($content,callback){
  var $container = $("#installations-list");
  $container.html($content);
  callback();
}

function makeContractList(response,callback){
  if(response != "nada"){
    
    var contracts = JSON.parse(response);
    var value,service,equipment,eMac,router,rMac,code;
    var selectContract = $("#extra-client-contract");
    var element = "<option value=''>--Selecciona--</option>";
    var cliente = contracts.cliente;
    var contractId = contractTable.getId();

    for (var i = 0; i < contracts.contratos.length; i++) {
      value     = contracts.contratos[i]["id_contrato"];
      service   = contracts.contratos[i]["servicio"];
      equipment = contracts.contratos[i]["nombre_equipo"];
      router    = contracts.contratos[i]["router"];
      eMac      = contracts.contratos[i]["mac_equipo"];
      rMac      = contracts.contratos[i]["mac_router"];
      code     = contracts.contratos[i]["codigo"];
      element += "<option value='" + value + "' data-service='"+service+"'  data-equipment='"+equipment+"'  data-e-mac='"+eMac+"'";
      element += " data-router='"+router+"'  data-r-mac='"+rMac+"' data-code='"+code+"'>";
      element += value +"</option>";  
    }
    selectContract.html(element);
    selectContract.val(contractId).change();
    $("#extra-client-name").val(cliente['nombres'] + " " + cliente['apellidos']);

  }else{
    displayMessage(MESSAGE_ERROR + " Este cliente no existe revise su cedula por favor");
  } 
}

function clearTbody(objecId){
  $(objecId).html("");
}

function fillClientFields(response,callback){
  if(response != "nada"){ 
    var cliente = JSON.parse(response);
    $("#averias-client-id").val(cliente['id_cliente']);
    $("#a-client").val(cliente['nombres'] + " " + cliente['apellidos'])
  }else{
    displayMessage(MESSAGE_ERROR + " Este cliente no existe revise su cedula por favor");
  }
}

function makePaymentList(response,callback){
  var selectPayUntil = $('#select-pay-until');
  selectPayUntil.html(response);
  selectPayUntil.parent().removeClass('hide');
  selectPayUntil.change();
  if(callback)callback();
}


/**
 * isEmpty
 * Verifica si los valores dados estan vacios o son nulos 
 * @param {Array. < string} values
 * @return {boolean}
 */
function isEmpty(values,is_num){
  for(var i = 0 ; i < values.length ; i++){
    if (values[i] == null || values[i] == ""){
      return true;
    } 
  }
  return false;
}


function updateSaldo(money){
  money = "RD$ "+ CurrencyFormat(money)
  $(".current-saldo").text(money);
}
function updateCount($content){
  $(".total-rows").html($content);
}
// +-----------------------------------------------------------------------------------------------------------------------------+
// |                                                     User passwords validations                                              |
// |                                                                                                                             |
// +-----------------------------------------------------------------------------------------------------------------------------+
//

function validateModal($modalId){
  var $userPassword = $($modalId+' .password');
  var $userPasswordConfirm = $($modalId+' .password-confirm');
  var $saveButton = $($modalId+' .save');
  
  $userPasswordConfirm.on('blur keyup',function(){
    validateTwo($userPassword,$userPasswordConfirm,$saveButton);
  });
  $saveButton.on('click',clearForm($modalId));
}

function validateTwo($firstObject,$secondObject,$button){
    if($secondObject.val() == $firstObject.val() && $secondObject.val() != ""){
      replaceClass($firstObject.parent(),"has-error","has-success");
      replaceClass($secondObject.parent(),"has-error","has-success");
      $button.removeAttr("disabled","");

    }else{
       replaceClass($firstObject.parent(),"has-success","has-error");
       replaceClass($secondObject.parent(),"has-success","has-error");
       $button.attr("disabled","");
    }
}

function validateThis(){
  var $userPassword = $('.password');
  var $userPasswordConfirm = $('.password-confirm');
  var $saveButton = $('.save');
  
  $userPassword.on('blur keyup',function(){
    validateTwo($userPassword,$userPasswordConfirm,$saveButton);
  });
  $userPasswordConfirm.on('blur keyup',function(){
    validateTwo($userPassword,$userPasswordConfirm,$saveButton);
  });
}

function clearForm(modalId){
  $(modalId + " input").val("");
}

function deleteValidation($inputElement, text, $buttonToActive){
  var innerText;
  this.text = text;
  var self  = this;
  $inputElement.on("keyup",function(e){
    e.stopImmediatePropagation();
    innerText = $(this).val() 
    if(innerText.toLowerCase() == self.text.toLowerCase()){
      $buttonToActive.removeAttr("disabled");

    }else{
      $buttonToActive.attr("disabled","");
    }
  })
}

// +-----------------------------------------------------------------------------------------------------------------------------+
// |                                                     Funciones de utileria                                                   |
// |                                                                                                                             |
// +-----------------------------------------------------------------------------------------------------------------------------+
//


function replaceClass($object,oldClass,newClass){
   $object.addClass(newClass);
   $object.removeClass(oldClass)
}

function makeServiceCardClickable(){
    var serviceCard      = $(".service-card");
    var btnPrintContract = $('#btn-print-requirement');

    serviceCard.on('click',function(e){
      e.stopImmediatePropagation();
      var $this       = $(this);
      var service_id  = $this.attr('data-id'); 
      var payment     = $this.attr('data-payment');
      var realLink    = btnPrintContract.attr('data-href')
      
      serviceCard.removeClass('selected');
      $this.addClass('selected');
      btnPrintContract.attr("href",realLink + "/" + service_id);
      $('#contract-client-payment').val(payment)
    })
}
/********************************************************
*                          Verify Rows                            
*                                                       *
********************************************************/


function verifyContractStatus(){
  $(".td-estado").each(function(i,value){
    var $this = $(this);
    var text = $this.text().trim();
    if(text == "activo"){
      $this.css({color:"green"})
    }else if(text == "saldado"){
      $this.parents("tr").css({background:"rgba(22,255,0,.3)",color:"#555"});
    }
  });
}

function verifyClientStatus(){
   $("td").each(function(i,value){
    var $this = $(this);
    var text = $this.text().trim();
    if(text == "no activo"){
      $this.css({color:"rgba(200,0,0,.7)"})
    }else if(text == "activo"){
      $this.css({color:"green"});
    }
  });
}

/********************************************************
*                       Loaders                            
*                                                       *
********************************************************/

function heavyLoad(stop){
  if(!stop){
    var html = '<div class="heavy-loader active">'
        html +=   '<div class="circle-load"></div>'
        html +=   '<div class="message">Preparando los datos</div>'
        html += '</div>'
    $("body").append(html)
    $("body").css({overflow:"hidden"});
    var message = $(".heavy-loader .message");
    setTimeout(function(){
      message.text("Configurando...");
    },4000)
    setTimeout(function(){
      message.text("Casi Terminamos ...");
    },8000)
    setTimeout(function(){
      message.text("Terminando el proceso ...");
      removeLoader();
    },15000)
  }else{
    removeLoader();
  }

  function removeLoader(){
    var loader = $(".heavy-loader");
    loader.remove();
    $("body").css({overflow:"auto"});
  }
}

function lineLoad(stop) {
  if(!stop){
     $(".loader").css({
      display: "block"
      });
  }else{
    $(".loader").css({display: "none"});
  }
}
// funciones de bootstrap
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

function validatePassword(password){
  var expression = '';
  var has_lowercase = false;
  var has_uppercase = false;
  var has_digit = '/*\d';

  if(password.length > 8) alert("mayor a 8")
  if(/\d/.test(password))alert("tiene digito")
  if(/[a-z]/.test(password))alert("tiene minisculas")
  if(/[A-Z]/.test(password)) alert('tiene mayusculas')
}
$(function(){
  var currentPage = $("title").text().split(" ");
  currentPage   = currentPage[4].toLowerCase().trim();
  if(currentPage == "administrador") {
    newUserForm();
  }
  getDate();
  adminFunctions();
  userInfoTip();
  makeServiceCardClickable();
  detailsFunctions();
  notificationFunctions();
  newContractFunctions();
  checkWindowSize();
  $(window).on('resize',function(){
    checkWindowSize();
  })
  
/**
 * Get Date:
 * Obtiene la fecha actual al segundo y la muestra en la pantalla de inicio
 * @return {void}
 */
function getDate(){
  var $day = $('.day');
  var $monthYear = $('.month-year');
  var $dayWeek = $('.dayweek');
  var $Hora = $('.hour span');
  var date,day,month,year,sHour;
  var days = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
  var months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  setInterval(updateHour,1000);

  function updateHour(){
    date = new Date();
    sDate = date.toString()
    $day.text(date.getDate());
    $monthYear.text("De " + months[date.getMonth()] + " de " + date.getFullYear());
    $dayWeek.text(days[date.getDay()]);
    
    sHour = moment().format('LTS');
     $Hora.html(sHour);
  }
}

/**
 * Admin Functions:
 * se encarga de el movimiento de los paneles en la pantalla 'administrador'
 * @return {void}
 */

function adminFunctions(){
  $('#company-section').animate({left:"0"},200)
  $('.administrador .aside-buttons a').on('click',function(e){
    e.preventDefault();
    var $this = $(this);
    var cardName = $this.attr('href').slice(1);
    if(cardName != null){
      $('.company-details').animate({left:"-110%"},200)
      $('#'+cardName+'.company-details').animate({left:"0"},200)
    }  
  })

  if($("#acount-section").length > 0){
    $('#acount-section').animate({left:"0"},200)
  }
}

/**
 * new User Form:
 * vaida las contraseñas en los formularios de los usuarios
 * @return {void}
 */
function newUserForm(){
  validateModal("#new-user-modal");
  validateModal("#update-user-modal");
}

/**
 * User Info Tip
 * hace un toggle en la visibilidad de la info del usuario
 * @return {void}
 */
function userInfoTip(){
  var infoTip = $(".user-info-tip");
  var profilePicture = $(".profile-picture");
  var btnMore = $(".btn-more");

  btnMore.on('click',function(e){
    infoTip.toggleClass("visible");
  });
}
});

function newContractFunctions(){
  var btnPrintContract = $("#btn-print-contract");
  var document = $(".note-item");
  var radioActivateContract = $("#radio-new-contract");
  var radioDisableContract = $("#radio-just-requirement");
  var contractControls = $(".contract-controls");
  var requirementControls = $(".requirement-controls");

  radioActivateContract.parents("label").on('click',function(){
   activateContractMode(); 

  });

  radioDisableContract.parents("label").on('click',function(){
    disableContractMode()
  });

  function activateContractMode($btn){
    radioDisableContract
      .removeAttr("checked","")
      .html("")
    radioActivateContract
      .attr("checked","")
      .html("&#10004;")
    document.removeClass("print-requirement");
    contractControls.removeClass("hide")
    requirementControls.addClass("hide")
    
  }

  function disableContractMode($btn){
    radioActivateContract
      .removeAttr("checked","")
      .html("")
    radioDisableContract
      .attr("checked","")
      .html("&#10004;")
    document.addClass("print-requirement");
    requirementControls.removeClass("hide")
    contractControls.addClass("hide")
  }
}

/********************************************************
*                          Modals Functions                            
*                                                       *
********************************************************/


$('#search-client-modal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  clientTable.init();
  var title = button.find('.section-title').text();
  if(!title) title = "Buscar Cliente"
  if(title.toLowerCase().trim() == "registrar pago"){
    buttonText = "ir a Pagos"
  }else{
    buttonText = "Nuevo Contrato"
  }
  
  var modal = $(this)
  modal.find('.modal-title').text(title)
  modal.find('.modal-footer .save').text(buttonText)
  modal.find('tbody').html('')
})



/********************************************************
*              other functions                            
*                                                       *
********************************************************/

function detailsFunctions(){
  var smallButtonsSelect = $('.btn-small');

  $('[role="tab"]').on('click',function(){
    var href = $(this).attr("href")
    if(href == "#payments" ||href == "#detalles_de_pago" || href == "#descuento" || href == "#month-and-date" || href == "#reconnect-service") {
      $(".payment-controls").addClass("visible");
    }else{
      $(".payment-controls").removeClass("visible");
    }

    if(href == "#contracts"){
      $(".contract-controls").addClass("visible")
    }else{
      $(".contract-controls")
    }


    getTabControls($(this));
  });

  $('.btn-small').on('click',function(){
    smallButtonsSelect.removeClass('selected');
    $(this).addClass('selected');
  })
}

function getTabControls($this){
  var controls = $this.attr("aria-controls");
  $(".dynamic-controls").text(controls);
}

function notificationFunctions(){
  var btnAverias      = $("#btn-see-averias");
  var btnPagos        = $("#btn-see-pagos");
  var btnCajaChica    = $('#btn-see-caja');
  var btnDeudores     = $("#btn-see-deudores")
  var btnDayIncomes   = $("#btn-see-day-incomes")
  var layoutContainer = $(".layout-container");

  btnAverias.on('click',function(){
    layoutContainer.animate({left:"-100%"},200);
  });

  btnPagos.on('click',function(){
    layoutContainer.animate({left:"0"},200);
  });

  btnDeudores.on('click',function(){
    layoutContainer.animate({left:"-200%"},200);
  });

   btnDayIncomes.on('click',function(){
    layoutContainer.animate({left:"-300%"},200);
  });
}

$("#select-extra-service").on('change',function(){
  var $this = $(("#select-extra-service :selected"));
  var cost = $this.attr("data-payment");
  
  $("#extra-service-cost").val(cost)
});

$("#extra-client-contract").on('change',function(){
  var $this = $(("#extra-client-contract :selected"));
  
  $("#extra-contract-service").val($this.attr("data-service"));
  $("#extra-equipo").val($this.attr("data-equipment"));
  $("#extra-router").val($this.attr("data-router"));
  $("#extra-e-mac").val($this.attr("data-e-mac"));
  $("#extra-r-mac").val($this.attr("data-r-mac"));
  $("#extra-code").val($this.attr("data-code"));
});

$(".columns-right").removeClass("pull-right");

$("#select-contract-code").on('change',function(){
  var $this = $(("#select-contract-code :selected"));
  $("#contract-ip").val($this.attr("data-ip-final"));
  $("#u-contract-ip").val($this.attr("data-ip-final"));
 
});

function checkWindowSize() {
  var width = window.screen.availWidth;
  var brandName = document.querySelector('.brand span');
  
  if(width <= 1100){
    brandName.textContent = "P";
  }else{
    brandName.textContent = "Payment";
  }
}

$(window).scroll(function () {
  position = $(window).scrollTop()
  movableNav = $('.aside-nav-container, .aside-wide-left')

  if(position >= 50){
    movableNav.addClass('moved')
  }else{
    movableNav.removeClass('moved')
  }
})
var Users = {
  add: function () {
    var form, nick, password, name, lastname, dni, type, is_empty;

    nick      = $("#user-nickname").val();
    password  = $("#user-password").val();
    name      = $("#user-name").val();
    lastname  = $("#user-lastname").val();
    dni       = getVal($("#user-dni"));
    type      = $("#user-type").val();

    var is_empty = isEmpty([nick, password, name, lastname, dni, type]);
    if (!is_empty) {
      form = 'nickname=' + nick + "&password=" + password + "&name=" + name + "&lastname=" + lastname;
      form += "&dni=" + dni + "&type=" + type;
      connectAndSend("user/addnew", true, initAdminHandlers, null, form, Users.getAll);
    } else {
      displayAlert("Revise", "LLene todos los campos por favor", "error");
    }
  },

  update: function () {
    var form, nick, password, name, lastname, dni, type;

    nick     = $("#e-nickname").val();
    name     = $("#e-name").val();
    lastname = $("#e-lastname").val();
    dni      = $("#e-dni").val();
    type     = $("#e-type").val();

    var is_empty = isEmpty([nick, name, lastname, dni, type]);
    if (!is_empty) {
      form = 'nickname=' + nick + "&name=" + name + "&lastname=" + lastname;
      form += "&dni=" + dni + "&type=" + type;
      connectAndSend("user/update", true, initAdminHandlers, null, form, Users.getAll);
    } else {
       displayAlert("Revise", "LLene todos los campos por favor", "error");
    }
  },

  getAll: function () {
    var form = "table=users";
    connectAndSend('user/getusers', false, initAdminHandlers, userTable.refresh, form, null);
  },

  delete: function (id) {
    var form = "user_id=" + id;
    connectAndSend('user/deleteuser', true, initAdminHandlers, null, form, Users.getAll);
  },

  confirmPassword: function(userId,currentPassword) {
    var form = 'user_id='+ userId +'&current_password=' + currentPassword;
    connectAndSend('user/confirm_password', false, false, processConfirmData, form, null, null);
    
    function processConfirmData(response) {
      var newPassword         = $("#acount-new-password");
      var newPasswordConfirm  = $("#acount-confirm-new-password");
      
      if (response == 1) {      
        newPassword.removeAttr('disabled');
        newPasswordConfirm.removeAttr('disabled');
        validateThis();
      }else{
        newPassword.attr('disabled',true);
        newPasswordConfirm.attr('disabled',true);
      }
    }
  },

  updatePassword: function(userId,currentPassword,newPassword){
    var form = 'user_id='+ userId  + "&current_password="+ currentPassword +'&new_password=' + newPassword;
    connectAndSend('user/update_password', false, false, Users.passwordChanged, form, null,heavyLoad);
  },

  passwordChanged: function(response){
    if(response==1){
      displayMessage(MESSAGE_SUCCESS + 'Contraseña Cambiada con exito')
      setTimeout(function(){
        window.location.href = BASE_URL + 'app/logout'
      },3000)      
    }else{
      displayMessage(MESSAGE_ERROR + ' Error al cambiar de contraseña, revise la contraseña actual')
    }
      
  }
}

var Clients = {
  add: function () {
     var form, nombres, apellidos, cedula, celular, provincia, sector, calle, casa, telefono,
       lugarTrabajo, telTrabajo, ingresos, fechaRegistro, estado;

    nombres       = $("#client-name").val();
    apellidos     = $("#client-lastname").val();
    cedula        = getVal($("#client-dni"));
    celular       = getVal($("#client-phone"));
    provincia     = $("#client-provincia").val();
    sector        = $("#client-sector").val();
    calle         = $("#client-street").val();
    casa          = $('#client-house').val();
    telefono      = getVal($('#client-telephone'));
    lugarTrabajo  = $('#client-job').val();
    telTrabajo    = getVal($('#client-job-telephone'));
    ingresos      = $('#client-salary').val();
    fechaRegistro = moment().format("YYYY-MM-DD");;
    estado        = "no activo";

    var is_empty = isEmpty([nombres, apellidos, cedula, celular, provincia, sector, calle, casa, telefono]);
    if (!is_empty) {
      form = 'nombres=' + nombres + "&apellidos=" + apellidos + "&cedula=" + cedula + "&celular=" + celular;
      form += "&provincia=" + provincia + "&sector=" + sector + "&calle=" + calle + "&casa=" + casa + "&telefono=" + telefono;
      form += "&lugar_trabajo=" + lugarTrabajo + "&tel_trabajo=" + telTrabajo + "&ingresos=" + ingresos + "&fecha_registro=" + fechaRegistro;
      form += "&estado=" + estado + "&tabla=clientes";

      connectAndSend("process/add", true, initClientHandlers, null, form, Clients.getAll);

    } else {
      displayAlert("Revise", "LLene todos los campos por favor", "error");
    }
  },

  getAll: function () {
    var form = "tabla=clientes";
    connectAndSend('process/getall', false, initClientHandlers, clientTable.refresh, form, null);
  },

  getOne: function (id, receiver) {
    form = "tabla=clientes&id=" + id;
    connectAndSend("process/getone", false, initClientHandlers, receiver, form, null)
  },

  receiveForEdit: function (content) {
    var client        = JSON.parse(content);
    this.id            = client['id_cliente'];
    var $nombres      = $("#u-client-name");
    var $apellidos    = $("#u-client-lastname");
    var $cedula       = $("#u-client-dni");
    var $celular      = $("#u-client-phone");
    var $provincia    = $("#u-client-provincia");
    var $sector       = $("#u-client-sector");
    var $calle        = $("#u-client-street");
    var $casa         = $('#u-client-house');
    var $telefono     = $('#u-client-telephone');
    var $lugarTrabajo = $('#u-client-job');
    var $telTrabajo   = $('#u-client-job-telephone');
    var $ingresos     = $('#u-client-salary');

    $nombres.val(client['nombres']);
    $apellidos.val(client['apellidos'])
    $cedula.val(client['cedula'])
    $celular.val(client['celular'])
    $provincia.val(client['provincia'])
    $sector.val(client['sector'])
    $calle.val(client['calle'])
    $casa.val(client['casa'])
    $telefono.val(client['telefono'])
    $lugarTrabajo.val(client['lugar_trabajo'])
    $telTrabajo.val(client['tel_trabajo'])
    $ingresos.val(client['salario'])

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
        form += "&casa=" + $casa.val() + "&telefono=" + getVal($telefono) + "&lugar_trabajo=" + $lugarTrabajo.val() + "&tel_trabajo =";
        form += getVal($telTrabajo) + "&tabla=clientes";
        form += "&ingresos=" + $ingresos.val();

        connectAndSend("process/update", true, initClientHandlers, null, form, Clients.getAll);

      } else {
        displayAlert("Revise", "LLene todos los campos por favor", "error");
      }
    }
  },

  saveObservations: function () {
    var form, observations,idCliente;
 
    observations = $("#text-observations").val();
    idCliente    = $("#detail-client-id").val();
 
    form = 'observaciones=' + observations + "&tabla=observaciones&id_cliente=" + idCliente;
    connectAndSend("process/update", true, null, null, form, null)
  },
  
  updateState: function (client) {
    form = 'data='+ JSON.stringify(client)+ '&module=clientes&action=update';
      connectAndSend('process/getjson',true,null,null,form, null);
  }
}

var Generals = {
  deleteRow: function (id, tabla) {
    var form = "tabla=" + tabla + "&id=" + id;
    var handlers, callback;
    switch (tabla) {
      case 'clientes':
        callback = Clients.getAll;
        break;
      case 'servicios':
        callback = Services.getAll;
        break;
    }
    connectAndSend('process/delete', true,null, null, form, callback);
  },
  /**
   * Search manda un mensaje al servidor de los valores a buscar
   * @param {string} text el valor a ser buscado
   * @param {string} dbTable nombre de la tabla donde se desea consultar en la base de datos
   * @param {function} fillTableFunction funcion de llenado de tabla donde se mostraran los resultados 
   * @param {function} handlerFunction funcion reinicio de los elementos en los handlers 
   */
  
  search: function (text, dbTable, fillTableFunction, handlerFunction) {
    if (handlerFunction == undefined) handlerFunction = initClientHandlers;
    if (fillTableFunction == undefined) fillTableFunction = fillCurrentTable;
    var word = text;
    if (word != null || word != "") {
      var form = "tabla=" + dbTable + "&word=" + word;
      connectAndSend('process/search', false, handlerFunction, fillTableFunction, form, null);
    }
  },

  count_table: function (table) {
    var form = "tabla=" + table;
    var updateFunction = updateCount;
    if (table == 'caja') updateFunction = updateCajaCount
    connectAndSend('process/count', false, null, updateFunction, form, null);
  }
}

var Services = {
  add: function () {
    var form, name, description, payment, type;

    name        = $("#service-name").val();
    description = $("#service-description").val();
    payment     = $("#service-monthly-payment").val();
    type        = $("#service-type").val();

    var is_empty = isEmpty([name, description, payment, type]);
    if (!is_empty) {
      form = 'nombre=' + name + "&descripcion=" + description + "&mensualidad=" + payment + "&tipo=" + type;
      form += "&tabla=servicios";
      connectAndSend("process/add", true, null, null, form, Services.getAll);
    } else {
      displayAlert("Revise", "LLene todos los campos por favor", "error");
    }
  },

  getAll: function () {
    var form = "tabla=servicios";
    connectAndSend('process/getall', false, null, serviceTable.refresh, form, null);
  },

  update: function () {
    var form, id, name, description, payment, type;

    id          = $('#u-service-id').val();
    name        = $('#u-service-name').val();
    description = $('#u-service-description').val();
    payment     = $('#u-service-monthly-payment').val();
    type        = $('#u-service-type').val();

    var is_empty = isEmpty([id, name, description, payment, type]);
    if (!is_empty) {
      form = 'id_servicio=' + id + "&nombre=" + name + "&descripcion=" + description + "&mensualidad=" + payment;
      form += "&tipo=" + type + "&tabla=servicios";
      connectAndSend("process/update", true, null, null, form, Services.getAll,heavyLoad);
    } else {
      displayAlert("Revise", "LLene todos los campos por favor", "error");
    }
  }
}

var Contracts = {
  add: function addNewContract() {
    var form, table, client_id, user_id, service_id, code, contract_date, payment, duration,
      equipment, eMac, router, rMac, total, nextPayment, model, ip;

    client_id     = $("#contract-client-id").val();
    user_id       = $("#contract-user-id").val();
    service_id    = $(".service-card.selected").attr('data-id');
    contract_date = $('#contract-client-date').val();
    duration      = $('#contract-client-months').val();
    equipment     = $('#contract-equipment').val();
    eMac          = $('#contract-e-mac').val();
    router        = $('#contract-router').val();
    rMac          = $('#contract-r-mac').val();
    model         = $('#contract-equipment-model').val();
    ip            = $('#contract-ip').val();
    code          = $("#select-contract-code").val();

    payment = $("#contract-client-payment").val();
    nextPayment = moment(contract_date).add(1, 'months').format('YYYY-MM-DD');

    var is_empty = isEmpty([client_id, user_id, service_id, contract_date, duration]);
    if (!is_empty) {
      total = (Number(duration) + 1) * Number(payment);
      form = 'id_empleado=' + user_id + "&id_cliente=" + client_id + "&id_servicio=" + service_id + "&codigo=" + code + "&fecha=" + contract_date;
      form += "&duracion=" + duration + "&monto_total=" + total + "&monto_pagado=0&ultimo_pago=null";
      form += "&mensualidad=" + payment + "&proximo_pago=" + nextPayment + "&estado=activo&tabla=contratos";
      form += "&nombre_equipo=" + equipment + "&mac_equipo=" + eMac + "&router=" + router + "&mac_router=" + rMac;
      form += "&modelo=" + model + "&ip=" + ip;
      connectAndSend("process/add", null, null, Contracts.getLast, form, null);
    } else {
      displayAlert("Revise", "LLene todos los campos por favor", "error");
    }
  },

  extend: function(idContrato) {
    var form;
    form = 'id_contrato=' + idContrator;
    connectAndSend("process/extend", true, null, null, form, null);
  },

  getAll: function() {
    var form = "tabla=contratos";
    connectAndSend('process/getall', false, null, contractTable.refresh, form, null);
  },

  getLast: function(data) {
    data = JSON.parse(data);
    console.log(data);
    console.log(data.mensaje);
    displayMessage(data.mensaje)
    $("#btn-save-contract").attr("disabled", "");
    $("#btn-print-contract").removeAttr("disabled");
    if(data.tabla_pagos){
      makePaymentList(data.tabla_pagos);
    }
  },

  callExtra: function() {
    var row = contractTable.getSelectedRow();
    if (row) {
      $("#extra-client-dni").val(row.cedula);
      Contracts.getAllOfClient(row.cedula);
      $('#add-extra-modal').modal();
    } else {
       displayAlert("Revise", "Seleccione el conrato primero", "error");
    }
  },

  cancel: function() {
    var row        = contractTable.getSelectedRow()
    var is_penalty = false;
    var reason     = $("#cancelation-reason").val();
    var checked    = $("#check-penalty:checked").length;
    var form, fecha;
    if(row.id){
      if (checked > 0) {
        is_penalty = true;
      }
      fecha = moment().format("YYYY-MM-DD");
      form = 'id_contrato=' + row.id + '&fecha=' + fecha + '&id_cliente=' + row.id_cliente;
      form += "&motivo=" + reason + "&penalidad=" + is_penalty;
      connectAndSend('process/cancel', true, null, null, form, Contracts.getAll);
    }else{
      displayMessage(MESSAGE_ERROR +" No hay contrato seleccionado");
    }
  },

  getOne: function(id_contrato, receiver) {
    form = "tabla=contratos&id_contrato=" + id_contrato;
    connectAndSend("process/getone", false, null, receiver, form, null)
  },

  recieve: function(content) {
    var contract    = JSON.parse(content);
    this.id_contrato = contract['id_contrato'];
    var $equipo     = $("#u-contract-equipment");
    var $macEquipo  = $("#u-contract-e-mac");
    var $router     = $("#u-contract-router");
    var $macRouter  = $("#u-contract-r-mac");
    var $modelo     = $("#u-contract-modelo");
    var $codigo     = $("#select-contract-code");
    var $isChangeIp = $("#check-change-ip");
    var $ip         = $("#u-contract-ip");

    $equipo.val(contract['nombre_equipo']);
    $macEquipo.val(contract['mac_equipo']);
    $router.val(contract['router']);
    $macRouter.val(contract['mac_router']);
    $modelo.val(contract['modelo']);
    $ip.val(contract['ip']);

    // $("#update-contract-modal select").val('')
    $("#update-contract-modal").modal();
    $("#update-contract").on('click', function (e) {
      e.stopImmediatePropagation();
      updateContract(id_contrato);
    });

    function updateContract(id_contrato) {
      var checked = $("#check-change-ip:checked").length;
      form = 'id_contrato=' + id_contrato + '&nombre_equipo=' + $equipo.val() + "&mac_equipo=" + $macEquipo.val();
      form += "&router=" + $router.val() + "&mac_router=" + $macRouter.val();
      form += "&modelo=" + $modelo.val();
      form += "&tabla=contratos";
      if (checked > 0) {
        form += "&ip=" + $ip.val() + "&codigo=" + $codigo.val();
      }
      connectAndSend("process/update", true, null, null, form, Contracts.getAll);
    }
  },

  getIpList: function () {
    var section_id = $("#select-contract-sector").val();
    var form = "id_seccion=" + section_id + "&tabla=ip_list";
    connectAndSend("process/getall", false, null, makeIpList, form, null);

    function makeIpList(content) {
      $("#select-contract-code").html(content);
    }
  },

  btnExtraPressed: function ($this) {
    var buttonId = $this.text().trim().toLowerCase();

    switch (buttonId) {
      case "mejorar":
        Contracts.upgrade();
        break;
      case "extender":
        Contracts.extend();
        break;
      case "guardar":
        Contracts.addExtra();
        break;
    }
  },

  upgrade: function () {
    var form, contractId, selectedService, serviceId, amount;

    contractId = $("#extra-client-contract").val();
    selectedService = $(".service-card.selected");
    serviceId = selectedService.attr("data-id");
    amount = selectedService.attr("data-payment");

    var is_empty = isEmpty([contractId, serviceId, amount]);
    if (!is_empty) {
      form = 'id_contrato=' + contractId + "&id_servicio=" + serviceId + "&cuota=" + amount;
      connectAndSend('process/upgrade', true, initGlobalHandlers, null, form, Contracts.getAll)
    } else {
      displayAlert("Revise", "asegurate de llenar todos los datos y seleccionar el servicio", "info");
    }
  },

  reconnect: function () {
    var form, contractId, selectedService, serviceId, duration, date,send, is_empty,info;

    contractId = $("#select-contract").val();
    selectedService = $(".service-card.selected");
    serviceId = selectedService.attr("data-id");
    duration  = $("#reconnection-months").val();
    date = $("#reconnection-date").val()

    is_empty = isEmpty([contractId,serviceId,date,duration]);
    console.log("service id" + serviceId + " duration " + duration + " date" + date + " contract "+ contractId )
    if(!is_empty){
      info = {
        'id_contrato': contractId,
        'fecha': date,
        'id_servicio': serviceId,
        'duracion': duration
      }
      form = "data=" + JSON.stringify(info);
      send = axios.post(BASE_URL + "contract/reconnect",form);
      send.then(function(res){
        displayMessage(res.data.mensaje);
        Payments.getAll();
        $("#btn-reconnect").removeAttr("disabled");
        $(".reconnect-caller").removeClass('visible');
        
      })
      send.catch(function(err){
        console.log(err);
      })
    }else{
      swal("Llene todos los campos")
    }
  },

  addExtra: function () {
    var form, contractId, extraService, serviceCost, equipment, eMac, router, rMac,paymentMode;

    contractId = $("#extra-client-contract").val();
    serviceCost = $("#extra-service-cost").val();
    extraService = $("#select-extra-service").val();
    equipment = $("#extra-equipo").val();
    eMac = $("#extra-e-mac").val();
    router = $("#extra-router").val();
    rMac = $("#extra-r-mac").val();
    paymentMode = $("#select-payment-mode").val();

    var is_empty = isEmpty([contractId, extraService, serviceCost,paymentMode]);
    if (!is_empty) {
      form = 'id_contrato=' + contractId + "&costo_servicio=" + serviceCost + "&nombre_servicio=" + extraService;
      form += '&nombre_equipo=' + equipment + "&mac_equipo=" + eMac + "&router=" + router + "&mac_router=" + rMac;
      form += '&modo_pago=' + paymentMode;
      connectAndSend('process/addextra', true, initGlobalHandlers, null, form, Contracts.getAll);
    } else {
      displayAlert("revise", "asegurate de llenar todos los datos y seleccionar el servicio", "info");
    }
  },

  extend: function () {
    var form, contractId, duration;
    contractId = $("#extra-client-contract").val();
    duration = $("#extra-extension-months").val();

    var is_empty = isEmpty([duration, contractId]);
    if (!is_empty) {
      form = 'id_contrato=' + contractId + "&duracion=" + duration;
      connectAndSend('process/extend_contract', true, initGlobalHandlers, null, form, Contracts.getAll)
    } else {
      displayAlert("revise", "asegurate de llenar todos los datos y seleccionar el servicio", "info");
    }
  },

  getAllOfClient: function(dni) {
    var form = "dni=" + dni;
    connectAndSend("process/data_for_extra", false, null, makeContractList, form, null);
  },

  // Note: lo siento, de aqui en adelante uso axios, es mucho mas comodo
  suspend: function (id_contrato) {
    form = "data=" + JSON.stringify({id_contrato:id_contrato})
    var send = axios.post(BASE_URL + 'contract/suspend',form);
    send.then(function(res){
      var data = res.data
      displayMessage(data.mensaje);
      Contracts.getAll();
    })
    send.catch(function(error){
      console.log(error);
    })
  }
}

var Payments = {
  getAll: function () {
    var id = $("#select-contract").val();
    if (id != null) {
      var form = "tabla=pagos&id=" + id;
      connectAndSend('process/getall', false, null, paymentTable.refresh, form, Payments.contractRefresh);
    }
  },

  update: function (id) {
      var date = moment().format("YYYY-MM-DD");
      var id_contrato = $("#select-contract").val();
      var form = "tabla=pagos&id=" + id + "&estado=pagado&fecha_pago=" + date + "&id_contrato=" + id_contrato;
      connectAndSend('process/update', true, null, null, form, Payments.getAll);
  },

  saveAbonos: function () {
    var form, observations, abono$inputAbono,$textAbono,contractId;

    $textAbono   = $('#text-abono-detail');
    observations = $textAbono.val();
    contractId   = $("#select-contract").val();
    $inputAbono  = $("#input-abono");
    abono        = $inputAbono.val();

    form = 'observaciones=' + observations + "&abonos=" + abono;
    form += "&contrato_abono="+contractId+"&tabla=abonos";
    connectAndSend("process/update", true, null, null, form, Payments.getAll)
    $inputAbono.val('')
  },

  saveExtra: function () {
    var send = axios.post(BASE_URL + 'process/')
  },

  updateUntil: function(contractId,lastPaymentId){
    var id_contrato = $("#select-contract").val();
    var form = "tabla=pagos_al_dia&id_ultimo_pago=" + lastPaymentId + "&estado=pagado&id_contrato=" + contractId;
    var handlers, callback;
    connectAndSend('process/update', true, null, null, form, null, heavyLoad);
  },
    
  removePayment: function (id) {
    var form = "tabla=deshacer_pago&id_pago=" + id;
    connectAndSend('process/update', true, null, null, form, Payments.getAll);
  },

  contractRefresh: function(){
    var id_cliente = $('#detail-client-id').val()
    var form = "tabla=contratos_cliente&id=" + id_cliente;
    connectAndSend('process/getall', false, null, detailsContractTable.refresh, form, null);
  },

  getOne: function(id_pago, receiver) {
    form = "tabla=pagos&id_pago=" + id_pago;
    connectAndSend("process/getone", false, null, receiver, form, null)
  },

  receiveForEdit: function(content){
    var pago          = JSON.parse(content);
    this.id_contrato  = pago['id_contrato'];
    this.id_pago     = pago['id_pago']
    var $concepto     = $("#payment-concept");
    var $fechaLimite  = $("#payment-limit-date");
    var $cuota        = $("#payment-cuota");
    var $mora         = $("#payment-mora");
    var $extra        = $("#payment-extra");
    var $total        = $("#payment-total");
    var $descuento    = $("#payment-discount-amount");
    var $razon        = $("#payment-discount-reason");
    var $modal        = $("#advanced-payment");

    $concepto.val(pago['concepto']);
    $fechaLimite.val(pago['fecha_limite']);
    $cuota.val(pago['cuota']);
    $mora.val(pago['mora']);
    $extra.val(pago['monto_extra']);
    $total.val(pago['total']);
    interactiveSum();

    $modal.modal();
    $modal.on('hide.bs.modal',function(){
      $modal.find('input').val('')
    });
    $("#btn-apply-discount").on('click', function (e) {
      e.stopImmediatePropagation();
      swal({
          title: 'Está Seguro?',
          text: "Seguro de que quiere aplicar este descuento de " + $descuento.val() + "?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Estoy Seguro!',
          cancelButtonText: 'Cancelar'
        }).then(function(){
          applyDiscount(id_pago);
          $modal.hide();
          $modal.modal('hide');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
 
        });
    });

    function applyDiscount(id_pago) {
      var date = moment().format("YYYY-MM-DD");
      form = 'id_pago=' + id_pago + '&id_contrato=' + id_contrato + "&cuota=" + $cuota.val();
      form += "&mora=" + $mora.val() + "&monto_extra=" + $extra.val();
      form += "&total=" + $total.val() + '&descuento=' + $descuento.val() + '&razon_descuento=' +$razon.val() + '&fecha_pago=' + date ;
      form += "&tabla=discount_pagos";
      connectAndSend("process/update", true, null, null, form, Payments.getAll);
      $modal.hide();
    }

    function interactiveSum(){
      $('.payment-sumandos').on('keyup',function(){
        $cuota.val(pago['cuota'] - $descuento.val());
        var suma = Number($cuota.val()) + Number($mora.val()) + Number($extra.val());
        $total.val(Number(suma))
      })
    }
  },

  edit: function(content){
    var pago          = JSON.parse(content);
    this.id_contrato  = pago['id_contrato'];
    this.id_pago      = pago['id_pago']
    var $modal        = $('#edit-payment-modal') 
    console.log(pago)

    $modal.modal();

    $modal.on('hide.bs.modal',function(){
      $modal.find('input').val('')
    });

    $("#btn-save-edited-payment").on('click', function (e) {
      e.stopImmediatePropagation();
      swal({
          title: 'Está Seguro?',
          text: "Seguro de que quiere aplicar este descuento de " + $descuento.val() + "?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Estoy Seguro!',
          cancelButtonText: 'Cancelar'
        }).then(function(){
          applyDiscount(id_pago);
          $modal.hide();
          $modal.modal('hide');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
 
        });
    });

    // function applyDiscount(id_pago) {
    //   var date = moment().format("YYYY-MM-DD");
    //   form = 'id_pago=' + id_pago + '&id_contrato=' + id_contrato + "&cuota=" + $cuota.val();
    //   form += "&mora=" + $mora.val() + "&monto_extra=" + $extra.val();
    //   form += "&total=" + $total.val() + '&descuento=' + $descuento.val() + '&razon_descuento=' +$razon.val() + '&fecha_pago=' + date ;
    //   form += "&tabla=discount_pagos";
    //   connectAndSend("process/update", true, null, null, form, Payments.getAll);
    //   $modal.hide();
    // }

    // function interactiveSum(){
    //   $('.payment-sumandos').on('keyup',function(){
    //     $cuota.val(pago['cuota'] - $descuento.val());
    //     var suma = Number($cuota.val()) + Number($mora.val()) + Number($extra.val());
    //     $total.val(Number(suma))
    //   })
    // }
  }
  
}

var Damages = {
  add: function () {
    var form, idCliente, description;
    idCliente = $("#averias-client-id").val();
    description = $("#a-description").val();

    var is_empty = isEmpty([idCliente, description]);
    if (!is_empty) {
      form = 'id_cliente=' + idCliente + "&descripcion=" + description + "&tabla=averias";
      connectAndSend("process/add", true, initGlobalHandlers, null, form, Damages.getAll);
    } else {
       displayAlert("Revise", "LLene todos los campos por favor", "error");
    }
    $('#new-averia-modal').find('input,textarea').val("");
  },

  getAll: function () {
    var status = $("#averias-view-mode").val();
    $(".presentado").text(status);
    var form = "tabla=averias&estado=" + status;
    connectAndSend('process/getall', false, initGlobalHandlers, fillAveriasList, form, null);
  },

  update: function ($id_averia) {
    var form = "tabla=averias&id_averia=" + $id_averia;
    connectAndSend('process/update', true, initGlobalHandlers, null, form, Damages.getAll);
  }
}

var Installations = {
  getAll: function () {
    var status = $("#installations-view-mode").val();
    var form = "tabla=instalaciones&estado=" + status;
    connectAndSend('process/getall', false, initGlobalHandlers, fillInstallationsList, form, null);
  },

  update: function ($id_pago) {
    var form = "tabla=instalaciones&id_pago=" + $id_pago;
    connectAndSend('process/update', true, initGlobalHandlers, null, form, Installations.getAll);
  }
}

var Caja = {
  add: function () {
    var form, amount, description, is_empty;

    amount = $("#caja-a-amount").val();
    description = $("#caja-a-description").val();
    form = "entrada=" + amount + "&descripcion=" + description + "&tabla=caja";
    is_empty = isEmpty([amount, description]);
    if (!is_empty) {
      connectAndSend('process/add', true, null, null, form, Caja.getAll);
    } else {
      displayAlert("Revise", "LLene todos los campos por favor", "error");
    }
  },

  retire: function () {
    var form, amount, description, is_empty;

    amount = $("#caja-r-amount").val();
    description = $("#caja-r-description").val();
    form = "salida=" + amount + "&descripcion=" + description;
    is_empty = isEmpty([amount, description]);
    if (!is_empty) {
       connectAndSend('process/retire', true, null, null, form, Caja.getAll);
    } else {
      displayAlert("Revise", "LLene todos los campos por favor", "error");
    }
  },

  getAll: function () {
    var form = "tabla=caja";
    connectAndSend('process/getAll', false, null, cajaTable.refresh, form, Caja.getSaldo);
  },

  getSaldo: function () {
    var form = "tabla=caja";
    connectAndSend('process/getone', false, null, updateSaldo, form, null)
  },

  search: function () {
    var $dateSearch = $("#caja-date");
    var $userSearch = $("#caja-user");
    var date = ($dateSearch.val()) ? $dateSearch.val() : '%';
    var userId = ($userSearch.val()) ? $userSearch.val() : '%';

    var form = "tabla=caja&id_empleado=" + userId + "&fecha=" + date;
    connectAndSend('process/search', false, null, cajaTable.refresh, form, null);
  }
}

var Company = {
  update: function () {
    var form,
    companyName = $("#company-name").val(),
    companyStatement = $("#company-statement").val(),
    companyPhone1 = getVal($("#company-phone1")),
    companyDirection = $("#company-direction").val(),
    companyDescription = $("#company-description").val(),
    companyPhone2 = getVal($("#company-phone2"))

    form = 'nombre=' + companyName + '&lema=' + companyStatement + '&descripcion=' + companyDescription + "&direccion="
    form += companyDirection + "&telefono1=" + companyPhone1 + "&telefonos=" + companyPhone2 + "&tabla=empresa";
    connectAndSend('process/update', true, null, null, form, null);
  }
}

var Settings = {
  update: function () {
    var form,
    settingsCargoMora = $("#settings-mora").val(),
    settingsFechaCorte = $("#settings-fecha-corte").val(),
    settingsAperturaCaja = $("#settings-apertura-caja").val(),
    settingsPenalizacionCancelacion = $("#settings-penalizacion-cancelacion").val(),
    settingsMesesPorDefecto = $("#settings-meses-por-defecto").val(),
    settingsSplitDay = $("#settings-split-day").val();

    form = 'cargo_mora=' + settingsCargoMora + '&fecha_corte=' + settingsFechaCorte + '&apertura_caja=' + settingsAperturaCaja;
    form += '&penalizacion_cancelacion=' + settingsPenalizacionCancelacion + '&meses_por_defecto=' + settingsMesesPorDefecto;
    form += '&split_day=' + settingsSplitDay + '&tabla=settings';
    connectAndSend('process/update', true, null, null, form, null);
  }
}

var Sections = { 
  add: function() {
    swal.setDefaults({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      animation: false,
      progressSteps: ['1', '2', '3']
    })

    var steps = [{
        title: 'Nombre del sector'
      },
      'Codigo del Sector',
    ]

    swal.queue(steps).then(function (result) {
      swal.resetDefaults()
      save(result)
    });

    function save(result){
      var form;
      var nombre = result[0];
      var codigoArea = result[1],

      form = "nombre="+nombre+"&codigo_area="+codigoArea;
      form += "&tabla=secciones"
     
      return new Promise(function(resolve){
         if(connectAndSend('process/add', true, false, null, form,Sections.getAll,heavyLoad)){
           return resolve();
         }
      })
    }
  },

  getIps: function() {
    var id = $("#select-sector").val();
    if (id != null) {
      var form = "tabla=ips&id=" + id;
      connectAndSend('process/getall', false, null, Sections.reorderTable, form,null);
    }
  },

  reorderTable: function(content){
    var table = $("#t-sections");
    table.bootstrapTable('destroy');
    $("#t-sections tbody").html(content);
    table.bootstrapTable();
    table.find('tbody').css({display:"table-row-group"});
  },

  getAll: function() {
      var form = "tabla=secciones";
      connectAndSend('process/getall', false, null, fillSelect, form,heavyLoad);

    function fillSelect(content){
      $("#select-sector").html(content);
    }
  },

  init: function(){
    var $table = $("#t-sections");
    var $btnPrint = $("#btn-print-sections");
    var $selectState = $("#filter-sections");
    

    $selectState.on('change',function(){
      var filter = $(this).val()
      if(filter.includes("]"))
        filter = ['ocupado','disponible']
      console.log(filter)

      $table.bootstrapTable('filterBy',{
        estado:  filter
      })
    })

    $btnPrint.on('click', function(){
      print();
    })

  }
}

var Extras = {
  remove: function (id) {
    var id_cliente, send;
    
    id_cliente = $('#detail-client-id').val()
    form = "data=" + JSON.stringify({id: id,id_cliente: id_cliente});
    send = axios.post(BASE_URL + 'extra/delete_extra', form);
    send.then(function(res){
      var data = res.data;
      displayMessage(data.mensaje);
      extraTable.refresh(data.extras);
    });
    
    send.catch(function(error){
      console.log(error);
    });

  }
}
  var currentPage = $("title").text().split(" ");
  currentPage = currentPage[4].toLowerCase().trim();
  var ran = false;
  
  function initComponents(){
    switch (currentPage) {
      case "home":
        initClientHandlers();
        break;
      case "administrador":
        initAdminHandlers();
        break;
      case "clientes":
        initClientHandlers();
        break;
      case "servicios":
        initServicesHandlers();
        break;
      case "nuevo_contrato":
        initContractHandlers();
        Contracts.getIpList();
        break;
      case "detalles":
        initPaymentsHandlers();
        detailHandlers();
        break;
      case "contratos":
        initContractHandlers();
        initClientHandlers();
        break;
      case "cuenta":
        acountHandlers();
        break;
      case "secciones":
        sectionHandlers();
        break;
    }

    initCajaHandlers();
    initGlobalHandlers();
  }

  // **************************************************     globals handlers       *****************************
  function initGlobalHandlers() {
    var averiaClientDni = $("#a-client-dni");
    if (currentPage == 'notificaciones') {
        Generals.count_table("averias");

      $("#averias-view-mode").on('change', function (e) {
        e.stopImmediatePropagation();
        Damages.getAll();
      });

       $("#installations-view-mode").on('change', function (e) {
        e.stopImmediatePropagation();
        Installations.getAll();
      });

      $('tbody').css({display:"table-row-group"});
    }

    if (currentPage == 'contratos') {
     initContractHandlers();
    }

    $("#btn-save-averia").on('click', function (e) {
      e.stopImmediatePropagation();
      Damages.add();
    });

    averiaClientDni.on('keyup', function (e) {
      if (isComplete(averiaClientDni)) {
        var dni = getVal(averiaClientDni);
        Clients.getOne(dni,fillClientFields)
      }else{
        $('#a-client').val('');
      }
    });

    $(".btn-update-averia").on('click', function (e) {
      e.stopImmediatePropagation();
      var id_averia = $(this).parents('.averia-item').find('.code')
      id_averia = id_averia.text().trim();
      Damages.update(id_averia);
    });
    
    $(".btn-update-installation").on('click', function (e) {
      e.stopImmediatePropagation();
      var id_pago = $(this).parents('.averia-item').find('.code');
      id_pago = id_pago.text().trim();
      Installations.update(id_pago);
    });

    $("#extra-controls").on('click',function(e){
      e.stopImmediatePropagation();
      Contracts.btnExtraPressed($(this));
    });

    $("#extra-client-dni").on('keydown',function(e){
      var key = e.which;
      var dni = $(this).val()
      if(key == 13){
        Contracts.getAllOfClient(dni);
      }
    });

  }

  //***************************************************     admin handlers          ***************************** */
  function initAdminHandlers() {
    userTable.init();
    $("#btn-save-user").on('click', function (e) {
      e.stopImmediatePropagation();
      Users.add();
    });

    $("#btn-update-user").on('click', function (e) {
      e.stopImmediatePropagation();
      Users.update();
    });

    $(".delete-user").on('click', function (e) {
      e.preventDefault();
      var $row = $(this).parents("tr");
      var id = $row.find('.user-id').text().trim();
      var row = userTable.getRow(id);
      swal({
          title: 'Está Seguro?',
          text: "Desea Eliminar al Usuario " + row.nombres +" "+ row.apellidos + "?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Estoy Seguro!',
          cancelButtonText: 'Cancelar'
        }).then(function(){
           Users.delete(id);
        });
    });

    $(".edit-user").on('click', function (e) {
      e.preventDefault();
      var id  = $(this).attr('data-user-id');
      var row = userTable.getRow(id);
      

      $("#e-nickname").val(row.nick);
      $("#e-name").val(row.nombres);
      $("#e-lastname").val(row.apellidos);
      $("#e-dni").val(row.cedula);
      $("#e-type").val(row.tipo_codigo);
      $('#update-user-modal').modal();
    });

    $("#update-company-data").on('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      Company.update();
    });

    $("#btn-update-settings").on('click',function(e){
        e.preventDefault();
        Settings.update();
    });

    // some globals handlers

    $("#btn-save-averia").on('click', function (e) {
      e.stopImmediatePropagation();
      Damages.add()
    });

  }
  //***************************************************     Init caja          ***************************** */
  
  function initCajaHandlers() {
    if (currentPage == 'administrador') {
      cajaTable.init();
    }



    var btnAddMoney     = $("#btn-add-money");
    var btnRetireMoney  = $("#btn-retire-money");
    var userSearch      = $("#caja-user");
    var dateSearch      = $("#caja-date");

    btnAddMoney.on('click', function (e) {
      e.stopImmediatePropagation();
      Caja.add();
    });

    btnRetireMoney.on('click', function (e) {
      e.stopImmediatePropagation();
      Caja.retire();
    });

    dateSearch.on('change',function(e){
      e.stopImmediatePropagation();
      Caja.search();
    });

    userSearch.on('change',function(e){
      e.stopImmediatePropagation();
      Caja.search();
    });
  }

  //***************************************************  Init client Handlers      ***************************** */
  function initClientHandlers() {
    if (currentPage == 'clientes') {
      clientTable.init();
    }

    $("#btn-save-client").on('click', function (e) {
      e.stopImmediatePropagation();
      Clients.add();
    });

    $("#update-client").on('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var id = clientTable.getId();
      if (id) {
        Clients.getOne(id, Clients.receiveForEdit);
      }
    });

    $("#client-searcher").on('keyup', function (e) {
      e.stopImmediatePropagation();
      var text = $(this).val();
      Generals.search(text, "clientes", clientTable.refresh);
    });

    $("#client-searcher-newcontract").on('keyup', function (e) {
      e.stopImmediatePropagation();
      var text = $(this).val();
      if (!isEmpty([text])) {
        Generals.search(text, "clientes", clientTable.refresh);
      } else {
        clearTbody(".lobby-results");
      }
    });

    $("#delete-client").on('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var row = clientTable.getSelectedRow();
      if (row) {
        swal({
          title: 'Está Seguro?',
          text: "Desea Eliminar al(la) Cliente " + row.nombres + " " + row.apellidos + "?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Estoy Seguro!',
          cancelButtonText: 'Cancelar'
        }).then(function(){
           Generals.deleteRow(row.id, "clientes")
        });
      }
    });

  }
  //***************************************************  Init Services Handlers    ***************************** */
  function initServicesHandlers() {
    serviceTable.init();

    $("#btn-save-service").on('click', function (e) {
      e.stopImmediatePropagation();
      Services.add();
    });

    $("#delete-service").on('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var id = serviceTable.getId();
      if (id) {
        swal({
          title: 'Está Seguro?',
          text: "Desea Eliminar  el Servicio?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Estoy Seguro!',
          cancelButtonText: 'Cancelar'
        }).then(function(){
           Generals.deleteRow(id, "servicios");
        });
      }
    });

    $("#edit-service").on('click', function (e) {
      e.preventDefault();
      var row = serviceTable.getSelectedRow();

      $('#u-service-id').val(row.id);
      $('#u-service-name').val(row.nombre);
      $('#u-service-description').val(row.descripcion);
      $('#u-service-monthly-payment').val(Number(row.mensualidad.replace("RD$ ",'')));
      $('#u-service-type').val(row.tipo);
      $('#update-service-modal').modal();

    });

    $("#btn-update-service").on('click', function (e) {
      e.stopImmediatePropagation();
      Services.update();
    });

    $("#service-searcher").on('keyup', function (e) {
      e.stopImmediatePropagation();
      var text = $(this).val();
      Generals.search(text, "servicios", serviceTable.refresh,initServicesHandlers);
    });


  }
  //***************************************************  Init Contract Handlers    ***************************** */
  function initContractHandlers() {
    contractTable.init();
    Contracts.getAll();
    
    $("#btn-save-contract").on('click', function (e) {
      e.stopImmediatePropagation();
      Contracts.add();
    });

    $("#btn-add-extra").on('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      Contracts.callExtra();
    });
    var cont = 0;

    $("#contract-searcher").on('keyup', function (e) {
      e.stopImmediatePropagation();
      var text = $(this).val();
      Generals.search(text, "v_contratos", contractTable.refresh,null);
    });

    $("#btn-cancel-contract").on('click', function (e) {
      e.preventDefault();
      var row = contractTable.getSelectedRow();
      if (row) {
        $(".cancel-name").text(row.cliente);
        var $inputElement   = $(".confirmed-data");
        var $buttonToActive = $("#cancel-permanently");

        deleteValidation($inputElement,row.cliente, $buttonToActive);
        $("#cancel-print").attr("href",BASE_URL + 'process/getcancelcontract/'+ row.id_cliente + "/" + row.id);

        $("#cancel-contract-modal").modal();
        $buttonToActive.on('click', function (e) {
          e.stopImmediatePropagation();
          Contracts.cancel()
          $buttonToActive.attr('disable');
        })

        $inputElement.val('');
        $buttonToActive.attr('disabled', '');
      }else{
        swal("Debes seleccionar un contrato")
      }
    });

    $("#btn-suspend-contract").on('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
       var row = contractTable.getSelectedRow();
       if (row) {
        swal({
          title: 'Está Seguro?',
          text: "Desea Suspender el contrato de " + row.cliente +" ?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Estoy Seguro!',
          cancelButtonText: 'Cancelar'
        }).then(function(){
           Contracts.suspend(row.id);
        });
       }else{
         swal("Debe seleccionar un contrato")
       }

    });

    $("#btn-update-contract").on('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var id = contractTable.getId();
      if (id) {
        Contracts.getOne(id, Contracts.recieve);
      }
    });

    $("#select-contract-sector").on('change',function(e){
      e.stopImmediatePropagation();
      Contracts.getIpList();
    })

    $('#select-pay-until').on('change', function(e){
      e.stopImmediatePropagation();
      var $this         = $('#select-pay-until :selected');
      var contractId    = $this.attr('data-contract');
      var lastPaymentId = $(this).val();
      Payments.updateUntil(contractId,lastPaymentId);
    });

  }
  //***************************************************  Init Payments  Handlers   ***************************** */
  
  function initPaymentsHandlers() {
    paymentTable.init();
    extraTable.init();
    if (!ran) {
      Payments.getAll();
      ran = true;
    }

    $("#btn-pay").on('click', function (e) {
      e.stopImmediatePropagation();
      var id = paymentTable.getId();
      if(id) {
        Payments.update(id);
        update_mode(id);
      }else{
        // TODO: MESSAGE Select a payment
      }
    }); 

    $("#select-contract").on('change', function (e) {
      e.stopImmediatePropagation();
      Payments.getAll();
    });

    $("#btn-reconnect").on('click',function(e) {
      e.stopImmediatePropagation()
      Contracts.reconnect()
    })

    $("#payment-detail-box").collapse()

    function update_mode(id){
      var mode = $('.payment-mode.selected').text();
      var extraInfo = {id: id.toString(),module:'pagos'}
      var form = 'data='+JSON.stringify({tipo: mode})+'&extra_info='+JSON.stringify(extraInfo);

      var send = axios.post( BASE_URL + 'process/axiosupdate',form)
      send.then(function(response){
        //TODO: something whith that / algo con esto
      });
      send.catch(function(){
        console.log(error);
      });
    }
  }
  //***************************************************      detail Handlers       ***************************** */
  function detailHandlers() {
    $("#btn-save-observations").on('click', function (e) {
      e.stopImmediatePropagation();
      Payments.saveAbonos();
    });

    $('#btn-save-real-observations').on('click',function(e){
      e.stopImmediatePropagation();
      Clients.saveObservations();
    })

    detailsContractTable.init();

  }

  function acountHandlers(){
    var $userId          = $("#acount-user-id")
    var $currentPassword = $("#acount-current-password")
    var $btnUpdateUser    = $("#update-user-data");
    var $newPassword      = $("#acount-new-password");

    $("#acount-current-password").on('keyup',function(e){
      e.stopImmediatePropagation();    
      Users.confirmPassword($userId.val(),$currentPassword.val());
    });

    $btnUpdateUser.on('click',function(e){
      e.preventDefault()
      e.stopImmediatePropagation();
      Users.updatePassword($userId.val(),$currentPassword.val(),$newPassword.val())
    })
  }

  function sectionHandlers() {
    if (!ran) {
      Sections.init()
      Sections.getIps();
      ran = true;
    }

    $("#btn-add-section").on('click', function (e) {
      e.stopImmediatePropagation();
      Sections.add();
    });

     $("#select-sector").on('change', function (e) {
      e.stopImmediatePropagation();
      Sections.getIps();
    });
  }

  $(function () {
    initComponents()
  });
var ran = false;

function loginHandlers() {

  $("#send-credentials").on('click', function (e) {
    e.stopImmediatePropagation();
    Session.login();
  });

  $("#user-input").on('keydown', function (e) {
    e.stopImmediatePropagation();
    loginLibrary.sendToLogin(e)
  })

  $("#password-input").on('keydown', function (e) {
    e.stopImmediatePropagation();
    loginLibrary.sendToLogin(e)
  })

  $("a[href]").on('click', function () {
    loginLibrary.loading();
    var $this = $(this);
    try {
      var target = $this.attr('target');
      setTimeout(function () {
        $(".loader").css({
          display: "none"
        });
      }, 3000)
    }catch (error) {
      throw error
    }
  })
}

var Session = {
  login: function() {
    var user     = $("#user-input").val();
    var password = $("#password-input").val();
    var is_empty = isEmpty([user, password])
    if (!is_empty) {
      var form = 'user=' + user + '&password=' + password;
      connectAndSend('app/login', false, false, Session.processLoginData, form, null, loginLibrary.loading)
    } else {
      displayMessage(MESSAGE_ERROR + " LLene todos los campos indicados para ingresar")
    }
  },

  processLoginData: function(response) {
    if (response == true) {
      window.location.href = BASE_URL + 'app/admin/';
    } else {
      $(".loader").css({
        display: "none"
      });
      displayMessage(MESSAGE_INFO + " Usuario y Contraseña no validos")
    }
  }
}

var loginLibrary = {
  loading: function(stop) {
    if(!stop){
       $(".loader").css({
        display: "block"
        });
    }else{
      $(".loader").css({display: "none"});
    }
  },
  
  sendToLogin: function(e) {
    key = e.which
    if (key == 13) {
      Session.login();
    }
  }
}

$(function () {
  loginHandlers();
})
  function isCurrentPage(pageName){
    if(getCurrentPage() == pageName){
      return true
    }  
    return false;
  }

  function getCurrentPage(){
    var currentPage = $("title").text().split(" ");
    currentPage = currentPage[4].toLowerCase().trim();
    return currentPage;
  }

  if(isCurrentPage("cierre") || isCurrentPage("cierre2")){
    cierreCajaFunctions();
  }

  if(isCurrentPage("reportes")){
    var script = document.createElement("script");
    script.src = BASE_URL + "assets/js/min/reportes.min.js?version=4.0.22";
    $("body").append(script);
  }

  function cierreCajaFunctions(){
    var totales = {
          total1: 0,
          total5: 0,
          total10: 0,
          total20: 0,
          total25: 0,
          total50: 0,
          total100: 0,
          total200: 0,
          total500: 0,
          total1000: 0,
          total2000: 0
        }

    var gasto   = {
        'fecha': '',
        'descripcion': '',
        'monto': '',
      }
    var gastos  = [{fecha: now(),descripcion:"hola",monto: 2000, id_gasto: 1}]
    var autor   = $('#autor-cierre').text().trim()

    var appCierre = new Vue({
      el: '#app-cierre',
      data: {
        isHide: false,
        fecha: now(),
        data_cierre:{
          autor: autor,
          pagos_facturas: 0,
          pagos_extras: 0,
          pagos_efectivo: 0,
          pagos_banco: 0,
          total_ingresos: 0,
          efectivo_caja: 0,
          total_descuadre: 0,
          total_gastos: 0,
          banco: 0
        },
        conteo:totales,
        suma: 0,
        gasto: gasto,
        gastos: gastos
      },

      mounted: function() {
        this.getGastos();
        this.setIngresos();
      },

      created: function(){
        $('.will-load').css({visibility:"visible"})
      },

      filters: {
        currencyFormat: function(number){
          return CurrencyFormat(number);
        }
      },

      methods:{
        changeTotal: function(e){
          var unit = e.srcElement.attributes['data-unit'].value
          var cantidad = e.srcElement.value
          var total = cantidad * unit
          totales['total'+ unit] = cantidad * unit * 1.00    
        }, 

        addGasto: function(e) {
          var gasto = this.gasto;
          gasto.fecha = now();
          form = 'data='+ JSON.stringify(gasto);
          var send = axios.post( BASE_URL + 'caja/add_gasto',form)
          send.then(function(response){
            var data = response.data
            displayMessage(data.mensaje)
            appCierre.fillGastos(data.gastos,"normal")
            appCierre.setGastoTotal(data.total_gastos)
          });
          send.catch(function(){
            console.log(error);
          });
        },

        fillGastos: function(gastos_servidor,mode){
          if(mode == "group"){
            if(gastos_servidor != null || gastos_servidor.length > 0){
              console.log([gastos_servidor]);
              appCierre.gastos = gastos_servidor;
            }else{
              appCierre.gastos = [];
            }
          }else{
            appCierre.gastos.push(JSON.parse(gastos_servidor)[0]);
          }
        },

        setGastoTotal: function(totalGastos){
          this.data_cierre.total_gastos = totalGastos
        },

        getGasto: function(e){
          var gasto = this.gasto;
          form = 'data='+ JSON.stringify(gasto);
          connectAndSend('caja/get_gasto',false,null,appCierre.fillGastos,form,null, null);
        },

        deleteGasto: function(e){
          console.log(e);
          var caller = e.target;
          if(caller.localname == "i"){
            caller = caller.parentElement;
          }
          var id = caller.attributes['data-id'].value
          swal({
            title: 'Está Seguro?',
            text: "Seguro de que quiere eliminar este gasto?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Estoy Seguro!',
            cancelButtonText: 'Cancelar'
          }).then(function(){
            form = 'data='+ JSON.stringify({id: id, fecha:now()})
            var send = axios.post(BASE_URL + 'caja/delete_gasto',form)
            send.then(function(response){
              var data = response.data
              displayMessage(data.mensaje)
              appCierre.fillGastos(data.gastos,"group")
              appCierre.setGastoTotal(data.total_gastos) 
            });
            send.catch(function(error){

            });
          });      
        },

        getGastos: function(){
          var data = {fecha: now()}
          form = 'data='+ JSON.stringify(data)
          var send = axios.post( BASE_URL + 'caja/get_gastos',form)
          send.then(function(response){
            var data = response.data
            displayMessage(data.mensaje)
            appCierre.fillGastos(data.gastos,"group")
            appCierre.setGastoTotal(data.total_gastos)
          });
          send.catch(function(){
            console.log(error);
          })
        },

        setIngresos: function(){
          var form = 'data=' + JSON.stringify({fecha: now()})
          var self = this.data_cierre;
          var send = axios.post( BASE_URL + 'caja/get_ingresos',form)
          send.then(function(response){
            var data = response.data
            self.pagos_facturas = data.pagos_facturas;
            self.pagos_extras = data.pagos_extras;
            self.pagos_efectivo = data.pagos_efectivo;
            self.pagos_banco = data.pagos_banco;
            self.total_ingresos = parseFloat(data.pagos_facturas) + parseFloat(self.pagos_extras);
            self.total_descuadre = - self.pagos_efectivo + self.efectivo_caja;
          });
          send.catch(function(){
            console.log(error);
          })
        },

        cerrarCaja: function(){
          var self   = this;
          var cierre = this.data_cierre;
          window.cierre = cierre;
          if(cierre.total_descuadre != 0){
            swal({
              title: 'Está Seguro?',
              text: "Hay un descuadre en la caja, quiere hacer el cierre de todos modos?",
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Si',
              cancelButtonText: 'No'
            }).then(function(){
              self.cerrar(cierre)
            })
          }else{
            self.cerrar(cierre);
          }
        },

        cerrar: function(cierre){
          
          cierre.fecha = now();
          form = 'data='+ JSON.stringify(cierre);
          var send = axios.post( BASE_URL + 'caja/add_cierre',form)
          send.then(function(response){
            var data = response.data
            displayMessage(data.mensaje)
            self.isHide = true;
            appSummaryView.isHide = false;
            appSummaryView.cierre = cierre;
            $("#app-cierre").addClass('hide');
            $(".top-nav").addClass('hide');
            $("#print-view").css({visibility: "visible"})
            
          });
          send.catch(function(){
            console.log(error);
          });
        }
      },

      computed:{
        getTotal: function(e){
          var t = totales;
          var self = this.data_cierre;
          var suma = sumar([t.total1,t.total5,t.total10, t.total20, t.total25, t.total50, t.total100, t.total200, t.total500, t.total1000, t.total2000]);
          this.suma = suma;
          self.efectivo_caja = suma.toFixed(2);
          self.total_descuadre = parseFloat(-self.pagos_efectivo) + parseFloat(self.efectivo_caja);
          self.banco = parseFloat(self.pagos_banco) + parseFloat(self.pagos_efectivo) - parseFloat(self.total_gastos) + parseFloat(self.total_descuadre)
          return this.suma;
        },

        decimals: function(){
          var fields = ["pagos_facturas","pagos_extra","pagos_efectivo","pagos_banco","total_ingresos","efectivo_caja","total_descuadre","total_gasto","banco"];
          fields.forEach(function(field) {
            this.data_cierre[field] = this.data_cierre[field].toFixed(2)
          }, this);
        }
      }
    })

    window.appCierre = appCierre;
    function sumar (valores){
      var suma = 0;
      for (var i = 0; i < valores.length; i++) {
        suma += parseFloat(valores[i]); 
      }
      return suma;
    }

    function now(){
      return moment().format("YYYY-MM-DD");
    }
  }
  Vue.component('summary-print-view',{
    template: '\
    <div class="print-container">\
      <div class="__header">\
      <h2 class="__title t-center"> {{title}}</h2>\
      </div>\
      <div class="__body">\
      <printeable></printeable>\
      </div>\
    <div>\
    \
    ',
    props:['somevalue'],
    methods:{
      goBack: function(){
        appSummaryView.isHide = true;
        window.appCierre.isHide = false;
        self.isHide = true;
        $(".top-nav").removeClass('hide');
        $("#app-cierre").removeClass('hide');
      }
    },
    data: function(){
      return {
        back: {link:"somelink",text:"volver a cierre"},
        foward: {link: BASE_URL + "app/logout",text:"cerrar session"},
        title:"Resumen de cierre de hoy",

      }
    }
  })

  var appSummaryView = new Vue({
    el: "#print-view",
    data: {
      isHide: true,
      back: {link:"somelink",text:"volver a cierre"},
      foward: {link: BASE_URL + "app/logout",text:"cerrar session"},
      cierre:{
          autor: '',
          pagos_facturas: 0,
          pagos_extras: 0,
          pagos_efectivo: 0,
          pagos_banco: 0,
          total_ingresos: 0,
          efectivo_caja: 0,
          total_descuadre: 0,
          total_gastos: 0,
          banco: 0
        }
    },
    filters: {
      currencyFormat: function(number){
        return "RD$ "+ CurrencyFormat(number);
      },

      spanishDateFormat: function(date){
        moment.locale('es-DO');
        return moment(date).format('dddd DD [de] MMMM [del] YYYY')
      }
    },
    methods:{
      goBack: function(){
        appSummaryView.isHide = true;
        window.appCierre.isHide = false;
        self.isHide = true;
        $(".top-nav").removeClass('hide');
        $("#app-cierre").removeClass('hide');
      },
      print: function(){
        print()
      }
    }
  })
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
    secondControls: {
      hide: true
    }
  },
  filters: {

  },
  methods:{
    putInstance: function(){

    },
    goBack: function () {
      extraTable.el.parents(".bootstrap-table").removeClass("hide");
      appPagoExtra.visible = false
      appPagoExtra.extra = {concepto: ''}
    },

    generatePayment: function () {
      var form = 'data=' + JSON.stringify(this.extra);
      var send = axios.post( BASE_URL + 'extra/generate_extra_payment',form);
      send.then(function(res){
        var data = res.data;
        displayMessage(data.mensaje);
        selectExtraPayment.html(data.pagos);
      });
      send.catch(function(){
        
      })
    },

    getPayment: function (id_pago) {
      var form = "data=" + JSON.stringify({id_pago: id_pago});
      var self = this
      var send = axios.post( BASE_URL + 'extra/get_payment',form);
      send.then(function(res){
        var data = res.data 
        self.recibo = data.recibo
      })
    },

    applyPayment: function () {
      var self = this
      var recibo = this.recibo
      var info = {
        id_extra: recibo.id_extra,
        id_pago: recibo.id_pago
      }

      var data = {
        concepto: recibo.concepto, 
        detalles_extra: recibo.detalles_extra,
        fecha_pago: recibo.fecha_pago,
        cuota: recibo.cuota,
        total: recibo.cuota,
        estado: 'pagado',
        tipo: recibo.tipo,
        generado: true
      }

      var form = 'data='+ JSON.stringify(data) + '&info='+ JSON.stringify(info)
      var send = axios.post(BASE_URL + 'extra/apply_payment',form)
      send.then(function (res) {
        var data = res.data
        displayMessage(data.mensaje);
        extraTable.refresh(data.extras);
        self.goBack();
      })
      send.catch(function(error){
        console.log(error);
      })
    },

    getPayments: function (id_extra) {
      var form = "data="+ JSON.stringify({id_extra: id_extra})
      var send = axios.post(BASE_URL + 'extra/get_extra_payment_of', form)
      send.then(function(res){
        var data = res.data;
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
        extraTable.refresh(data.extras);
        self.getPayments(extra.id_extra);
        extraTable.el.parents(".bootstrap-table").addClass("hide");
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

  appPagoExtra.getPayments(row.id_extra);
})

var selectExtraPayment = $("#select-extra-payment");
selectExtraPayment.on('change',function(){
  var id_pago = selectExtraPayment.val()
  appPagoExtra.getPayment(id_pago)
})
/*! AdminLTE app.js
* ================
* Main JS application file for AdminLTE v2. This file
* should be included in all pages. It controls some layout
* options and implements exclusive AdminLTE plugins.
*
* @Author  Almsaeed Studio
* @Support <https://www.almsaeedstudio.com>
* @Email   <abdullah@almsaeedstudio.com>
* @version 2.4.0
* @repository git://github.com/almasaeed2010/AdminLTE.git
* @license MIT <http://opensource.org/licenses/MIT>
*/
if("undefined"==typeof jQuery)throw new Error("AdminLTE requires jQuery");+function(a){"use strict";function b(b){return this.each(function(){var e=a(this),f=e.data(c);if(!f){var h=a.extend({},d,e.data(),"object"==typeof b&&b);e.data(c,f=new g(h))}if("string"==typeof b){if(void 0===f[b])throw new Error("No method named "+b);f[b]()}})}var c="lte.layout",d={slimscroll:!0,resetHeight:!0},e={wrapper:".wrapper",contentWrapper:".content-wrapper",layoutBoxed:".layout-boxed",mainFooter:".main-footer",mainHeader:".main-header",sidebar:".sidebar",controlSidebar:".control-sidebar",fixed:".fixed",sidebarMenu:".sidebar-menu",logo:".main-header .logo"},f={fixed:"fixed",holdTransition:"hold-transition"},g=function(a){this.options=a,this.bindedResize=!1,this.activate()};g.prototype.activate=function(){this.fix(),this.fixSidebar(),a("body").removeClass(f.holdTransition),this.options.resetHeight&&a("body, html, "+e.wrapper).css({height:"auto","min-height":"100%"}),this.bindedResize||(a(window).resize(function(){this.fix(),this.fixSidebar(),a(e.logo+", "+e.sidebar).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(){this.fix(),this.fixSidebar()}.bind(this))}.bind(this)),this.bindedResize=!0),a(e.sidebarMenu).on("expanded.tree",function(){this.fix(),this.fixSidebar()}.bind(this)),a(e.sidebarMenu).on("collapsed.tree",function(){this.fix(),this.fixSidebar()}.bind(this))},g.prototype.fix=function(){a(e.layoutBoxed+" > "+e.wrapper).css("overflow","hidden");var b=a(e.mainFooter).outerHeight()||0,c=a(e.mainHeader).outerHeight()+b,d=a(window).height(),g=a(e.sidebar).height()||0;if(a("body").hasClass(f.fixed))a(e.contentWrapper).css("min-height",d-b);else{var h;d>=g?(a(e.contentWrapper).css("min-height",d-c),h=d-c):(a(e.contentWrapper).css("min-height",g),h=g);var i=a(e.controlSidebar);void 0!==i&&i.height()>h&&a(e.contentWrapper).css("min-height",i.height())}},g.prototype.fixSidebar=function(){if(!a("body").hasClass(f.fixed))return void(void 0!==a.fn.slimScroll&&a(e.sidebar).slimScroll({destroy:!0}).height("auto"));this.options.slimscroll&&void 0!==a.fn.slimScroll&&(a(e.sidebar).slimScroll({destroy:!0}).height("auto"),a(e.sidebar).slimScroll({height:a(window).height()-a(e.mainHeader).height()+"px",color:"rgba(0,0,0,0.2)",size:"3px"}))};var h=a.fn.layout;a.fn.layout=b,a.fn.layout.Constuctor=g,a.fn.layout.noConflict=function(){return a.fn.layout=h,this},a(window).on("load",function(){b.call(a("body"))})}(jQuery),function(a){"use strict";function b(b){return this.each(function(){var e=a(this),f=e.data(c);if(!f){var g=a.extend({},d,e.data(),"object"==typeof b&&b);e.data(c,f=new h(g))}"toggle"==b&&f.toggle()})}var c="lte.pushmenu",d={collapseScreenSize:767,expandOnHover:!1,expandTransitionDelay:200},e={collapsed:".sidebar-collapse",open:".sidebar-open",mainSidebar:".main-sidebar",contentWrapper:".content-wrapper",searchInput:".sidebar-form .form-control",button:'[data-toggle="push-menu"]',mini:".sidebar-mini",expanded:".sidebar-expanded-on-hover",layoutFixed:".fixed"},f={collapsed:"sidebar-collapse",open:"sidebar-open",mini:"sidebar-mini",expanded:"sidebar-expanded-on-hover",expandFeature:"sidebar-mini-expand-feature",layoutFixed:"fixed"},g={expanded:"expanded.pushMenu",collapsed:"collapsed.pushMenu"},h=function(a){this.options=a,this.init()};h.prototype.init=function(){(this.options.expandOnHover||a("body").is(e.mini+e.layoutFixed))&&(this.expandOnHover(),a("body").addClass(f.expandFeature)),a(e.contentWrapper).click(function(){a(window).width()<=this.options.collapseScreenSize&&a("body").hasClass(f.open)&&this.close()}.bind(this)),a(e.searchInput).click(function(a){a.stopPropagation()})},h.prototype.toggle=function(){var b=a(window).width(),c=!a("body").hasClass(f.collapsed);b<=this.options.collapseScreenSize&&(c=a("body").hasClass(f.open)),c?this.close():this.open()},h.prototype.open=function(){a(window).width()>this.options.collapseScreenSize?a("body").removeClass(f.collapsed).trigger(a.Event(g.expanded)):a("body").addClass(f.open).trigger(a.Event(g.expanded))},h.prototype.close=function(){a(window).width()>this.options.collapseScreenSize?a("body").addClass(f.collapsed).trigger(a.Event(g.collapsed)):a("body").removeClass(f.open+" "+f.collapsed).trigger(a.Event(g.collapsed))},h.prototype.expandOnHover=function(){a(e.mainSidebar).hover(function(){a("body").is(e.mini+e.collapsed)&&a(window).width()>this.options.collapseScreenSize&&this.expand()}.bind(this),function(){a("body").is(e.expanded)&&this.collapse()}.bind(this))},h.prototype.expand=function(){setTimeout(function(){a("body").removeClass(f.collapsed).addClass(f.expanded)},this.options.expandTransitionDelay)},h.prototype.collapse=function(){setTimeout(function(){a("body").removeClass(f.expanded).addClass(f.collapsed)},this.options.expandTransitionDelay)};var i=a.fn.pushMenu;a.fn.pushMenu=b,a.fn.pushMenu.Constructor=h,a.fn.pushMenu.noConflict=function(){return a.fn.pushMenu=i,this},a(document).on("click",e.button,function(c){c.preventDefault(),b.call(a(this),"toggle")}),a(window).on("load",function(){b.call(a(e.button))})}(jQuery),function(a){"use strict";function b(b){return this.each(function(){var e=a(this);if(!e.data(c)){var f=a.extend({},d,e.data(),"object"==typeof b&&b);e.data(c,new h(e,f))}})}var c="lte.tree",d={animationSpeed:500,accordion:!0,followLink:!1,trigger:".treeview a"},e={tree:".tree",treeview:".treeview",treeviewMenu:".treeview-menu",open:".menu-open, .active",li:"li",data:'[data-widget="tree"]',active:".active"},f={open:"menu-open",tree:"tree"},g={collapsed:"collapsed.tree",expanded:"expanded.tree"},h=function(b,c){this.element=b,this.options=c,a(this.element).addClass(f.tree),a(e.treeview+e.active,this.element).addClass(f.open),this._setUpListeners()};h.prototype.toggle=function(a,b){var c=a.next(e.treeviewMenu),d=a.parent(),g=d.hasClass(f.open);d.is(e.treeview)&&(this.options.followLink&&"#"!=a.attr("href")||b.preventDefault(),g?this.collapse(c,d):this.expand(c,d))},h.prototype.expand=function(b,c){var d=a.Event(g.expanded);if(this.options.accordion){var h=c.siblings(e.open),i=h.children(e.treeviewMenu);this.collapse(i,h)}c.addClass(f.open),b.slideDown(this.options.animationSpeed,function(){a(this.element).trigger(d)}.bind(this))},h.prototype.collapse=function(b,c){var d=a.Event(g.collapsed);b.find(e.open).removeClass(f.open),c.removeClass(f.open),b.slideUp(this.options.animationSpeed,function(){b.find(e.open+" > "+e.treeview).slideUp(),a(this.element).trigger(d)}.bind(this))},h.prototype._setUpListeners=function(){var b=this;a(this.element).on("click",this.options.trigger,function(c){b.toggle(a(this),c)})};var i=a.fn.tree;a.fn.tree=b,a.fn.tree.Constructor=h,a.fn.tree.noConflict=function(){return a.fn.tree=i,this},a(window).on("load",function(){a(e.data).each(function(){b.call(a(this))})})}(jQuery),function(a){"use strict";function b(b){return this.each(function(){var e=a(this),f=e.data(c);if(!f){var g=a.extend({},d,e.data(),"object"==typeof b&&b);e.data(c,f=new h(e,g))}"string"==typeof b&&f.toggle()})}var c="lte.controlsidebar",d={slide:!0},e={sidebar:".control-sidebar",data:'[data-toggle="control-sidebar"]',open:".control-sidebar-open",bg:".control-sidebar-bg",wrapper:".wrapper",content:".content-wrapper",boxed:".layout-boxed"},f={open:"control-sidebar-open",fixed:"fixed"},g={collapsed:"collapsed.controlsidebar",expanded:"expanded.controlsidebar"},h=function(a,b){this.element=a,this.options=b,this.hasBindedResize=!1,this.init()};h.prototype.init=function(){a(this.element).is(e.data)||a(this).on("click",this.toggle),this.fix(),a(window).resize(function(){this.fix()}.bind(this))},h.prototype.toggle=function(b){b&&b.preventDefault(),this.fix(),a(e.sidebar).is(e.open)||a("body").is(e.open)?this.collapse():this.expand()},h.prototype.expand=function(){this.options.slide?a(e.sidebar).addClass(f.open):a("body").addClass(f.open),a(this.element).trigger(a.Event(g.expanded))},h.prototype.collapse=function(){a("body, "+e.sidebar).removeClass(f.open),a(this.element).trigger(a.Event(g.collapsed))},h.prototype.fix=function(){a("body").is(e.boxed)&&this._fixForBoxed(a(e.bg))},h.prototype._fixForBoxed=function(b){b.css({position:"absolute",height:a(e.wrapper).height()})};var i=a.fn.controlSidebar;a.fn.controlSidebar=b,a.fn.controlSidebar.Constructor=h,a.fn.controlSidebar.noConflict=function(){return a.fn.controlSidebar=i,this},a(document).on("click",e.data,function(c){c&&c.preventDefault(),b.call(a(this),"toggle")})}(jQuery),function(a){"use strict";function b(b){return this.each(function(){var e=a(this),f=e.data(c);if(!f){var g=a.extend({},d,e.data(),"object"==typeof b&&b);e.data(c,f=new h(e,g))}if("string"==typeof b){if(void 0===f[b])throw new Error("No method named "+b);f[b]()}})}var c="lte.boxwidget",d={animationSpeed:500,collapseTrigger:'[data-widget="collapse"]',removeTrigger:'[data-widget="remove"]',collapseIcon:"fa-minus",expandIcon:"fa-plus",removeIcon:"fa-times"},e={data:".box",collapsed:".collapsed-box",body:".box-body",footer:".box-footer",tools:".box-tools"},f={collapsed:"collapsed-box"},g={collapsed:"collapsed.boxwidget",expanded:"expanded.boxwidget",removed:"removed.boxwidget"},h=function(a,b){this.element=a,this.options=b,this._setUpListeners()};h.prototype.toggle=function(){a(this.element).is(e.collapsed)?this.expand():this.collapse()},h.prototype.expand=function(){var b=a.Event(g.expanded),c=this.options.collapseIcon,d=this.options.expandIcon;a(this.element).removeClass(f.collapsed),a(this.element).find(e.tools).find("."+d).removeClass(d).addClass(c),a(this.element).find(e.body+", "+e.footer).slideDown(this.options.animationSpeed,function(){a(this.element).trigger(b)}.bind(this))},h.prototype.collapse=function(){var b=a.Event(g.collapsed),c=this.options.collapseIcon,d=this.options.expandIcon;a(this.element).find(e.tools).find("."+c).removeClass(c).addClass(d),a(this.element).find(e.body+", "+e.footer).slideUp(this.options.animationSpeed,function(){a(this.element).addClass(f.collapsed),a(this.element).trigger(b)}.bind(this))},h.prototype.remove=function(){var b=a.Event(g.removed);a(this.element).slideUp(this.options.animationSpeed,function(){a(this.element).trigger(b),a(this.element).remove()}.bind(this))},h.prototype._setUpListeners=function(){var b=this;a(this.element).on("click",this.options.collapseTrigger,function(a){a&&a.preventDefault(),b.toggle()}),a(this.element).on("click",this.options.removeTrigger,function(a){a&&a.preventDefault(),b.remove()})};var i=a.fn.boxWidget;a.fn.boxWidget=b,a.fn.boxWidget.Constructor=h,a.fn.boxWidget.noConflict=function(){return a.fn.boxWidget=i,this},a(window).on("load",function(){a(e.data).each(function(){b.call(a(this))})})}(jQuery),function(a){"use strict";function b(b){return this.each(function(){var e=a(this),f=e.data(c);if(!f){var h=a.extend({},d,e.data(),"object"==typeof b&&b);e.data(c,f=new g(e,h))}if("string"==typeof f){if(void 0===f[b])throw new Error("No method named "+b);f[b]()}})}var c="lte.todolist",d={iCheck:!1,onCheck:function(){},onUnCheck:function(){}},e={data:'[data-widget="todo-list"]'},f={done:"done"},g=function(a,b){this.element=a,this.options=b,this._setUpListeners()};g.prototype.toggle=function(a){if(a.parents(e.li).first().toggleClass(f.done),!a.prop("checked"))return void this.unCheck(a);this.check(a)},g.prototype.check=function(a){this.options.onCheck.call(a)},g.prototype.unCheck=function(a){this.options.onUnCheck.call(a)},g.prototype._setUpListeners=function(){var b=this;a(this.element).on("change ifChanged","input:checkbox",function(){b.toggle(a(this))})};var h=a.fn.todoList;a.fn.todoList=b,a.fn.todoList.Constructor=g,a.fn.todoList.noConflict=function(){return a.fn.todoList=h,this},a(window).on("load",function(){a(e.data).each(function(){b.call(a(this))})})}(jQuery),function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data(c);e||d.data(c,e=new f(d)),"string"==typeof b&&e.toggle(d)})}var c="lte.directchat",d={data:'[data-widget="chat-pane-toggle"]',box:".direct-chat"},e={open:"direct-chat-contacts-open"},f=function(a){this.element=a};f.prototype.toggle=function(a){a.parents(d.box).first().toggleClass(e.open)};var g=a.fn.directChat;a.fn.directChat=b,a.fn.directChat.Constructor=f,a.fn.directChat.noConflict=function(){return a.fn.directChat=g,this},a(document).on("click",d.data,function(c){c&&c.preventDefault(),b.call(a(this),"toggle")})}(jQuery);
/**
* @license Input Mask plugin for jquery
* http://github.com/RobinHerbots/jquery.inputmask
* Copyright (c) 2010 - 2014 Robin Herbots
* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
* Version: 0.0.0
*/
(function ($) {
    if ($.fn.inputmask === undefined) {
        //helper functions    
        function isInputEventSupported(eventName) {
            var el = document.createElement('input'),
            eventName = 'on' + eventName,
            isSupported = (eventName in el);
            if (!isSupported) {
                el.setAttribute(eventName, 'return;');
                isSupported = typeof el[eventName] == 'function';
            }
            el = null;
            return isSupported;
        }
        function resolveAlias(aliasStr, options, opts) {
            var aliasDefinition = opts.aliases[aliasStr];
            if (aliasDefinition) {
                if (aliasDefinition.alias) resolveAlias(aliasDefinition.alias, undefined, opts); //alias is another alias
                $.extend(true, opts, aliasDefinition);  //merge alias definition in the options
                $.extend(true, opts, options);  //reapply extra given options
                return true;
            }
            return false;
        }
        function generateMaskSets(opts) {
            var ms = [];
            var genmasks = []; //used to keep track of the masks that where processed, to avoid duplicates
            function getMaskTemplate(mask) {
                if (opts.numericInput) {
                    mask = mask.split('').reverse().join('');
                }
                var escaped = false, outCount = 0, greedy = opts.greedy, repeat = opts.repeat;
                if (repeat == "*") greedy = false;
                //if (greedy == true && opts.placeholder == "") opts.placeholder = " ";
                if (mask.length == 1 && greedy == false && repeat != 0) { opts.placeholder = ""; } //hide placeholder with single non-greedy mask
                var singleMask = $.map(mask.split(""), function (element, index) {
                    var outElem = [];
                    if (element == opts.escapeChar) {
                        escaped = true;
                    }
                    else if ((element != opts.optionalmarker.start && element != opts.optionalmarker.end) || escaped) {
                        var maskdef = opts.definitions[element];
                        if (maskdef && !escaped) {
                            for (var i = 0; i < maskdef.cardinality; i++) {
                                outElem.push(opts.placeholder.charAt((outCount + i) % opts.placeholder.length));
                            }
                        } else {
                            outElem.push(element);
                            escaped = false;
                        }
                        outCount += outElem.length;
                        return outElem;
                    }
                });

                //allocate repetitions
                var repeatedMask = singleMask.slice();
                for (var i = 1; i < repeat && greedy; i++) {
                    repeatedMask = repeatedMask.concat(singleMask.slice());
                }

                return { "mask": repeatedMask, "repeat": repeat, "greedy": greedy };
            }
            //test definition => {fn: RegExp/function, cardinality: int, optionality: bool, newBlockMarker: bool, offset: int, casing: null/upper/lower, def: definitionSymbol}
            function getTestingChain(mask) {
                if (opts.numericInput) {
                    mask = mask.split('').reverse().join('');
                }
                var isOptional = false, escaped = false;
                var newBlockMarker = false; //indicates wheter the begin/ending of a block should be indicated

                return $.map(mask.split(""), function (element, index) {
                    var outElem = [];

                    if (element == opts.escapeChar) {
                        escaped = true;
                    } else if (element == opts.optionalmarker.start && !escaped) {
                        isOptional = true;
                        newBlockMarker = true;
                    }
                    else if (element == opts.optionalmarker.end && !escaped) {
                        isOptional = false;
                        newBlockMarker = true;
                    }
                    else {
                        var maskdef = opts.definitions[element];
                        if (maskdef && !escaped) {
                            var prevalidators = maskdef["prevalidator"], prevalidatorsL = prevalidators ? prevalidators.length : 0;
                            for (var i = 1; i < maskdef.cardinality; i++) {
                                var prevalidator = prevalidatorsL >= i ? prevalidators[i - 1] : [], validator = prevalidator["validator"], cardinality = prevalidator["cardinality"];
                                outElem.push({ fn: validator ? typeof validator == 'string' ? new RegExp(validator) : new function () { this.test = validator; } : new RegExp("."), cardinality: cardinality ? cardinality : 1, optionality: isOptional, newBlockMarker: isOptional == true ? newBlockMarker : false, offset: 0, casing: maskdef["casing"], def: maskdef["definitionSymbol"] || element });
                                if (isOptional == true) //reset newBlockMarker
                                    newBlockMarker = false;
                            }
                            outElem.push({ fn: maskdef.validator ? typeof maskdef.validator == 'string' ? new RegExp(maskdef.validator) : new function () { this.test = maskdef.validator; } : new RegExp("."), cardinality: maskdef.cardinality, optionality: isOptional, newBlockMarker: newBlockMarker, offset: 0, casing: maskdef["casing"], def: maskdef["definitionSymbol"] || element });
                        } else {
                            outElem.push({ fn: null, cardinality: 0, optionality: isOptional, newBlockMarker: newBlockMarker, offset: 0, casing: null, def: element });
                            escaped = false;
                        }
                        //reset newBlockMarker
                        newBlockMarker = false;
                        return outElem;
                    }
                });
            }
            function markOptional(maskPart) { //needed for the clearOptionalTail functionality
                return opts.optionalmarker.start + maskPart + opts.optionalmarker.end;
            }
            function splitFirstOptionalEndPart(maskPart) {
                var optionalStartMarkers = 0, optionalEndMarkers = 0, mpl = maskPart.length;
                for (var i = 0; i < mpl; i++) {
                    if (maskPart.charAt(i) == opts.optionalmarker.start) {
                        optionalStartMarkers++;
                    }
                    if (maskPart.charAt(i) == opts.optionalmarker.end) {
                        optionalEndMarkers++;
                    }
                    if (optionalStartMarkers > 0 && optionalStartMarkers == optionalEndMarkers)
                        break;
                }
                var maskParts = [maskPart.substring(0, i)];
                if (i < mpl) {
                    maskParts.push(maskPart.substring(i + 1, mpl));
                }
                return maskParts;
            }
            function splitFirstOptionalStartPart(maskPart) {
                var mpl = maskPart.length;
                for (var i = 0; i < mpl; i++) {
                    if (maskPart.charAt(i) == opts.optionalmarker.start) {
                        break;
                    }
                }
                var maskParts = [maskPart.substring(0, i)];
                if (i < mpl) {
                    maskParts.push(maskPart.substring(i + 1, mpl));
                }
                return maskParts;
            }
            function generateMask(maskPrefix, maskPart, metadata) {
                var maskParts = splitFirstOptionalEndPart(maskPart);
                var newMask, maskTemplate;

                var masks = splitFirstOptionalStartPart(maskParts[0]);
                if (masks.length > 1) {
                    newMask = maskPrefix + masks[0] + markOptional(masks[1]) + (maskParts.length > 1 ? maskParts[1] : "");
                    if ($.inArray(newMask, genmasks) == -1 && newMask != "") {
                        genmasks.push(newMask);
                        maskTemplate = getMaskTemplate(newMask);
                        ms.push({
                            "mask": newMask,
                            "_buffer": maskTemplate["mask"],
                            "buffer": maskTemplate["mask"].slice(),
                            "tests": getTestingChain(newMask),
                            "lastValidPosition": -1,
                            "greedy": maskTemplate["greedy"],
                            "repeat": maskTemplate["repeat"],
                            "metadata": metadata
                        });
                    }
                    newMask = maskPrefix + masks[0] + (maskParts.length > 1 ? maskParts[1] : "");
                    if ($.inArray(newMask, genmasks) == -1 && newMask != "") {
                        genmasks.push(newMask);
                        maskTemplate = getMaskTemplate(newMask);
                        ms.push({
                            "mask": newMask,
                            "_buffer": maskTemplate["mask"],
                            "buffer": maskTemplate["mask"].slice(),
                            "tests": getTestingChain(newMask),
                            "lastValidPosition": -1,
                            "greedy": maskTemplate["greedy"],
                            "repeat": maskTemplate["repeat"],
                            "metadata": metadata
                        });
                    }
                    if (splitFirstOptionalStartPart(masks[1]).length > 1) { //optional contains another optional
                        generateMask(maskPrefix + masks[0], masks[1] + maskParts[1], metadata);
                    }
                    if (maskParts.length > 1 && splitFirstOptionalStartPart(maskParts[1]).length > 1) {
                        generateMask(maskPrefix + masks[0] + markOptional(masks[1]), maskParts[1], metadata);
                        generateMask(maskPrefix + masks[0], maskParts[1], metadata);
                    }
                }
                else {
                    newMask = maskPrefix + maskParts;
                    if ($.inArray(newMask, genmasks) == -1 && newMask != "") {
                        genmasks.push(newMask);
                        maskTemplate = getMaskTemplate(newMask);
                        ms.push({
                            "mask": newMask,
                            "_buffer": maskTemplate["mask"],
                            "buffer": maskTemplate["mask"].slice(),
                            "tests": getTestingChain(newMask),
                            "lastValidPosition": -1,
                            "greedy": maskTemplate["greedy"],
                            "repeat": maskTemplate["repeat"],
                            "metadata": metadata
                        });
                    }
                }

            }

            if ($.isFunction(opts.mask)) { //allow mask to be a preprocessing fn - should return a valid mask
                opts.mask = opts.mask.call(this, opts);
            }
            if ($.isArray(opts.mask)) {
                $.each(opts.mask, function (ndx, msk) {
                    if (msk["mask"] != undefined) {
                        generateMask("", msk["mask"].toString(), msk);
                    } else
                        generateMask("", msk.toString());
                });
            } else generateMask("", opts.mask.toString());

            return opts.greedy ? ms : ms.sort(function (a, b) { return a["mask"].length - b["mask"].length; });
        }

        var msie10 = navigator.userAgent.match(new RegExp("msie 10", "i")) !== null,
            iphone = navigator.userAgent.match(new RegExp("iphone", "i")) !== null,
            android = navigator.userAgent.match(new RegExp("android.*safari.*", "i")) !== null,
            androidchrome = navigator.userAgent.match(new RegExp("android.*chrome.*", "i")) !== null,
            pasteEvent = isInputEventSupported('paste') ? 'paste' : isInputEventSupported('input') ? 'input' : "propertychange";


        //masking scope
        //actionObj definition see below
        function maskScope(masksets, activeMasksetIndex, opts, actionObj) {
            var isRTL = false,
                valueOnFocus = getActiveBuffer().join(''),
                $el, chromeValueOnInput,
                skipKeyPressEvent = false, //Safari 5.1.x - modal dialog fires keypress twice workaround
                skipInputEvent = false, //skip when triggered from within inputmask
                ignorable = false;


            //maskset helperfunctions

            function getActiveMaskSet() {
                return masksets[activeMasksetIndex];
            }

            function getActiveTests() {
                return getActiveMaskSet()['tests'];
            }

            function getActiveBufferTemplate() {
                return getActiveMaskSet()['_buffer'];
            }

            function getActiveBuffer() {
                return getActiveMaskSet()['buffer'];
            }

            function isValid(pos, c, strict) { //strict true ~ no correction or autofill
                strict = strict === true; //always set a value to strict to prevent possible strange behavior in the extensions 

                function _isValid(position, activeMaskset, c, strict) {
                    var testPos = determineTestPosition(position), loopend = c ? 1 : 0, chrs = '', buffer = activeMaskset["buffer"];
                    for (var i = activeMaskset['tests'][testPos].cardinality; i > loopend; i--) {
                        chrs += getBufferElement(buffer, testPos - (i - 1));
                    }

                    if (c) {
                        chrs += c;
                    }

                    //return is false or a json object => { pos: ??, c: ??} or true
                    return activeMaskset['tests'][testPos].fn != null ?
                        activeMaskset['tests'][testPos].fn.test(chrs, buffer, position, strict, opts)
                        : (c == getBufferElement(activeMaskset['_buffer'], position, true) || c == opts.skipOptionalPartCharacter) ?
                            { "refresh": true, c: getBufferElement(activeMaskset['_buffer'], position, true), pos: position }
                            : false;
                }

                function PostProcessResults(maskForwards, results) {
                    var hasValidActual = false;
                    $.each(results, function (ndx, rslt) {
                        hasValidActual = $.inArray(rslt["activeMasksetIndex"], maskForwards) == -1 && rslt["result"] !== false;
                        if (hasValidActual) return false;
                    });
                    if (hasValidActual) { //strip maskforwards
                        results = $.map(results, function (rslt, ndx) {
                            if ($.inArray(rslt["activeMasksetIndex"], maskForwards) == -1) {
                                return rslt;
                            } else {
                                masksets[rslt["activeMasksetIndex"]]["lastValidPosition"] = actualLVP;
                            }
                        });
                    } else { //keep maskforwards with the least forward
                        var lowestPos = -1, lowestIndex = -1, rsltValid;
                        $.each(results, function (ndx, rslt) {
                            if ($.inArray(rslt["activeMasksetIndex"], maskForwards) != -1 && rslt["result"] !== false & (lowestPos == -1 || lowestPos > rslt["result"]["pos"])) {
                                lowestPos = rslt["result"]["pos"];
                                lowestIndex = rslt["activeMasksetIndex"];
                            }
                        });
                        results = $.map(results, function (rslt, ndx) {
                            if ($.inArray(rslt["activeMasksetIndex"], maskForwards) != -1) {
                                if (rslt["result"]["pos"] == lowestPos) {
                                    return rslt;
                                } else if (rslt["result"] !== false) {
                                    for (var i = pos; i < lowestPos; i++) {
                                        rsltValid = _isValid(i, masksets[rslt["activeMasksetIndex"]], masksets[lowestIndex]["buffer"][i], true);
                                        if (rsltValid === false) {
                                            masksets[rslt["activeMasksetIndex"]]["lastValidPosition"] = lowestPos - 1;
                                            break;
                                        } else {
                                            setBufferElement(masksets[rslt["activeMasksetIndex"]]["buffer"], i, masksets[lowestIndex]["buffer"][i], true);
                                            masksets[rslt["activeMasksetIndex"]]["lastValidPosition"] = i;
                                        }
                                    }
                                    //also check check for the lowestpos with the new input
                                    rsltValid = _isValid(lowestPos, masksets[rslt["activeMasksetIndex"]], c, true);
                                    if (rsltValid !== false) {
                                        setBufferElement(masksets[rslt["activeMasksetIndex"]]["buffer"], lowestPos, c, true);
                                        masksets[rslt["activeMasksetIndex"]]["lastValidPosition"] = lowestPos;
                                    }
                                    //console.log("ndx " + rslt["activeMasksetIndex"] + " validate " + masksets[rslt["activeMasksetIndex"]]["buffer"].join('') + " lv " + masksets[rslt["activeMasksetIndex"]]['lastValidPosition']);
                                    return rslt;
                                }
                            }
                        });
                    }
                    return results;
                }

                if (strict) {
                    var result = _isValid(pos, getActiveMaskSet(), c, strict); //only check validity in current mask when validating strict
                    if (result === true) {
                        result = { "pos": pos }; //always take a possible corrected maskposition into account
                    }
                    return result;
                }

                var results = [], result = false, currentActiveMasksetIndex = activeMasksetIndex,
                    actualBuffer = getActiveBuffer().slice(), actualLVP = getActiveMaskSet()["lastValidPosition"],
                    actualPrevious = seekPrevious(pos),
                    maskForwards = [];
                $.each(masksets, function (index, value) {
                    if (typeof (value) == "object") {
                        activeMasksetIndex = index;

                        var maskPos = pos;
                        var lvp = getActiveMaskSet()['lastValidPosition'],
                            rsltValid;
                        if (lvp == actualLVP) {
                            if ((maskPos - actualLVP) > 1) {
                                for (var i = lvp == -1 ? 0 : lvp; i < maskPos; i++) {
                                    rsltValid = _isValid(i, getActiveMaskSet(), actualBuffer[i], true);
                                    if (rsltValid === false) {
                                        break;
                                    } else {
                                        setBufferElement(getActiveBuffer(), i, actualBuffer[i], true);
                                        if (rsltValid === true) {
                                            rsltValid = { "pos": i }; //always take a possible corrected maskposition into account
                                        }
                                        var newValidPosition = rsltValid.pos || i;
                                        if (getActiveMaskSet()['lastValidPosition'] < newValidPosition)
                                            getActiveMaskSet()['lastValidPosition'] = newValidPosition; //set new position from isValid
                                    }
                                }
                            }
                            //does the input match on a further position?
                            if (!isMask(maskPos) && !_isValid(maskPos, getActiveMaskSet(), c, strict)) {
                                var maxForward = seekNext(maskPos) - maskPos;
                                for (var fw = 0; fw < maxForward; fw++) {
                                    if (_isValid(++maskPos, getActiveMaskSet(), c, strict) !== false)
                                        break;
                                }
                                maskForwards.push(activeMasksetIndex);
                                //console.log('maskforward ' + activeMasksetIndex + " pos " + pos + " maskPos " + maskPos);
                            }
                        }

                        if (getActiveMaskSet()['lastValidPosition'] >= actualLVP || activeMasksetIndex == currentActiveMasksetIndex) {
                            if (maskPos >= 0 && maskPos < getMaskLength()) {
                                result = _isValid(maskPos, getActiveMaskSet(), c, strict);
                                if (result !== false) {
                                    if (result === true) {
                                        result = { "pos": maskPos }; //always take a possible corrected maskposition into account
                                    }
                                    var newValidPosition = result.pos || maskPos;
                                    if (getActiveMaskSet()['lastValidPosition'] < newValidPosition)
                                        getActiveMaskSet()['lastValidPosition'] = newValidPosition; //set new position from isValid
                                }
                                //console.log("pos " + pos + " ndx " + activeMasksetIndex + " validate " + getActiveBuffer().join('') + " lv " + getActiveMaskSet()['lastValidPosition']);
                                results.push({ "activeMasksetIndex": index, "result": result });
                            }
                        }
                    }
                });
                activeMasksetIndex = currentActiveMasksetIndex; //reset activeMasksetIndex

                return PostProcessResults(maskForwards, results); //return results of the multiple mask validations
            }

            function determineActiveMasksetIndex() {
                var currentMasksetIndex = activeMasksetIndex,
                    highestValid = { "activeMasksetIndex": 0, "lastValidPosition": -1, "next": -1 };
                $.each(masksets, function (index, value) {
                    if (typeof (value) == "object") {
                        activeMasksetIndex = index;
                        if (getActiveMaskSet()['lastValidPosition'] > highestValid['lastValidPosition']) {
                            highestValid["activeMasksetIndex"] = index;
                            highestValid["lastValidPosition"] = getActiveMaskSet()['lastValidPosition'];
                            highestValid["next"] = seekNext(getActiveMaskSet()['lastValidPosition']);
                        } else if (getActiveMaskSet()['lastValidPosition'] == highestValid['lastValidPosition'] &&
                            (highestValid['next'] == -1 || highestValid['next'] > seekNext(getActiveMaskSet()['lastValidPosition']))) {
                            highestValid["activeMasksetIndex"] = index;
                            highestValid["lastValidPosition"] = getActiveMaskSet()['lastValidPosition'];
                            highestValid["next"] = seekNext(getActiveMaskSet()['lastValidPosition']);
                        }
                    }
                });

                activeMasksetIndex = highestValid["lastValidPosition"] != -1 && masksets[currentMasksetIndex]["lastValidPosition"] == highestValid["lastValidPosition"] ? currentMasksetIndex : highestValid["activeMasksetIndex"];
                if (currentMasksetIndex != activeMasksetIndex) {
                    clearBuffer(getActiveBuffer(), seekNext(highestValid["lastValidPosition"]), getMaskLength());
                    getActiveMaskSet()["writeOutBuffer"] = true;
                }
                $el.data('_inputmask')['activeMasksetIndex'] = activeMasksetIndex; //store the activeMasksetIndex
            }

            function isMask(pos) {
                var testPos = determineTestPosition(pos);
                var test = getActiveTests()[testPos];

                return test != undefined ? test.fn : false;
            }

            function determineTestPosition(pos) {
                return pos % getActiveTests().length;
            }

            function getMaskLength() {
                return opts.getMaskLength(getActiveBufferTemplate(), getActiveMaskSet()['greedy'], getActiveMaskSet()['repeat'], getActiveBuffer(), opts);
            }

            //pos: from position

            function seekNext(pos) {
                var maskL = getMaskLength();
                if (pos >= maskL) return maskL;
                var position = pos;
                while (++position < maskL && !isMask(position)) {
                }
                return position;
            }

            //pos: from position

            function seekPrevious(pos) {
                var position = pos;
                if (position <= 0) return 0;

                while (--position > 0 && !isMask(position)) {
                }
                return position;
            }

            function setBufferElement(buffer, position, element, autoPrepare) {
                if (autoPrepare) position = prepareBuffer(buffer, position);

                var test = getActiveTests()[determineTestPosition(position)];
                var elem = element;
                if (elem != undefined && test != undefined) {
                    switch (test.casing) {
                        case "upper":
                            elem = element.toUpperCase();
                            break;
                        case "lower":
                            elem = element.toLowerCase();
                            break;
                    }
                }

                buffer[position] = elem;
            }

            function getBufferElement(buffer, position, autoPrepare) {
                if (autoPrepare) position = prepareBuffer(buffer, position);
                return buffer[position];
            }

            //needed to handle the non-greedy mask repetitions

            function prepareBuffer(buffer, position) {
                var j;
                while (buffer[position] == undefined && buffer.length < getMaskLength()) {
                    j = 0;
                    while (getActiveBufferTemplate()[j] !== undefined) { //add a new buffer
                        buffer.push(getActiveBufferTemplate()[j++]);
                    }
                }

                return position;
            }

            function writeBuffer(input, buffer, caretPos) {
                input._valueSet(buffer.join(''));
                if (caretPos != undefined) {
                    caret(input, caretPos);
                }
            }

            function clearBuffer(buffer, start, end, stripNomasks) {
                for (var i = start, maskL = getMaskLength() ; i < end && i < maskL; i++) {
                    if (stripNomasks === true) {
                        if (!isMask(i))
                            setBufferElement(buffer, i, "");
                    } else
                        setBufferElement(buffer, i, getBufferElement(getActiveBufferTemplate().slice(), i, true));
                }
            }

            function setReTargetPlaceHolder(buffer, pos) {
                var testPos = determineTestPosition(pos);
                setBufferElement(buffer, pos, getBufferElement(getActiveBufferTemplate(), testPos));
            }

            function getPlaceHolder(pos) {
                return opts.placeholder.charAt(pos % opts.placeholder.length);
            }

            function checkVal(input, writeOut, strict, nptvl, intelliCheck) {
                var inputValue = nptvl != undefined ? nptvl.slice() : truncateInput(input._valueGet()).split('');

                $.each(masksets, function (ndx, ms) {
                    if (typeof (ms) == "object") {
                        ms["buffer"] = ms["_buffer"].slice();
                        ms["lastValidPosition"] = -1;
                        ms["p"] = -1;
                    }
                });
                if (strict !== true) activeMasksetIndex = 0;
                if (writeOut) input._valueSet(""); //initial clear
                var ml = getMaskLength();
                $.each(inputValue, function (ndx, charCode) {
                    if (intelliCheck === true) {
                        var p = getActiveMaskSet()["p"], lvp = p == -1 ? p : seekPrevious(p),
                            pos = lvp == -1 ? ndx : seekNext(lvp);
                        if ($.inArray(charCode, getActiveBufferTemplate().slice(lvp + 1, pos)) == -1) {
                            keypressEvent.call(input, undefined, true, charCode.charCodeAt(0), writeOut, strict, ndx);
                        }
                    } else {
                        keypressEvent.call(input, undefined, true, charCode.charCodeAt(0), writeOut, strict, ndx);
                    }
                });

                if (strict === true && getActiveMaskSet()["p"] != -1) {
                    getActiveMaskSet()["lastValidPosition"] = seekPrevious(getActiveMaskSet()["p"]);
                }
            }

            function escapeRegex(str) {
                return $.inputmask.escapeRegex.call(this, str);
            }

            function truncateInput(inputValue) {
                return inputValue.replace(new RegExp("(" + escapeRegex(getActiveBufferTemplate().join('')) + ")*$"), "");
            }

            function clearOptionalTail(input) {
                var buffer = getActiveBuffer(), tmpBuffer = buffer.slice(), testPos, pos;
                for (var pos = tmpBuffer.length - 1; pos >= 0; pos--) {
                    var testPos = determineTestPosition(pos);
                    if (getActiveTests()[testPos].optionality) {
                        if (!isMask(pos) || !isValid(pos, buffer[pos], true))
                            tmpBuffer.pop();
                        else break;
                    } else break;
                }
                writeBuffer(input, tmpBuffer);
            }

            function unmaskedvalue($input, skipDatepickerCheck) {
                if (getActiveTests() && (skipDatepickerCheck === true || !$input.hasClass('hasDatepicker'))) {
                    //checkVal(input, false, true);
                    var umValue = $.map(getActiveBuffer(), function (element, index) {
                        return isMask(index) && isValid(index, element, true) ? element : null;
                    });
                    var unmaskedValue = (isRTL ? umValue.reverse() : umValue).join('');
                    return opts.onUnMask != undefined ? opts.onUnMask.call(this, getActiveBuffer().join(''), unmaskedValue) : unmaskedValue;
                } else {
                    return $input[0]._valueGet();
                }
            }

            function TranslatePosition(pos) {
                if (isRTL && typeof pos == 'number' && (!opts.greedy || opts.placeholder != "")) {
                    var bffrLght = getActiveBuffer().length;
                    pos = bffrLght - pos;
                }
                return pos;
            }

            function caret(input, begin, end) {
                var npt = input.jquery && input.length > 0 ? input[0] : input, range;
                if (typeof begin == 'number') {
                    begin = TranslatePosition(begin);
                    end = TranslatePosition(end);
                    if (!$(input).is(':visible')) {
                        return;
                    }
                    end = (typeof end == 'number') ? end : begin;
                    npt.scrollLeft = npt.scrollWidth;
                    if (opts.insertMode == false && begin == end) end++; //set visualization for insert/overwrite mode
                    if (npt.setSelectionRange) {
                        npt.selectionStart = begin;
                        npt.selectionEnd = android ? begin : end;

                    } else if (npt.createTextRange) {
                        range = npt.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', end);
                        range.moveStart('character', begin);
                        range.select();
                    }
                } else {
                    if (!$(input).is(':visible')) {
                        return { "begin": 0, "end": 0 };
                    }
                    if (npt.setSelectionRange) {
                        begin = npt.selectionStart;
                        end = npt.selectionEnd;
                    } else if (document.selection && document.selection.createRange) {
                        range = document.selection.createRange();
                        begin = 0 - range.duplicate().moveStart('character', -100000);
                        end = begin + range.text.length;
                    }
                    begin = TranslatePosition(begin);
                    end = TranslatePosition(end);
                    return { "begin": begin, "end": end };
                }
            }

            function isComplete(buffer) { //return true / false / undefined (repeat *)
                if (opts.repeat == "*") return undefined;
                var complete = false, highestValidPosition = 0, currentActiveMasksetIndex = activeMasksetIndex;
                $.each(masksets, function (ndx, ms) {
                    if (typeof (ms) == "object") {
                        activeMasksetIndex = ndx;
                        var aml = seekPrevious(getMaskLength());
                        if (ms["lastValidPosition"] >= highestValidPosition && ms["lastValidPosition"] == aml) {
                            var msComplete = true;
                            for (var i = 0; i <= aml; i++) {
                                var mask = isMask(i), testPos = determineTestPosition(i);
                                if ((mask && (buffer[i] == undefined || buffer[i] == getPlaceHolder(i))) || (!mask && buffer[i] != getActiveBufferTemplate()[testPos])) {
                                    msComplete = false;
                                    break;
                                }
                            }
                            complete = complete || msComplete;
                            if (complete) //break loop
                                return false;
                        }
                        highestValidPosition = ms["lastValidPosition"];
                    }
                });
                activeMasksetIndex = currentActiveMasksetIndex; //reset activeMaskset
                return complete;
            }

            function isSelection(begin, end) {
                return isRTL ? (begin - end) > 1 || ((begin - end) == 1 && opts.insertMode) :
                    (end - begin) > 1 || ((end - begin) == 1 && opts.insertMode);
            }


            //private functions
            function installEventRuler(npt) {
                var events = $._data(npt).events;

                $.each(events, function (eventType, eventHandlers) {
                    $.each(eventHandlers, function (ndx, eventHandler) {
                        if (eventHandler.namespace == "inputmask") {
                            if (eventHandler.type != "setvalue") {
                                var handler = eventHandler.handler;
                                eventHandler.handler = function (e) {
                                    if (this.readOnly || this.disabled)
                                        e.preventDefault;
                                    else
                                        return handler.apply(this, arguments);
                                };
                            }
                        }
                    });
                });
            }

            function patchValueProperty(npt) {
                var valueProperty;
                if (Object.getOwnPropertyDescriptor)
                    valueProperty = Object.getOwnPropertyDescriptor(npt, "value");
                if (valueProperty && valueProperty.get) {
                    if (!npt._valueGet) {
                        var valueGet = valueProperty.get;
                        var valueSet = valueProperty.set;
                        npt._valueGet = function () {
                            return isRTL ? valueGet.call(this).split('').reverse().join('') : valueGet.call(this);
                        };
                        npt._valueSet = function (value) {
                            valueSet.call(this, isRTL ? value.split('').reverse().join('') : value);
                        };

                        Object.defineProperty(npt, "value", {
                            get: function () {
                                var $self = $(this), inputData = $(this).data('_inputmask'), masksets = inputData['masksets'],
                                    activeMasksetIndex = inputData['activeMasksetIndex'];
                                return inputData && inputData['opts'].autoUnmask ? $self.inputmask('unmaskedvalue') : valueGet.call(this) != masksets[activeMasksetIndex]['_buffer'].join('') ? valueGet.call(this) : '';
                            },
                            set: function (value) {
                                valueSet.call(this, value);
                                $(this).triggerHandler('setvalue.inputmask');
                            }
                        });
                    }
                } else if (document.__lookupGetter__ && npt.__lookupGetter__("value")) {
                    if (!npt._valueGet) {
                        var valueGet = npt.__lookupGetter__("value");
                        var valueSet = npt.__lookupSetter__("value");
                        npt._valueGet = function () {
                            return isRTL ? valueGet.call(this).split('').reverse().join('') : valueGet.call(this);
                        };
                        npt._valueSet = function (value) {
                            valueSet.call(this, isRTL ? value.split('').reverse().join('') : value);
                        };

                        npt.__defineGetter__("value", function () {
                            var $self = $(this), inputData = $(this).data('_inputmask'), masksets = inputData['masksets'],
                                activeMasksetIndex = inputData['activeMasksetIndex'];
                            return inputData && inputData['opts'].autoUnmask ? $self.inputmask('unmaskedvalue') : valueGet.call(this) != masksets[activeMasksetIndex]['_buffer'].join('') ? valueGet.call(this) : '';
                        });
                        npt.__defineSetter__("value", function (value) {
                            valueSet.call(this, value);
                            $(this).triggerHandler('setvalue.inputmask');
                        });
                    }
                } else {
                    if (!npt._valueGet) {
                        npt._valueGet = function () { return isRTL ? this.value.split('').reverse().join('') : this.value; };
                        npt._valueSet = function (value) { this.value = isRTL ? value.split('').reverse().join('') : value; };
                    }
                    if ($.valHooks.text == undefined || $.valHooks.text.inputmaskpatch != true) {
                        var valueGet = $.valHooks.text && $.valHooks.text.get ? $.valHooks.text.get : function (elem) { return elem.value; };
                        var valueSet = $.valHooks.text && $.valHooks.text.set ? $.valHooks.text.set : function (elem, value) {
                            elem.value = value;
                            return elem;
                        };

                        jQuery.extend($.valHooks, {
                            text: {
                                get: function (elem) {
                                    var $elem = $(elem);
                                    if ($elem.data('_inputmask')) {
                                        if ($elem.data('_inputmask')['opts'].autoUnmask)
                                            return $elem.inputmask('unmaskedvalue');
                                        else {
                                            var result = valueGet(elem),
                                                inputData = $elem.data('_inputmask'), masksets = inputData['masksets'],
                                                activeMasksetIndex = inputData['activeMasksetIndex'];
                                            return result != masksets[activeMasksetIndex]['_buffer'].join('') ? result : '';
                                        }
                                    } else return valueGet(elem);
                                },
                                set: function (elem, value) {
                                    var $elem = $(elem);
                                    var result = valueSet(elem, value);
                                    if ($elem.data('_inputmask')) $elem.triggerHandler('setvalue.inputmask');
                                    return result;
                                },
                                inputmaskpatch: true
                            }
                        });
                    }
                }
            }

            //shift chars to left from start to end and put c at end position if defined

            function shiftL(start, end, c, maskJumps) {
                var buffer = getActiveBuffer();
                if (maskJumps !== false) //jumping over nonmask position
                    while (!isMask(start) && start - 1 >= 0) start--;
                for (var i = start; i < end && i < getMaskLength() ; i++) {
                    if (isMask(i)) {
                        setReTargetPlaceHolder(buffer, i);
                        var j = seekNext(i);
                        var p = getBufferElement(buffer, j);
                        if (p != getPlaceHolder(j)) {
                            if (j < getMaskLength() && isValid(i, p, true) !== false && getActiveTests()[determineTestPosition(i)].def == getActiveTests()[determineTestPosition(j)].def) {
                                setBufferElement(buffer, i, p, true);
                            } else {
                                if (isMask(i))
                                    break;
                            }
                        }
                    } else {
                        setReTargetPlaceHolder(buffer, i);
                    }
                }
                if (c != undefined)
                    setBufferElement(buffer, seekPrevious(end), c);

                if (getActiveMaskSet()["greedy"] == false) {
                    var trbuffer = truncateInput(buffer.join('')).split('');
                    buffer.length = trbuffer.length;
                    for (var i = 0, bl = buffer.length; i < bl; i++) {
                        buffer[i] = trbuffer[i];
                    }
                    if (buffer.length == 0) getActiveMaskSet()["buffer"] = getActiveBufferTemplate().slice();
                }
                return start; //return the used start position
            }

            function shiftR(start, end, c) {
                var buffer = getActiveBuffer();
                if (getBufferElement(buffer, start, true) != getPlaceHolder(start)) {
                    for (var i = seekPrevious(end) ; i > start && i >= 0; i--) {
                        if (isMask(i)) {
                            var j = seekPrevious(i);
                            var t = getBufferElement(buffer, j);
                            if (t != getPlaceHolder(j)) {
                                if (isValid(j, t, true) !== false && getActiveTests()[determineTestPosition(i)].def == getActiveTests()[determineTestPosition(j)].def) {
                                    setBufferElement(buffer, i, t, true);
                                    setReTargetPlaceHolder(buffer, j);
                                } //else break;
                            }
                        } else
                            setReTargetPlaceHolder(buffer, i);
                    }
                }
                if (c != undefined && getBufferElement(buffer, start) == getPlaceHolder(start))
                    setBufferElement(buffer, start, c);
                var lengthBefore = buffer.length;
                if (getActiveMaskSet()["greedy"] == false) {
                    var trbuffer = truncateInput(buffer.join('')).split('');
                    buffer.length = trbuffer.length;
                    for (var i = 0, bl = buffer.length; i < bl; i++) {
                        buffer[i] = trbuffer[i];
                    }
                    if (buffer.length == 0) getActiveMaskSet()["buffer"] = getActiveBufferTemplate().slice();
                }
                return end - (lengthBefore - buffer.length); //return new start position
            }

            function HandleRemove(input, k, pos) {
                if (opts.numericInput || isRTL) {
                    switch (k) {
                        case opts.keyCode.BACKSPACE:
                            k = opts.keyCode.DELETE;
                            break;
                        case opts.keyCode.DELETE:
                            k = opts.keyCode.BACKSPACE;
                            break;
                    }
                    if (isRTL) {
                        var pend = pos.end;
                        pos.end = pos.begin;
                        pos.begin = pend;
                    }
                }

                var isSelection = true;
                if (pos.begin == pos.end) {
                    var posBegin = k == opts.keyCode.BACKSPACE ? pos.begin - 1 : pos.begin;
                    if (opts.isNumeric && opts.radixPoint != "" && getActiveBuffer()[posBegin] == opts.radixPoint) {
                        pos.begin = (getActiveBuffer().length - 1 == posBegin) /* radixPoint is latest? delete it */ ? pos.begin : k == opts.keyCode.BACKSPACE ? posBegin : seekNext(posBegin);
                        pos.end = pos.begin;
                    }
                    isSelection = false;
                    if (k == opts.keyCode.BACKSPACE)
                        pos.begin--;
                    else if (k == opts.keyCode.DELETE)
                        pos.end++;
                } else if (pos.end - pos.begin == 1 && !opts.insertMode) {
                    isSelection = false;
                    if (k == opts.keyCode.BACKSPACE)
                        pos.begin--;
                }

                clearBuffer(getActiveBuffer(), pos.begin, pos.end);

                var ml = getMaskLength();
                if (opts.greedy == false) {
                    shiftL(pos.begin, ml, undefined, !isRTL && (k == opts.keyCode.BACKSPACE && !isSelection));
                } else {
                    var newpos = pos.begin;
                    for (var i = pos.begin; i < pos.end; i++) { //seeknext to skip placeholders at start in selection
                        if (isMask(i) || !isSelection)
                            newpos = shiftL(pos.begin, ml, undefined, !isRTL && (k == opts.keyCode.BACKSPACE && !isSelection));
                    }
                    if (!isSelection) pos.begin = newpos;
                }
                var firstMaskPos = seekNext(-1);
                clearBuffer(getActiveBuffer(), pos.begin, pos.end, true);
                checkVal(input, false, masksets[1] == undefined || firstMaskPos >= pos.end, getActiveBuffer());
                if (getActiveMaskSet()['lastValidPosition'] < firstMaskPos) {
                    getActiveMaskSet()["lastValidPosition"] = -1;
                    getActiveMaskSet()["p"] = firstMaskPos;
                } else {
                    getActiveMaskSet()["p"] = pos.begin;
                }
            }

            function keydownEvent(e) {
                //Safari 5.1.x - modal dialog fires keypress twice workaround
                skipKeyPressEvent = false;
                var input = this, $input = $(input), k = e.keyCode, pos = caret(input);

                //backspace, delete, and escape get special treatment
                if (k == opts.keyCode.BACKSPACE || k == opts.keyCode.DELETE || (iphone && k == 127) || e.ctrlKey && k == 88) { //backspace/delete
                    e.preventDefault(); //stop default action but allow propagation
                    if (k == 88) valueOnFocus = getActiveBuffer().join('');
                    HandleRemove(input, k, pos);
                    determineActiveMasksetIndex();
                    writeBuffer(input, getActiveBuffer(), getActiveMaskSet()["p"]);
                    if (input._valueGet() == getActiveBufferTemplate().join(''))
                        $input.trigger('cleared');

                    if (opts.showTooltip) { //update tooltip
                        $input.prop("title", getActiveMaskSet()["mask"]);
                    }
                } else if (k == opts.keyCode.END || k == opts.keyCode.PAGE_DOWN) { //when END or PAGE_DOWN pressed set position at lastmatch
                    setTimeout(function () {
                        var caretPos = seekNext(getActiveMaskSet()["lastValidPosition"]);
                        if (!opts.insertMode && caretPos == getMaskLength() && !e.shiftKey) caretPos--;
                        caret(input, e.shiftKey ? pos.begin : caretPos, caretPos);
                    }, 0);
                } else if ((k == opts.keyCode.HOME && !e.shiftKey) || k == opts.keyCode.PAGE_UP) { //Home or page_up
                    caret(input, 0, e.shiftKey ? pos.begin : 0);
                } else if (k == opts.keyCode.ESCAPE || (k == 90 && e.ctrlKey)) { //escape && undo
                    checkVal(input, true, false, valueOnFocus.split(''));
                    $input.click();
                } else if (k == opts.keyCode.INSERT && !(e.shiftKey || e.ctrlKey)) { //insert
                    opts.insertMode = !opts.insertMode;
                    caret(input, !opts.insertMode && pos.begin == getMaskLength() ? pos.begin - 1 : pos.begin);
                } else if (opts.insertMode == false && !e.shiftKey) {
                    if (k == opts.keyCode.RIGHT) {
                        setTimeout(function () {
                            var caretPos = caret(input);
                            caret(input, caretPos.begin);
                        }, 0);
                    } else if (k == opts.keyCode.LEFT) {
                        setTimeout(function () {
                            var caretPos = caret(input);
                            caret(input, caretPos.begin - 1);
                        }, 0);
                    }
                }

                var currentCaretPos = caret(input);
                if (opts.onKeyDown.call(this, e, getActiveBuffer(), opts) === true) //extra stuff to execute on keydown
                    caret(input, currentCaretPos.begin, currentCaretPos.end);
                ignorable = $.inArray(k, opts.ignorables) != -1;
            }


            function keypressEvent(e, checkval, k, writeOut, strict, ndx) {
                //Safari 5.1.x - modal dialog fires keypress twice workaround
                if (k == undefined && skipKeyPressEvent) return false;
                skipKeyPressEvent = true;

                var input = this, $input = $(input);

                e = e || window.event;
                var k = checkval ? k : (e.which || e.charCode || e.keyCode);

                if (checkval !== true && (!(e.ctrlKey && e.altKey) && (e.ctrlKey || e.metaKey || ignorable))) {
                    return true;
                } else {
                    if (k) {
                        //special treat the decimal separator
                        if (checkval !== true && k == 46 && e.shiftKey == false && opts.radixPoint == ",") k = 44;

                        var pos, results, result, c = String.fromCharCode(k);
                        if (checkval) {
                            var pcaret = strict ? ndx : getActiveMaskSet()["lastValidPosition"] + 1;
                            pos = { begin: pcaret, end: pcaret };
                        } else {
                            pos = caret(input);
                        }

                        //should we clear a possible selection??
                        var isSlctn = isSelection(pos.begin, pos.end), redetermineLVP = false,
                            initialIndex = activeMasksetIndex;
                        if (isSlctn) {
                            activeMasksetIndex = initialIndex;
                            $.each(masksets, function (ndx, lmnt) { //init undobuffer for recovery when not valid
                                if (typeof (lmnt) == "object") {
                                    activeMasksetIndex = ndx;
                                    getActiveMaskSet()["undoBuffer"] = getActiveBuffer().join('');
                                }
                            });
                            HandleRemove(input, opts.keyCode.DELETE, pos);
                            if (!opts.insertMode) { //preserve some space
                                $.each(masksets, function (ndx, lmnt) {
                                    if (typeof (lmnt) == "object") {
                                        activeMasksetIndex = ndx;
                                        shiftR(pos.begin, getMaskLength());
                                        getActiveMaskSet()["lastValidPosition"] = seekNext(getActiveMaskSet()["lastValidPosition"]);
                                    }
                                });
                            }
                            activeMasksetIndex = initialIndex; //restore index
                        }

                        var radixPosition = getActiveBuffer().join('').indexOf(opts.radixPoint);
                        if (opts.isNumeric && checkval !== true && radixPosition != -1) {
                            if (opts.greedy && pos.begin <= radixPosition) {
                                pos.begin = seekPrevious(pos.begin);
                                pos.end = pos.begin;
                            } else if (c == opts.radixPoint) {
                                pos.begin = radixPosition;
                                pos.end = pos.begin;
                            }
                        }


                        var p = pos.begin;
                        results = isValid(p, c, strict);
                        if (strict === true) results = [{ "activeMasksetIndex": activeMasksetIndex, "result": results }];
                        var minimalForwardPosition = -1;
                        $.each(results, function (index, result) {
                            activeMasksetIndex = result["activeMasksetIndex"];
                            getActiveMaskSet()["writeOutBuffer"] = true;
                            var np = result["result"];
                            if (np !== false) {
                                var refresh = false, buffer = getActiveBuffer();
                                if (np !== true) {
                                    refresh = np["refresh"]; //only rewrite buffer from isValid
                                    p = np.pos != undefined ? np.pos : p; //set new position from isValid
                                    c = np.c != undefined ? np.c : c; //set new char from isValid
                                }
                                if (refresh !== true) {
                                    if (opts.insertMode == true) {
                                        var lastUnmaskedPosition = getMaskLength();
                                        var bfrClone = buffer.slice();
                                        while (getBufferElement(bfrClone, lastUnmaskedPosition, true) != getPlaceHolder(lastUnmaskedPosition) && lastUnmaskedPosition >= p) {
                                            lastUnmaskedPosition = lastUnmaskedPosition == 0 ? -1 : seekPrevious(lastUnmaskedPosition);
                                        }
                                        if (lastUnmaskedPosition >= p) {
                                            shiftR(p, getMaskLength(), c);
                                            //shift the lvp if needed
                                            var lvp = getActiveMaskSet()["lastValidPosition"], nlvp = seekNext(lvp);
                                            if (nlvp != getMaskLength() && lvp >= p && (getBufferElement(getActiveBuffer(), nlvp, true) != getPlaceHolder(nlvp))) {
                                                getActiveMaskSet()["lastValidPosition"] = nlvp;
                                            }
                                        } else getActiveMaskSet()["writeOutBuffer"] = false;
                                    } else setBufferElement(buffer, p, c, true);
                                    if (minimalForwardPosition == -1 || minimalForwardPosition > seekNext(p)) {
                                        minimalForwardPosition = seekNext(p);
                                    }
                                } else if (!strict) {
                                    var nextPos = p < getMaskLength() ? p + 1 : p;
                                    if (minimalForwardPosition == -1 || minimalForwardPosition > nextPos) {
                                        minimalForwardPosition = nextPos;
                                    }
                                }
                                if (minimalForwardPosition > getActiveMaskSet()["p"])
                                    getActiveMaskSet()["p"] = minimalForwardPosition; //needed for checkval strict 
                            }
                        });

                        if (strict !== true) {
                            activeMasksetIndex = initialIndex;
                            determineActiveMasksetIndex();
                        }
                        if (writeOut !== false) {
                            $.each(results, function (ndx, rslt) {
                                if (rslt["activeMasksetIndex"] == activeMasksetIndex) {
                                    result = rslt;
                                    return false;
                                }
                            });
                            if (result != undefined) {
                                var self = this;
                                setTimeout(function () { opts.onKeyValidation.call(self, result["result"], opts); }, 0);
                                if (getActiveMaskSet()["writeOutBuffer"] && result["result"] !== false) {
                                    var buffer = getActiveBuffer();

                                    var newCaretPosition;
                                    if (checkval) {
                                        newCaretPosition = undefined;
                                    } else if (opts.numericInput) {
                                        if (p > radixPosition) {
                                            newCaretPosition = seekPrevious(minimalForwardPosition);
                                        } else if (c == opts.radixPoint) {
                                            newCaretPosition = minimalForwardPosition - 1;
                                        } else newCaretPosition = seekPrevious(minimalForwardPosition - 1);
                                    } else {
                                        newCaretPosition = minimalForwardPosition;
                                    }

                                    writeBuffer(input, buffer, newCaretPosition);
                                    if (checkval !== true) {
                                        setTimeout(function () { //timeout needed for IE
                                            if (isComplete(buffer) === true)
                                                $input.trigger("complete");
                                            skipInputEvent = true;
                                            $input.trigger("input");
                                        }, 0);
                                    }
                                } else if (isSlctn) {
                                    getActiveMaskSet()["buffer"] = getActiveMaskSet()["undoBuffer"].split('');
                                }
                            }
                        }

                        if (opts.showTooltip) { //update tooltip
                            $input.prop("title", getActiveMaskSet()["mask"]);
                        }

                        //needed for IE8 and below
                        if (e) e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    }
                }
            }

            function keyupEvent(e) {
                var $input = $(this), input = this, k = e.keyCode, buffer = getActiveBuffer();

                if (androidchrome && k == opts.keyCode.BACKSPACE) {
                    if (chromeValueOnInput == input._valueGet())
                        keydownEvent.call(this, e);
                }

                opts.onKeyUp.call(this, e, buffer, opts); //extra stuff to execute on keyup
                if (k == opts.keyCode.TAB && opts.showMaskOnFocus) {
                    if ($input.hasClass('focus.inputmask') && input._valueGet().length == 0) {
                        buffer = getActiveBufferTemplate().slice();
                        writeBuffer(input, buffer);
                        caret(input, 0);
                        valueOnFocus = getActiveBuffer().join('');
                    } else {
                        writeBuffer(input, buffer);
                        if (buffer.join('') == getActiveBufferTemplate().join('') && $.inArray(opts.radixPoint, buffer) != -1) {
                            caret(input, TranslatePosition(0));
                            $input.click();
                        } else
                            caret(input, TranslatePosition(0), TranslatePosition(getMaskLength()));
                    }
                }
            }

            function inputEvent(e) {
                if (skipInputEvent === true) {
                    skipInputEvent = false;
                    return true;
                }
                var input = this, $input = $(input);

                chromeValueOnInput = getActiveBuffer().join('');
                checkVal(input, false, false);
                writeBuffer(input, getActiveBuffer());
                if (isComplete(getActiveBuffer()) === true)
                    $input.trigger("complete");
                $input.click();
            }

            function mask(el) {
                $el = $(el);
                if ($el.is(":input")) {
                    //store tests & original buffer in the input element - used to get the unmasked value
                    $el.data('_inputmask', {
                        'masksets': masksets,
                        'activeMasksetIndex': activeMasksetIndex,
                        'opts': opts,
                        'isRTL': false
                    });

                    //show tooltip
                    if (opts.showTooltip) {
                        $el.prop("title", getActiveMaskSet()["mask"]);
                    }

                    //correct greedy setting if needed
                    getActiveMaskSet()['greedy'] = getActiveMaskSet()['greedy'] ? getActiveMaskSet()['greedy'] : getActiveMaskSet()['repeat'] == 0;

                    //handle maxlength attribute
                    if ($el.attr("maxLength") != null) //only when the attribute is set
                    {
                        var maxLength = $el.prop('maxLength');
                        if (maxLength > -1) { //handle *-repeat
                            $.each(masksets, function (ndx, ms) {
                                if (typeof (ms) == "object") {
                                    if (ms["repeat"] == "*") {
                                        ms["repeat"] = maxLength;
                                    }
                                }
                            });
                        }
                        if (getMaskLength() >= maxLength && maxLength > -1) { //FF sets no defined max length to -1 
                            if (maxLength < getActiveBufferTemplate().length) getActiveBufferTemplate().length = maxLength;
                            if (getActiveMaskSet()['greedy'] == false) {
                                getActiveMaskSet()['repeat'] = Math.round(maxLength / getActiveBufferTemplate().length);
                            }
                            $el.prop('maxLength', getMaskLength() * 2);
                        }
                    }

                    patchValueProperty(el);

                    if (opts.numericInput) opts.isNumeric = opts.numericInput;
                    if (el.dir == "rtl" || (opts.numericInput && opts.rightAlignNumerics) || (opts.isNumeric && opts.rightAlignNumerics))
                        $el.css("text-align", "right");

                    if (el.dir == "rtl" || opts.numericInput) {
                        el.dir = "ltr";
                        $el.removeAttr("dir");
                        var inputData = $el.data('_inputmask');
                        inputData['isRTL'] = true;
                        $el.data('_inputmask', inputData);
                        isRTL = true;
                    }

                    //unbind all events - to make sure that no other mask will interfere when re-masking
                    $el.unbind(".inputmask");
                    $el.removeClass('focus.inputmask');
                    //bind events
                    $el.closest('form').bind("submit", function () { //trigger change on submit if any
                        if (valueOnFocus != getActiveBuffer().join('')) {
                            $el.change();
                        }
                    }).bind('reset', function () {
                        setTimeout(function () {
                            $el.trigger("setvalue");
                        }, 0);
                    });
                    $el.bind("mouseenter.inputmask", function () {
                        var $input = $(this), input = this;
                        if (!$input.hasClass('focus.inputmask') && opts.showMaskOnHover) {
                            if (input._valueGet() != getActiveBuffer().join('')) {
                                writeBuffer(input, getActiveBuffer());
                            }
                        }
                    }).bind("blur.inputmask", function () {
                        var $input = $(this), input = this, nptValue = input._valueGet(), buffer = getActiveBuffer();
                        $input.removeClass('focus.inputmask');
                        if (valueOnFocus != getActiveBuffer().join('')) {
                            $input.change();
                        }
                        if (opts.clearMaskOnLostFocus && nptValue != '') {
                            if (nptValue == getActiveBufferTemplate().join(''))
                                input._valueSet('');
                            else { //clearout optional tail of the mask
                                clearOptionalTail(input);
                            }
                        }
                        if (isComplete(buffer) === false) {
                            $input.trigger("incomplete");
                            if (opts.clearIncomplete) {
                                $.each(masksets, function (ndx, ms) {
                                    if (typeof (ms) == "object") {
                                        ms["buffer"] = ms["_buffer"].slice();
                                        ms["lastValidPosition"] = -1;
                                    }
                                });
                                activeMasksetIndex = 0;
                                if (opts.clearMaskOnLostFocus)
                                    input._valueSet('');
                                else {
                                    buffer = getActiveBufferTemplate().slice();
                                    writeBuffer(input, buffer);
                                }
                            }
                        }
                    }).bind("focus.inputmask", function () {
                        var $input = $(this), input = this, nptValue = input._valueGet();
                        if (opts.showMaskOnFocus && !$input.hasClass('focus.inputmask') && (!opts.showMaskOnHover || (opts.showMaskOnHover && nptValue == ''))) {
                            if (input._valueGet() != getActiveBuffer().join('')) {
                                writeBuffer(input, getActiveBuffer(), seekNext(getActiveMaskSet()["lastValidPosition"]));
                            }
                        }
                        $input.addClass('focus.inputmask');
                        valueOnFocus = getActiveBuffer().join('');
                    }).bind("mouseleave.inputmask", function () {
                        var $input = $(this), input = this;
                        if (opts.clearMaskOnLostFocus) {
                            if (!$input.hasClass('focus.inputmask') && input._valueGet() != $input.attr("placeholder")) {
                                if (input._valueGet() == getActiveBufferTemplate().join('') || input._valueGet() == '')
                                    input._valueSet('');
                                else { //clearout optional tail of the mask
                                    clearOptionalTail(input);
                                }
                            }
                        }
                    }).bind("click.inputmask", function () {
                        var input = this;
                        setTimeout(function () {
                            var selectedCaret = caret(input), buffer = getActiveBuffer();
                            if (selectedCaret.begin == selectedCaret.end) {
                                var clickPosition = isRTL ? TranslatePosition(selectedCaret.begin) : selectedCaret.begin,
                                    lvp = getActiveMaskSet()["lastValidPosition"],
                                    lastPosition;
                                if (opts.isNumeric) {
                                    lastPosition = opts.skipRadixDance === false && opts.radixPoint != "" && $.inArray(opts.radixPoint, buffer) != -1 ?
                                        (opts.numericInput ? seekNext($.inArray(opts.radixPoint, buffer)) : $.inArray(opts.radixPoint, buffer)) :
                                        seekNext(lvp);
                                } else {
                                    lastPosition = seekNext(lvp);
                                }
                                if (clickPosition < lastPosition) {
                                    if (isMask(clickPosition))
                                        caret(input, clickPosition);
                                    else caret(input, seekNext(clickPosition));
                                } else
                                    caret(input, lastPosition);
                            }
                        }, 0);
                    }).bind('dblclick.inputmask', function () {
                        var input = this;
                        setTimeout(function () {
                            caret(input, 0, seekNext(getActiveMaskSet()["lastValidPosition"]));
                        }, 0);
                    }).bind(pasteEvent + ".inputmask dragdrop.inputmask drop.inputmask", function (e) {
                        if (skipInputEvent === true) {
                            skipInputEvent = false;
                            return true;
                        }
                        var input = this, $input = $(input);

                        //paste event for IE8 and lower I guess ;-)
                        if (e.type == "propertychange" && input._valueGet().length <= getMaskLength()) {
                            return true;
                        }
                        setTimeout(function () {
                            var pasteValue = opts.onBeforePaste != undefined ? opts.onBeforePaste.call(this, input._valueGet()) : input._valueGet();
                            checkVal(input, true, false, pasteValue.split(''), true);
                            if (isComplete(getActiveBuffer()) === true)
                                $input.trigger("complete");
                            $input.click();
                        }, 0);
                    }).bind('setvalue.inputmask', function () {
                        var input = this;
                        checkVal(input, true);
                        valueOnFocus = getActiveBuffer().join('');
                        if (input._valueGet() == getActiveBufferTemplate().join(''))
                            input._valueSet('');
                    }).bind('complete.inputmask', opts.oncomplete
                    ).bind('incomplete.inputmask', opts.onincomplete
                    ).bind('cleared.inputmask', opts.oncleared
                    ).bind("keyup.inputmask", keyupEvent);

                    if (androidchrome) {
                        $el.bind("input.inputmask", inputEvent);
                    } else {
                        $el.bind("keydown.inputmask", keydownEvent
                        ).bind("keypress.inputmask", keypressEvent);
                    }

                    if (msie10)
                        $el.bind("input.inputmask", inputEvent);

                    //apply mask
                    checkVal(el, true, false);
                    valueOnFocus = getActiveBuffer().join('');
                    // Wrap document.activeElement in a try/catch block since IE9 throw "Unspecified error" if document.activeElement is undefined when we are in an IFrame.
                    var activeElement;
                    try {
                        activeElement = document.activeElement;
                    } catch (e) {
                    }
                    if (activeElement === el) { //position the caret when in focus
                        $el.addClass('focus.inputmask');
                        caret(el, seekNext(getActiveMaskSet()["lastValidPosition"]));
                    } else if (opts.clearMaskOnLostFocus) {
                        if (getActiveBuffer().join('') == getActiveBufferTemplate().join('')) {
                            el._valueSet('');
                        } else {
                            clearOptionalTail(el);
                        }
                    } else {
                        writeBuffer(el, getActiveBuffer());
                    }

                    installEventRuler(el);
                }
            }

            //action object
            if (actionObj != undefined) {
                switch (actionObj["action"]) {
                    case "isComplete":
                        return isComplete(actionObj["buffer"]);
                    case "unmaskedvalue":
                        isRTL = actionObj["$input"].data('_inputmask')['isRTL'];
                        return unmaskedvalue(actionObj["$input"], actionObj["skipDatepickerCheck"]);
                    case "mask":
                        mask(actionObj["el"]);
                        break;
                    case "format":
                        $el = $({});
                        $el.data('_inputmask', {
                            'masksets': masksets,
                            'activeMasksetIndex': activeMasksetIndex,
                            'opts': opts,
                            'isRTL': opts.numericInput
                        });
                        if (opts.numericInput) {
                            opts.isNumeric = opts.numericInput;
                            isRTL = true;
                        }

                        checkVal($el, false, false, actionObj["value"].split(''), true);
                        return getActiveBuffer().join('');
                }
            }
        }
        $.inputmask = {
            //options default
            defaults: {
                placeholder: "_",
                optionalmarker: { start: "[", end: "]" },
                quantifiermarker: { start: "{", end: "}" },
                groupmarker: { start: "(", end: ")" },
                escapeChar: "\\",
                mask: null,
                oncomplete: $.noop, //executes when the mask is complete
                onincomplete: $.noop, //executes when the mask is incomplete and focus is lost
                oncleared: $.noop, //executes when the mask is cleared
                repeat: 0, //repetitions of the mask: * ~ forever, otherwise specify an integer
                greedy: true, //true: allocated buffer for the mask and repetitions - false: allocate only if needed
                autoUnmask: false, //automatically unmask when retrieving the value with $.fn.val or value if the browser supports __lookupGetter__ or getOwnPropertyDescriptor
                clearMaskOnLostFocus: true,
                insertMode: true, //insert the input or overwrite the input
                clearIncomplete: false, //clear the incomplete input on blur
                aliases: {}, //aliases definitions => see jquery.inputmask.extensions.js
                onKeyUp: $.noop, //override to implement autocomplete on certain keys for example
                onKeyDown: $.noop, //override to implement autocomplete on certain keys for example
                onBeforePaste: undefined, //executes before masking the pasted value to allow preprocessing of the pasted value.  args => pastedValue => return processedValue
                onUnMask: undefined, //executes after unmasking to allow postprocessing of the unmaskedvalue.  args => maskedValue, unmaskedValue
                showMaskOnFocus: true, //show the mask-placeholder when the input has focus
                showMaskOnHover: true, //show the mask-placeholder when hovering the empty input
                onKeyValidation: $.noop, //executes on every key-press with the result of isValid. Params: result, opts
                skipOptionalPartCharacter: " ", //a character which can be used to skip an optional part of a mask
                showTooltip: false, //show the activemask as tooltip
                numericInput: false, //numericInput input direction style (input shifts to the left while holding the caret position)
                //numeric basic properties
                isNumeric: false, //enable numeric features
                radixPoint: "", //".", // | ","
                skipRadixDance: false, //disable radixpoint caret positioning
                rightAlignNumerics: true, //align numerics to the right
                //numeric basic properties
                definitions: {
                    '9': {
                        validator: "[0-9]",
                        cardinality: 1
                    },
                    'a': {
                        validator: "[A-Za-z\u0410-\u044F\u0401\u0451]",
                        cardinality: 1
                    },
                    '*': {
                        validator: "[A-Za-z\u0410-\u044F\u0401\u04510-9]",
                        cardinality: 1
                    }
                },
                keyCode: {
                    ALT: 18, BACKSPACE: 8, CAPS_LOCK: 20, COMMA: 188, COMMAND: 91, COMMAND_LEFT: 91, COMMAND_RIGHT: 93, CONTROL: 17, DELETE: 46, DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, INSERT: 45, LEFT: 37, MENU: 93, NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108,
                    NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SHIFT: 16, SPACE: 32, TAB: 9, UP: 38, WINDOWS: 91
                },
                //specify keycodes which should not be considered in the keypress event, otherwise the preventDefault will stop their default behavior especially in FF
                ignorables: [8, 9, 13, 19, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123],
                getMaskLength: function (buffer, greedy, repeat, currentBuffer, opts) {
                    var calculatedLength = buffer.length;
                    if (!greedy) {
                        if (repeat == "*") {
                            calculatedLength = currentBuffer.length + 1;
                        } else if (repeat > 1) {
                            calculatedLength += (buffer.length * (repeat - 1));
                        }
                    }
                    return calculatedLength;
                }
            },
            escapeRegex: function (str) {
                var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
                return str.replace(new RegExp('(\\' + specials.join('|\\') + ')', 'gim'), '\\$1');
            },
            format: function (value, options) {
                var opts = $.extend(true, {}, $.inputmask.defaults, options);
                resolveAlias(opts.alias, options, opts);
                return maskScope(generateMaskSets(opts), 0, opts, { "action": "format", "value": value });
            }
        };

        $.fn.inputmask = function (fn, options) {
            var opts = $.extend(true, {}, $.inputmask.defaults, options),
                masksets,
                activeMasksetIndex = 0;

            if (typeof fn === "string") {
                switch (fn) {
                    case "mask":
                        //resolve possible aliases given by options
                        resolveAlias(opts.alias, options, opts);
                        masksets = generateMaskSets(opts);
                        if (masksets.length == 0) { return this; }

                        return this.each(function () {
                            maskScope($.extend(true, {}, masksets), 0, opts, { "action": "mask", "el": this });
                        });
                    case "unmaskedvalue":
                        var $input = $(this), input = this;
                        if ($input.data('_inputmask')) {
                            masksets = $input.data('_inputmask')['masksets'];
                            activeMasksetIndex = $input.data('_inputmask')['activeMasksetIndex'];
                            opts = $input.data('_inputmask')['opts'];
                            return maskScope(masksets, activeMasksetIndex, opts, { "action": "unmaskedvalue", "$input": $input });
                        } else return $input.val();
                    case "remove":
                        return this.each(function () {
                            var $input = $(this), input = this;
                            if ($input.data('_inputmask')) {
                                masksets = $input.data('_inputmask')['masksets'];
                                activeMasksetIndex = $input.data('_inputmask')['activeMasksetIndex'];
                                opts = $input.data('_inputmask')['opts'];
                                //writeout the unmaskedvalue
                                input._valueSet(maskScope(masksets, activeMasksetIndex, opts, { "action": "unmaskedvalue", "$input": $input, "skipDatepickerCheck": true }));
                                //clear data
                                $input.removeData('_inputmask');
                                //unbind all events
                                $input.unbind(".inputmask");
                                $input.removeClass('focus.inputmask');
                                //restore the value property
                                var valueProperty;
                                if (Object.getOwnPropertyDescriptor)
                                    valueProperty = Object.getOwnPropertyDescriptor(input, "value");
                                if (valueProperty && valueProperty.get) {
                                    if (input._valueGet) {
                                        Object.defineProperty(input, "value", {
                                            get: input._valueGet,
                                            set: input._valueSet
                                        });
                                    }
                                } else if (document.__lookupGetter__ && input.__lookupGetter__("value")) {
                                    if (input._valueGet) {
                                        input.__defineGetter__("value", input._valueGet);
                                        input.__defineSetter__("value", input._valueSet);
                                    }
                                }
                                try { //try catch needed for IE7 as it does not supports deleting fns
                                    delete input._valueGet;
                                    delete input._valueSet;
                                } catch (e) {
                                    input._valueGet = undefined;
                                    input._valueSet = undefined;

                                }
                            }
                        });
                        break;
                    case "getemptymask": //return the default (empty) mask value, usefull for setting the default value in validation
                        if (this.data('_inputmask')) {
                            masksets = this.data('_inputmask')['masksets'];
                            activeMasksetIndex = this.data('_inputmask')['activeMasksetIndex'];
                            return masksets[activeMasksetIndex]['_buffer'].join('');
                        }
                        else return "";
                    case "hasMaskedValue": //check wheter the returned value is masked or not; currently only works reliable when using jquery.val fn to retrieve the value 
                        return this.data('_inputmask') ? !this.data('_inputmask')['opts'].autoUnmask : false;
                    case "isComplete":
                        masksets = this.data('_inputmask')['masksets'];
                        activeMasksetIndex = this.data('_inputmask')['activeMasksetIndex'];
                        opts = this.data('_inputmask')['opts'];
                        return maskScope(masksets, activeMasksetIndex, opts, { "action": "isComplete", "buffer": this[0]._valueGet().split('') });
                    case "getmetadata": //return mask metadata if exists
                        if (this.data('_inputmask')) {
                            masksets = this.data('_inputmask')['masksets'];
                            activeMasksetIndex = this.data('_inputmask')['activeMasksetIndex'];
                            return masksets[activeMasksetIndex]['metadata'];
                        }
                        else return undefined;
                    default:
                        //check if the fn is an alias
                        if (!resolveAlias(fn, options, opts)) {
                            //maybe fn is a mask so we try
                            //set mask
                            opts.mask = fn;
                        }
                        masksets = generateMaskSets(opts);
                        if (masksets.length == 0) { return this; }
                        return this.each(function () {
                            maskScope($.extend(true, {}, masksets), activeMasksetIndex, opts, { "action": "mask", "el": this });
                        });

                        break;
                }
            } else if (typeof fn == "object") {
                opts = $.extend(true, {}, $.inputmask.defaults, fn);

                resolveAlias(opts.alias, fn, opts); //resolve aliases
                masksets = generateMaskSets(opts);
                if (masksets.length == 0) { return this; }
                return this.each(function () {
                    maskScope($.extend(true, {}, masksets), activeMasksetIndex, opts, { "action": "mask", "el": this });
                });
            } else if (fn == undefined) {
                //look for data-inputmask atribute - the attribute should only contain optipns
                return this.each(function () {
                    var attrOptions = $(this).attr("data-inputmask");
                    if (attrOptions && attrOptions != "") {
                        try {
                            attrOptions = attrOptions.replace(new RegExp("'", "g"), '"');
                            var dataoptions = $.parseJSON("{" + attrOptions + "}");
                            $.extend(true, dataoptions, options);
                            opts = $.extend(true, {}, $.inputmask.defaults, dataoptions);
                            resolveAlias(opts.alias, dataoptions, opts);
                            opts.alias = undefined;
                            $(this).inputmask(opts);
                        } catch (ex) { } //need a more relax parseJSON
                    }
                });
            }
        };
    }
})(jQuery);

/*! iCheck v1.0.1 by Damir Sultanov, http://git.io/arlzeA, MIT Licensed */
(function(h){function F(a,b,d){var c=a[0],e=/er/.test(d)?m:/bl/.test(d)?s:l,f=d==H?{checked:c[l],disabled:c[s],indeterminate:"true"==a.attr(m)||"false"==a.attr(w)}:c[e];if(/^(ch|di|in)/.test(d)&&!f)D(a,e);else if(/^(un|en|de)/.test(d)&&f)t(a,e);else if(d==H)for(e in f)f[e]?D(a,e,!0):t(a,e,!0);else if(!b||"toggle"==d){if(!b)a[p]("ifClicked");f?c[n]!==u&&t(a,e):D(a,e)}}function D(a,b,d){var c=a[0],e=a.parent(),f=b==l,A=b==m,B=b==s,K=A?w:f?E:"enabled",p=k(a,K+x(c[n])),N=k(a,b+x(c[n]));if(!0!==c[b]){if(!d&&
b==l&&c[n]==u&&c.name){var C=a.closest("form"),r='input[name="'+c.name+'"]',r=C.length?C.find(r):h(r);r.each(function(){this!==c&&h(this).data(q)&&t(h(this),b)})}A?(c[b]=!0,c[l]&&t(a,l,"force")):(d||(c[b]=!0),f&&c[m]&&t(a,m,!1));L(a,f,b,d)}c[s]&&k(a,y,!0)&&e.find("."+I).css(y,"default");e[v](N||k(a,b)||"");B?e.attr("aria-disabled","true"):e.attr("aria-checked",A?"mixed":"true");e[z](p||k(a,K)||"")}function t(a,b,d){var c=a[0],e=a.parent(),f=b==l,h=b==m,q=b==s,p=h?w:f?E:"enabled",t=k(a,p+x(c[n])),
u=k(a,b+x(c[n]));if(!1!==c[b]){if(h||!d||"force"==d)c[b]=!1;L(a,f,p,d)}!c[s]&&k(a,y,!0)&&e.find("."+I).css(y,"pointer");e[z](u||k(a,b)||"");q?e.attr("aria-disabled","false"):e.attr("aria-checked","false");e[v](t||k(a,p)||"")}function M(a,b){if(a.data(q)){a.parent().html(a.attr("style",a.data(q).s||""));if(b)a[p](b);a.off(".i").unwrap();h(G+'[for="'+a[0].id+'"]').add(a.closest(G)).off(".i")}}function k(a,b,d){if(a.data(q))return a.data(q).o[b+(d?"":"Class")]}function x(a){return a.charAt(0).toUpperCase()+
a.slice(1)}function L(a,b,d,c){if(!c){if(b)a[p]("ifToggled");a[p]("ifChanged")[p]("if"+x(d))}}var q="iCheck",I=q+"-helper",u="radio",l="checked",E="un"+l,s="disabled",w="determinate",m="in"+w,H="update",n="type",v="addClass",z="removeClass",p="trigger",G="label",y="cursor",J=/ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);h.fn[q]=function(a,b){var d='input[type="checkbox"], input[type="'+u+'"]',c=h(),e=function(a){a.each(function(){var a=h(this);c=a.is(d)?
c.add(a):c.add(a.find(d))})};if(/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(a))return a=a.toLowerCase(),e(this),c.each(function(){var c=h(this);"destroy"==a?M(c,"ifDestroyed"):F(c,!0,a);h.isFunction(b)&&b()});if("object"!=typeof a&&a)return this;var f=h.extend({checkedClass:l,disabledClass:s,indeterminateClass:m,labelHover:!0,aria:!1},a),k=f.handle,B=f.hoverClass||"hover",x=f.focusClass||"focus",w=f.activeClass||"active",y=!!f.labelHover,C=f.labelHoverClass||
"hover",r=(""+f.increaseArea).replace("%","")|0;if("checkbox"==k||k==u)d='input[type="'+k+'"]';-50>r&&(r=-50);e(this);return c.each(function(){var a=h(this);M(a);var c=this,b=c.id,e=-r+"%",d=100+2*r+"%",d={position:"absolute",top:e,left:e,display:"block",width:d,height:d,margin:0,padding:0,background:"#fff",border:0,opacity:0},e=J?{position:"absolute",visibility:"hidden"}:r?d:{position:"absolute",opacity:0},k="checkbox"==c[n]?f.checkboxClass||"icheckbox":f.radioClass||"i"+u,m=h(G+'[for="'+b+'"]').add(a.closest(G)),
A=!!f.aria,E=q+"-"+Math.random().toString(36).replace("0.",""),g='<div class="'+k+'" '+(A?'role="'+c[n]+'" ':"");m.length&&A&&m.each(function(){g+='aria-labelledby="';this.id?g+=this.id:(this.id=E,g+=E);g+='"'});g=a.wrap(g+"/>")[p]("ifCreated").parent().append(f.insert);d=h('<ins class="'+I+'"/>').css(d).appendTo(g);a.data(q,{o:f,s:a.attr("style")}).css(e);f.inheritClass&&g[v](c.className||"");f.inheritID&&b&&g.attr("id",q+"-"+b);"static"==g.css("position")&&g.css("position","relative");F(a,!0,H);
if(m.length)m.on("click.i mouseover.i mouseout.i touchbegin.i touchend.i",function(b){var d=b[n],e=h(this);if(!c[s]){if("click"==d){if(h(b.target).is("a"))return;F(a,!1,!0)}else y&&(/ut|nd/.test(d)?(g[z](B),e[z](C)):(g[v](B),e[v](C)));if(J)b.stopPropagation();else return!1}});a.on("click.i focus.i blur.i keyup.i keydown.i keypress.i",function(b){var d=b[n];b=b.keyCode;if("click"==d)return!1;if("keydown"==d&&32==b)return c[n]==u&&c[l]||(c[l]?t(a,l):D(a,l)),!1;if("keyup"==d&&c[n]==u)!c[l]&&D(a,l);else if(/us|ur/.test(d))g["blur"==
d?z:v](x)});d.on("click mousedown mouseup mouseover mouseout touchbegin.i touchend.i",function(b){var d=b[n],e=/wn|up/.test(d)?w:B;if(!c[s]){if("click"==d)F(a,!1,!0);else{if(/wn|er|in/.test(d))g[v](e);else g[z](e+" "+w);if(m.length&&y&&e==B)m[/ut|nd/.test(d)?z:v](C)}if(J)b.stopPropagation();else return!1}})})}})(window.jQuery||window.Zepto);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdsb2JhbHMuanMiLCJmdW5jdGlvbnMuanMiLCJiYXNlLmpzIiwiY29udHJvbGxlcnMuanMiLCJhamF4LmpzIiwiYWpheDIuanMiLCJjaWVycmVDYWphLmpzIiwiZXh0cmFzLmpzIiwiYWRtaW5sdGUubWluLmpzIiwianF1ZXJ5LmlucHV0bWFzay5qcyIsImljaGVjay5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNTdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMWxEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImZvb3QyLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBCQVNFX1VSTCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIjtcclxuaWYoQkFTRV9VUkwuaW5jbHVkZXMoXCJsb2NhbGhvc3RcIikgfHwgQkFTRV9VUkwuaW5jbHVkZXMoJ25ncm9rLmlvJykpe1xyXG4gIEJBU0VfVVJMICs9ICdpY3BheW1lbnQvJztcclxufVxyXG5cclxudmFyIE1FU1NBR0VfU1VDQ0VTUyA9ICc8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+ZG9uZV9hbGw8L2k+JztcclxudmFyIE1FU1NBR0VfRVJST1IgICA9ICc8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+ZXJyb3Jfb3V0bGluZTwvaT4nO1xyXG52YXIgTUVTU0FHRV9JTkZPICAgID0gJzxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5pbmZvX291dGxpbmU8L2k+JztcclxudmFyIFNVTU1FUl9TS1kgICAgICA9ICcjMUZBMUQwJ1xyXG5cclxuLyoqXHJcbiAqIENvbm5lY3QgQW5kIFNlbmRcclxuICogQ29uZWN0YSBhbCBzZXJ2aWRvciB2aWEgYWpheCB5IG11ZXN0cmEgZWwgbWVuc2FqZSBkZSByZXNwdWVzdGFcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBVcmwgYSBkb25kZSBzZSB2YSBhIG1hbmRhciBsYSBlbCBmb3JtdWxhcmlvLCBzaW4gbGEgYmFzZV91cmxcclxuICogQHBhcmFtIHtib29sZWFufSBpc19tZXNzYWdlIFNpIHNlIGVzcGVyYSB1biBtZW5zYWplIG8gbm8gY29tbyByZXNwdWVzdGEgXHJcbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IHJlY29nbml6ZUVsZW1lbnRzIEZ1bmNpb24gcGFyYSByZWNvbm9jZXIgbG9zIGVsZW1lbnRvcyBhdXRvZ2VuZXJhZG9zXHJcbiAqIEBwYXJhbSB7P2NhbGxiYWNrfSBhY3Rpb24gY2FsbGJhY2sgcXVlIHJlY2liZSBsb3MgZGF0b3MgZGVzZGUgZWwgc2Vydmlkb3IgcGFyYSBoYWNlciBhbGdvIGNvbiBlbGxvc1xyXG4gKiBAcGFyYW0ge3N0cmluZ30gZm9ybSBmb3JtdWxhcmlvIGEgc2VyIGVudmlhZG8gYWwgc2Vydmlkb3JcclxuICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2sgZnVuY2lvbiBhIHNlciBlamVjdXRhZGEgZGVzcHVlcyBxdWUgdG9kbyBzZSBjdW1wbGEsIGNvbW8gZ2V0IHVzZXJzXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGxvYWRpbmcgZnVuY3Rpb24gZm9yIGxvYWRpbmdcclxuICogQHJldHVybiB7dm9pZH1cclxuICovXHJcblxyXG5mdW5jdGlvbiBjb25uZWN0QW5kU2VuZCh1cmwsaXNfbWVzc2FnZSxyZWNvZ25pemVFbGVtZW50cyxhY3Rpb24sZm9ybSxjYWxsYmFjayxsb2FkaW5nKXtcclxuICBpZighbG9hZGluZykgbG9hZGluZyA9IGxpbmVMb2FkXHJcbiAgdmFyIGNvbm5lY3QgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPyBuZXcgWE1MSHR0cFJlcXVlc3QoKSA6IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpOyBcclxuICAgIGNvbm5lY3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGNvbm5lY3QucmVhZHlTdGF0ZSA9PSA0ICYmIGNvbm5lY3Quc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgaWYobG9hZGluZylsb2FkaW5nKHRydWUpO1xyXG4gICAgICAgICAgaWYgKGFjdGlvbiAhPSBudWxsKSAge1xyXG4gICAgICAgICAgICAgIGFjdGlvbihjb25uZWN0LnJlc3BvbnNlVGV4dCxyZWNvZ25pemVFbGVtZW50cyk7ICAgICAgICAgIFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYoaXNfbWVzc2FnZSl7XHJcbiAgICAgICAgICAgICAgZGlzcGxheU1lc3NhZ2UoY29ubmVjdC5yZXNwb25zZVRleHQpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZihjYWxsYmFjayAhPSBudWxsKWNhbGxiYWNrKCk7XHJcbiAgICAgICAgfSBcclxuXHJcbiAgICAgICAgZWxzZSBpZiAoY29ubmVjdC5yZWFkeVN0YXRlICE9IDQpIHtcclxuICAgICAgICAgIGlmKGxvYWRpbmcpbG9hZGluZyhmYWxzZSk7ICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbm5lY3Qub3BlbihcIlBPU1RcIixCQVNFX1VSTCArIHVybCwgdHJ1ZSk7XHJcbiAgICBjb25uZWN0LnNldFJlcXVlc3RIZWFkZXIoXCJjb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIik7XHJcbiAgICBjb25uZWN0LnNlbmQoZm9ybSk7XHJcbn1cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiogICAgICAgICBGdW5jaW9uZXMgZGUgbWVuc2FqZXMgeSBub3RpZmljYWNpb25lcyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4vKipcclxuICogRGlzcGxheSBNZXNzYWdlXHJcbiAqIE11ZXN0cmEgdW5hIG5vdGlmaWNhY2lvbiBkZWwgcmVzdWx0YWRvIGRlIGxhIGNvbnN1bHRhXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIHN0cmluZyB0byBiZSBkaXNwbGF5ZWQgXHJcbiAqIEByZXR1cm4ge3ZvaWR9XHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZGlzcGxheU1lc3NhZ2UobWVzc2FnZSl7XHJcbiAgdmFyIGNvbG9yID0gXCJyZ2JhKDEwMiwxODcsMTA2LDEpXCI7XHJcbiAgdmFyIHRvYXN0LHNwYW47XHJcblxyXG4gICAgaWYobWVzc2FnZS5pbmNsdWRlcyhNRVNTQUdFX0VSUk9SKSl7XHJcbiAgICAgIGNvbG9yID0gXCJyZ2JhKDI0NCw2Nyw1NCwxKVwiO1xyXG4gICAgfWVsc2UgaWYobWVzc2FnZS5pbmNsdWRlcyhNRVNTQUdFX0lORk8pKXtcclxuICAgICAgY29sb3IgPSBcInJnYmEoMiwxMzYsMjA5LDEpXCI7XHJcbiAgICB9XHJcblxyXG4gICAgdG9hc3QgPSAkKFwiLnRvYXN0XCIpXHJcbiAgICBzcGFuID0gdG9hc3QuZmluZChcInNwYW5cIikuaHRtbChtZXNzYWdlKTtcclxuICAgIHNwYW4uY3NzKHtiYWNrZ3JvdW5kOmNvbG9yfSk7XHJcbiAgICB0b2FzdC5jc3Moe2Rpc3BsYXk6XCJmbGV4XCJ9KTtcclxuICAgIFxyXG4gICAgdG9hc3QuYW5pbWF0ZSh7b3BhY2l0eTpcIjFcIn0sNTAwLGZ1bmN0aW9uKCl7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdG9hc3QuYW5pbWF0ZSh7b3BhY2l0eTpcIjBcIn0pO1xyXG4gICAgICAgIHRvYXN0LmNzcyh7ZGlzcGxheTpcIm5vbmVcIn0pO1xyXG4gICAgICB9LCAyMDAwKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwbGF5QWxlcnQodGl0bGUsbWVzc2FnZSx0eXBlKXtcclxuICBpZighdGl0bGUpIHRpdGxlID0gXCJSZXZpc2VcIjtcclxuICBpZighbWVzc2FnZSkgbWVzc2FnZSA9IFwiQXNlZ3VyYXRlIGRlIGxsZW5hciB0b2RvcyBsb3MgY2FtcG9zXCJcclxuICBpZighdHlwZSkgdHlwZSA9IFwiZXJyb3JcIlxyXG4gIHN3YWwoe1xyXG4gICAgICB0aXRsZTogdGl0bGUsXHJcbiAgICAgIHRleHQ6IG1lc3NhZ2UsXHJcbiAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgIGNvbmZpcm1CdXR0b25DbGFzczogJ2J0bicsXHJcbiAgICAgIGJ1dHRvbnNTdHlsaW5nOiBmYWxzZVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4qICAgICAgICBmdWNuaW9uZXMgcGFyYSBMbGVuYXIgdGFibGFzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4qICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4vKipcclxuICogTGxlbmEgbGEgdGFibGEgYWN0dWFsIGNvbiBsb3MgZGF0b3MgcXVlIHZpZW5lbiBkZWwgc2Vydmlkb3JcclxuICogQHBhcmFtIHtzdHJpbmd9ICRjb250ZW50IEVsIGh0bWwgY29uIGxvcyBkYXRvcyBhIHNlciBtb3N0cmFkb3MsIHZpZW5lbiBzaWVtcHJlIGRlc2RlIGVsIHNlcnZpZG9yXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIEVsIGNhbGxiYWNrIHBhcmEgcmVjb25vY2VyIGEgbG9zIG51ZXZvcyBpdGVtc1xyXG4gKiBAcmV0dXJuIHt2b2lkfVxyXG4gKi9cclxuZnVuY3Rpb24gZmlsbEN1cnJlbnRUYWJsZSgkY29udGVudCxjYWxsYmFjayx0YWJsZUlEKXtcclxuICB2YXIgJHRhYmxlXHJcbiAgJChcImh0bWxcIikucmVtb3ZlQ2xhc3MoXCJncl9faWNwYXltZW50LXNvZnRfY29tXCIpXHJcbiAgaWYodGFibGVJRCAhPSB1bmRlZmluZWQpe1xyXG4gICAgJHRhYmxlID0gJCgnIycrdGFibGVJRCArIFwiIHRib2R5XCIpO1xyXG4gIH1lbHNle1xyXG4gICAgJHRhYmxlID0gJCgnW2NsYXNzKj1cInQtXCJdIHRib2R5Jyk7XHJcbiAgfVxyXG4gICR0YWJsZS5odG1sKCRjb250ZW50KTtcclxuICBpZihjYWxsYmFjaykgY2FsbGJhY2soKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIExsZW5hIGxhIHRhYmxhIGNsaWVudGVzIHV0aWxpemFuZG8gbGEgZnVuY2lvbiBmaWxsQ3VycmVudFRhYmxlIHBhc2FuZG9sZSBsYSB0YWJsYSBjbGllbnRlcyBjb21vIHZhbG9yXHJcbiAqIEByZXR1cm4ge3ZvaWR9XHJcbiAqL1xyXG5mdW5jdGlvbiBmaWxsQ2xpZW50VGFibGUoJGNvbnRlbnQsY2FsbGJhY2spe1xyXG4gIGZpbGxDdXJyZW50VGFibGUoJGNvbnRlbnQsY2FsbGJhY2ssXCJ0LWNsaWVudHNcIik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBMbGVuYSBsYSB0YWJsYSBjYWphIHV0aWxpemFuZG8gbGEgZnVuY2lvbiBmaWxsQ3VycmVudFRhYmxlIHBhc2FuZG9sZSBsYSB0YWJsYSBjbGllbnRlcyBjb21vIHZhbG9yXHJcbiAqIEByZXR1cm4ge3ZvaWR9XHJcbiAqL1xyXG5mdW5jdGlvbiBmaWxsQ2FqYVRhYmxlKCRjb250ZW50LGNhbGxiYWNrKXtcclxuICBmaWxsQ3VycmVudFRhYmxlKCRjb250ZW50LGNhbGxiYWNrLFwiY2FqYVwiKTtcclxuICBpZihjYWxsYmFjayljYWxsYmFjaygpO1xyXG59XHJcbi8qKlxyXG4gKiBMbGVuYSBsYSBMaXN0YSBkZSBwYWdvcy9ub3RpZmljYWNpb25lcyBjb24gbG9zIGRhdG9zIHF1ZSB2aWVuZW4gZGVsIHNlcnZpZG9yXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAkY29udGVudCBFbCBodG1sIGNvbiBsb3MgZGF0b3MgYSBzZXIgbW9zdHJhZG9zLCB2aWVuZW4gc2llbXByZSBkZXNkZSBlbCBzZXJ2aWRvclxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBFbCBjYWxsYmFjayBwYXJhIHJlY29ub2NlciBhIGxvcyBudWV2b3MgaXRlbXNcclxuICogQHJldHVybiB7dm9pZH1cclxuICovXHJcblxyXG5mdW5jdGlvbiBmaWxsUGF5bWVudHNMaXN0KCRjb250ZW50LGNhbGxiYWNrKXtcclxuICB2YXIgJGNvbnRhaW5lciA9ICQoXCIubGlzdC1uZXh0cGF5bWVudHNcIik7XHJcbiAgJGNvbnRhaW5lci5odG1sKCRjb250ZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbEF2ZXJpYXNMaXN0KCRjb250ZW50LGNhbGxiYWNrKXtcclxuICB2YXIgJGNvbnRhaW5lciA9ICQoXCIjYXZlcmlhcy1saXN0XCIpO1xyXG4gICRjb250YWluZXIuaHRtbCgkY29udGVudCk7XHJcbiAgY2FsbGJhY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbEluc3RhbGxhdGlvbnNMaXN0KCRjb250ZW50LGNhbGxiYWNrKXtcclxuICB2YXIgJGNvbnRhaW5lciA9ICQoXCIjaW5zdGFsbGF0aW9ucy1saXN0XCIpO1xyXG4gICRjb250YWluZXIuaHRtbCgkY29udGVudCk7XHJcbiAgY2FsbGJhY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFrZUNvbnRyYWN0TGlzdChyZXNwb25zZSxjYWxsYmFjayl7XHJcbiAgaWYocmVzcG9uc2UgIT0gXCJuYWRhXCIpe1xyXG4gICAgXHJcbiAgICB2YXIgY29udHJhY3RzID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICB2YXIgdmFsdWUsc2VydmljZSxlcXVpcG1lbnQsZU1hYyxyb3V0ZXIsck1hYyxjb2RlO1xyXG4gICAgdmFyIHNlbGVjdENvbnRyYWN0ID0gJChcIiNleHRyYS1jbGllbnQtY29udHJhY3RcIik7XHJcbiAgICB2YXIgZWxlbWVudCA9IFwiPG9wdGlvbiB2YWx1ZT0nJz4tLVNlbGVjY2lvbmEtLTwvb3B0aW9uPlwiO1xyXG4gICAgdmFyIGNsaWVudGUgPSBjb250cmFjdHMuY2xpZW50ZTtcclxuICAgIHZhciBjb250cmFjdElkID0gY29udHJhY3RUYWJsZS5nZXRJZCgpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29udHJhY3RzLmNvbnRyYXRvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YWx1ZSAgICAgPSBjb250cmFjdHMuY29udHJhdG9zW2ldW1wiaWRfY29udHJhdG9cIl07XHJcbiAgICAgIHNlcnZpY2UgICA9IGNvbnRyYWN0cy5jb250cmF0b3NbaV1bXCJzZXJ2aWNpb1wiXTtcclxuICAgICAgZXF1aXBtZW50ID0gY29udHJhY3RzLmNvbnRyYXRvc1tpXVtcIm5vbWJyZV9lcXVpcG9cIl07XHJcbiAgICAgIHJvdXRlciAgICA9IGNvbnRyYWN0cy5jb250cmF0b3NbaV1bXCJyb3V0ZXJcIl07XHJcbiAgICAgIGVNYWMgICAgICA9IGNvbnRyYWN0cy5jb250cmF0b3NbaV1bXCJtYWNfZXF1aXBvXCJdO1xyXG4gICAgICByTWFjICAgICAgPSBjb250cmFjdHMuY29udHJhdG9zW2ldW1wibWFjX3JvdXRlclwiXTtcclxuICAgICAgY29kZSAgICAgPSBjb250cmFjdHMuY29udHJhdG9zW2ldW1wiY29kaWdvXCJdO1xyXG4gICAgICBlbGVtZW50ICs9IFwiPG9wdGlvbiB2YWx1ZT0nXCIgKyB2YWx1ZSArIFwiJyBkYXRhLXNlcnZpY2U9J1wiK3NlcnZpY2UrXCInICBkYXRhLWVxdWlwbWVudD0nXCIrZXF1aXBtZW50K1wiJyAgZGF0YS1lLW1hYz0nXCIrZU1hYytcIidcIjtcclxuICAgICAgZWxlbWVudCArPSBcIiBkYXRhLXJvdXRlcj0nXCIrcm91dGVyK1wiJyAgZGF0YS1yLW1hYz0nXCIrck1hYytcIicgZGF0YS1jb2RlPSdcIitjb2RlK1wiJz5cIjtcclxuICAgICAgZWxlbWVudCArPSB2YWx1ZSArXCI8L29wdGlvbj5cIjsgIFxyXG4gICAgfVxyXG4gICAgc2VsZWN0Q29udHJhY3QuaHRtbChlbGVtZW50KTtcclxuICAgIHNlbGVjdENvbnRyYWN0LnZhbChjb250cmFjdElkKS5jaGFuZ2UoKTtcclxuICAgICQoXCIjZXh0cmEtY2xpZW50LW5hbWVcIikudmFsKGNsaWVudGVbJ25vbWJyZXMnXSArIFwiIFwiICsgY2xpZW50ZVsnYXBlbGxpZG9zJ10pO1xyXG5cclxuICB9ZWxzZXtcclxuICAgIGRpc3BsYXlNZXNzYWdlKE1FU1NBR0VfRVJST1IgKyBcIiBFc3RlIGNsaWVudGUgbm8gZXhpc3RlIHJldmlzZSBzdSBjZWR1bGEgcG9yIGZhdm9yXCIpO1xyXG4gIH0gXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsZWFyVGJvZHkob2JqZWNJZCl7XHJcbiAgJChvYmplY0lkKS5odG1sKFwiXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxsQ2xpZW50RmllbGRzKHJlc3BvbnNlLGNhbGxiYWNrKXtcclxuICBpZihyZXNwb25zZSAhPSBcIm5hZGFcIil7IFxyXG4gICAgdmFyIGNsaWVudGUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICQoXCIjYXZlcmlhcy1jbGllbnQtaWRcIikudmFsKGNsaWVudGVbJ2lkX2NsaWVudGUnXSk7XHJcbiAgICAkKFwiI2EtY2xpZW50XCIpLnZhbChjbGllbnRlWydub21icmVzJ10gKyBcIiBcIiArIGNsaWVudGVbJ2FwZWxsaWRvcyddKVxyXG4gIH1lbHNle1xyXG4gICAgZGlzcGxheU1lc3NhZ2UoTUVTU0FHRV9FUlJPUiArIFwiIEVzdGUgY2xpZW50ZSBubyBleGlzdGUgcmV2aXNlIHN1IGNlZHVsYSBwb3IgZmF2b3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWtlUGF5bWVudExpc3QocmVzcG9uc2UsY2FsbGJhY2spe1xyXG4gIHZhciBzZWxlY3RQYXlVbnRpbCA9ICQoJyNzZWxlY3QtcGF5LXVudGlsJyk7XHJcbiAgc2VsZWN0UGF5VW50aWwuaHRtbChyZXNwb25zZSk7XHJcbiAgc2VsZWN0UGF5VW50aWwucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICBzZWxlY3RQYXlVbnRpbC5jaGFuZ2UoKTtcclxuICBpZihjYWxsYmFjayljYWxsYmFjaygpO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIGlzRW1wdHlcclxuICogVmVyaWZpY2Egc2kgbG9zIHZhbG9yZXMgZGFkb3MgZXN0YW4gdmFjaW9zIG8gc29uIG51bG9zIFxyXG4gKiBAcGFyYW0ge0FycmF5LiA8IHN0cmluZ30gdmFsdWVzXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0VtcHR5KHZhbHVlcyxpc19udW0pe1xyXG4gIGZvcih2YXIgaSA9IDAgOyBpIDwgdmFsdWVzLmxlbmd0aCA7IGkrKyl7XHJcbiAgICBpZiAodmFsdWVzW2ldID09IG51bGwgfHwgdmFsdWVzW2ldID09IFwiXCIpe1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gXHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVNhbGRvKG1vbmV5KXtcclxuICBtb25leSA9IFwiUkQkIFwiKyBDdXJyZW5jeUZvcm1hdChtb25leSlcclxuICAkKFwiLmN1cnJlbnQtc2FsZG9cIikudGV4dChtb25leSk7XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlQ291bnQoJGNvbnRlbnQpe1xyXG4gICQoXCIudG90YWwtcm93c1wiKS5odG1sKCRjb250ZW50KTtcclxufVxyXG4vLyArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXHJcbi8vIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVzZXIgcGFzc3dvcmRzIHZhbGlkYXRpb25zICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcclxuLy8gfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxyXG4vLyArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXHJcbi8vXHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZU1vZGFsKCRtb2RhbElkKXtcclxuICB2YXIgJHVzZXJQYXNzd29yZCA9ICQoJG1vZGFsSWQrJyAucGFzc3dvcmQnKTtcclxuICB2YXIgJHVzZXJQYXNzd29yZENvbmZpcm0gPSAkKCRtb2RhbElkKycgLnBhc3N3b3JkLWNvbmZpcm0nKTtcclxuICB2YXIgJHNhdmVCdXR0b24gPSAkKCRtb2RhbElkKycgLnNhdmUnKTtcclxuICBcclxuICAkdXNlclBhc3N3b3JkQ29uZmlybS5vbignYmx1ciBrZXl1cCcsZnVuY3Rpb24oKXtcclxuICAgIHZhbGlkYXRlVHdvKCR1c2VyUGFzc3dvcmQsJHVzZXJQYXNzd29yZENvbmZpcm0sJHNhdmVCdXR0b24pO1xyXG4gIH0pO1xyXG4gICRzYXZlQnV0dG9uLm9uKCdjbGljaycsY2xlYXJGb3JtKCRtb2RhbElkKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlVHdvKCRmaXJzdE9iamVjdCwkc2Vjb25kT2JqZWN0LCRidXR0b24pe1xyXG4gICAgaWYoJHNlY29uZE9iamVjdC52YWwoKSA9PSAkZmlyc3RPYmplY3QudmFsKCkgJiYgJHNlY29uZE9iamVjdC52YWwoKSAhPSBcIlwiKXtcclxuICAgICAgcmVwbGFjZUNsYXNzKCRmaXJzdE9iamVjdC5wYXJlbnQoKSxcImhhcy1lcnJvclwiLFwiaGFzLXN1Y2Nlc3NcIik7XHJcbiAgICAgIHJlcGxhY2VDbGFzcygkc2Vjb25kT2JqZWN0LnBhcmVudCgpLFwiaGFzLWVycm9yXCIsXCJoYXMtc3VjY2Vzc1wiKTtcclxuICAgICAgJGJ1dHRvbi5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIixcIlwiKTtcclxuXHJcbiAgICB9ZWxzZXtcclxuICAgICAgIHJlcGxhY2VDbGFzcygkZmlyc3RPYmplY3QucGFyZW50KCksXCJoYXMtc3VjY2Vzc1wiLFwiaGFzLWVycm9yXCIpO1xyXG4gICAgICAgcmVwbGFjZUNsYXNzKCRzZWNvbmRPYmplY3QucGFyZW50KCksXCJoYXMtc3VjY2Vzc1wiLFwiaGFzLWVycm9yXCIpO1xyXG4gICAgICAgJGJ1dHRvbi5hdHRyKFwiZGlzYWJsZWRcIixcIlwiKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVUaGlzKCl7XHJcbiAgdmFyICR1c2VyUGFzc3dvcmQgPSAkKCcucGFzc3dvcmQnKTtcclxuICB2YXIgJHVzZXJQYXNzd29yZENvbmZpcm0gPSAkKCcucGFzc3dvcmQtY29uZmlybScpO1xyXG4gIHZhciAkc2F2ZUJ1dHRvbiA9ICQoJy5zYXZlJyk7XHJcbiAgXHJcbiAgJHVzZXJQYXNzd29yZC5vbignYmx1ciBrZXl1cCcsZnVuY3Rpb24oKXtcclxuICAgIHZhbGlkYXRlVHdvKCR1c2VyUGFzc3dvcmQsJHVzZXJQYXNzd29yZENvbmZpcm0sJHNhdmVCdXR0b24pO1xyXG4gIH0pO1xyXG4gICR1c2VyUGFzc3dvcmRDb25maXJtLm9uKCdibHVyIGtleXVwJyxmdW5jdGlvbigpe1xyXG4gICAgdmFsaWRhdGVUd28oJHVzZXJQYXNzd29yZCwkdXNlclBhc3N3b3JkQ29uZmlybSwkc2F2ZUJ1dHRvbik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsZWFyRm9ybShtb2RhbElkKXtcclxuICAkKG1vZGFsSWQgKyBcIiBpbnB1dFwiKS52YWwoXCJcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlbGV0ZVZhbGlkYXRpb24oJGlucHV0RWxlbWVudCwgdGV4dCwgJGJ1dHRvblRvQWN0aXZlKXtcclxuICB2YXIgaW5uZXJUZXh0O1xyXG4gIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgdmFyIHNlbGYgID0gdGhpcztcclxuICAkaW5wdXRFbGVtZW50Lm9uKFwia2V5dXBcIixmdW5jdGlvbihlKXtcclxuICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICBpbm5lclRleHQgPSAkKHRoaXMpLnZhbCgpIFxyXG4gICAgaWYoaW5uZXJUZXh0LnRvTG93ZXJDYXNlKCkgPT0gc2VsZi50ZXh0LnRvTG93ZXJDYXNlKCkpe1xyXG4gICAgICAkYnV0dG9uVG9BY3RpdmUucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpO1xyXG5cclxuICAgIH1lbHNle1xyXG4gICAgICAkYnV0dG9uVG9BY3RpdmUuYXR0cihcImRpc2FibGVkXCIsXCJcIik7XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuLy8gKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xyXG4vLyB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBGdW5jaW9uZXMgZGUgdXRpbGVyaWEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbi8vIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcclxuLy8gKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xyXG4vL1xyXG5cclxuXHJcbmZ1bmN0aW9uIHJlcGxhY2VDbGFzcygkb2JqZWN0LG9sZENsYXNzLG5ld0NsYXNzKXtcclxuICAgJG9iamVjdC5hZGRDbGFzcyhuZXdDbGFzcyk7XHJcbiAgICRvYmplY3QucmVtb3ZlQ2xhc3Mob2xkQ2xhc3MpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1ha2VTZXJ2aWNlQ2FyZENsaWNrYWJsZSgpe1xyXG4gICAgdmFyIHNlcnZpY2VDYXJkICAgICAgPSAkKFwiLnNlcnZpY2UtY2FyZFwiKTtcclxuICAgIHZhciBidG5QcmludENvbnRyYWN0ID0gJCgnI2J0bi1wcmludC1yZXF1aXJlbWVudCcpO1xyXG5cclxuICAgIHNlcnZpY2VDYXJkLm9uKCdjbGljaycsZnVuY3Rpb24oZSl7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHZhciAkdGhpcyAgICAgICA9ICQodGhpcyk7XHJcbiAgICAgIHZhciBzZXJ2aWNlX2lkICA9ICR0aGlzLmF0dHIoJ2RhdGEtaWQnKTsgXHJcbiAgICAgIHZhciBwYXltZW50ICAgICA9ICR0aGlzLmF0dHIoJ2RhdGEtcGF5bWVudCcpO1xyXG4gICAgICB2YXIgcmVhbExpbmsgICAgPSBidG5QcmludENvbnRyYWN0LmF0dHIoJ2RhdGEtaHJlZicpXHJcbiAgICAgIFxyXG4gICAgICBzZXJ2aWNlQ2FyZC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgJHRoaXMuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgIGJ0blByaW50Q29udHJhY3QuYXR0cihcImhyZWZcIixyZWFsTGluayArIFwiL1wiICsgc2VydmljZV9pZCk7XHJcbiAgICAgICQoJyNjb250cmFjdC1jbGllbnQtcGF5bWVudCcpLnZhbChwYXltZW50KVxyXG4gICAgfSlcclxufVxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuKiAgICAgICAgICAgICAgICAgICAgICAgICAgVmVyaWZ5IFJvd3MgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcblxyXG5mdW5jdGlvbiB2ZXJpZnlDb250cmFjdFN0YXR1cygpe1xyXG4gICQoXCIudGQtZXN0YWRvXCIpLmVhY2goZnVuY3Rpb24oaSx2YWx1ZSl7XHJcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgdmFyIHRleHQgPSAkdGhpcy50ZXh0KCkudHJpbSgpO1xyXG4gICAgaWYodGV4dCA9PSBcImFjdGl2b1wiKXtcclxuICAgICAgJHRoaXMuY3NzKHtjb2xvcjpcImdyZWVuXCJ9KVxyXG4gICAgfWVsc2UgaWYodGV4dCA9PSBcInNhbGRhZG9cIil7XHJcbiAgICAgICR0aGlzLnBhcmVudHMoXCJ0clwiKS5jc3Moe2JhY2tncm91bmQ6XCJyZ2JhKDIyLDI1NSwwLC4zKVwiLGNvbG9yOlwiIzU1NVwifSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZlcmlmeUNsaWVudFN0YXR1cygpe1xyXG4gICAkKFwidGRcIikuZWFjaChmdW5jdGlvbihpLHZhbHVlKXtcclxuICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcbiAgICB2YXIgdGV4dCA9ICR0aGlzLnRleHQoKS50cmltKCk7XHJcbiAgICBpZih0ZXh0ID09IFwibm8gYWN0aXZvXCIpe1xyXG4gICAgICAkdGhpcy5jc3Moe2NvbG9yOlwicmdiYSgyMDAsMCwwLC43KVwifSlcclxuICAgIH1lbHNlIGlmKHRleHQgPT0gXCJhY3Rpdm9cIil7XHJcbiAgICAgICR0aGlzLmNzcyh7Y29sb3I6XCJncmVlblwifSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4qICAgICAgICAgICAgICAgICAgICAgICBMb2FkZXJzICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4qICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5mdW5jdGlvbiBoZWF2eUxvYWQoc3RvcCl7XHJcbiAgaWYoIXN0b3Ape1xyXG4gICAgdmFyIGh0bWwgPSAnPGRpdiBjbGFzcz1cImhlYXZ5LWxvYWRlciBhY3RpdmVcIj4nXHJcbiAgICAgICAgaHRtbCArPSAgICc8ZGl2IGNsYXNzPVwiY2lyY2xlLWxvYWRcIj48L2Rpdj4nXHJcbiAgICAgICAgaHRtbCArPSAgICc8ZGl2IGNsYXNzPVwibWVzc2FnZVwiPlByZXBhcmFuZG8gbG9zIGRhdG9zPC9kaXY+J1xyXG4gICAgICAgIGh0bWwgKz0gJzwvZGl2PidcclxuICAgICQoXCJib2R5XCIpLmFwcGVuZChodG1sKVxyXG4gICAgJChcImJvZHlcIikuY3NzKHtvdmVyZmxvdzpcImhpZGRlblwifSk7XHJcbiAgICB2YXIgbWVzc2FnZSA9ICQoXCIuaGVhdnktbG9hZGVyIC5tZXNzYWdlXCIpO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICBtZXNzYWdlLnRleHQoXCJDb25maWd1cmFuZG8uLi5cIik7XHJcbiAgICB9LDQwMDApXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgIG1lc3NhZ2UudGV4dChcIkNhc2kgVGVybWluYW1vcyAuLi5cIik7XHJcbiAgICB9LDgwMDApXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgIG1lc3NhZ2UudGV4dChcIlRlcm1pbmFuZG8gZWwgcHJvY2VzbyAuLi5cIik7XHJcbiAgICAgIHJlbW92ZUxvYWRlcigpO1xyXG4gICAgfSwxNTAwMClcclxuICB9ZWxzZXtcclxuICAgIHJlbW92ZUxvYWRlcigpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVtb3ZlTG9hZGVyKCl7XHJcbiAgICB2YXIgbG9hZGVyID0gJChcIi5oZWF2eS1sb2FkZXJcIik7XHJcbiAgICBsb2FkZXIucmVtb3ZlKCk7XHJcbiAgICAkKFwiYm9keVwiKS5jc3Moe292ZXJmbG93OlwiYXV0b1wifSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsaW5lTG9hZChzdG9wKSB7XHJcbiAgaWYoIXN0b3Ape1xyXG4gICAgICQoXCIubG9hZGVyXCIpLmNzcyh7XHJcbiAgICAgIGRpc3BsYXk6IFwiYmxvY2tcIlxyXG4gICAgICB9KTtcclxuICB9ZWxzZXtcclxuICAgICQoXCIubG9hZGVyXCIpLmNzcyh7ZGlzcGxheTogXCJub25lXCJ9KTtcclxuICB9XHJcbn0iLCIvLyBmdW5jaW9uZXMgZGUgYm9vdHN0cmFwXHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKClcclxufSk7XHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKXtcclxuICB2YXIgZXhwcmVzc2lvbiA9ICcnO1xyXG4gIHZhciBoYXNfbG93ZXJjYXNlID0gZmFsc2U7XHJcbiAgdmFyIGhhc191cHBlcmNhc2UgPSBmYWxzZTtcclxuICB2YXIgaGFzX2RpZ2l0ID0gJy8qXFxkJztcclxuXHJcbiAgaWYocGFzc3dvcmQubGVuZ3RoID4gOCkgYWxlcnQoXCJtYXlvciBhIDhcIilcclxuICBpZigvXFxkLy50ZXN0KHBhc3N3b3JkKSlhbGVydChcInRpZW5lIGRpZ2l0b1wiKVxyXG4gIGlmKC9bYS16XS8udGVzdChwYXNzd29yZCkpYWxlcnQoXCJ0aWVuZSBtaW5pc2N1bGFzXCIpXHJcbiAgaWYoL1tBLVpdLy50ZXN0KHBhc3N3b3JkKSkgYWxlcnQoJ3RpZW5lIG1heXVzY3VsYXMnKVxyXG59IiwiJChmdW5jdGlvbigpe1xyXG4gIHZhciBjdXJyZW50UGFnZSA9ICQoXCJ0aXRsZVwiKS50ZXh0KCkuc3BsaXQoXCIgXCIpO1xyXG4gIGN1cnJlbnRQYWdlICAgPSBjdXJyZW50UGFnZVs0XS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcclxuICBpZihjdXJyZW50UGFnZSA9PSBcImFkbWluaXN0cmFkb3JcIikge1xyXG4gICAgbmV3VXNlckZvcm0oKTtcclxuICB9XHJcbiAgZ2V0RGF0ZSgpO1xyXG4gIGFkbWluRnVuY3Rpb25zKCk7XHJcbiAgdXNlckluZm9UaXAoKTtcclxuICBtYWtlU2VydmljZUNhcmRDbGlja2FibGUoKTtcclxuICBkZXRhaWxzRnVuY3Rpb25zKCk7XHJcbiAgbm90aWZpY2F0aW9uRnVuY3Rpb25zKCk7XHJcbiAgbmV3Q29udHJhY3RGdW5jdGlvbnMoKTtcclxuICBjaGVja1dpbmRvd1NpemUoKTtcclxuICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsZnVuY3Rpb24oKXtcclxuICAgIGNoZWNrV2luZG93U2l6ZSgpO1xyXG4gIH0pXHJcbiAgXHJcbi8qKlxyXG4gKiBHZXQgRGF0ZTpcclxuICogT2J0aWVuZSBsYSBmZWNoYSBhY3R1YWwgYWwgc2VndW5kbyB5IGxhIG11ZXN0cmEgZW4gbGEgcGFudGFsbGEgZGUgaW5pY2lvXHJcbiAqIEByZXR1cm4ge3ZvaWR9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXREYXRlKCl7XHJcbiAgdmFyICRkYXkgPSAkKCcuZGF5Jyk7XHJcbiAgdmFyICRtb250aFllYXIgPSAkKCcubW9udGgteWVhcicpO1xyXG4gIHZhciAkZGF5V2VlayA9ICQoJy5kYXl3ZWVrJyk7XHJcbiAgdmFyICRIb3JhID0gJCgnLmhvdXIgc3BhbicpO1xyXG4gIHZhciBkYXRlLGRheSxtb250aCx5ZWFyLHNIb3VyO1xyXG4gIHZhciBkYXlzID0gW1wiRG9taW5nb1wiLFwiTHVuZXNcIixcIk1hcnRlc1wiLFwiTWllcmNvbGVzXCIsXCJKdWV2ZXNcIixcIlZpZXJuZXNcIixcIlNhYmFkb1wiXTtcclxuICB2YXIgbW9udGhzID0gW1wiRW5lcm9cIixcIkZlYnJlcm9cIixcIk1hcnpvXCIsXCJBYnJpbFwiLFwiTWF5b1wiLFwiSnVuaW9cIixcIkp1bGlvXCIsXCJBZ29zdG9cIixcIlNlcHRpZW1icmVcIixcIk9jdHVicmVcIixcIk5vdmllbWJyZVwiLFwiRGljaWVtYnJlXCJdO1xyXG5cclxuICBzZXRJbnRlcnZhbCh1cGRhdGVIb3VyLDEwMDApO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVIb3VyKCl7XHJcbiAgICBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIHNEYXRlID0gZGF0ZS50b1N0cmluZygpXHJcbiAgICAkZGF5LnRleHQoZGF0ZS5nZXREYXRlKCkpO1xyXG4gICAgJG1vbnRoWWVhci50ZXh0KFwiRGUgXCIgKyBtb250aHNbZGF0ZS5nZXRNb250aCgpXSArIFwiIGRlIFwiICsgZGF0ZS5nZXRGdWxsWWVhcigpKTtcclxuICAgICRkYXlXZWVrLnRleHQoZGF5c1tkYXRlLmdldERheSgpXSk7XHJcbiAgICBcclxuICAgIHNIb3VyID0gbW9tZW50KCkuZm9ybWF0KCdMVFMnKTtcclxuICAgICAkSG9yYS5odG1sKHNIb3VyKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZG1pbiBGdW5jdGlvbnM6XHJcbiAqIHNlIGVuY2FyZ2EgZGUgZWwgbW92aW1pZW50byBkZSBsb3MgcGFuZWxlcyBlbiBsYSBwYW50YWxsYSAnYWRtaW5pc3RyYWRvcidcclxuICogQHJldHVybiB7dm9pZH1cclxuICovXHJcblxyXG5mdW5jdGlvbiBhZG1pbkZ1bmN0aW9ucygpe1xyXG4gICQoJyNjb21wYW55LXNlY3Rpb24nKS5hbmltYXRlKHtsZWZ0OlwiMFwifSwyMDApXHJcbiAgJCgnLmFkbWluaXN0cmFkb3IgLmFzaWRlLWJ1dHRvbnMgYScpLm9uKCdjbGljaycsZnVuY3Rpb24oZSl7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgdmFyIGNhcmROYW1lID0gJHRoaXMuYXR0cignaHJlZicpLnNsaWNlKDEpO1xyXG4gICAgaWYoY2FyZE5hbWUgIT0gbnVsbCl7XHJcbiAgICAgICQoJy5jb21wYW55LWRldGFpbHMnKS5hbmltYXRlKHtsZWZ0OlwiLTExMCVcIn0sMjAwKVxyXG4gICAgICAkKCcjJytjYXJkTmFtZSsnLmNvbXBhbnktZGV0YWlscycpLmFuaW1hdGUoe2xlZnQ6XCIwXCJ9LDIwMClcclxuICAgIH0gIFxyXG4gIH0pXHJcblxyXG4gIGlmKCQoXCIjYWNvdW50LXNlY3Rpb25cIikubGVuZ3RoID4gMCl7XHJcbiAgICAkKCcjYWNvdW50LXNlY3Rpb24nKS5hbmltYXRlKHtsZWZ0OlwiMFwifSwyMDApXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogbmV3IFVzZXIgRm9ybTpcclxuICogdmFpZGEgbGFzIGNvbnRyYXNlw7FhcyBlbiBsb3MgZm9ybXVsYXJpb3MgZGUgbG9zIHVzdWFyaW9zXHJcbiAqIEByZXR1cm4ge3ZvaWR9XHJcbiAqL1xyXG5mdW5jdGlvbiBuZXdVc2VyRm9ybSgpe1xyXG4gIHZhbGlkYXRlTW9kYWwoXCIjbmV3LXVzZXItbW9kYWxcIik7XHJcbiAgdmFsaWRhdGVNb2RhbChcIiN1cGRhdGUtdXNlci1tb2RhbFwiKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVzZXIgSW5mbyBUaXBcclxuICogaGFjZSB1biB0b2dnbGUgZW4gbGEgdmlzaWJpbGlkYWQgZGUgbGEgaW5mbyBkZWwgdXN1YXJpb1xyXG4gKiBAcmV0dXJuIHt2b2lkfVxyXG4gKi9cclxuZnVuY3Rpb24gdXNlckluZm9UaXAoKXtcclxuICB2YXIgaW5mb1RpcCA9ICQoXCIudXNlci1pbmZvLXRpcFwiKTtcclxuICB2YXIgcHJvZmlsZVBpY3R1cmUgPSAkKFwiLnByb2ZpbGUtcGljdHVyZVwiKTtcclxuICB2YXIgYnRuTW9yZSA9ICQoXCIuYnRuLW1vcmVcIik7XHJcblxyXG4gIGJ0bk1vcmUub24oJ2NsaWNrJyxmdW5jdGlvbihlKXtcclxuICAgIGluZm9UaXAudG9nZ2xlQ2xhc3MoXCJ2aXNpYmxlXCIpO1xyXG4gIH0pO1xyXG59XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gbmV3Q29udHJhY3RGdW5jdGlvbnMoKXtcclxuICB2YXIgYnRuUHJpbnRDb250cmFjdCA9ICQoXCIjYnRuLXByaW50LWNvbnRyYWN0XCIpO1xyXG4gIHZhciBkb2N1bWVudCA9ICQoXCIubm90ZS1pdGVtXCIpO1xyXG4gIHZhciByYWRpb0FjdGl2YXRlQ29udHJhY3QgPSAkKFwiI3JhZGlvLW5ldy1jb250cmFjdFwiKTtcclxuICB2YXIgcmFkaW9EaXNhYmxlQ29udHJhY3QgPSAkKFwiI3JhZGlvLWp1c3QtcmVxdWlyZW1lbnRcIik7XHJcbiAgdmFyIGNvbnRyYWN0Q29udHJvbHMgPSAkKFwiLmNvbnRyYWN0LWNvbnRyb2xzXCIpO1xyXG4gIHZhciByZXF1aXJlbWVudENvbnRyb2xzID0gJChcIi5yZXF1aXJlbWVudC1jb250cm9sc1wiKTtcclxuXHJcbiAgcmFkaW9BY3RpdmF0ZUNvbnRyYWN0LnBhcmVudHMoXCJsYWJlbFwiKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7XHJcbiAgIGFjdGl2YXRlQ29udHJhY3RNb2RlKCk7IFxyXG5cclxuICB9KTtcclxuXHJcbiAgcmFkaW9EaXNhYmxlQ29udHJhY3QucGFyZW50cyhcImxhYmVsXCIpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuICAgIGRpc2FibGVDb250cmFjdE1vZGUoKVxyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiBhY3RpdmF0ZUNvbnRyYWN0TW9kZSgkYnRuKXtcclxuICAgIHJhZGlvRGlzYWJsZUNvbnRyYWN0XHJcbiAgICAgIC5yZW1vdmVBdHRyKFwiY2hlY2tlZFwiLFwiXCIpXHJcbiAgICAgIC5odG1sKFwiXCIpXHJcbiAgICByYWRpb0FjdGl2YXRlQ29udHJhY3RcclxuICAgICAgLmF0dHIoXCJjaGVja2VkXCIsXCJcIilcclxuICAgICAgLmh0bWwoXCImIzEwMDA0O1wiKVxyXG4gICAgZG9jdW1lbnQucmVtb3ZlQ2xhc3MoXCJwcmludC1yZXF1aXJlbWVudFwiKTtcclxuICAgIGNvbnRyYWN0Q29udHJvbHMucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpXHJcbiAgICByZXF1aXJlbWVudENvbnRyb2xzLmFkZENsYXNzKFwiaGlkZVwiKVxyXG4gICAgXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkaXNhYmxlQ29udHJhY3RNb2RlKCRidG4pe1xyXG4gICAgcmFkaW9BY3RpdmF0ZUNvbnRyYWN0XHJcbiAgICAgIC5yZW1vdmVBdHRyKFwiY2hlY2tlZFwiLFwiXCIpXHJcbiAgICAgIC5odG1sKFwiXCIpXHJcbiAgICByYWRpb0Rpc2FibGVDb250cmFjdFxyXG4gICAgICAuYXR0cihcImNoZWNrZWRcIixcIlwiKVxyXG4gICAgICAuaHRtbChcIiYjMTAwMDQ7XCIpXHJcbiAgICBkb2N1bWVudC5hZGRDbGFzcyhcInByaW50LXJlcXVpcmVtZW50XCIpO1xyXG4gICAgcmVxdWlyZW1lbnRDb250cm9scy5yZW1vdmVDbGFzcyhcImhpZGVcIilcclxuICAgIGNvbnRyYWN0Q29udHJvbHMuYWRkQ2xhc3MoXCJoaWRlXCIpXHJcbiAgfVxyXG59XHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuKiAgICAgICAgICAgICAgICAgICAgICAgICAgTW9kYWxzIEZ1bmN0aW9ucyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuXHJcbiQoJyNzZWFyY2gtY2xpZW50LW1vZGFsJykub24oJ3Nob3cuYnMubW9kYWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KTtcclxuICBjbGllbnRUYWJsZS5pbml0KCk7XHJcbiAgdmFyIHRpdGxlID0gYnV0dG9uLmZpbmQoJy5zZWN0aW9uLXRpdGxlJykudGV4dCgpO1xyXG4gIGlmKCF0aXRsZSkgdGl0bGUgPSBcIkJ1c2NhciBDbGllbnRlXCJcclxuICBpZih0aXRsZS50b0xvd2VyQ2FzZSgpLnRyaW0oKSA9PSBcInJlZ2lzdHJhciBwYWdvXCIpe1xyXG4gICAgYnV0dG9uVGV4dCA9IFwiaXIgYSBQYWdvc1wiXHJcbiAgfWVsc2V7XHJcbiAgICBidXR0b25UZXh0ID0gXCJOdWV2byBDb250cmF0b1wiXHJcbiAgfVxyXG4gIFxyXG4gIHZhciBtb2RhbCA9ICQodGhpcylcclxuICBtb2RhbC5maW5kKCcubW9kYWwtdGl0bGUnKS50ZXh0KHRpdGxlKVxyXG4gIG1vZGFsLmZpbmQoJy5tb2RhbC1mb290ZXIgLnNhdmUnKS50ZXh0KGJ1dHRvblRleHQpXHJcbiAgbW9kYWwuZmluZCgndGJvZHknKS5odG1sKCcnKVxyXG59KVxyXG5cclxuXHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuKiAgICAgICAgICAgICAgb3RoZXIgZnVuY3Rpb25zICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4qICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5mdW5jdGlvbiBkZXRhaWxzRnVuY3Rpb25zKCl7XHJcbiAgdmFyIHNtYWxsQnV0dG9uc1NlbGVjdCA9ICQoJy5idG4tc21hbGwnKTtcclxuXHJcbiAgJCgnW3JvbGU9XCJ0YWJcIl0nKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgaHJlZiA9ICQodGhpcykuYXR0cihcImhyZWZcIilcclxuICAgIGlmKGhyZWYgPT0gXCIjcGF5bWVudHNcIiB8fGhyZWYgPT0gXCIjZGV0YWxsZXNfZGVfcGFnb1wiIHx8IGhyZWYgPT0gXCIjZGVzY3VlbnRvXCIgfHwgaHJlZiA9PSBcIiNtb250aC1hbmQtZGF0ZVwiIHx8IGhyZWYgPT0gXCIjcmVjb25uZWN0LXNlcnZpY2VcIikge1xyXG4gICAgICAkKFwiLnBheW1lbnQtY29udHJvbHNcIikuYWRkQ2xhc3MoXCJ2aXNpYmxlXCIpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICQoXCIucGF5bWVudC1jb250cm9sc1wiKS5yZW1vdmVDbGFzcyhcInZpc2libGVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoaHJlZiA9PSBcIiNjb250cmFjdHNcIil7XHJcbiAgICAgICQoXCIuY29udHJhY3QtY29udHJvbHNcIikuYWRkQ2xhc3MoXCJ2aXNpYmxlXCIpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgJChcIi5jb250cmFjdC1jb250cm9sc1wiKVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRUYWJDb250cm9scygkKHRoaXMpKTtcclxuICB9KTtcclxuXHJcbiAgJCgnLmJ0bi1zbWFsbCcpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuICAgIHNtYWxsQnV0dG9uc1NlbGVjdC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICQodGhpcykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VGFiQ29udHJvbHMoJHRoaXMpe1xyXG4gIHZhciBjb250cm9scyA9ICR0aGlzLmF0dHIoXCJhcmlhLWNvbnRyb2xzXCIpO1xyXG4gICQoXCIuZHluYW1pYy1jb250cm9sc1wiKS50ZXh0KGNvbnRyb2xzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbm90aWZpY2F0aW9uRnVuY3Rpb25zKCl7XHJcbiAgdmFyIGJ0bkF2ZXJpYXMgICAgICA9ICQoXCIjYnRuLXNlZS1hdmVyaWFzXCIpO1xyXG4gIHZhciBidG5QYWdvcyAgICAgICAgPSAkKFwiI2J0bi1zZWUtcGFnb3NcIik7XHJcbiAgdmFyIGJ0bkNhamFDaGljYSAgICA9ICQoJyNidG4tc2VlLWNhamEnKTtcclxuICB2YXIgYnRuRGV1ZG9yZXMgICAgID0gJChcIiNidG4tc2VlLWRldWRvcmVzXCIpXHJcbiAgdmFyIGJ0bkRheUluY29tZXMgICA9ICQoXCIjYnRuLXNlZS1kYXktaW5jb21lc1wiKVxyXG4gIHZhciBsYXlvdXRDb250YWluZXIgPSAkKFwiLmxheW91dC1jb250YWluZXJcIik7XHJcblxyXG4gIGJ0bkF2ZXJpYXMub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xyXG4gICAgbGF5b3V0Q29udGFpbmVyLmFuaW1hdGUoe2xlZnQ6XCItMTAwJVwifSwyMDApO1xyXG4gIH0pO1xyXG5cclxuICBidG5QYWdvcy5vbignY2xpY2snLGZ1bmN0aW9uKCl7XHJcbiAgICBsYXlvdXRDb250YWluZXIuYW5pbWF0ZSh7bGVmdDpcIjBcIn0sMjAwKTtcclxuICB9KTtcclxuXHJcbiAgYnRuRGV1ZG9yZXMub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xyXG4gICAgbGF5b3V0Q29udGFpbmVyLmFuaW1hdGUoe2xlZnQ6XCItMjAwJVwifSwyMDApO1xyXG4gIH0pO1xyXG5cclxuICAgYnRuRGF5SW5jb21lcy5vbignY2xpY2snLGZ1bmN0aW9uKCl7XHJcbiAgICBsYXlvdXRDb250YWluZXIuYW5pbWF0ZSh7bGVmdDpcIi0zMDAlXCJ9LDIwMCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbiQoXCIjc2VsZWN0LWV4dHJhLXNlcnZpY2VcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcclxuICB2YXIgJHRoaXMgPSAkKChcIiNzZWxlY3QtZXh0cmEtc2VydmljZSA6c2VsZWN0ZWRcIikpO1xyXG4gIHZhciBjb3N0ID0gJHRoaXMuYXR0cihcImRhdGEtcGF5bWVudFwiKTtcclxuICBcclxuICAkKFwiI2V4dHJhLXNlcnZpY2UtY29zdFwiKS52YWwoY29zdClcclxufSk7XHJcblxyXG4kKFwiI2V4dHJhLWNsaWVudC1jb250cmFjdFwiKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xyXG4gIHZhciAkdGhpcyA9ICQoKFwiI2V4dHJhLWNsaWVudC1jb250cmFjdCA6c2VsZWN0ZWRcIikpO1xyXG4gIFxyXG4gICQoXCIjZXh0cmEtY29udHJhY3Qtc2VydmljZVwiKS52YWwoJHRoaXMuYXR0cihcImRhdGEtc2VydmljZVwiKSk7XHJcbiAgJChcIiNleHRyYS1lcXVpcG9cIikudmFsKCR0aGlzLmF0dHIoXCJkYXRhLWVxdWlwbWVudFwiKSk7XHJcbiAgJChcIiNleHRyYS1yb3V0ZXJcIikudmFsKCR0aGlzLmF0dHIoXCJkYXRhLXJvdXRlclwiKSk7XHJcbiAgJChcIiNleHRyYS1lLW1hY1wiKS52YWwoJHRoaXMuYXR0cihcImRhdGEtZS1tYWNcIikpO1xyXG4gICQoXCIjZXh0cmEtci1tYWNcIikudmFsKCR0aGlzLmF0dHIoXCJkYXRhLXItbWFjXCIpKTtcclxuICAkKFwiI2V4dHJhLWNvZGVcIikudmFsKCR0aGlzLmF0dHIoXCJkYXRhLWNvZGVcIikpO1xyXG59KTtcclxuXHJcbiQoXCIuY29sdW1ucy1yaWdodFwiKS5yZW1vdmVDbGFzcyhcInB1bGwtcmlnaHRcIik7XHJcblxyXG4kKFwiI3NlbGVjdC1jb250cmFjdC1jb2RlXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcbiAgdmFyICR0aGlzID0gJCgoXCIjc2VsZWN0LWNvbnRyYWN0LWNvZGUgOnNlbGVjdGVkXCIpKTtcclxuICAkKFwiI2NvbnRyYWN0LWlwXCIpLnZhbCgkdGhpcy5hdHRyKFwiZGF0YS1pcC1maW5hbFwiKSk7XHJcbiAgJChcIiN1LWNvbnRyYWN0LWlwXCIpLnZhbCgkdGhpcy5hdHRyKFwiZGF0YS1pcC1maW5hbFwiKSk7XHJcbiBcclxufSk7XHJcblxyXG5mdW5jdGlvbiBjaGVja1dpbmRvd1NpemUoKSB7XHJcbiAgdmFyIHdpZHRoID0gd2luZG93LnNjcmVlbi5hdmFpbFdpZHRoO1xyXG4gIHZhciBicmFuZE5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnJhbmQgc3BhbicpO1xyXG4gIFxyXG4gIGlmKHdpZHRoIDw9IDExMDApe1xyXG4gICAgYnJhbmROYW1lLnRleHRDb250ZW50ID0gXCJQXCI7XHJcbiAgfWVsc2V7XHJcbiAgICBicmFuZE5hbWUudGV4dENvbnRlbnQgPSBcIlBheW1lbnRcIjtcclxuICB9XHJcbn1cclxuXHJcbiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24gKCkge1xyXG4gIHBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpXHJcbiAgbW92YWJsZU5hdiA9ICQoJy5hc2lkZS1uYXYtY29udGFpbmVyLCAuYXNpZGUtd2lkZS1sZWZ0JylcclxuXHJcbiAgaWYocG9zaXRpb24gPj0gNTApe1xyXG4gICAgbW92YWJsZU5hdi5hZGRDbGFzcygnbW92ZWQnKVxyXG4gIH1lbHNle1xyXG4gICAgbW92YWJsZU5hdi5yZW1vdmVDbGFzcygnbW92ZWQnKVxyXG4gIH1cclxufSkiLCJ2YXIgVXNlcnMgPSB7XHJcbiAgYWRkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZm9ybSwgbmljaywgcGFzc3dvcmQsIG5hbWUsIGxhc3RuYW1lLCBkbmksIHR5cGUsIGlzX2VtcHR5O1xyXG5cclxuICAgIG5pY2sgICAgICA9ICQoXCIjdXNlci1uaWNrbmFtZVwiKS52YWwoKTtcclxuICAgIHBhc3N3b3JkICA9ICQoXCIjdXNlci1wYXNzd29yZFwiKS52YWwoKTtcclxuICAgIG5hbWUgICAgICA9ICQoXCIjdXNlci1uYW1lXCIpLnZhbCgpO1xyXG4gICAgbGFzdG5hbWUgID0gJChcIiN1c2VyLWxhc3RuYW1lXCIpLnZhbCgpO1xyXG4gICAgZG5pICAgICAgID0gZ2V0VmFsKCQoXCIjdXNlci1kbmlcIikpO1xyXG4gICAgdHlwZSAgICAgID0gJChcIiN1c2VyLXR5cGVcIikudmFsKCk7XHJcblxyXG4gICAgdmFyIGlzX2VtcHR5ID0gaXNFbXB0eShbbmljaywgcGFzc3dvcmQsIG5hbWUsIGxhc3RuYW1lLCBkbmksIHR5cGVdKTtcclxuICAgIGlmICghaXNfZW1wdHkpIHtcclxuICAgICAgZm9ybSA9ICduaWNrbmFtZT0nICsgbmljayArIFwiJnBhc3N3b3JkPVwiICsgcGFzc3dvcmQgKyBcIiZuYW1lPVwiICsgbmFtZSArIFwiJmxhc3RuYW1lPVwiICsgbGFzdG5hbWU7XHJcbiAgICAgIGZvcm0gKz0gXCImZG5pPVwiICsgZG5pICsgXCImdHlwZT1cIiArIHR5cGU7XHJcbiAgICAgIGNvbm5lY3RBbmRTZW5kKFwidXNlci9hZGRuZXdcIiwgdHJ1ZSwgaW5pdEFkbWluSGFuZGxlcnMsIG51bGwsIGZvcm0sIFVzZXJzLmdldEFsbCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkaXNwbGF5QWxlcnQoXCJSZXZpc2VcIiwgXCJMTGVuZSB0b2RvcyBsb3MgY2FtcG9zIHBvciBmYXZvclwiLCBcImVycm9yXCIpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGZvcm0sIG5pY2ssIHBhc3N3b3JkLCBuYW1lLCBsYXN0bmFtZSwgZG5pLCB0eXBlO1xyXG5cclxuICAgIG5pY2sgICAgID0gJChcIiNlLW5pY2tuYW1lXCIpLnZhbCgpO1xyXG4gICAgbmFtZSAgICAgPSAkKFwiI2UtbmFtZVwiKS52YWwoKTtcclxuICAgIGxhc3RuYW1lID0gJChcIiNlLWxhc3RuYW1lXCIpLnZhbCgpO1xyXG4gICAgZG5pICAgICAgPSAkKFwiI2UtZG5pXCIpLnZhbCgpO1xyXG4gICAgdHlwZSAgICAgPSAkKFwiI2UtdHlwZVwiKS52YWwoKTtcclxuXHJcbiAgICB2YXIgaXNfZW1wdHkgPSBpc0VtcHR5KFtuaWNrLCBuYW1lLCBsYXN0bmFtZSwgZG5pLCB0eXBlXSk7XHJcbiAgICBpZiAoIWlzX2VtcHR5KSB7XHJcbiAgICAgIGZvcm0gPSAnbmlja25hbWU9JyArIG5pY2sgKyBcIiZuYW1lPVwiICsgbmFtZSArIFwiJmxhc3RuYW1lPVwiICsgbGFzdG5hbWU7XHJcbiAgICAgIGZvcm0gKz0gXCImZG5pPVwiICsgZG5pICsgXCImdHlwZT1cIiArIHR5cGU7XHJcbiAgICAgIGNvbm5lY3RBbmRTZW5kKFwidXNlci91cGRhdGVcIiwgdHJ1ZSwgaW5pdEFkbWluSGFuZGxlcnMsIG51bGwsIGZvcm0sIFVzZXJzLmdldEFsbCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgZGlzcGxheUFsZXJ0KFwiUmV2aXNlXCIsIFwiTExlbmUgdG9kb3MgbG9zIGNhbXBvcyBwb3IgZmF2b3JcIiwgXCJlcnJvclwiKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBnZXRBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBmb3JtID0gXCJ0YWJsZT11c2Vyc1wiO1xyXG4gICAgY29ubmVjdEFuZFNlbmQoJ3VzZXIvZ2V0dXNlcnMnLCBmYWxzZSwgaW5pdEFkbWluSGFuZGxlcnMsIHVzZXJUYWJsZS5yZWZyZXNoLCBmb3JtLCBudWxsKTtcclxuICB9LFxyXG5cclxuICBkZWxldGU6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgdmFyIGZvcm0gPSBcInVzZXJfaWQ9XCIgKyBpZDtcclxuICAgIGNvbm5lY3RBbmRTZW5kKCd1c2VyL2RlbGV0ZXVzZXInLCB0cnVlLCBpbml0QWRtaW5IYW5kbGVycywgbnVsbCwgZm9ybSwgVXNlcnMuZ2V0QWxsKTtcclxuICB9LFxyXG5cclxuICBjb25maXJtUGFzc3dvcmQ6IGZ1bmN0aW9uKHVzZXJJZCxjdXJyZW50UGFzc3dvcmQpIHtcclxuICAgIHZhciBmb3JtID0gJ3VzZXJfaWQ9JysgdXNlcklkICsnJmN1cnJlbnRfcGFzc3dvcmQ9JyArIGN1cnJlbnRQYXNzd29yZDtcclxuICAgIGNvbm5lY3RBbmRTZW5kKCd1c2VyL2NvbmZpcm1fcGFzc3dvcmQnLCBmYWxzZSwgZmFsc2UsIHByb2Nlc3NDb25maXJtRGF0YSwgZm9ybSwgbnVsbCwgbnVsbCk7XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHByb2Nlc3NDb25maXJtRGF0YShyZXNwb25zZSkge1xyXG4gICAgICB2YXIgbmV3UGFzc3dvcmQgICAgICAgICA9ICQoXCIjYWNvdW50LW5ldy1wYXNzd29yZFwiKTtcclxuICAgICAgdmFyIG5ld1Bhc3N3b3JkQ29uZmlybSAgPSAkKFwiI2Fjb3VudC1jb25maXJtLW5ldy1wYXNzd29yZFwiKTtcclxuICAgICAgXHJcbiAgICAgIGlmIChyZXNwb25zZSA9PSAxKSB7ICAgICAgXHJcbiAgICAgICAgbmV3UGFzc3dvcmQucmVtb3ZlQXR0cignZGlzYWJsZWQnKTtcclxuICAgICAgICBuZXdQYXNzd29yZENvbmZpcm0ucmVtb3ZlQXR0cignZGlzYWJsZWQnKTtcclxuICAgICAgICB2YWxpZGF0ZVRoaXMoKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgbmV3UGFzc3dvcmQuYXR0cignZGlzYWJsZWQnLHRydWUpO1xyXG4gICAgICAgIG5ld1Bhc3N3b3JkQ29uZmlybS5hdHRyKCdkaXNhYmxlZCcsdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICB1cGRhdGVQYXNzd29yZDogZnVuY3Rpb24odXNlcklkLGN1cnJlbnRQYXNzd29yZCxuZXdQYXNzd29yZCl7XHJcbiAgICB2YXIgZm9ybSA9ICd1c2VyX2lkPScrIHVzZXJJZCAgKyBcIiZjdXJyZW50X3Bhc3N3b3JkPVwiKyBjdXJyZW50UGFzc3dvcmQgKycmbmV3X3Bhc3N3b3JkPScgKyBuZXdQYXNzd29yZDtcclxuICAgIGNvbm5lY3RBbmRTZW5kKCd1c2VyL3VwZGF0ZV9wYXNzd29yZCcsIGZhbHNlLCBmYWxzZSwgVXNlcnMucGFzc3dvcmRDaGFuZ2VkLCBmb3JtLCBudWxsLGhlYXZ5TG9hZCk7XHJcbiAgfSxcclxuXHJcbiAgcGFzc3dvcmRDaGFuZ2VkOiBmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICBpZihyZXNwb25zZT09MSl7XHJcbiAgICAgIGRpc3BsYXlNZXNzYWdlKE1FU1NBR0VfU1VDQ0VTUyArICdDb250cmFzZcOxYSBDYW1iaWFkYSBjb24gZXhpdG8nKVxyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBCQVNFX1VSTCArICdhcHAvbG9nb3V0J1xyXG4gICAgICB9LDMwMDApICAgICAgXHJcbiAgICB9ZWxzZXtcclxuICAgICAgZGlzcGxheU1lc3NhZ2UoTUVTU0FHRV9FUlJPUiArICcgRXJyb3IgYWwgY2FtYmlhciBkZSBjb250cmFzZcOxYSwgcmV2aXNlIGxhIGNvbnRyYXNlw7FhIGFjdHVhbCcpXHJcbiAgICB9XHJcbiAgICAgIFxyXG4gIH1cclxufVxyXG5cclxudmFyIENsaWVudHMgPSB7XHJcbiAgYWRkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgdmFyIGZvcm0sIG5vbWJyZXMsIGFwZWxsaWRvcywgY2VkdWxhLCBjZWx1bGFyLCBwcm92aW5jaWEsIHNlY3RvciwgY2FsbGUsIGNhc2EsIHRlbGVmb25vLFxyXG4gICAgICAgbHVnYXJUcmFiYWpvLCB0ZWxUcmFiYWpvLCBpbmdyZXNvcywgZmVjaGFSZWdpc3RybywgZXN0YWRvO1xyXG5cclxuICAgIG5vbWJyZXMgICAgICAgPSAkKFwiI2NsaWVudC1uYW1lXCIpLnZhbCgpO1xyXG4gICAgYXBlbGxpZG9zICAgICA9ICQoXCIjY2xpZW50LWxhc3RuYW1lXCIpLnZhbCgpO1xyXG4gICAgY2VkdWxhICAgICAgICA9IGdldFZhbCgkKFwiI2NsaWVudC1kbmlcIikpO1xyXG4gICAgY2VsdWxhciAgICAgICA9IGdldFZhbCgkKFwiI2NsaWVudC1waG9uZVwiKSk7XHJcbiAgICBwcm92aW5jaWEgICAgID0gJChcIiNjbGllbnQtcHJvdmluY2lhXCIpLnZhbCgpO1xyXG4gICAgc2VjdG9yICAgICAgICA9ICQoXCIjY2xpZW50LXNlY3RvclwiKS52YWwoKTtcclxuICAgIGNhbGxlICAgICAgICAgPSAkKFwiI2NsaWVudC1zdHJlZXRcIikudmFsKCk7XHJcbiAgICBjYXNhICAgICAgICAgID0gJCgnI2NsaWVudC1ob3VzZScpLnZhbCgpO1xyXG4gICAgdGVsZWZvbm8gICAgICA9IGdldFZhbCgkKCcjY2xpZW50LXRlbGVwaG9uZScpKTtcclxuICAgIGx1Z2FyVHJhYmFqbyAgPSAkKCcjY2xpZW50LWpvYicpLnZhbCgpO1xyXG4gICAgdGVsVHJhYmFqbyAgICA9IGdldFZhbCgkKCcjY2xpZW50LWpvYi10ZWxlcGhvbmUnKSk7XHJcbiAgICBpbmdyZXNvcyAgICAgID0gJCgnI2NsaWVudC1zYWxhcnknKS52YWwoKTtcclxuICAgIGZlY2hhUmVnaXN0cm8gPSBtb21lbnQoKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpOztcclxuICAgIGVzdGFkbyAgICAgICAgPSBcIm5vIGFjdGl2b1wiO1xyXG5cclxuICAgIHZhciBpc19lbXB0eSA9IGlzRW1wdHkoW25vbWJyZXMsIGFwZWxsaWRvcywgY2VkdWxhLCBjZWx1bGFyLCBwcm92aW5jaWEsIHNlY3RvciwgY2FsbGUsIGNhc2EsIHRlbGVmb25vXSk7XHJcbiAgICBpZiAoIWlzX2VtcHR5KSB7XHJcbiAgICAgIGZvcm0gPSAnbm9tYnJlcz0nICsgbm9tYnJlcyArIFwiJmFwZWxsaWRvcz1cIiArIGFwZWxsaWRvcyArIFwiJmNlZHVsYT1cIiArIGNlZHVsYSArIFwiJmNlbHVsYXI9XCIgKyBjZWx1bGFyO1xyXG4gICAgICBmb3JtICs9IFwiJnByb3ZpbmNpYT1cIiArIHByb3ZpbmNpYSArIFwiJnNlY3Rvcj1cIiArIHNlY3RvciArIFwiJmNhbGxlPVwiICsgY2FsbGUgKyBcIiZjYXNhPVwiICsgY2FzYSArIFwiJnRlbGVmb25vPVwiICsgdGVsZWZvbm87XHJcbiAgICAgIGZvcm0gKz0gXCImbHVnYXJfdHJhYmFqbz1cIiArIGx1Z2FyVHJhYmFqbyArIFwiJnRlbF90cmFiYWpvPVwiICsgdGVsVHJhYmFqbyArIFwiJmluZ3Jlc29zPVwiICsgaW5ncmVzb3MgKyBcIiZmZWNoYV9yZWdpc3Rybz1cIiArIGZlY2hhUmVnaXN0cm87XHJcbiAgICAgIGZvcm0gKz0gXCImZXN0YWRvPVwiICsgZXN0YWRvICsgXCImdGFibGE9Y2xpZW50ZXNcIjtcclxuXHJcbiAgICAgIGNvbm5lY3RBbmRTZW5kKFwicHJvY2Vzcy9hZGRcIiwgdHJ1ZSwgaW5pdENsaWVudEhhbmRsZXJzLCBudWxsLCBmb3JtLCBDbGllbnRzLmdldEFsbCk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGlzcGxheUFsZXJ0KFwiUmV2aXNlXCIsIFwiTExlbmUgdG9kb3MgbG9zIGNhbXBvcyBwb3IgZmF2b3JcIiwgXCJlcnJvclwiKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBnZXRBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBmb3JtID0gXCJ0YWJsYT1jbGllbnRlc1wiO1xyXG4gICAgY29ubmVjdEFuZFNlbmQoJ3Byb2Nlc3MvZ2V0YWxsJywgZmFsc2UsIGluaXRDbGllbnRIYW5kbGVycywgY2xpZW50VGFibGUucmVmcmVzaCwgZm9ybSwgbnVsbCk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0T25lOiBmdW5jdGlvbiAoaWQsIHJlY2VpdmVyKSB7XHJcbiAgICBmb3JtID0gXCJ0YWJsYT1jbGllbnRlcyZpZD1cIiArIGlkO1xyXG4gICAgY29ubmVjdEFuZFNlbmQoXCJwcm9jZXNzL2dldG9uZVwiLCBmYWxzZSwgaW5pdENsaWVudEhhbmRsZXJzLCByZWNlaXZlciwgZm9ybSwgbnVsbClcclxuICB9LFxyXG5cclxuICByZWNlaXZlRm9yRWRpdDogZnVuY3Rpb24gKGNvbnRlbnQpIHtcclxuICAgIHZhciBjbGllbnQgICAgICAgID0gSlNPTi5wYXJzZShjb250ZW50KTtcclxuICAgIHRoaXMuaWQgICAgICAgICAgICA9IGNsaWVudFsnaWRfY2xpZW50ZSddO1xyXG4gICAgdmFyICRub21icmVzICAgICAgPSAkKFwiI3UtY2xpZW50LW5hbWVcIik7XHJcbiAgICB2YXIgJGFwZWxsaWRvcyAgICA9ICQoXCIjdS1jbGllbnQtbGFzdG5hbWVcIik7XHJcbiAgICB2YXIgJGNlZHVsYSAgICAgICA9ICQoXCIjdS1jbGllbnQtZG5pXCIpO1xyXG4gICAgdmFyICRjZWx1bGFyICAgICAgPSAkKFwiI3UtY2xpZW50LXBob25lXCIpO1xyXG4gICAgdmFyICRwcm92aW5jaWEgICAgPSAkKFwiI3UtY2xpZW50LXByb3ZpbmNpYVwiKTtcclxuICAgIHZhciAkc2VjdG9yICAgICAgID0gJChcIiN1LWNsaWVudC1zZWN0b3JcIik7XHJcbiAgICB2YXIgJGNhbGxlICAgICAgICA9ICQoXCIjdS1jbGllbnQtc3RyZWV0XCIpO1xyXG4gICAgdmFyICRjYXNhICAgICAgICAgPSAkKCcjdS1jbGllbnQtaG91c2UnKTtcclxuICAgIHZhciAkdGVsZWZvbm8gICAgID0gJCgnI3UtY2xpZW50LXRlbGVwaG9uZScpO1xyXG4gICAgdmFyICRsdWdhclRyYWJham8gPSAkKCcjdS1jbGllbnQtam9iJyk7XHJcbiAgICB2YXIgJHRlbFRyYWJham8gICA9ICQoJyN1LWNsaWVudC1qb2ItdGVsZXBob25lJyk7XHJcbiAgICB2YXIgJGluZ3Jlc29zICAgICA9ICQoJyN1LWNsaWVudC1zYWxhcnknKTtcclxuXHJcbiAgICAkbm9tYnJlcy52YWwoY2xpZW50Wydub21icmVzJ10pO1xyXG4gICAgJGFwZWxsaWRvcy52YWwoY2xpZW50WydhcGVsbGlkb3MnXSlcclxuICAgICRjZWR1bGEudmFsKGNsaWVudFsnY2VkdWxhJ10pXHJcbiAgICAkY2VsdWxhci52YWwoY2xpZW50WydjZWx1bGFyJ10pXHJcbiAgICAkcHJvdmluY2lhLnZhbChjbGllbnRbJ3Byb3ZpbmNpYSddKVxyXG4gICAgJHNlY3Rvci52YWwoY2xpZW50WydzZWN0b3InXSlcclxuICAgICRjYWxsZS52YWwoY2xpZW50WydjYWxsZSddKVxyXG4gICAgJGNhc2EudmFsKGNsaWVudFsnY2FzYSddKVxyXG4gICAgJHRlbGVmb25vLnZhbChjbGllbnRbJ3RlbGVmb25vJ10pXHJcbiAgICAkbHVnYXJUcmFiYWpvLnZhbChjbGllbnRbJ2x1Z2FyX3RyYWJham8nXSlcclxuICAgICR0ZWxUcmFiYWpvLnZhbChjbGllbnRbJ3RlbF90cmFiYWpvJ10pXHJcbiAgICAkaW5ncmVzb3MudmFsKGNsaWVudFsnc2FsYXJpbyddKVxyXG5cclxuICAgICQoXCIjdXBkYXRlLWNsaWVudC1tb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgJChcIiNidG4tdXBkYXRlLWNsaWVudFwiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHVwZGF0ZUNsaWVudCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlQ2xpZW50KCkge1xyXG4gICAgICB2YXIgaXNfZW1wdHkgPSBpc0VtcHR5KFskbm9tYnJlcy52YWwoKSwgJGFwZWxsaWRvcy52YWwoKSwgJGNlZHVsYS52YWwoKSwgJGNlbHVsYXIudmFsKCksICRwcm92aW5jaWEudmFsKCksICRzZWN0b3IudmFsKCksICRjYWxsZS52YWwoKSxcclxuICAgICAgICAkY2FzYS52YWwoKSwgJHRlbGVmb25vLnZhbCgpXHJcbiAgICAgIF0pO1xyXG5cclxuICAgICAgaWYgKCFpc19lbXB0eSkge1xyXG4gICAgICAgIGZvcm0gPSAnaWQ9JyArIGlkICsgJyZub21icmVzPScgKyAkbm9tYnJlcy52YWwoKSArIFwiJmFwZWxsaWRvcz1cIiArICRhcGVsbGlkb3MudmFsKCkgKyBcIiZjZWR1bGE9XCIgKyBnZXRWYWwoJGNlZHVsYSk7XHJcbiAgICAgICAgZm9ybSArPSBcIiZjZWx1bGFyPVwiICsgZ2V0VmFsKCRjZWx1bGFyKSArIFwiJnByb3ZpbmNpYT1cIiArICRwcm92aW5jaWEudmFsKCkgKyBcIiZzZWN0b3I9XCIgKyAkc2VjdG9yLnZhbCgpICsgXCImY2FsbGU9XCIgKyAkY2FsbGUudmFsKCk7XHJcbiAgICAgICAgZm9ybSArPSBcIiZjYXNhPVwiICsgJGNhc2EudmFsKCkgKyBcIiZ0ZWxlZm9ubz1cIiArIGdldFZhbCgkdGVsZWZvbm8pICsgXCImbHVnYXJfdHJhYmFqbz1cIiArICRsdWdhclRyYWJham8udmFsKCkgKyBcIiZ0ZWxfdHJhYmFqbyA9XCI7XHJcbiAgICAgICAgZm9ybSArPSBnZXRWYWwoJHRlbFRyYWJham8pICsgXCImdGFibGE9Y2xpZW50ZXNcIjtcclxuICAgICAgICBmb3JtICs9IFwiJmluZ3Jlc29zPVwiICsgJGluZ3Jlc29zLnZhbCgpO1xyXG5cclxuICAgICAgICBjb25uZWN0QW5kU2VuZChcInByb2Nlc3MvdXBkYXRlXCIsIHRydWUsIGluaXRDbGllbnRIYW5kbGVycywgbnVsbCwgZm9ybSwgQ2xpZW50cy5nZXRBbGwpO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkaXNwbGF5QWxlcnQoXCJSZXZpc2VcIiwgXCJMTGVuZSB0b2RvcyBsb3MgY2FtcG9zIHBvciBmYXZvclwiLCBcImVycm9yXCIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgc2F2ZU9ic2VydmF0aW9uczogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGZvcm0sIG9ic2VydmF0aW9ucyxpZENsaWVudGU7XHJcbiBcclxuICAgIG9ic2VydmF0aW9ucyA9ICQoXCIjdGV4dC1vYnNlcnZhdGlvbnNcIikudmFsKCk7XHJcbiAgICBpZENsaWVudGUgICAgPSAkKFwiI2RldGFpbC1jbGllbnQtaWRcIikudmFsKCk7XHJcbiBcclxuICAgIGZvcm0gPSAnb2JzZXJ2YWNpb25lcz0nICsgb2JzZXJ2YXRpb25zICsgXCImdGFibGE9b2JzZXJ2YWNpb25lcyZpZF9jbGllbnRlPVwiICsgaWRDbGllbnRlO1xyXG4gICAgY29ubmVjdEFuZFNlbmQoXCJwcm9jZXNzL3VwZGF0ZVwiLCB0cnVlLCBudWxsLCBudWxsLCBmb3JtLCBudWxsKVxyXG4gIH0sXHJcbiAgXHJcbiAgdXBkYXRlU3RhdGU6IGZ1bmN0aW9uIChjbGllbnQpIHtcclxuICAgIGZvcm0gPSAnZGF0YT0nKyBKU09OLnN0cmluZ2lmeShjbGllbnQpKyAnJm1vZHVsZT1jbGllbnRlcyZhY3Rpb249dXBkYXRlJztcclxuICAgICAgY29ubmVjdEFuZFNlbmQoJ3Byb2Nlc3MvZ2V0anNvbicsdHJ1ZSxudWxsLG51bGwsZm9ybSwgbnVsbCk7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgR2VuZXJhbHMgPSB7XHJcbiAgZGVsZXRlUm93OiBmdW5jdGlvbiAoaWQsIHRhYmxhKSB7XHJcbiAgICB2YXIgZm9ybSA9IFwidGFibGE9XCIgKyB0YWJsYSArIFwiJmlkPVwiICsgaWQ7XHJcbiAgICB2YXIgaGFuZGxlcnMsIGNhbGxiYWNrO1xyXG4gICAgc3dpdGNoICh0YWJsYSkge1xyXG4gICAgICBjYXNlICdjbGllbnRlcyc6XHJcbiAgICAgICAgY2FsbGJhY2sgPSBDbGllbnRzLmdldEFsbDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnc2VydmljaW9zJzpcclxuICAgICAgICBjYWxsYmFjayA9IFNlcnZpY2VzLmdldEFsbDtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGNvbm5lY3RBbmRTZW5kKCdwcm9jZXNzL2RlbGV0ZScsIHRydWUsbnVsbCwgbnVsbCwgZm9ybSwgY2FsbGJhY2spO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2VhcmNoIG1hbmRhIHVuIG1lbnNhamUgYWwgc2Vydmlkb3IgZGUgbG9zIHZhbG9yZXMgYSBidXNjYXJcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBlbCB2YWxvciBhIHNlciBidXNjYWRvXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRiVGFibGUgbm9tYnJlIGRlIGxhIHRhYmxhIGRvbmRlIHNlIGRlc2VhIGNvbnN1bHRhciBlbiBsYSBiYXNlIGRlIGRhdG9zXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZmlsbFRhYmxlRnVuY3Rpb24gZnVuY2lvbiBkZSBsbGVuYWRvIGRlIHRhYmxhIGRvbmRlIHNlIG1vc3RyYXJhbiBsb3MgcmVzdWx0YWRvcyBcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyRnVuY3Rpb24gZnVuY2lvbiByZWluaWNpbyBkZSBsb3MgZWxlbWVudG9zIGVuIGxvcyBoYW5kbGVycyBcclxuICAgKi9cclxuICBcclxuICBzZWFyY2g6IGZ1bmN0aW9uICh0ZXh0LCBkYlRhYmxlLCBmaWxsVGFibGVGdW5jdGlvbiwgaGFuZGxlckZ1bmN0aW9uKSB7XHJcbiAgICBpZiAoaGFuZGxlckZ1bmN0aW9uID09IHVuZGVmaW5lZCkgaGFuZGxlckZ1bmN0aW9uID0gaW5pdENsaWVudEhhbmRsZXJzO1xyXG4gICAgaWYgKGZpbGxUYWJsZUZ1bmN0aW9uID09IHVuZGVmaW5lZCkgZmlsbFRhYmxlRnVuY3Rpb24gPSBmaWxsQ3VycmVudFRhYmxlO1xyXG4gICAgdmFyIHdvcmQgPSB0ZXh0O1xyXG4gICAgaWYgKHdvcmQgIT0gbnVsbCB8fCB3b3JkICE9IFwiXCIpIHtcclxuICAgICAgdmFyIGZvcm0gPSBcInRhYmxhPVwiICsgZGJUYWJsZSArIFwiJndvcmQ9XCIgKyB3b3JkO1xyXG4gICAgICBjb25uZWN0QW5kU2VuZCgncHJvY2Vzcy9zZWFyY2gnLCBmYWxzZSwgaGFuZGxlckZ1bmN0aW9uLCBmaWxsVGFibGVGdW5jdGlvbiwgZm9ybSwgbnVsbCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY291bnRfdGFibGU6IGZ1bmN0aW9uICh0YWJsZSkge1xyXG4gICAgdmFyIGZvcm0gPSBcInRhYmxhPVwiICsgdGFibGU7XHJcbiAgICB2YXIgdXBkYXRlRnVuY3Rpb24gPSB1cGRhdGVDb3VudDtcclxuICAgIGlmICh0YWJsZSA9PSAnY2FqYScpIHVwZGF0ZUZ1bmN0aW9uID0gdXBkYXRlQ2FqYUNvdW50XHJcbiAgICBjb25uZWN0QW5kU2VuZCgncHJvY2Vzcy9jb3VudCcsIGZhbHNlLCBudWxsLCB1cGRhdGVGdW5jdGlvbiwgZm9ybSwgbnVsbCk7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgU2VydmljZXMgPSB7XHJcbiAgYWRkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZm9ybSwgbmFtZSwgZGVzY3JpcHRpb24sIHBheW1lbnQsIHR5cGU7XHJcblxyXG4gICAgbmFtZSAgICAgICAgPSAkKFwiI3NlcnZpY2UtbmFtZVwiKS52YWwoKTtcclxuICAgIGRlc2NyaXB0aW9uID0gJChcIiNzZXJ2aWNlLWRlc2NyaXB0aW9uXCIpLnZhbCgpO1xyXG4gICAgcGF5bWVudCAgICAgPSAkKFwiI3NlcnZpY2UtbW9udGhseS1wYXltZW50XCIpLnZhbCgpO1xyXG4gICAgdHlwZSAgICAgICAgPSAkKFwiI3NlcnZpY2UtdHlwZVwiKS52YWwoKTtcclxuXHJcbiAgICB2YXIgaXNfZW1wdHkgPSBpc0VtcHR5KFtuYW1lLCBkZXNjcmlwdGlvbiwgcGF5bWVudCwgdHlwZV0pO1xyXG4gICAgaWYgKCFpc19lbXB0eSkge1xyXG4gICAgICBmb3JtID0gJ25vbWJyZT0nICsgbmFtZSArIFwiJmRlc2NyaXBjaW9uPVwiICsgZGVzY3JpcHRpb24gKyBcIiZtZW5zdWFsaWRhZD1cIiArIHBheW1lbnQgKyBcIiZ0aXBvPVwiICsgdHlwZTtcclxuICAgICAgZm9ybSArPSBcIiZ0YWJsYT1zZXJ2aWNpb3NcIjtcclxuICAgICAgY29ubmVjdEFuZFNlbmQoXCJwcm9jZXNzL2FkZFwiLCB0cnVlLCBudWxsLCBudWxsLCBmb3JtLCBTZXJ2aWNlcy5nZXRBbGwpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGlzcGxheUFsZXJ0KFwiUmV2aXNlXCIsIFwiTExlbmUgdG9kb3MgbG9zIGNhbXBvcyBwb3IgZmF2b3JcIiwgXCJlcnJvclwiKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBnZXRBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBmb3JtID0gXCJ0YWJsYT1zZXJ2aWNpb3NcIjtcclxuICAgIGNvbm5lY3RBbmRTZW5kKCdwcm9jZXNzL2dldGFsbCcsIGZhbHNlLCBudWxsLCBzZXJ2aWNlVGFibGUucmVmcmVzaCwgZm9ybSwgbnVsbCk7XHJcbiAgfSxcclxuXHJcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZm9ybSwgaWQsIG5hbWUsIGRlc2NyaXB0aW9uLCBwYXltZW50LCB0eXBlO1xyXG5cclxuICAgIGlkICAgICAgICAgID0gJCgnI3Utc2VydmljZS1pZCcpLnZhbCgpO1xyXG4gICAgbmFtZSAgICAgICAgPSAkKCcjdS1zZXJ2aWNlLW5hbWUnKS52YWwoKTtcclxuICAgIGRlc2NyaXB0aW9uID0gJCgnI3Utc2VydmljZS1kZXNjcmlwdGlvbicpLnZhbCgpO1xyXG4gICAgcGF5bWVudCAgICAgPSAkKCcjdS1zZXJ2aWNlLW1vbnRobHktcGF5bWVudCcpLnZhbCgpO1xyXG4gICAgdHlwZSAgICAgICAgPSAkKCcjdS1zZXJ2aWNlLXR5cGUnKS52YWwoKTtcclxuXHJcbiAgICB2YXIgaXNfZW1wdHkgPSBpc0VtcHR5KFtpZCwgbmFtZSwgZGVzY3JpcHRpb24sIHBheW1lbnQsIHR5cGVdKTtcclxuICAgIGlmICghaXNfZW1wdHkpIHtcclxuICAgICAgZm9ybSA9ICdpZF9zZXJ2aWNpbz0nICsgaWQgKyBcIiZub21icmU9XCIgKyBuYW1lICsgXCImZGVzY3JpcGNpb249XCIgKyBkZXNjcmlwdGlvbiArIFwiJm1lbnN1YWxpZGFkPVwiICsgcGF5bWVudDtcclxuICAgICAgZm9ybSArPSBcIiZ0aXBvPVwiICsgdHlwZSArIFwiJnRhYmxhPXNlcnZpY2lvc1wiO1xyXG4gICAgICBjb25uZWN0QW5kU2VuZChcInByb2Nlc3MvdXBkYXRlXCIsIHRydWUsIG51bGwsIG51bGwsIGZvcm0sIFNlcnZpY2VzLmdldEFsbCxoZWF2eUxvYWQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGlzcGxheUFsZXJ0KFwiUmV2aXNlXCIsIFwiTExlbmUgdG9kb3MgbG9zIGNhbXBvcyBwb3IgZmF2b3JcIiwgXCJlcnJvclwiKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbnZhciBDb250cmFjdHMgPSB7XHJcbiAgYWRkOiBmdW5jdGlvbiBhZGROZXdDb250cmFjdCgpIHtcclxuICAgIHZhciBmb3JtLCB0YWJsZSwgY2xpZW50X2lkLCB1c2VyX2lkLCBzZXJ2aWNlX2lkLCBjb2RlLCBjb250cmFjdF9kYXRlLCBwYXltZW50LCBkdXJhdGlvbixcclxuICAgICAgZXF1aXBtZW50LCBlTWFjLCByb3V0ZXIsIHJNYWMsIHRvdGFsLCBuZXh0UGF5bWVudCwgbW9kZWwsIGlwO1xyXG5cclxuICAgIGNsaWVudF9pZCAgICAgPSAkKFwiI2NvbnRyYWN0LWNsaWVudC1pZFwiKS52YWwoKTtcclxuICAgIHVzZXJfaWQgICAgICAgPSAkKFwiI2NvbnRyYWN0LXVzZXItaWRcIikudmFsKCk7XHJcbiAgICBzZXJ2aWNlX2lkICAgID0gJChcIi5zZXJ2aWNlLWNhcmQuc2VsZWN0ZWRcIikuYXR0cignZGF0YS1pZCcpO1xyXG4gICAgY29udHJhY3RfZGF0ZSA9ICQoJyNjb250cmFjdC1jbGllbnQtZGF0ZScpLnZhbCgpO1xyXG4gICAgZHVyYXRpb24gICAgICA9ICQoJyNjb250cmFjdC1jbGllbnQtbW9udGhzJykudmFsKCk7XHJcbiAgICBlcXVpcG1lbnQgICAgID0gJCgnI2NvbnRyYWN0LWVxdWlwbWVudCcpLnZhbCgpO1xyXG4gICAgZU1hYyAgICAgICAgICA9ICQoJyNjb250cmFjdC1lLW1hYycpLnZhbCgpO1xyXG4gICAgcm91dGVyICAgICAgICA9ICQoJyNjb250cmFjdC1yb3V0ZXInKS52YWwoKTtcclxuICAgIHJNYWMgICAgICAgICAgPSAkKCcjY29udHJhY3Qtci1tYWMnKS52YWwoKTtcclxuICAgIG1vZGVsICAgICAgICAgPSAkKCcjY29udHJhY3QtZXF1aXBtZW50LW1vZGVsJykudmFsKCk7XHJcbiAgICBpcCAgICAgICAgICAgID0gJCgnI2NvbnRyYWN0LWlwJykudmFsKCk7XHJcbiAgICBjb2RlICAgICAgICAgID0gJChcIiNzZWxlY3QtY29udHJhY3QtY29kZVwiKS52YWwoKTtcclxuXHJcbiAgICBwYXltZW50ID0gJChcIiNjb250cmFjdC1jbGllbnQtcGF5bWVudFwiKS52YWwoKTtcclxuICAgIG5leHRQYXltZW50ID0gbW9tZW50KGNvbnRyYWN0X2RhdGUpLmFkZCgxLCAnbW9udGhzJykuZm9ybWF0KCdZWVlZLU1NLUREJyk7XHJcblxyXG4gICAgdmFyIGlzX2VtcHR5ID0gaXNFbXB0eShbY2xpZW50X2lkLCB1c2VyX2lkLCBzZXJ2aWNlX2lkLCBjb250cmFjdF9kYXRlLCBkdXJhdGlvbl0pO1xyXG4gICAgaWYgKCFpc19lbXB0eSkge1xyXG4gICAgICB0b3RhbCA9IChOdW1iZXIoZHVyYXRpb24pICsgMSkgKiBOdW1iZXIocGF5bWVudCk7XHJcbiAgICAgIGZvcm0gPSAnaWRfZW1wbGVhZG89JyArIHVzZXJfaWQgKyBcIiZpZF9jbGllbnRlPVwiICsgY2xpZW50X2lkICsgXCImaWRfc2VydmljaW89XCIgKyBzZXJ2aWNlX2lkICsgXCImY29kaWdvPVwiICsgY29kZSArIFwiJmZlY2hhPVwiICsgY29udHJhY3RfZGF0ZTtcclxuICAgICAgZm9ybSArPSBcIiZkdXJhY2lvbj1cIiArIGR1cmF0aW9uICsgXCImbW9udG9fdG90YWw9XCIgKyB0b3RhbCArIFwiJm1vbnRvX3BhZ2Fkbz0wJnVsdGltb19wYWdvPW51bGxcIjtcclxuICAgICAgZm9ybSArPSBcIiZtZW5zdWFsaWRhZD1cIiArIHBheW1lbnQgKyBcIiZwcm94aW1vX3BhZ289XCIgKyBuZXh0UGF5bWVudCArIFwiJmVzdGFkbz1hY3Rpdm8mdGFibGE9Y29udHJhdG9zXCI7XHJcbiAgICAgIGZvcm0gKz0gXCImbm9tYnJlX2VxdWlwbz1cIiArIGVxdWlwbWVudCArIFwiJm1hY19lcXVpcG89XCIgKyBlTWFjICsgXCImcm91dGVyPVwiICsgcm91dGVyICsgXCImbWFjX3JvdXRlcj1cIiArIHJNYWM7XHJcbiAgICAgIGZvcm0gKz0gXCImbW9kZWxvPVwiICsgbW9kZWwgKyBcIiZpcD1cIiArIGlwO1xyXG4gICAgICBjb25uZWN0QW5kU2VuZChcInByb2Nlc3MvYWRkXCIsIG51bGwsIG51bGwsIENvbnRyYWN0cy5nZXRMYXN0LCBmb3JtLCBudWxsKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRpc3BsYXlBbGVydChcIlJldmlzZVwiLCBcIkxMZW5lIHRvZG9zIGxvcyBjYW1wb3MgcG9yIGZhdm9yXCIsIFwiZXJyb3JcIik7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXh0ZW5kOiBmdW5jdGlvbihpZENvbnRyYXRvKSB7XHJcbiAgICB2YXIgZm9ybTtcclxuICAgIGZvcm0gPSAnaWRfY29udHJhdG89JyArIGlkQ29udHJhdG9yO1xyXG4gICAgY29ubmVjdEFuZFNlbmQoXCJwcm9jZXNzL2V4dGVuZFwiLCB0cnVlLCBudWxsLCBudWxsLCBmb3JtLCBudWxsKTtcclxuICB9LFxyXG5cclxuICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGZvcm0gPSBcInRhYmxhPWNvbnRyYXRvc1wiO1xyXG4gICAgY29ubmVjdEFuZFNlbmQoJ3Byb2Nlc3MvZ2V0YWxsJywgZmFsc2UsIG51bGwsIGNvbnRyYWN0VGFibGUucmVmcmVzaCwgZm9ybSwgbnVsbCk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0TGFzdDogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgIGNvbnNvbGUubG9nKGRhdGEubWVuc2FqZSk7XHJcbiAgICBkaXNwbGF5TWVzc2FnZShkYXRhLm1lbnNhamUpXHJcbiAgICAkKFwiI2J0bi1zYXZlLWNvbnRyYWN0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBcIlwiKTtcclxuICAgICQoXCIjYnRuLXByaW50LWNvbnRyYWN0XCIpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcclxuICAgIGlmKGRhdGEudGFibGFfcGFnb3Mpe1xyXG4gICAgICBtYWtlUGF5bWVudExpc3QoZGF0YS50YWJsYV9wYWdvcyk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY2FsbEV4dHJhOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciByb3cgPSBjb250cmFjdFRhYmxlLmdldFNlbGVjdGVkUm93KCk7XHJcbiAgICBpZiAocm93KSB7XHJcbiAgICAgICQoXCIjZXh0cmEtY2xpZW50LWRuaVwiKS52YWwocm93LmNlZHVsYSk7XHJcbiAgICAgIENvbnRyYWN0cy5nZXRBbGxPZkNsaWVudChyb3cuY2VkdWxhKTtcclxuICAgICAgJCgnI2FkZC1leHRyYS1tb2RhbCcpLm1vZGFsKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgZGlzcGxheUFsZXJ0KFwiUmV2aXNlXCIsIFwiU2VsZWNjaW9uZSBlbCBjb25yYXRvIHByaW1lcm9cIiwgXCJlcnJvclwiKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHJvdyAgICAgICAgPSBjb250cmFjdFRhYmxlLmdldFNlbGVjdGVkUm93KClcclxuICAgIHZhciBpc19wZW5hbHR5ID0gZmFsc2U7XHJcbiAgICB2YXIgcmVhc29uICAgICA9ICQoXCIjY2FuY2VsYXRpb24tcmVhc29uXCIpLnZhbCgpO1xyXG4gICAgdmFyIGNoZWNrZWQgICAgPSAkKFwiI2NoZWNrLXBlbmFsdHk6Y2hlY2tlZFwiKS5sZW5ndGg7XHJcbiAgICB2YXIgZm9ybSwgZmVjaGE7XHJcbiAgICBpZihyb3cuaWQpe1xyXG4gICAgICBpZiAoY2hlY2tlZCA+IDApIHtcclxuICAgICAgICBpc19wZW5hbHR5ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBmZWNoYSA9IG1vbWVudCgpLmZvcm1hdChcIllZWVktTU0tRERcIik7XHJcbiAgICAgIGZvcm0gPSAnaWRfY29udHJhdG89JyArIHJvdy5pZCArICcmZmVjaGE9JyArIGZlY2hhICsgJyZpZF9jbGllbnRlPScgKyByb3cuaWRfY2xpZW50ZTtcclxuICAgICAgZm9ybSArPSBcIiZtb3Rpdm89XCIgKyByZWFzb24gKyBcIiZwZW5hbGlkYWQ9XCIgKyBpc19wZW5hbHR5O1xyXG4gICAgICBjb25uZWN0QW5kU2VuZCgncHJvY2Vzcy9jYW5jZWwnLCB0cnVlLCBudWxsLCBudWxsLCBmb3JtLCBDb250cmFjdHMuZ2V0QWxsKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBkaXNwbGF5TWVzc2FnZShNRVNTQUdFX0VSUk9SICtcIiBObyBoYXkgY29udHJhdG8gc2VsZWNjaW9uYWRvXCIpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGdldE9uZTogZnVuY3Rpb24oaWRfY29udHJhdG8sIHJlY2VpdmVyKSB7XHJcbiAgICBmb3JtID0gXCJ0YWJsYT1jb250cmF0b3MmaWRfY29udHJhdG89XCIgKyBpZF9jb250cmF0bztcclxuICAgIGNvbm5lY3RBbmRTZW5kKFwicHJvY2Vzcy9nZXRvbmVcIiwgZmFsc2UsIG51bGwsIHJlY2VpdmVyLCBmb3JtLCBudWxsKVxyXG4gIH0sXHJcblxyXG4gIHJlY2lldmU6IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuICAgIHZhciBjb250cmFjdCAgICA9IEpTT04ucGFyc2UoY29udGVudCk7XHJcbiAgICB0aGlzLmlkX2NvbnRyYXRvID0gY29udHJhY3RbJ2lkX2NvbnRyYXRvJ107XHJcbiAgICB2YXIgJGVxdWlwbyAgICAgPSAkKFwiI3UtY29udHJhY3QtZXF1aXBtZW50XCIpO1xyXG4gICAgdmFyICRtYWNFcXVpcG8gID0gJChcIiN1LWNvbnRyYWN0LWUtbWFjXCIpO1xyXG4gICAgdmFyICRyb3V0ZXIgICAgID0gJChcIiN1LWNvbnRyYWN0LXJvdXRlclwiKTtcclxuICAgIHZhciAkbWFjUm91dGVyICA9ICQoXCIjdS1jb250cmFjdC1yLW1hY1wiKTtcclxuICAgIHZhciAkbW9kZWxvICAgICA9ICQoXCIjdS1jb250cmFjdC1tb2RlbG9cIik7XHJcbiAgICB2YXIgJGNvZGlnbyAgICAgPSAkKFwiI3NlbGVjdC1jb250cmFjdC1jb2RlXCIpO1xyXG4gICAgdmFyICRpc0NoYW5nZUlwID0gJChcIiNjaGVjay1jaGFuZ2UtaXBcIik7XHJcbiAgICB2YXIgJGlwICAgICAgICAgPSAkKFwiI3UtY29udHJhY3QtaXBcIik7XHJcblxyXG4gICAgJGVxdWlwby52YWwoY29udHJhY3RbJ25vbWJyZV9lcXVpcG8nXSk7XHJcbiAgICAkbWFjRXF1aXBvLnZhbChjb250cmFjdFsnbWFjX2VxdWlwbyddKTtcclxuICAgICRyb3V0ZXIudmFsKGNvbnRyYWN0Wydyb3V0ZXInXSk7XHJcbiAgICAkbWFjUm91dGVyLnZhbChjb250cmFjdFsnbWFjX3JvdXRlciddKTtcclxuICAgICRtb2RlbG8udmFsKGNvbnRyYWN0Wydtb2RlbG8nXSk7XHJcbiAgICAkaXAudmFsKGNvbnRyYWN0WydpcCddKTtcclxuXHJcbiAgICAvLyAkKFwiI3VwZGF0ZS1jb250cmFjdC1tb2RhbCBzZWxlY3RcIikudmFsKCcnKVxyXG4gICAgJChcIiN1cGRhdGUtY29udHJhY3QtbW9kYWxcIikubW9kYWwoKTtcclxuICAgICQoXCIjdXBkYXRlLWNvbnRyYWN0XCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHVwZGF0ZUNvbnRyYWN0KGlkX2NvbnRyYXRvKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNvbnRyYWN0KGlkX2NvbnRyYXRvKSB7XHJcbiAgICAgIHZhciBjaGVja2VkID0gJChcIiNjaGVjay1jaGFuZ2UtaXA6Y2hlY2tlZFwiKS5sZW5ndGg7XHJcbiAgICAgIGZvcm0gPSAnaWRfY29udHJhdG89JyArIGlkX2NvbnRyYXRvICsgJyZub21icmVfZXF1aXBvPScgKyAkZXF1aXBvLnZhbCgpICsgXCImbWFjX2VxdWlwbz1cIiArICRtYWNFcXVpcG8udmFsKCk7XHJcbiAgICAgIGZvcm0gKz0gXCImcm91dGVyPVwiICsgJHJvdXRlci52YWwoKSArIFwiJm1hY19yb3V0ZXI9XCIgKyAkbWFjUm91dGVyLnZhbCgpO1xyXG4gICAgICBmb3JtICs9IFwiJm1vZGVsbz1cIiArICRtb2RlbG8udmFsKCk7XHJcbiAgICAgIGZvcm0gKz0gXCImdGFibGE9Y29udHJhdG9zXCI7XHJcbiAgICAgIGlmIChjaGVja2VkID4gMCkge1xyXG4gICAgICAgIGZvcm0gKz0gXCImaXA9XCIgKyAkaXAudmFsKCkgKyBcIiZjb2RpZ289XCIgKyAkY29kaWdvLnZhbCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbm5lY3RBbmRTZW5kKFwicHJvY2Vzcy91cGRhdGVcIiwgdHJ1ZSwgbnVsbCwgbnVsbCwgZm9ybSwgQ29udHJhY3RzLmdldEFsbCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0SXBMaXN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VjdGlvbl9pZCA9ICQoXCIjc2VsZWN0LWNvbnRyYWN0LXNlY3RvclwiKS52YWwoKTtcclxuICAgIHZhciBmb3JtID0gXCJpZF9zZWNjaW9uPVwiICsgc2VjdGlvbl9pZCArIFwiJnRhYmxhPWlwX2xpc3RcIjtcclxuICAgIGNvbm5lY3RBbmRTZW5kKFwicHJvY2Vzcy9nZXRhbGxcIiwgZmFsc2UsIG51bGwsIG1ha2VJcExpc3QsIGZvcm0sIG51bGwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG1ha2VJcExpc3QoY29udGVudCkge1xyXG4gICAgICAkKFwiI3NlbGVjdC1jb250cmFjdC1jb2RlXCIpLmh0bWwoY29udGVudCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgYnRuRXh0cmFQcmVzc2VkOiBmdW5jdGlvbiAoJHRoaXMpIHtcclxuICAgIHZhciBidXR0b25JZCA9ICR0aGlzLnRleHQoKS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICBzd2l0Y2ggKGJ1dHRvbklkKSB7XHJcbiAgICAgIGNhc2UgXCJtZWpvcmFyXCI6XHJcbiAgICAgICAgQ29udHJhY3RzLnVwZ3JhZGUoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcImV4dGVuZGVyXCI6XHJcbiAgICAgICAgQ29udHJhY3RzLmV4dGVuZCgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiZ3VhcmRhclwiOlxyXG4gICAgICAgIENvbnRyYWN0cy5hZGRFeHRyYSgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHVwZ3JhZGU6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBmb3JtLCBjb250cmFjdElkLCBzZWxlY3RlZFNlcnZpY2UsIHNlcnZpY2VJZCwgYW1vdW50O1xyXG5cclxuICAgIGNvbnRyYWN0SWQgPSAkKFwiI2V4dHJhLWNsaWVudC1jb250cmFjdFwiKS52YWwoKTtcclxuICAgIHNlbGVjdGVkU2VydmljZSA9ICQoXCIuc2VydmljZS1jYXJkLnNlbGVjdGVkXCIpO1xyXG4gICAgc2VydmljZUlkID0gc2VsZWN0ZWRTZXJ2aWNlLmF0dHIoXCJkYXRhLWlkXCIpO1xyXG4gICAgYW1vdW50ID0gc2VsZWN0ZWRTZXJ2aWNlLmF0dHIoXCJkYXRhLXBheW1lbnRcIik7XHJcblxyXG4gICAgdmFyIGlzX2VtcHR5ID0gaXNFbXB0eShbY29udHJhY3RJZCwgc2VydmljZUlkLCBhbW91bnRdKTtcclxuICAgIGlmICghaXNfZW1wdHkpIHtcclxuICAgICAgZm9ybSA9ICdpZF9jb250cmF0bz0nICsgY29udHJhY3RJZCArIFwiJmlkX3NlcnZpY2lvPVwiICsgc2VydmljZUlkICsgXCImY3VvdGE9XCIgKyBhbW91bnQ7XHJcbiAgICAgIGNvbm5lY3RBbmRTZW5kKCdwcm9jZXNzL3VwZ3JhZGUnLCB0cnVlLCBpbml0R2xvYmFsSGFuZGxlcnMsIG51bGwsIGZvcm0sIENvbnRyYWN0cy5nZXRBbGwpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkaXNwbGF5QWxlcnQoXCJSZXZpc2VcIiwgXCJhc2VndXJhdGUgZGUgbGxlbmFyIHRvZG9zIGxvcyBkYXRvcyB5IHNlbGVjY2lvbmFyIGVsIHNlcnZpY2lvXCIsIFwiaW5mb1wiKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZWNvbm5lY3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBmb3JtLCBjb250cmFjdElkLCBzZWxlY3RlZFNlcnZpY2UsIHNlcnZpY2VJZCwgZHVyYXRpb24sIGRhdGUsc2VuZCwgaXNfZW1wdHksaW5mbztcclxuXHJcbiAgICBjb250cmFjdElkID0gJChcIiNzZWxlY3QtY29udHJhY3RcIikudmFsKCk7XHJcbiAgICBzZWxlY3RlZFNlcnZpY2UgPSAkKFwiLnNlcnZpY2UtY2FyZC5zZWxlY3RlZFwiKTtcclxuICAgIHNlcnZpY2VJZCA9IHNlbGVjdGVkU2VydmljZS5hdHRyKFwiZGF0YS1pZFwiKTtcclxuICAgIGR1cmF0aW9uICA9ICQoXCIjcmVjb25uZWN0aW9uLW1vbnRoc1wiKS52YWwoKTtcclxuICAgIGRhdGUgPSAkKFwiI3JlY29ubmVjdGlvbi1kYXRlXCIpLnZhbCgpXHJcblxyXG4gICAgaXNfZW1wdHkgPSBpc0VtcHR5KFtjb250cmFjdElkLHNlcnZpY2VJZCxkYXRlLGR1cmF0aW9uXSk7XHJcbiAgICBjb25zb2xlLmxvZyhcInNlcnZpY2UgaWRcIiArIHNlcnZpY2VJZCArIFwiIGR1cmF0aW9uIFwiICsgZHVyYXRpb24gKyBcIiBkYXRlXCIgKyBkYXRlICsgXCIgY29udHJhY3QgXCIrIGNvbnRyYWN0SWQgKVxyXG4gICAgaWYoIWlzX2VtcHR5KXtcclxuICAgICAgaW5mbyA9IHtcclxuICAgICAgICAnaWRfY29udHJhdG8nOiBjb250cmFjdElkLFxyXG4gICAgICAgICdmZWNoYSc6IGRhdGUsXHJcbiAgICAgICAgJ2lkX3NlcnZpY2lvJzogc2VydmljZUlkLFxyXG4gICAgICAgICdkdXJhY2lvbic6IGR1cmF0aW9uXHJcbiAgICAgIH1cclxuICAgICAgZm9ybSA9IFwiZGF0YT1cIiArIEpTT04uc3RyaW5naWZ5KGluZm8pO1xyXG4gICAgICBzZW5kID0gYXhpb3MucG9zdChCQVNFX1VSTCArIFwiY29udHJhY3QvcmVjb25uZWN0XCIsZm9ybSk7XHJcbiAgICAgIHNlbmQudGhlbihmdW5jdGlvbihyZXMpe1xyXG4gICAgICAgIGRpc3BsYXlNZXNzYWdlKHJlcy5kYXRhLm1lbnNhamUpO1xyXG4gICAgICAgIFBheW1lbnRzLmdldEFsbCgpO1xyXG4gICAgICAgICQoXCIjYnRuLXJlY29ubmVjdFwiKS5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgJChcIi5yZWNvbm5lY3QtY2FsbGVyXCIpLnJlbW92ZUNsYXNzKCd2aXNpYmxlJyk7XHJcbiAgICAgICAgXHJcbiAgICAgIH0pXHJcbiAgICAgIHNlbmQuY2F0Y2goZnVuY3Rpb24oZXJyKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICB9KVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIHN3YWwoXCJMbGVuZSB0b2RvcyBsb3MgY2FtcG9zXCIpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgYWRkRXh0cmE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBmb3JtLCBjb250cmFjdElkLCBleHRyYVNlcnZpY2UsIHNlcnZpY2VDb3N0LCBlcXVpcG1lbnQsIGVNYWMsIHJvdXRlciwgck1hYyxwYXltZW50TW9kZTtcclxuXHJcbiAgICBjb250cmFjdElkID0gJChcIiNleHRyYS1jbGllbnQtY29udHJhY3RcIikudmFsKCk7XHJcbiAgICBzZXJ2aWNlQ29zdCA9ICQoXCIjZXh0cmEtc2VydmljZS1jb3N0XCIpLnZhbCgpO1xyXG4gICAgZXh0cmFTZXJ2aWNlID0gJChcIiNzZWxlY3QtZXh0cmEtc2VydmljZVwiKS52YWwoKTtcclxuICAgIGVxdWlwbWVudCA9ICQoXCIjZXh0cmEtZXF1aXBvXCIpLnZhbCgpO1xyXG4gICAgZU1hYyA9ICQoXCIjZXh0cmEtZS1tYWNcIikudmFsKCk7XHJcbiAgICByb3V0ZXIgPSAkKFwiI2V4dHJhLXJvdXRlclwiKS52YWwoKTtcclxuICAgIHJNYWMgPSAkKFwiI2V4dHJhLXItbWFjXCIpLnZhbCgpO1xyXG4gICAgcGF5bWVudE1vZGUgPSAkKFwiI3NlbGVjdC1wYXltZW50LW1vZGVcIikudmFsKCk7XHJcblxyXG4gICAgdmFyIGlzX2VtcHR5ID0gaXNFbXB0eShbY29udHJhY3RJZCwgZXh0cmFTZXJ2aWNlLCBzZXJ2aWNlQ29zdCxwYXltZW50TW9kZV0pO1xyXG4gICAgaWYgKCFpc19lbXB0eSkge1xyXG4gICAgICBmb3JtID0gJ2lkX2NvbnRyYXRvPScgKyBjb250cmFjdElkICsgXCImY29zdG9fc2VydmljaW89XCIgKyBzZXJ2aWNlQ29zdCArIFwiJm5vbWJyZV9zZXJ2aWNpbz1cIiArIGV4dHJhU2VydmljZTtcclxuICAgICAgZm9ybSArPSAnJm5vbWJyZV9lcXVpcG89JyArIGVxdWlwbWVudCArIFwiJm1hY19lcXVpcG89XCIgKyBlTWFjICsgXCImcm91dGVyPVwiICsgcm91dGVyICsgXCImbWFjX3JvdXRlcj1cIiArIHJNYWM7XHJcbiAgICAgIGZvcm0gKz0gJyZtb2RvX3BhZ289JyArIHBheW1lbnRNb2RlO1xyXG4gICAgICBjb25uZWN0QW5kU2VuZCgncHJvY2Vzcy9hZGRleHRyYScsIHRydWUsIGluaXRHbG9iYWxIYW5kbGVycywgbnVsbCwgZm9ybSwgQ29udHJhY3RzLmdldEFsbCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkaXNwbGF5QWxlcnQoXCJyZXZpc2VcIiwgXCJhc2VndXJhdGUgZGUgbGxlbmFyIHRvZG9zIGxvcyBkYXRvcyB5IHNlbGVjY2lvbmFyIGVsIHNlcnZpY2lvXCIsIFwiaW5mb1wiKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBleHRlbmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBmb3JtLCBjb250cmFjdElkLCBkdXJhdGlvbjtcclxuICAgIGNvbnRyYWN0SWQgPSAkKFwiI2V4dHJhLWNsaWVudC1jb250cmFjdFwiKS52YWwoKTtcclxuICAgIGR1cmF0aW9uID0gJChcIiNleHRyYS1leHRlbnNpb24tbW9udGhzXCIpLnZhbCgpO1xyXG5cclxuICAgIHZhciBpc19lbXB0eSA9IGlzRW1wdHkoW2R1cmF0aW9uLCBjb250cmFjdElkXSk7XHJcbiAgICBpZiAoIWlzX2VtcHR5KSB7XHJcbiAgICAgIGZvcm0gPSAnaWRfY29udHJhdG89JyArIGNvbnRyYWN0SWQgKyBcIiZkdXJhY2lvbj1cIiArIGR1cmF0aW9uO1xyXG4gICAgICBjb25uZWN0QW5kU2VuZCgncHJvY2Vzcy9leHRlbmRfY29udHJhY3QnLCB0cnVlLCBpbml0R2xvYmFsSGFuZGxlcnMsIG51bGwsIGZvcm0sIENvbnRyYWN0cy5nZXRBbGwpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkaXNwbGF5QWxlcnQoXCJyZXZpc2VcIiwgXCJhc2VndXJhdGUgZGUgbGxlbmFyIHRvZG9zIGxvcyBkYXRvcyB5IHNlbGVjY2lvbmFyIGVsIHNlcnZpY2lvXCIsIFwiaW5mb1wiKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBnZXRBbGxPZkNsaWVudDogZnVuY3Rpb24oZG5pKSB7XHJcbiAgICB2YXIgZm9ybSA9IFwiZG5pPVwiICsgZG5pO1xyXG4gICAgY29ubmVjdEFuZFNlbmQoXCJwcm9jZXNzL2RhdGFfZm9yX2V4dHJhXCIsIGZhbHNlLCBudWxsLCBtYWtlQ29udHJhY3RMaXN0LCBmb3JtLCBudWxsKTtcclxuICB9LFxyXG5cclxuICAvLyBOb3RlOiBsbyBzaWVudG8sIGRlIGFxdWkgZW4gYWRlbGFudGUgdXNvIGF4aW9zLCBlcyBtdWNobyBtYXMgY29tb2RvXHJcbiAgc3VzcGVuZDogZnVuY3Rpb24gKGlkX2NvbnRyYXRvKSB7XHJcbiAgICBmb3JtID0gXCJkYXRhPVwiICsgSlNPTi5zdHJpbmdpZnkoe2lkX2NvbnRyYXRvOmlkX2NvbnRyYXRvfSlcclxuICAgIHZhciBzZW5kID0gYXhpb3MucG9zdChCQVNFX1VSTCArICdjb250cmFjdC9zdXNwZW5kJyxmb3JtKTtcclxuICAgIHNlbmQudGhlbihmdW5jdGlvbihyZXMpe1xyXG4gICAgICB2YXIgZGF0YSA9IHJlcy5kYXRhXHJcbiAgICAgIGRpc3BsYXlNZXNzYWdlKGRhdGEubWVuc2FqZSk7XHJcbiAgICAgIENvbnRyYWN0cy5nZXRBbGwoKTtcclxuICAgIH0pXHJcbiAgICBzZW5kLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbnZhciBQYXltZW50cyA9IHtcclxuICBnZXRBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBpZCA9ICQoXCIjc2VsZWN0LWNvbnRyYWN0XCIpLnZhbCgpO1xyXG4gICAgaWYgKGlkICE9IG51bGwpIHtcclxuICAgICAgdmFyIGZvcm0gPSBcInRhYmxhPXBhZ29zJmlkPVwiICsgaWQ7XHJcbiAgICAgIGNvbm5lY3RBbmRTZW5kKCdwcm9jZXNzL2dldGFsbCcsIGZhbHNlLCBudWxsLCBwYXltZW50VGFibGUucmVmcmVzaCwgZm9ybSwgUGF5bWVudHMuY29udHJhY3RSZWZyZXNoKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB1cGRhdGU6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICB2YXIgZGF0ZSA9IG1vbWVudCgpLmZvcm1hdChcIllZWVktTU0tRERcIik7XHJcbiAgICAgIHZhciBpZF9jb250cmF0byA9ICQoXCIjc2VsZWN0LWNvbnRyYWN0XCIpLnZhbCgpO1xyXG4gICAgICB2YXIgZm9ybSA9IFwidGFibGE9cGFnb3MmaWQ9XCIgKyBpZCArIFwiJmVzdGFkbz1wYWdhZG8mZmVjaGFfcGFnbz1cIiArIGRhdGUgKyBcIiZpZF9jb250cmF0bz1cIiArIGlkX2NvbnRyYXRvO1xyXG4gICAgICBjb25uZWN0QW5kU2VuZCgncHJvY2Vzcy91cGRhdGUnLCB0cnVlLCBudWxsLCBudWxsLCBmb3JtLCBQYXltZW50cy5nZXRBbGwpO1xyXG4gIH0sXHJcblxyXG4gIHNhdmVBYm9ub3M6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBmb3JtLCBvYnNlcnZhdGlvbnMsIGFib25vJGlucHV0QWJvbm8sJHRleHRBYm9ubyxjb250cmFjdElkO1xyXG5cclxuICAgICR0ZXh0QWJvbm8gICA9ICQoJyN0ZXh0LWFib25vLWRldGFpbCcpO1xyXG4gICAgb2JzZXJ2YXRpb25zID0gJHRleHRBYm9uby52YWwoKTtcclxuICAgIGNvbnRyYWN0SWQgICA9ICQoXCIjc2VsZWN0LWNvbnRyYWN0XCIpLnZhbCgpO1xyXG4gICAgJGlucHV0QWJvbm8gID0gJChcIiNpbnB1dC1hYm9ub1wiKTtcclxuICAgIGFib25vICAgICAgICA9ICRpbnB1dEFib25vLnZhbCgpO1xyXG5cclxuICAgIGZvcm0gPSAnb2JzZXJ2YWNpb25lcz0nICsgb2JzZXJ2YXRpb25zICsgXCImYWJvbm9zPVwiICsgYWJvbm87XHJcbiAgICBmb3JtICs9IFwiJmNvbnRyYXRvX2Fib25vPVwiK2NvbnRyYWN0SWQrXCImdGFibGE9YWJvbm9zXCI7XHJcbiAgICBjb25uZWN0QW5kU2VuZChcInByb2Nlc3MvdXBkYXRlXCIsIHRydWUsIG51bGwsIG51bGwsIGZvcm0sIFBheW1lbnRzLmdldEFsbClcclxuICAgICRpbnB1dEFib25vLnZhbCgnJylcclxuICB9LFxyXG5cclxuICBzYXZlRXh0cmE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZW5kID0gYXhpb3MucG9zdChCQVNFX1VSTCArICdwcm9jZXNzLycpXHJcbiAgfSxcclxuXHJcbiAgdXBkYXRlVW50aWw6IGZ1bmN0aW9uKGNvbnRyYWN0SWQsbGFzdFBheW1lbnRJZCl7XHJcbiAgICB2YXIgaWRfY29udHJhdG8gPSAkKFwiI3NlbGVjdC1jb250cmFjdFwiKS52YWwoKTtcclxuICAgIHZhciBmb3JtID0gXCJ0YWJsYT1wYWdvc19hbF9kaWEmaWRfdWx0aW1vX3BhZ289XCIgKyBsYXN0UGF5bWVudElkICsgXCImZXN0YWRvPXBhZ2FkbyZpZF9jb250cmF0bz1cIiArIGNvbnRyYWN0SWQ7XHJcbiAgICB2YXIgaGFuZGxlcnMsIGNhbGxiYWNrO1xyXG4gICAgY29ubmVjdEFuZFNlbmQoJ3Byb2Nlc3MvdXBkYXRlJywgdHJ1ZSwgbnVsbCwgbnVsbCwgZm9ybSwgbnVsbCwgaGVhdnlMb2FkKTtcclxuICB9LFxyXG4gICAgXHJcbiAgcmVtb3ZlUGF5bWVudDogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICB2YXIgZm9ybSA9IFwidGFibGE9ZGVzaGFjZXJfcGFnbyZpZF9wYWdvPVwiICsgaWQ7XHJcbiAgICBjb25uZWN0QW5kU2VuZCgncHJvY2Vzcy91cGRhdGUnLCB0cnVlLCBudWxsLCBudWxsLCBmb3JtLCBQYXltZW50cy5nZXRBbGwpO1xyXG4gIH0sXHJcblxyXG4gIGNvbnRyYWN0UmVmcmVzaDogZnVuY3Rpb24oKXtcclxuICAgIHZhciBpZF9jbGllbnRlID0gJCgnI2RldGFpbC1jbGllbnQtaWQnKS52YWwoKVxyXG4gICAgdmFyIGZvcm0gPSBcInRhYmxhPWNvbnRyYXRvc19jbGllbnRlJmlkPVwiICsgaWRfY2xpZW50ZTtcclxuICAgIGNvbm5lY3RBbmRTZW5kKCdwcm9jZXNzL2dldGFsbCcsIGZhbHNlLCBudWxsLCBkZXRhaWxzQ29udHJhY3RUYWJsZS5yZWZyZXNoLCBmb3JtLCBudWxsKTtcclxuICB9LFxyXG5cclxuICBnZXRPbmU6IGZ1bmN0aW9uKGlkX3BhZ28sIHJlY2VpdmVyKSB7XHJcbiAgICBmb3JtID0gXCJ0YWJsYT1wYWdvcyZpZF9wYWdvPVwiICsgaWRfcGFnbztcclxuICAgIGNvbm5lY3RBbmRTZW5kKFwicHJvY2Vzcy9nZXRvbmVcIiwgZmFsc2UsIG51bGwsIHJlY2VpdmVyLCBmb3JtLCBudWxsKVxyXG4gIH0sXHJcblxyXG4gIHJlY2VpdmVGb3JFZGl0OiBmdW5jdGlvbihjb250ZW50KXtcclxuICAgIHZhciBwYWdvICAgICAgICAgID0gSlNPTi5wYXJzZShjb250ZW50KTtcclxuICAgIHRoaXMuaWRfY29udHJhdG8gID0gcGFnb1snaWRfY29udHJhdG8nXTtcclxuICAgIHRoaXMuaWRfcGFnbyAgICAgPSBwYWdvWydpZF9wYWdvJ11cclxuICAgIHZhciAkY29uY2VwdG8gICAgID0gJChcIiNwYXltZW50LWNvbmNlcHRcIik7XHJcbiAgICB2YXIgJGZlY2hhTGltaXRlICA9ICQoXCIjcGF5bWVudC1saW1pdC1kYXRlXCIpO1xyXG4gICAgdmFyICRjdW90YSAgICAgICAgPSAkKFwiI3BheW1lbnQtY3VvdGFcIik7XHJcbiAgICB2YXIgJG1vcmEgICAgICAgICA9ICQoXCIjcGF5bWVudC1tb3JhXCIpO1xyXG4gICAgdmFyICRleHRyYSAgICAgICAgPSAkKFwiI3BheW1lbnQtZXh0cmFcIik7XHJcbiAgICB2YXIgJHRvdGFsICAgICAgICA9ICQoXCIjcGF5bWVudC10b3RhbFwiKTtcclxuICAgIHZhciAkZGVzY3VlbnRvICAgID0gJChcIiNwYXltZW50LWRpc2NvdW50LWFtb3VudFwiKTtcclxuICAgIHZhciAkcmF6b24gICAgICAgID0gJChcIiNwYXltZW50LWRpc2NvdW50LXJlYXNvblwiKTtcclxuICAgIHZhciAkbW9kYWwgICAgICAgID0gJChcIiNhZHZhbmNlZC1wYXltZW50XCIpO1xyXG5cclxuICAgICRjb25jZXB0by52YWwocGFnb1snY29uY2VwdG8nXSk7XHJcbiAgICAkZmVjaGFMaW1pdGUudmFsKHBhZ29bJ2ZlY2hhX2xpbWl0ZSddKTtcclxuICAgICRjdW90YS52YWwocGFnb1snY3VvdGEnXSk7XHJcbiAgICAkbW9yYS52YWwocGFnb1snbW9yYSddKTtcclxuICAgICRleHRyYS52YWwocGFnb1snbW9udG9fZXh0cmEnXSk7XHJcbiAgICAkdG90YWwudmFsKHBhZ29bJ3RvdGFsJ10pO1xyXG4gICAgaW50ZXJhY3RpdmVTdW0oKTtcclxuXHJcbiAgICAkbW9kYWwubW9kYWwoKTtcclxuICAgICRtb2RhbC5vbignaGlkZS5icy5tb2RhbCcsZnVuY3Rpb24oKXtcclxuICAgICAgJG1vZGFsLmZpbmQoJ2lucHV0JykudmFsKCcnKVxyXG4gICAgfSk7XHJcbiAgICAkKFwiI2J0bi1hcHBseS1kaXNjb3VudFwiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiAnRXN0w6EgU2VndXJvPycsXHJcbiAgICAgICAgICB0ZXh0OiBcIlNlZ3VybyBkZSBxdWUgcXVpZXJlIGFwbGljYXIgZXN0ZSBkZXNjdWVudG8gZGUgXCIgKyAkZGVzY3VlbnRvLnZhbCgpICsgXCI/XCIsXHJcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsXHJcbiAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdFc3RveSBTZWd1cm8hJyxcclxuICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6ICdDYW5jZWxhcidcclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICBhcHBseURpc2NvdW50KGlkX3BhZ28pO1xyXG4gICAgICAgICAgJG1vZGFsLmhpZGUoKTtcclxuICAgICAgICAgICRtb2RhbC5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJyk7XHJcbiAgICAgICAgICAkKCcubW9kYWwtYmFja2Ryb3AnKS5yZW1vdmUoKTtcclxuIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwbHlEaXNjb3VudChpZF9wYWdvKSB7XHJcbiAgICAgIHZhciBkYXRlID0gbW9tZW50KCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcclxuICAgICAgZm9ybSA9ICdpZF9wYWdvPScgKyBpZF9wYWdvICsgJyZpZF9jb250cmF0bz0nICsgaWRfY29udHJhdG8gKyBcIiZjdW90YT1cIiArICRjdW90YS52YWwoKTtcclxuICAgICAgZm9ybSArPSBcIiZtb3JhPVwiICsgJG1vcmEudmFsKCkgKyBcIiZtb250b19leHRyYT1cIiArICRleHRyYS52YWwoKTtcclxuICAgICAgZm9ybSArPSBcIiZ0b3RhbD1cIiArICR0b3RhbC52YWwoKSArICcmZGVzY3VlbnRvPScgKyAkZGVzY3VlbnRvLnZhbCgpICsgJyZyYXpvbl9kZXNjdWVudG89JyArJHJhem9uLnZhbCgpICsgJyZmZWNoYV9wYWdvPScgKyBkYXRlIDtcclxuICAgICAgZm9ybSArPSBcIiZ0YWJsYT1kaXNjb3VudF9wYWdvc1wiO1xyXG4gICAgICBjb25uZWN0QW5kU2VuZChcInByb2Nlc3MvdXBkYXRlXCIsIHRydWUsIG51bGwsIG51bGwsIGZvcm0sIFBheW1lbnRzLmdldEFsbCk7XHJcbiAgICAgICRtb2RhbC5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW50ZXJhY3RpdmVTdW0oKXtcclxuICAgICAgJCgnLnBheW1lbnQtc3VtYW5kb3MnKS5vbigna2V5dXAnLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJGN1b3RhLnZhbChwYWdvWydjdW90YSddIC0gJGRlc2N1ZW50by52YWwoKSk7XHJcbiAgICAgICAgdmFyIHN1bWEgPSBOdW1iZXIoJGN1b3RhLnZhbCgpKSArIE51bWJlcigkbW9yYS52YWwoKSkgKyBOdW1iZXIoJGV4dHJhLnZhbCgpKTtcclxuICAgICAgICAkdG90YWwudmFsKE51bWJlcihzdW1hKSlcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBlZGl0OiBmdW5jdGlvbihjb250ZW50KXtcclxuICAgIHZhciBwYWdvICAgICAgICAgID0gSlNPTi5wYXJzZShjb250ZW50KTtcclxuICAgIHRoaXMuaWRfY29udHJhdG8gID0gcGFnb1snaWRfY29udHJhdG8nXTtcclxuICAgIHRoaXMuaWRfcGFnbyAgICAgID0gcGFnb1snaWRfcGFnbyddXHJcbiAgICB2YXIgJG1vZGFsICAgICAgICA9ICQoJyNlZGl0LXBheW1lbnQtbW9kYWwnKSBcclxuICAgIGNvbnNvbGUubG9nKHBhZ28pXHJcblxyXG4gICAgJG1vZGFsLm1vZGFsKCk7XHJcblxyXG4gICAgJG1vZGFsLm9uKCdoaWRlLmJzLm1vZGFsJyxmdW5jdGlvbigpe1xyXG4gICAgICAkbW9kYWwuZmluZCgnaW5wdXQnKS52YWwoJycpXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2J0bi1zYXZlLWVkaXRlZC1wYXltZW50XCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6ICdFc3TDoSBTZWd1cm8/JyxcclxuICAgICAgICAgIHRleHQ6IFwiU2VndXJvIGRlIHF1ZSBxdWllcmUgYXBsaWNhciBlc3RlIGRlc2N1ZW50byBkZSBcIiArICRkZXNjdWVudG8udmFsKCkgKyBcIj9cIixcclxuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcclxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ0VzdG95IFNlZ3VybyEnLFxyXG4gICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ0NhbmNlbGFyJ1xyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgIGFwcGx5RGlzY291bnQoaWRfcGFnbyk7XHJcbiAgICAgICAgICAkbW9kYWwuaGlkZSgpO1xyXG4gICAgICAgICAgJG1vZGFsLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKTtcclxuICAgICAgICAgICQoJy5tb2RhbC1iYWNrZHJvcCcpLnJlbW92ZSgpO1xyXG4gXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBmdW5jdGlvbiBhcHBseURpc2NvdW50KGlkX3BhZ28pIHtcclxuICAgIC8vICAgdmFyIGRhdGUgPSBtb21lbnQoKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xyXG4gICAgLy8gICBmb3JtID0gJ2lkX3BhZ289JyArIGlkX3BhZ28gKyAnJmlkX2NvbnRyYXRvPScgKyBpZF9jb250cmF0byArIFwiJmN1b3RhPVwiICsgJGN1b3RhLnZhbCgpO1xyXG4gICAgLy8gICBmb3JtICs9IFwiJm1vcmE9XCIgKyAkbW9yYS52YWwoKSArIFwiJm1vbnRvX2V4dHJhPVwiICsgJGV4dHJhLnZhbCgpO1xyXG4gICAgLy8gICBmb3JtICs9IFwiJnRvdGFsPVwiICsgJHRvdGFsLnZhbCgpICsgJyZkZXNjdWVudG89JyArICRkZXNjdWVudG8udmFsKCkgKyAnJnJhem9uX2Rlc2N1ZW50bz0nICskcmF6b24udmFsKCkgKyAnJmZlY2hhX3BhZ289JyArIGRhdGUgO1xyXG4gICAgLy8gICBmb3JtICs9IFwiJnRhYmxhPWRpc2NvdW50X3BhZ29zXCI7XHJcbiAgICAvLyAgIGNvbm5lY3RBbmRTZW5kKFwicHJvY2Vzcy91cGRhdGVcIiwgdHJ1ZSwgbnVsbCwgbnVsbCwgZm9ybSwgUGF5bWVudHMuZ2V0QWxsKTtcclxuICAgIC8vICAgJG1vZGFsLmhpZGUoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBmdW5jdGlvbiBpbnRlcmFjdGl2ZVN1bSgpe1xyXG4gICAgLy8gICAkKCcucGF5bWVudC1zdW1hbmRvcycpLm9uKCdrZXl1cCcsZnVuY3Rpb24oKXtcclxuICAgIC8vICAgICAkY3VvdGEudmFsKHBhZ29bJ2N1b3RhJ10gLSAkZGVzY3VlbnRvLnZhbCgpKTtcclxuICAgIC8vICAgICB2YXIgc3VtYSA9IE51bWJlcigkY3VvdGEudmFsKCkpICsgTnVtYmVyKCRtb3JhLnZhbCgpKSArIE51bWJlcigkZXh0cmEudmFsKCkpO1xyXG4gICAgLy8gICAgICR0b3RhbC52YWwoTnVtYmVyKHN1bWEpKVxyXG4gICAgLy8gICB9KVxyXG4gICAgLy8gfVxyXG4gIH1cclxuICBcclxufVxyXG5cclxudmFyIERhbWFnZXMgPSB7XHJcbiAgYWRkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZm9ybSwgaWRDbGllbnRlLCBkZXNjcmlwdGlvbjtcclxuICAgIGlkQ2xpZW50ZSA9ICQoXCIjYXZlcmlhcy1jbGllbnQtaWRcIikudmFsKCk7XHJcbiAgICBkZXNjcmlwdGlvbiA9ICQoXCIjYS1kZXNjcmlwdGlvblwiKS52YWwoKTtcclxuXHJcbiAgICB2YXIgaXNfZW1wdHkgPSBpc0VtcHR5KFtpZENsaWVudGUsIGRlc2NyaXB0aW9uXSk7XHJcbiAgICBpZiAoIWlzX2VtcHR5KSB7XHJcbiAgICAgIGZvcm0gPSAnaWRfY2xpZW50ZT0nICsgaWRDbGllbnRlICsgXCImZGVzY3JpcGNpb249XCIgKyBkZXNjcmlwdGlvbiArIFwiJnRhYmxhPWF2ZXJpYXNcIjtcclxuICAgICAgY29ubmVjdEFuZFNlbmQoXCJwcm9jZXNzL2FkZFwiLCB0cnVlLCBpbml0R2xvYmFsSGFuZGxlcnMsIG51bGwsIGZvcm0sIERhbWFnZXMuZ2V0QWxsKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICBkaXNwbGF5QWxlcnQoXCJSZXZpc2VcIiwgXCJMTGVuZSB0b2RvcyBsb3MgY2FtcG9zIHBvciBmYXZvclwiLCBcImVycm9yXCIpO1xyXG4gICAgfVxyXG4gICAgJCgnI25ldy1hdmVyaWEtbW9kYWwnKS5maW5kKCdpbnB1dCx0ZXh0YXJlYScpLnZhbChcIlwiKTtcclxuICB9LFxyXG5cclxuICBnZXRBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzdGF0dXMgPSAkKFwiI2F2ZXJpYXMtdmlldy1tb2RlXCIpLnZhbCgpO1xyXG4gICAgJChcIi5wcmVzZW50YWRvXCIpLnRleHQoc3RhdHVzKTtcclxuICAgIHZhciBmb3JtID0gXCJ0YWJsYT1hdmVyaWFzJmVzdGFkbz1cIiArIHN0YXR1cztcclxuICAgIGNvbm5lY3RBbmRTZW5kKCdwcm9jZXNzL2dldGFsbCcsIGZhbHNlLCBpbml0R2xvYmFsSGFuZGxlcnMsIGZpbGxBdmVyaWFzTGlzdCwgZm9ybSwgbnVsbCk7XHJcbiAgfSxcclxuXHJcbiAgdXBkYXRlOiBmdW5jdGlvbiAoJGlkX2F2ZXJpYSkge1xyXG4gICAgdmFyIGZvcm0gPSBcInRhYmxhPWF2ZXJpYXMmaWRfYXZlcmlhPVwiICsgJGlkX2F2ZXJpYTtcclxuICAgIGNvbm5lY3RBbmRTZW5kKCdwcm9jZXNzL3VwZGF0ZScsIHRydWUsIGluaXRHbG9iYWxIYW5kbGVycywgbnVsbCwgZm9ybSwgRGFtYWdlcy5nZXRBbGwpO1xyXG4gIH1cclxufVxyXG5cclxudmFyIEluc3RhbGxhdGlvbnMgPSB7XHJcbiAgZ2V0QWxsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc3RhdHVzID0gJChcIiNpbnN0YWxsYXRpb25zLXZpZXctbW9kZVwiKS52YWwoKTtcclxuICAgIHZhciBmb3JtID0gXCJ0YWJsYT1pbnN0YWxhY2lvbmVzJmVzdGFkbz1cIiArIHN0YXR1cztcclxuICAgIGNvbm5lY3RBbmRTZW5kKCdwcm9jZXNzL2dldGFsbCcsIGZhbHNlLCBpbml0R2xvYmFsSGFuZGxlcnMsIGZpbGxJbnN0YWxsYXRpb25zTGlzdCwgZm9ybSwgbnVsbCk7XHJcbiAgfSxcclxuXHJcbiAgdXBkYXRlOiBmdW5jdGlvbiAoJGlkX3BhZ28pIHtcclxuICAgIHZhciBmb3JtID0gXCJ0YWJsYT1pbnN0YWxhY2lvbmVzJmlkX3BhZ289XCIgKyAkaWRfcGFnbztcclxuICAgIGNvbm5lY3RBbmRTZW5kKCdwcm9jZXNzL3VwZGF0ZScsIHRydWUsIGluaXRHbG9iYWxIYW5kbGVycywgbnVsbCwgZm9ybSwgSW5zdGFsbGF0aW9ucy5nZXRBbGwpO1xyXG4gIH1cclxufVxyXG5cclxudmFyIENhamEgPSB7XHJcbiAgYWRkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZm9ybSwgYW1vdW50LCBkZXNjcmlwdGlvbiwgaXNfZW1wdHk7XHJcblxyXG4gICAgYW1vdW50ID0gJChcIiNjYWphLWEtYW1vdW50XCIpLnZhbCgpO1xyXG4gICAgZGVzY3JpcHRpb24gPSAkKFwiI2NhamEtYS1kZXNjcmlwdGlvblwiKS52YWwoKTtcclxuICAgIGZvcm0gPSBcImVudHJhZGE9XCIgKyBhbW91bnQgKyBcIiZkZXNjcmlwY2lvbj1cIiArIGRlc2NyaXB0aW9uICsgXCImdGFibGE9Y2FqYVwiO1xyXG4gICAgaXNfZW1wdHkgPSBpc0VtcHR5KFthbW91bnQsIGRlc2NyaXB0aW9uXSk7XHJcbiAgICBpZiAoIWlzX2VtcHR5KSB7XHJcbiAgICAgIGNvbm5lY3RBbmRTZW5kKCdwcm9jZXNzL2FkZCcsIHRydWUsIG51bGwsIG51bGwsIGZvcm0sIENhamEuZ2V0QWxsKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRpc3BsYXlBbGVydChcIlJldmlzZVwiLCBcIkxMZW5lIHRvZG9zIGxvcyBjYW1wb3MgcG9yIGZhdm9yXCIsIFwiZXJyb3JcIik7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmV0aXJlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZm9ybSwgYW1vdW50LCBkZXNjcmlwdGlvbiwgaXNfZW1wdHk7XHJcblxyXG4gICAgYW1vdW50ID0gJChcIiNjYWphLXItYW1vdW50XCIpLnZhbCgpO1xyXG4gICAgZGVzY3JpcHRpb24gPSAkKFwiI2NhamEtci1kZXNjcmlwdGlvblwiKS52YWwoKTtcclxuICAgIGZvcm0gPSBcInNhbGlkYT1cIiArIGFtb3VudCArIFwiJmRlc2NyaXBjaW9uPVwiICsgZGVzY3JpcHRpb247XHJcbiAgICBpc19lbXB0eSA9IGlzRW1wdHkoW2Ftb3VudCwgZGVzY3JpcHRpb25dKTtcclxuICAgIGlmICghaXNfZW1wdHkpIHtcclxuICAgICAgIGNvbm5lY3RBbmRTZW5kKCdwcm9jZXNzL3JldGlyZScsIHRydWUsIG51bGwsIG51bGwsIGZvcm0sIENhamEuZ2V0QWxsKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRpc3BsYXlBbGVydChcIlJldmlzZVwiLCBcIkxMZW5lIHRvZG9zIGxvcyBjYW1wb3MgcG9yIGZhdm9yXCIsIFwiZXJyb3JcIik7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0QWxsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZm9ybSA9IFwidGFibGE9Y2FqYVwiO1xyXG4gICAgY29ubmVjdEFuZFNlbmQoJ3Byb2Nlc3MvZ2V0QWxsJywgZmFsc2UsIG51bGwsIGNhamFUYWJsZS5yZWZyZXNoLCBmb3JtLCBDYWphLmdldFNhbGRvKTtcclxuICB9LFxyXG5cclxuICBnZXRTYWxkbzogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGZvcm0gPSBcInRhYmxhPWNhamFcIjtcclxuICAgIGNvbm5lY3RBbmRTZW5kKCdwcm9jZXNzL2dldG9uZScsIGZhbHNlLCBudWxsLCB1cGRhdGVTYWxkbywgZm9ybSwgbnVsbClcclxuICB9LFxyXG5cclxuICBzZWFyY2g6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkZGF0ZVNlYXJjaCA9ICQoXCIjY2FqYS1kYXRlXCIpO1xyXG4gICAgdmFyICR1c2VyU2VhcmNoID0gJChcIiNjYWphLXVzZXJcIik7XHJcbiAgICB2YXIgZGF0ZSA9ICgkZGF0ZVNlYXJjaC52YWwoKSkgPyAkZGF0ZVNlYXJjaC52YWwoKSA6ICclJztcclxuICAgIHZhciB1c2VySWQgPSAoJHVzZXJTZWFyY2gudmFsKCkpID8gJHVzZXJTZWFyY2gudmFsKCkgOiAnJSc7XHJcblxyXG4gICAgdmFyIGZvcm0gPSBcInRhYmxhPWNhamEmaWRfZW1wbGVhZG89XCIgKyB1c2VySWQgKyBcIiZmZWNoYT1cIiArIGRhdGU7XHJcbiAgICBjb25uZWN0QW5kU2VuZCgncHJvY2Vzcy9zZWFyY2gnLCBmYWxzZSwgbnVsbCwgY2FqYVRhYmxlLnJlZnJlc2gsIGZvcm0sIG51bGwpO1xyXG4gIH1cclxufVxyXG5cclxudmFyIENvbXBhbnkgPSB7XHJcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZm9ybSxcclxuICAgIGNvbXBhbnlOYW1lID0gJChcIiNjb21wYW55LW5hbWVcIikudmFsKCksXHJcbiAgICBjb21wYW55U3RhdGVtZW50ID0gJChcIiNjb21wYW55LXN0YXRlbWVudFwiKS52YWwoKSxcclxuICAgIGNvbXBhbnlQaG9uZTEgPSBnZXRWYWwoJChcIiNjb21wYW55LXBob25lMVwiKSksXHJcbiAgICBjb21wYW55RGlyZWN0aW9uID0gJChcIiNjb21wYW55LWRpcmVjdGlvblwiKS52YWwoKSxcclxuICAgIGNvbXBhbnlEZXNjcmlwdGlvbiA9ICQoXCIjY29tcGFueS1kZXNjcmlwdGlvblwiKS52YWwoKSxcclxuICAgIGNvbXBhbnlQaG9uZTIgPSBnZXRWYWwoJChcIiNjb21wYW55LXBob25lMlwiKSlcclxuXHJcbiAgICBmb3JtID0gJ25vbWJyZT0nICsgY29tcGFueU5hbWUgKyAnJmxlbWE9JyArIGNvbXBhbnlTdGF0ZW1lbnQgKyAnJmRlc2NyaXBjaW9uPScgKyBjb21wYW55RGVzY3JpcHRpb24gKyBcIiZkaXJlY2Npb249XCJcclxuICAgIGZvcm0gKz0gY29tcGFueURpcmVjdGlvbiArIFwiJnRlbGVmb25vMT1cIiArIGNvbXBhbnlQaG9uZTEgKyBcIiZ0ZWxlZm9ub3M9XCIgKyBjb21wYW55UGhvbmUyICsgXCImdGFibGE9ZW1wcmVzYVwiO1xyXG4gICAgY29ubmVjdEFuZFNlbmQoJ3Byb2Nlc3MvdXBkYXRlJywgdHJ1ZSwgbnVsbCwgbnVsbCwgZm9ybSwgbnVsbCk7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgU2V0dGluZ3MgPSB7XHJcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZm9ybSxcclxuICAgIHNldHRpbmdzQ2FyZ29Nb3JhID0gJChcIiNzZXR0aW5ncy1tb3JhXCIpLnZhbCgpLFxyXG4gICAgc2V0dGluZ3NGZWNoYUNvcnRlID0gJChcIiNzZXR0aW5ncy1mZWNoYS1jb3J0ZVwiKS52YWwoKSxcclxuICAgIHNldHRpbmdzQXBlcnR1cmFDYWphID0gJChcIiNzZXR0aW5ncy1hcGVydHVyYS1jYWphXCIpLnZhbCgpLFxyXG4gICAgc2V0dGluZ3NQZW5hbGl6YWNpb25DYW5jZWxhY2lvbiA9ICQoXCIjc2V0dGluZ3MtcGVuYWxpemFjaW9uLWNhbmNlbGFjaW9uXCIpLnZhbCgpLFxyXG4gICAgc2V0dGluZ3NNZXNlc1BvckRlZmVjdG8gPSAkKFwiI3NldHRpbmdzLW1lc2VzLXBvci1kZWZlY3RvXCIpLnZhbCgpLFxyXG4gICAgc2V0dGluZ3NTcGxpdERheSA9ICQoXCIjc2V0dGluZ3Mtc3BsaXQtZGF5XCIpLnZhbCgpO1xyXG5cclxuICAgIGZvcm0gPSAnY2FyZ29fbW9yYT0nICsgc2V0dGluZ3NDYXJnb01vcmEgKyAnJmZlY2hhX2NvcnRlPScgKyBzZXR0aW5nc0ZlY2hhQ29ydGUgKyAnJmFwZXJ0dXJhX2NhamE9JyArIHNldHRpbmdzQXBlcnR1cmFDYWphO1xyXG4gICAgZm9ybSArPSAnJnBlbmFsaXphY2lvbl9jYW5jZWxhY2lvbj0nICsgc2V0dGluZ3NQZW5hbGl6YWNpb25DYW5jZWxhY2lvbiArICcmbWVzZXNfcG9yX2RlZmVjdG89JyArIHNldHRpbmdzTWVzZXNQb3JEZWZlY3RvO1xyXG4gICAgZm9ybSArPSAnJnNwbGl0X2RheT0nICsgc2V0dGluZ3NTcGxpdERheSArICcmdGFibGE9c2V0dGluZ3MnO1xyXG4gICAgY29ubmVjdEFuZFNlbmQoJ3Byb2Nlc3MvdXBkYXRlJywgdHJ1ZSwgbnVsbCwgbnVsbCwgZm9ybSwgbnVsbCk7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgU2VjdGlvbnMgPSB7IFxyXG4gIGFkZDogZnVuY3Rpb24oKSB7XHJcbiAgICBzd2FsLnNldERlZmF1bHRzKHtcclxuICAgICAgaW5wdXQ6ICd0ZXh0JyxcclxuICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdOZXh0ICZyYXJyOycsXHJcbiAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgIGFuaW1hdGlvbjogZmFsc2UsXHJcbiAgICAgIHByb2dyZXNzU3RlcHM6IFsnMScsICcyJywgJzMnXVxyXG4gICAgfSlcclxuXHJcbiAgICB2YXIgc3RlcHMgPSBbe1xyXG4gICAgICAgIHRpdGxlOiAnTm9tYnJlIGRlbCBzZWN0b3InXHJcbiAgICAgIH0sXHJcbiAgICAgICdDb2RpZ28gZGVsIFNlY3RvcicsXHJcbiAgICBdXHJcblxyXG4gICAgc3dhbC5xdWV1ZShzdGVwcykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgIHN3YWwucmVzZXREZWZhdWx0cygpXHJcbiAgICAgIHNhdmUocmVzdWx0KVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gc2F2ZShyZXN1bHQpe1xyXG4gICAgICB2YXIgZm9ybTtcclxuICAgICAgdmFyIG5vbWJyZSA9IHJlc3VsdFswXTtcclxuICAgICAgdmFyIGNvZGlnb0FyZWEgPSByZXN1bHRbMV0sXHJcblxyXG4gICAgICBmb3JtID0gXCJub21icmU9XCIrbm9tYnJlK1wiJmNvZGlnb19hcmVhPVwiK2NvZGlnb0FyZWE7XHJcbiAgICAgIGZvcm0gKz0gXCImdGFibGE9c2VjY2lvbmVzXCJcclxuICAgICBcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpe1xyXG4gICAgICAgICBpZihjb25uZWN0QW5kU2VuZCgncHJvY2Vzcy9hZGQnLCB0cnVlLCBmYWxzZSwgbnVsbCwgZm9ybSxTZWN0aW9ucy5nZXRBbGwsaGVhdnlMb2FkKSl7XHJcbiAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGdldElwczogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaWQgPSAkKFwiI3NlbGVjdC1zZWN0b3JcIikudmFsKCk7XHJcbiAgICBpZiAoaWQgIT0gbnVsbCkge1xyXG4gICAgICB2YXIgZm9ybSA9IFwidGFibGE9aXBzJmlkPVwiICsgaWQ7XHJcbiAgICAgIGNvbm5lY3RBbmRTZW5kKCdwcm9jZXNzL2dldGFsbCcsIGZhbHNlLCBudWxsLCBTZWN0aW9ucy5yZW9yZGVyVGFibGUsIGZvcm0sbnVsbCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVvcmRlclRhYmxlOiBmdW5jdGlvbihjb250ZW50KXtcclxuICAgIHZhciB0YWJsZSA9ICQoXCIjdC1zZWN0aW9uc1wiKTtcclxuICAgIHRhYmxlLmJvb3RzdHJhcFRhYmxlKCdkZXN0cm95Jyk7XHJcbiAgICAkKFwiI3Qtc2VjdGlvbnMgdGJvZHlcIikuaHRtbChjb250ZW50KTtcclxuICAgIHRhYmxlLmJvb3RzdHJhcFRhYmxlKCk7XHJcbiAgICB0YWJsZS5maW5kKCd0Ym9keScpLmNzcyh7ZGlzcGxheTpcInRhYmxlLXJvdy1ncm91cFwifSk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0QWxsOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGZvcm0gPSBcInRhYmxhPXNlY2Npb25lc1wiO1xyXG4gICAgICBjb25uZWN0QW5kU2VuZCgncHJvY2Vzcy9nZXRhbGwnLCBmYWxzZSwgbnVsbCwgZmlsbFNlbGVjdCwgZm9ybSxoZWF2eUxvYWQpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGZpbGxTZWxlY3QoY29udGVudCl7XHJcbiAgICAgICQoXCIjc2VsZWN0LXNlY3RvclwiKS5odG1sKGNvbnRlbnQpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGluaXQ6IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgJHRhYmxlID0gJChcIiN0LXNlY3Rpb25zXCIpO1xyXG4gICAgdmFyICRidG5QcmludCA9ICQoXCIjYnRuLXByaW50LXNlY3Rpb25zXCIpO1xyXG4gICAgdmFyICRzZWxlY3RTdGF0ZSA9ICQoXCIjZmlsdGVyLXNlY3Rpb25zXCIpO1xyXG4gICAgXHJcblxyXG4gICAgJHNlbGVjdFN0YXRlLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBmaWx0ZXIgPSAkKHRoaXMpLnZhbCgpXHJcbiAgICAgIGlmKGZpbHRlci5pbmNsdWRlcyhcIl1cIikpXHJcbiAgICAgICAgZmlsdGVyID0gWydvY3VwYWRvJywnZGlzcG9uaWJsZSddXHJcbiAgICAgIGNvbnNvbGUubG9nKGZpbHRlcilcclxuXHJcbiAgICAgICR0YWJsZS5ib290c3RyYXBUYWJsZSgnZmlsdGVyQnknLHtcclxuICAgICAgICBlc3RhZG86ICBmaWx0ZXJcclxuICAgICAgfSlcclxuICAgIH0pXHJcblxyXG4gICAgJGJ0blByaW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIHByaW50KCk7XHJcbiAgICB9KVxyXG5cclxuICB9XHJcbn1cclxuXHJcbnZhciBFeHRyYXMgPSB7XHJcbiAgcmVtb3ZlOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgIHZhciBpZF9jbGllbnRlLCBzZW5kO1xyXG4gICAgXHJcbiAgICBpZF9jbGllbnRlID0gJCgnI2RldGFpbC1jbGllbnQtaWQnKS52YWwoKVxyXG4gICAgZm9ybSA9IFwiZGF0YT1cIiArIEpTT04uc3RyaW5naWZ5KHtpZDogaWQsaWRfY2xpZW50ZTogaWRfY2xpZW50ZX0pO1xyXG4gICAgc2VuZCA9IGF4aW9zLnBvc3QoQkFTRV9VUkwgKyAnZXh0cmEvZGVsZXRlX2V4dHJhJywgZm9ybSk7XHJcbiAgICBzZW5kLnRoZW4oZnVuY3Rpb24ocmVzKXtcclxuICAgICAgdmFyIGRhdGEgPSByZXMuZGF0YTtcclxuICAgICAgZGlzcGxheU1lc3NhZ2UoZGF0YS5tZW5zYWplKTtcclxuICAgICAgZXh0cmFUYWJsZS5yZWZyZXNoKGRhdGEuZXh0cmFzKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBzZW5kLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxufSIsIiAgdmFyIGN1cnJlbnRQYWdlID0gJChcInRpdGxlXCIpLnRleHQoKS5zcGxpdChcIiBcIik7XHJcbiAgY3VycmVudFBhZ2UgPSBjdXJyZW50UGFnZVs0XS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcclxuICB2YXIgcmFuID0gZmFsc2U7XHJcbiAgXHJcbiAgZnVuY3Rpb24gaW5pdENvbXBvbmVudHMoKXtcclxuICAgIHN3aXRjaCAoY3VycmVudFBhZ2UpIHtcclxuICAgICAgY2FzZSBcImhvbWVcIjpcclxuICAgICAgICBpbml0Q2xpZW50SGFuZGxlcnMoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcImFkbWluaXN0cmFkb3JcIjpcclxuICAgICAgICBpbml0QWRtaW5IYW5kbGVycygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiY2xpZW50ZXNcIjpcclxuICAgICAgICBpbml0Q2xpZW50SGFuZGxlcnMoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcInNlcnZpY2lvc1wiOlxyXG4gICAgICAgIGluaXRTZXJ2aWNlc0hhbmRsZXJzKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCJudWV2b19jb250cmF0b1wiOlxyXG4gICAgICAgIGluaXRDb250cmFjdEhhbmRsZXJzKCk7XHJcbiAgICAgICAgQ29udHJhY3RzLmdldElwTGlzdCgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiZGV0YWxsZXNcIjpcclxuICAgICAgICBpbml0UGF5bWVudHNIYW5kbGVycygpO1xyXG4gICAgICAgIGRldGFpbEhhbmRsZXJzKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCJjb250cmF0b3NcIjpcclxuICAgICAgICBpbml0Q29udHJhY3RIYW5kbGVycygpO1xyXG4gICAgICAgIGluaXRDbGllbnRIYW5kbGVycygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiY3VlbnRhXCI6XHJcbiAgICAgICAgYWNvdW50SGFuZGxlcnMoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcInNlY2Npb25lc1wiOlxyXG4gICAgICAgIHNlY3Rpb25IYW5kbGVycygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRDYWphSGFuZGxlcnMoKTtcclxuICAgIGluaXRHbG9iYWxIYW5kbGVycygpO1xyXG4gIH1cclxuXHJcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogICAgIGdsb2JhbHMgaGFuZGxlcnMgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICBmdW5jdGlvbiBpbml0R2xvYmFsSGFuZGxlcnMoKSB7XHJcbiAgICB2YXIgYXZlcmlhQ2xpZW50RG5pID0gJChcIiNhLWNsaWVudC1kbmlcIik7XHJcbiAgICBpZiAoY3VycmVudFBhZ2UgPT0gJ25vdGlmaWNhY2lvbmVzJykge1xyXG4gICAgICAgIEdlbmVyYWxzLmNvdW50X3RhYmxlKFwiYXZlcmlhc1wiKTtcclxuXHJcbiAgICAgICQoXCIjYXZlcmlhcy12aWV3LW1vZGVcIikub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBEYW1hZ2VzLmdldEFsbCgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICAkKFwiI2luc3RhbGxhdGlvbnMtdmlldy1tb2RlXCIpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgSW5zdGFsbGF0aW9ucy5nZXRBbGwoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkKCd0Ym9keScpLmNzcyh7ZGlzcGxheTpcInRhYmxlLXJvdy1ncm91cFwifSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGN1cnJlbnRQYWdlID09ICdjb250cmF0b3MnKSB7XHJcbiAgICAgaW5pdENvbnRyYWN0SGFuZGxlcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICAkKFwiI2J0bi1zYXZlLWF2ZXJpYVwiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICBEYW1hZ2VzLmFkZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYXZlcmlhQ2xpZW50RG5pLm9uKCdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGlmIChpc0NvbXBsZXRlKGF2ZXJpYUNsaWVudERuaSkpIHtcclxuICAgICAgICB2YXIgZG5pID0gZ2V0VmFsKGF2ZXJpYUNsaWVudERuaSk7XHJcbiAgICAgICAgQ2xpZW50cy5nZXRPbmUoZG5pLGZpbGxDbGllbnRGaWVsZHMpXHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICQoJyNhLWNsaWVudCcpLnZhbCgnJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIuYnRuLXVwZGF0ZS1hdmVyaWFcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgdmFyIGlkX2F2ZXJpYSA9ICQodGhpcykucGFyZW50cygnLmF2ZXJpYS1pdGVtJykuZmluZCgnLmNvZGUnKVxyXG4gICAgICBpZF9hdmVyaWEgPSBpZF9hdmVyaWEudGV4dCgpLnRyaW0oKTtcclxuICAgICAgRGFtYWdlcy51cGRhdGUoaWRfYXZlcmlhKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAkKFwiLmJ0bi11cGRhdGUtaW5zdGFsbGF0aW9uXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHZhciBpZF9wYWdvID0gJCh0aGlzKS5wYXJlbnRzKCcuYXZlcmlhLWl0ZW0nKS5maW5kKCcuY29kZScpO1xyXG4gICAgICBpZF9wYWdvID0gaWRfcGFnby50ZXh0KCkudHJpbSgpO1xyXG4gICAgICBJbnN0YWxsYXRpb25zLnVwZGF0ZShpZF9wYWdvKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjZXh0cmEtY29udHJvbHNcIikub24oJ2NsaWNrJyxmdW5jdGlvbihlKXtcclxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgQ29udHJhY3RzLmJ0bkV4dHJhUHJlc3NlZCgkKHRoaXMpKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjZXh0cmEtY2xpZW50LWRuaVwiKS5vbigna2V5ZG93bicsZnVuY3Rpb24oZSl7XHJcbiAgICAgIHZhciBrZXkgPSBlLndoaWNoO1xyXG4gICAgICB2YXIgZG5pID0gJCh0aGlzKS52YWwoKVxyXG4gICAgICBpZihrZXkgPT0gMTMpe1xyXG4gICAgICAgIENvbnRyYWN0cy5nZXRBbGxPZkNsaWVudChkbmkpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAgICAgYWRtaW4gaGFuZGxlcnMgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuICBmdW5jdGlvbiBpbml0QWRtaW5IYW5kbGVycygpIHtcclxuICAgIHVzZXJUYWJsZS5pbml0KCk7XHJcbiAgICAkKFwiI2J0bi1zYXZlLXVzZXJcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgVXNlcnMuYWRkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2J0bi11cGRhdGUtdXNlclwiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICBVc2Vycy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIuZGVsZXRlLXVzZXJcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB2YXIgJHJvdyA9ICQodGhpcykucGFyZW50cyhcInRyXCIpO1xyXG4gICAgICB2YXIgaWQgPSAkcm93LmZpbmQoJy51c2VyLWlkJykudGV4dCgpLnRyaW0oKTtcclxuICAgICAgdmFyIHJvdyA9IHVzZXJUYWJsZS5nZXRSb3coaWQpO1xyXG4gICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiAnRXN0w6EgU2VndXJvPycsXHJcbiAgICAgICAgICB0ZXh0OiBcIkRlc2VhIEVsaW1pbmFyIGFsIFVzdWFyaW8gXCIgKyByb3cubm9tYnJlcyArXCIgXCIrIHJvdy5hcGVsbGlkb3MgKyBcIj9cIixcclxuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcclxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ0VzdG95IFNlZ3VybyEnLFxyXG4gICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ0NhbmNlbGFyJ1xyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICBVc2Vycy5kZWxldGUoaWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIi5lZGl0LXVzZXJcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB2YXIgaWQgID0gJCh0aGlzKS5hdHRyKCdkYXRhLXVzZXItaWQnKTtcclxuICAgICAgdmFyIHJvdyA9IHVzZXJUYWJsZS5nZXRSb3coaWQpO1xyXG4gICAgICBcclxuXHJcbiAgICAgICQoXCIjZS1uaWNrbmFtZVwiKS52YWwocm93Lm5pY2spO1xyXG4gICAgICAkKFwiI2UtbmFtZVwiKS52YWwocm93Lm5vbWJyZXMpO1xyXG4gICAgICAkKFwiI2UtbGFzdG5hbWVcIikudmFsKHJvdy5hcGVsbGlkb3MpO1xyXG4gICAgICAkKFwiI2UtZG5pXCIpLnZhbChyb3cuY2VkdWxhKTtcclxuICAgICAgJChcIiNlLXR5cGVcIikudmFsKHJvdy50aXBvX2NvZGlnbyk7XHJcbiAgICAgICQoJyN1cGRhdGUtdXNlci1tb2RhbCcpLm1vZGFsKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI3VwZGF0ZS1jb21wYW55LWRhdGFcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICBDb21wYW55LnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNidG4tdXBkYXRlLXNldHRpbmdzXCIpLm9uKCdjbGljaycsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIFNldHRpbmdzLnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gc29tZSBnbG9iYWxzIGhhbmRsZXJzXHJcblxyXG4gICAgJChcIiNidG4tc2F2ZS1hdmVyaWFcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgRGFtYWdlcy5hZGQoKVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAgICAgSW5pdCBjYWphICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbiAgXHJcbiAgZnVuY3Rpb24gaW5pdENhamFIYW5kbGVycygpIHtcclxuICAgIGlmIChjdXJyZW50UGFnZSA9PSAnYWRtaW5pc3RyYWRvcicpIHtcclxuICAgICAgY2FqYVRhYmxlLmluaXQoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHZhciBidG5BZGRNb25leSAgICAgPSAkKFwiI2J0bi1hZGQtbW9uZXlcIik7XHJcbiAgICB2YXIgYnRuUmV0aXJlTW9uZXkgID0gJChcIiNidG4tcmV0aXJlLW1vbmV5XCIpO1xyXG4gICAgdmFyIHVzZXJTZWFyY2ggICAgICA9ICQoXCIjY2FqYS11c2VyXCIpO1xyXG4gICAgdmFyIGRhdGVTZWFyY2ggICAgICA9ICQoXCIjY2FqYS1kYXRlXCIpO1xyXG5cclxuICAgIGJ0bkFkZE1vbmV5Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIENhamEuYWRkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBidG5SZXRpcmVNb25leS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICBDYWphLnJldGlyZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGF0ZVNlYXJjaC5vbignY2hhbmdlJyxmdW5jdGlvbihlKXtcclxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgQ2FqYS5zZWFyY2goKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHVzZXJTZWFyY2gub24oJ2NoYW5nZScsZnVuY3Rpb24oZSl7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIENhamEuc2VhcmNoKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICBJbml0IGNsaWVudCBIYW5kbGVycyAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbiAgZnVuY3Rpb24gaW5pdENsaWVudEhhbmRsZXJzKCkge1xyXG4gICAgaWYgKGN1cnJlbnRQYWdlID09ICdjbGllbnRlcycpIHtcclxuICAgICAgY2xpZW50VGFibGUuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgICQoXCIjYnRuLXNhdmUtY2xpZW50XCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIENsaWVudHMuYWRkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI3VwZGF0ZS1jbGllbnRcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICB2YXIgaWQgPSBjbGllbnRUYWJsZS5nZXRJZCgpO1xyXG4gICAgICBpZiAoaWQpIHtcclxuICAgICAgICBDbGllbnRzLmdldE9uZShpZCwgQ2xpZW50cy5yZWNlaXZlRm9yRWRpdCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjY2xpZW50LXNlYXJjaGVyXCIpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHZhciB0ZXh0ID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgR2VuZXJhbHMuc2VhcmNoKHRleHQsIFwiY2xpZW50ZXNcIiwgY2xpZW50VGFibGUucmVmcmVzaCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2NsaWVudC1zZWFyY2hlci1uZXdjb250cmFjdFwiKS5vbigna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICB2YXIgdGV4dCA9ICQodGhpcykudmFsKCk7XHJcbiAgICAgIGlmICghaXNFbXB0eShbdGV4dF0pKSB7XHJcbiAgICAgICAgR2VuZXJhbHMuc2VhcmNoKHRleHQsIFwiY2xpZW50ZXNcIiwgY2xpZW50VGFibGUucmVmcmVzaCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2xlYXJUYm9keShcIi5sb2JieS1yZXN1bHRzXCIpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2RlbGV0ZS1jbGllbnRcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICB2YXIgcm93ID0gY2xpZW50VGFibGUuZ2V0U2VsZWN0ZWRSb3coKTtcclxuICAgICAgaWYgKHJvdykge1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6ICdFc3TDoSBTZWd1cm8/JyxcclxuICAgICAgICAgIHRleHQ6IFwiRGVzZWEgRWxpbWluYXIgYWwobGEpIENsaWVudGUgXCIgKyByb3cubm9tYnJlcyArIFwiIFwiICsgcm93LmFwZWxsaWRvcyArIFwiP1wiLFxyXG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxyXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnRXN0b3kgU2VndXJvIScsXHJcbiAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiAnQ2FuY2VsYXInXHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgIEdlbmVyYWxzLmRlbGV0ZVJvdyhyb3cuaWQsIFwiY2xpZW50ZXNcIilcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuICAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAgSW5pdCBTZXJ2aWNlcyBIYW5kbGVycyAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4gIGZ1bmN0aW9uIGluaXRTZXJ2aWNlc0hhbmRsZXJzKCkge1xyXG4gICAgc2VydmljZVRhYmxlLmluaXQoKTtcclxuXHJcbiAgICAkKFwiI2J0bi1zYXZlLXNlcnZpY2VcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgU2VydmljZXMuYWRkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2RlbGV0ZS1zZXJ2aWNlXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgdmFyIGlkID0gc2VydmljZVRhYmxlLmdldElkKCk7XHJcbiAgICAgIGlmIChpZCkge1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6ICdFc3TDoSBTZWd1cm8/JyxcclxuICAgICAgICAgIHRleHQ6IFwiRGVzZWEgRWxpbWluYXIgIGVsIFNlcnZpY2lvP1wiLFxyXG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxyXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnRXN0b3kgU2VndXJvIScsXHJcbiAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiAnQ2FuY2VsYXInXHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgIEdlbmVyYWxzLmRlbGV0ZVJvdyhpZCwgXCJzZXJ2aWNpb3NcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjZWRpdC1zZXJ2aWNlXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdmFyIHJvdyA9IHNlcnZpY2VUYWJsZS5nZXRTZWxlY3RlZFJvdygpO1xyXG5cclxuICAgICAgJCgnI3Utc2VydmljZS1pZCcpLnZhbChyb3cuaWQpO1xyXG4gICAgICAkKCcjdS1zZXJ2aWNlLW5hbWUnKS52YWwocm93Lm5vbWJyZSk7XHJcbiAgICAgICQoJyN1LXNlcnZpY2UtZGVzY3JpcHRpb24nKS52YWwocm93LmRlc2NyaXBjaW9uKTtcclxuICAgICAgJCgnI3Utc2VydmljZS1tb250aGx5LXBheW1lbnQnKS52YWwoTnVtYmVyKHJvdy5tZW5zdWFsaWRhZC5yZXBsYWNlKFwiUkQkIFwiLCcnKSkpO1xyXG4gICAgICAkKCcjdS1zZXJ2aWNlLXR5cGUnKS52YWwocm93LnRpcG8pO1xyXG4gICAgICAkKCcjdXBkYXRlLXNlcnZpY2UtbW9kYWwnKS5tb2RhbCgpO1xyXG5cclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjYnRuLXVwZGF0ZS1zZXJ2aWNlXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIFNlcnZpY2VzLnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNzZXJ2aWNlLXNlYXJjaGVyXCIpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHZhciB0ZXh0ID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgR2VuZXJhbHMuc2VhcmNoKHRleHQsIFwic2VydmljaW9zXCIsIHNlcnZpY2VUYWJsZS5yZWZyZXNoLGluaXRTZXJ2aWNlc0hhbmRsZXJzKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG4gIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICBJbml0IENvbnRyYWN0IEhhbmRsZXJzICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbiAgZnVuY3Rpb24gaW5pdENvbnRyYWN0SGFuZGxlcnMoKSB7XHJcbiAgICBjb250cmFjdFRhYmxlLmluaXQoKTtcclxuICAgIENvbnRyYWN0cy5nZXRBbGwoKTtcclxuICAgIFxyXG4gICAgJChcIiNidG4tc2F2ZS1jb250cmFjdFwiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICBDb250cmFjdHMuYWRkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2J0bi1hZGQtZXh0cmFcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICBDb250cmFjdHMuY2FsbEV4dHJhKCk7XHJcbiAgICB9KTtcclxuICAgIHZhciBjb250ID0gMDtcclxuXHJcbiAgICAkKFwiI2NvbnRyYWN0LXNlYXJjaGVyXCIpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHZhciB0ZXh0ID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgR2VuZXJhbHMuc2VhcmNoKHRleHQsIFwidl9jb250cmF0b3NcIiwgY29udHJhY3RUYWJsZS5yZWZyZXNoLG51bGwpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNidG4tY2FuY2VsLWNvbnRyYWN0XCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdmFyIHJvdyA9IGNvbnRyYWN0VGFibGUuZ2V0U2VsZWN0ZWRSb3coKTtcclxuICAgICAgaWYgKHJvdykge1xyXG4gICAgICAgICQoXCIuY2FuY2VsLW5hbWVcIikudGV4dChyb3cuY2xpZW50ZSk7XHJcbiAgICAgICAgdmFyICRpbnB1dEVsZW1lbnQgICA9ICQoXCIuY29uZmlybWVkLWRhdGFcIik7XHJcbiAgICAgICAgdmFyICRidXR0b25Ub0FjdGl2ZSA9ICQoXCIjY2FuY2VsLXBlcm1hbmVudGx5XCIpO1xyXG5cclxuICAgICAgICBkZWxldGVWYWxpZGF0aW9uKCRpbnB1dEVsZW1lbnQscm93LmNsaWVudGUsICRidXR0b25Ub0FjdGl2ZSk7XHJcbiAgICAgICAgJChcIiNjYW5jZWwtcHJpbnRcIikuYXR0cihcImhyZWZcIixCQVNFX1VSTCArICdwcm9jZXNzL2dldGNhbmNlbGNvbnRyYWN0LycrIHJvdy5pZF9jbGllbnRlICsgXCIvXCIgKyByb3cuaWQpO1xyXG5cclxuICAgICAgICAkKFwiI2NhbmNlbC1jb250cmFjdC1tb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICRidXR0b25Ub0FjdGl2ZS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIENvbnRyYWN0cy5jYW5jZWwoKVxyXG4gICAgICAgICAgJGJ1dHRvblRvQWN0aXZlLmF0dHIoJ2Rpc2FibGUnKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAkaW5wdXRFbGVtZW50LnZhbCgnJyk7XHJcbiAgICAgICAgJGJ1dHRvblRvQWN0aXZlLmF0dHIoJ2Rpc2FibGVkJywgJycpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBzd2FsKFwiRGViZXMgc2VsZWNjaW9uYXIgdW4gY29udHJhdG9cIilcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNidG4tc3VzcGVuZC1jb250cmFjdFwiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICB2YXIgcm93ID0gY29udHJhY3RUYWJsZS5nZXRTZWxlY3RlZFJvdygpO1xyXG4gICAgICAgaWYgKHJvdykge1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6ICdFc3TDoSBTZWd1cm8/JyxcclxuICAgICAgICAgIHRleHQ6IFwiRGVzZWEgU3VzcGVuZGVyIGVsIGNvbnRyYXRvIGRlIFwiICsgcm93LmNsaWVudGUgK1wiID9cIixcclxuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcclxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ0VzdG95IFNlZ3VybyEnLFxyXG4gICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ0NhbmNlbGFyJ1xyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICBDb250cmFjdHMuc3VzcGVuZChyb3cuaWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgfWVsc2V7XHJcbiAgICAgICAgIHN3YWwoXCJEZWJlIHNlbGVjY2lvbmFyIHVuIGNvbnRyYXRvXCIpXHJcbiAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNidG4tdXBkYXRlLWNvbnRyYWN0XCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgdmFyIGlkID0gY29udHJhY3RUYWJsZS5nZXRJZCgpO1xyXG4gICAgICBpZiAoaWQpIHtcclxuICAgICAgICBDb250cmFjdHMuZ2V0T25lKGlkLCBDb250cmFjdHMucmVjaWV2ZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjc2VsZWN0LWNvbnRyYWN0LXNlY3RvclwiKS5vbignY2hhbmdlJyxmdW5jdGlvbihlKXtcclxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgQ29udHJhY3RzLmdldElwTGlzdCgpO1xyXG4gICAgfSlcclxuXHJcbiAgICAkKCcjc2VsZWN0LXBheS11bnRpbCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKXtcclxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgdmFyICR0aGlzICAgICAgICAgPSAkKCcjc2VsZWN0LXBheS11bnRpbCA6c2VsZWN0ZWQnKTtcclxuICAgICAgdmFyIGNvbnRyYWN0SWQgICAgPSAkdGhpcy5hdHRyKCdkYXRhLWNvbnRyYWN0Jyk7XHJcbiAgICAgIHZhciBsYXN0UGF5bWVudElkID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgUGF5bWVudHMudXBkYXRlVW50aWwoY29udHJhY3RJZCxsYXN0UGF5bWVudElkKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcbiAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogIEluaXQgUGF5bWVudHMgIEhhbmRsZXJzICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuICBcclxuICBmdW5jdGlvbiBpbml0UGF5bWVudHNIYW5kbGVycygpIHtcclxuICAgIHBheW1lbnRUYWJsZS5pbml0KCk7XHJcbiAgICBleHRyYVRhYmxlLmluaXQoKTtcclxuICAgIGlmICghcmFuKSB7XHJcbiAgICAgIFBheW1lbnRzLmdldEFsbCgpO1xyXG4gICAgICByYW4gPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgICQoXCIjYnRuLXBheVwiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICB2YXIgaWQgPSBwYXltZW50VGFibGUuZ2V0SWQoKTtcclxuICAgICAgaWYoaWQpIHtcclxuICAgICAgICBQYXltZW50cy51cGRhdGUoaWQpO1xyXG4gICAgICAgIHVwZGF0ZV9tb2RlKGlkKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgLy8gVE9ETzogTUVTU0FHRSBTZWxlY3QgYSBwYXltZW50XHJcbiAgICAgIH1cclxuICAgIH0pOyBcclxuXHJcbiAgICAkKFwiI3NlbGVjdC1jb250cmFjdFwiKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgUGF5bWVudHMuZ2V0QWxsKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2J0bi1yZWNvbm5lY3RcIikub24oJ2NsaWNrJyxmdW5jdGlvbihlKSB7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKClcclxuICAgICAgQ29udHJhY3RzLnJlY29ubmVjdCgpXHJcbiAgICB9KVxyXG5cclxuICAgICQoXCIjcGF5bWVudC1kZXRhaWwtYm94XCIpLmNvbGxhcHNlKClcclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVfbW9kZShpZCl7XHJcbiAgICAgIHZhciBtb2RlID0gJCgnLnBheW1lbnQtbW9kZS5zZWxlY3RlZCcpLnRleHQoKTtcclxuICAgICAgdmFyIGV4dHJhSW5mbyA9IHtpZDogaWQudG9TdHJpbmcoKSxtb2R1bGU6J3BhZ29zJ31cclxuICAgICAgdmFyIGZvcm0gPSAnZGF0YT0nK0pTT04uc3RyaW5naWZ5KHt0aXBvOiBtb2RlfSkrJyZleHRyYV9pbmZvPScrSlNPTi5zdHJpbmdpZnkoZXh0cmFJbmZvKTtcclxuXHJcbiAgICAgIHZhciBzZW5kID0gYXhpb3MucG9zdCggQkFTRV9VUkwgKyAncHJvY2Vzcy9heGlvc3VwZGF0ZScsZm9ybSlcclxuICAgICAgc2VuZC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAvL1RPRE86IHNvbWV0aGluZyB3aGl0aCB0aGF0IC8gYWxnbyBjb24gZXN0b1xyXG4gICAgICB9KTtcclxuICAgICAgc2VuZC5jYXRjaChmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICAgICAgZGV0YWlsIEhhbmRsZXJzICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbiAgZnVuY3Rpb24gZGV0YWlsSGFuZGxlcnMoKSB7XHJcbiAgICAkKFwiI2J0bi1zYXZlLW9ic2VydmF0aW9uc1wiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICBQYXltZW50cy5zYXZlQWJvbm9zKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcjYnRuLXNhdmUtcmVhbC1vYnNlcnZhdGlvbnMnKS5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xyXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICBDbGllbnRzLnNhdmVPYnNlcnZhdGlvbnMoKTtcclxuICAgIH0pXHJcblxyXG4gICAgZGV0YWlsc0NvbnRyYWN0VGFibGUuaW5pdCgpO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFjb3VudEhhbmRsZXJzKCl7XHJcbiAgICB2YXIgJHVzZXJJZCAgICAgICAgICA9ICQoXCIjYWNvdW50LXVzZXItaWRcIilcclxuICAgIHZhciAkY3VycmVudFBhc3N3b3JkID0gJChcIiNhY291bnQtY3VycmVudC1wYXNzd29yZFwiKVxyXG4gICAgdmFyICRidG5VcGRhdGVVc2VyICAgID0gJChcIiN1cGRhdGUtdXNlci1kYXRhXCIpO1xyXG4gICAgdmFyICRuZXdQYXNzd29yZCAgICAgID0gJChcIiNhY291bnQtbmV3LXBhc3N3b3JkXCIpO1xyXG5cclxuICAgICQoXCIjYWNvdW50LWN1cnJlbnQtcGFzc3dvcmRcIikub24oJ2tleXVwJyxmdW5jdGlvbihlKXtcclxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTsgICAgXHJcbiAgICAgIFVzZXJzLmNvbmZpcm1QYXNzd29yZCgkdXNlcklkLnZhbCgpLCRjdXJyZW50UGFzc3dvcmQudmFsKCkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJGJ0blVwZGF0ZVVzZXIub24oJ2NsaWNrJyxmdW5jdGlvbihlKXtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIFVzZXJzLnVwZGF0ZVBhc3N3b3JkKCR1c2VySWQudmFsKCksJGN1cnJlbnRQYXNzd29yZC52YWwoKSwkbmV3UGFzc3dvcmQudmFsKCkpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2VjdGlvbkhhbmRsZXJzKCkge1xyXG4gICAgaWYgKCFyYW4pIHtcclxuICAgICAgU2VjdGlvbnMuaW5pdCgpXHJcbiAgICAgIFNlY3Rpb25zLmdldElwcygpO1xyXG4gICAgICByYW4gPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgICQoXCIjYnRuLWFkZC1zZWN0aW9uXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIFNlY3Rpb25zLmFkZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgICQoXCIjc2VsZWN0LXNlY3RvclwiKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgU2VjdGlvbnMuZ2V0SXBzKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICQoZnVuY3Rpb24gKCkge1xyXG4gICAgaW5pdENvbXBvbmVudHMoKVxyXG4gIH0pOyIsInZhciByYW4gPSBmYWxzZTtcclxuXHJcbmZ1bmN0aW9uIGxvZ2luSGFuZGxlcnMoKSB7XHJcblxyXG4gICQoXCIjc2VuZC1jcmVkZW50aWFsc1wiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgIFNlc3Npb24ubG9naW4oKTtcclxuICB9KTtcclxuXHJcbiAgJChcIiN1c2VyLWlucHV0XCIpLm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICBsb2dpbkxpYnJhcnkuc2VuZFRvTG9naW4oZSlcclxuICB9KVxyXG5cclxuICAkKFwiI3Bhc3N3b3JkLWlucHV0XCIpLm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICBsb2dpbkxpYnJhcnkuc2VuZFRvTG9naW4oZSlcclxuICB9KVxyXG5cclxuICAkKFwiYVtocmVmXVwiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBsb2dpbkxpYnJhcnkubG9hZGluZygpO1xyXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHZhciB0YXJnZXQgPSAkdGhpcy5hdHRyKCd0YXJnZXQnKTtcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChcIi5sb2FkZXJcIikuY3NzKHtcclxuICAgICAgICAgIGRpc3BsYXk6IFwibm9uZVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sIDMwMDApXHJcbiAgICB9Y2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHRocm93IGVycm9yXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxudmFyIFNlc3Npb24gPSB7XHJcbiAgbG9naW46IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHVzZXIgICAgID0gJChcIiN1c2VyLWlucHV0XCIpLnZhbCgpO1xyXG4gICAgdmFyIHBhc3N3b3JkID0gJChcIiNwYXNzd29yZC1pbnB1dFwiKS52YWwoKTtcclxuICAgIHZhciBpc19lbXB0eSA9IGlzRW1wdHkoW3VzZXIsIHBhc3N3b3JkXSlcclxuICAgIGlmICghaXNfZW1wdHkpIHtcclxuICAgICAgdmFyIGZvcm0gPSAndXNlcj0nICsgdXNlciArICcmcGFzc3dvcmQ9JyArIHBhc3N3b3JkO1xyXG4gICAgICBjb25uZWN0QW5kU2VuZCgnYXBwL2xvZ2luJywgZmFsc2UsIGZhbHNlLCBTZXNzaW9uLnByb2Nlc3NMb2dpbkRhdGEsIGZvcm0sIG51bGwsIGxvZ2luTGlicmFyeS5sb2FkaW5nKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGlzcGxheU1lc3NhZ2UoTUVTU0FHRV9FUlJPUiArIFwiIExMZW5lIHRvZG9zIGxvcyBjYW1wb3MgaW5kaWNhZG9zIHBhcmEgaW5ncmVzYXJcIilcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBwcm9jZXNzTG9naW5EYXRhOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgaWYgKHJlc3BvbnNlID09IHRydWUpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBCQVNFX1VSTCArICdhcHAvYWRtaW4vJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoXCIubG9hZGVyXCIpLmNzcyh7XHJcbiAgICAgICAgZGlzcGxheTogXCJub25lXCJcclxuICAgICAgfSk7XHJcbiAgICAgIGRpc3BsYXlNZXNzYWdlKE1FU1NBR0VfSU5GTyArIFwiIFVzdWFyaW8geSBDb250cmFzZcOxYSBubyB2YWxpZG9zXCIpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG52YXIgbG9naW5MaWJyYXJ5ID0ge1xyXG4gIGxvYWRpbmc6IGZ1bmN0aW9uKHN0b3ApIHtcclxuICAgIGlmKCFzdG9wKXtcclxuICAgICAgICQoXCIubG9hZGVyXCIpLmNzcyh7XHJcbiAgICAgICAgZGlzcGxheTogXCJibG9ja1wiXHJcbiAgICAgICAgfSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgJChcIi5sb2FkZXJcIikuY3NzKHtkaXNwbGF5OiBcIm5vbmVcIn0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgXHJcbiAgc2VuZFRvTG9naW46IGZ1bmN0aW9uKGUpIHtcclxuICAgIGtleSA9IGUud2hpY2hcclxuICAgIGlmIChrZXkgPT0gMTMpIHtcclxuICAgICAgU2Vzc2lvbi5sb2dpbigpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgbG9naW5IYW5kbGVycygpO1xyXG59KSIsIiAgZnVuY3Rpb24gaXNDdXJyZW50UGFnZShwYWdlTmFtZSl7XHJcbiAgICBpZihnZXRDdXJyZW50UGFnZSgpID09IHBhZ2VOYW1lKXtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0gIFxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0Q3VycmVudFBhZ2UoKXtcclxuICAgIHZhciBjdXJyZW50UGFnZSA9ICQoXCJ0aXRsZVwiKS50ZXh0KCkuc3BsaXQoXCIgXCIpO1xyXG4gICAgY3VycmVudFBhZ2UgPSBjdXJyZW50UGFnZVs0XS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcclxuICAgIHJldHVybiBjdXJyZW50UGFnZTtcclxuICB9XHJcblxyXG4gIGlmKGlzQ3VycmVudFBhZ2UoXCJjaWVycmVcIikgfHwgaXNDdXJyZW50UGFnZShcImNpZXJyZTJcIikpe1xyXG4gICAgY2llcnJlQ2FqYUZ1bmN0aW9ucygpO1xyXG4gIH1cclxuXHJcbiAgaWYoaXNDdXJyZW50UGFnZShcInJlcG9ydGVzXCIpKXtcclxuICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gICAgc2NyaXB0LnNyYyA9IEJBU0VfVVJMICsgXCJhc3NldHMvanMvbWluL3JlcG9ydGVzLm1pbi5qcz92ZXJzaW9uPTQuMC4yMlwiO1xyXG4gICAgJChcImJvZHlcIikuYXBwZW5kKHNjcmlwdCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjaWVycmVDYWphRnVuY3Rpb25zKCl7XHJcbiAgICB2YXIgdG90YWxlcyA9IHtcclxuICAgICAgICAgIHRvdGFsMTogMCxcclxuICAgICAgICAgIHRvdGFsNTogMCxcclxuICAgICAgICAgIHRvdGFsMTA6IDAsXHJcbiAgICAgICAgICB0b3RhbDIwOiAwLFxyXG4gICAgICAgICAgdG90YWwyNTogMCxcclxuICAgICAgICAgIHRvdGFsNTA6IDAsXHJcbiAgICAgICAgICB0b3RhbDEwMDogMCxcclxuICAgICAgICAgIHRvdGFsMjAwOiAwLFxyXG4gICAgICAgICAgdG90YWw1MDA6IDAsXHJcbiAgICAgICAgICB0b3RhbDEwMDA6IDAsXHJcbiAgICAgICAgICB0b3RhbDIwMDA6IDBcclxuICAgICAgICB9XHJcblxyXG4gICAgdmFyIGdhc3RvICAgPSB7XHJcbiAgICAgICAgJ2ZlY2hhJzogJycsXHJcbiAgICAgICAgJ2Rlc2NyaXBjaW9uJzogJycsXHJcbiAgICAgICAgJ21vbnRvJzogJycsXHJcbiAgICAgIH1cclxuICAgIHZhciBnYXN0b3MgID0gW3tmZWNoYTogbm93KCksZGVzY3JpcGNpb246XCJob2xhXCIsbW9udG86IDIwMDAsIGlkX2dhc3RvOiAxfV1cclxuICAgIHZhciBhdXRvciAgID0gJCgnI2F1dG9yLWNpZXJyZScpLnRleHQoKS50cmltKClcclxuXHJcbiAgICB2YXIgYXBwQ2llcnJlID0gbmV3IFZ1ZSh7XHJcbiAgICAgIGVsOiAnI2FwcC1jaWVycmUnLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgaXNIaWRlOiBmYWxzZSxcclxuICAgICAgICBmZWNoYTogbm93KCksXHJcbiAgICAgICAgZGF0YV9jaWVycmU6e1xyXG4gICAgICAgICAgYXV0b3I6IGF1dG9yLFxyXG4gICAgICAgICAgcGFnb3NfZmFjdHVyYXM6IDAsXHJcbiAgICAgICAgICBwYWdvc19leHRyYXM6IDAsXHJcbiAgICAgICAgICBwYWdvc19lZmVjdGl2bzogMCxcclxuICAgICAgICAgIHBhZ29zX2JhbmNvOiAwLFxyXG4gICAgICAgICAgdG90YWxfaW5ncmVzb3M6IDAsXHJcbiAgICAgICAgICBlZmVjdGl2b19jYWphOiAwLFxyXG4gICAgICAgICAgdG90YWxfZGVzY3VhZHJlOiAwLFxyXG4gICAgICAgICAgdG90YWxfZ2FzdG9zOiAwLFxyXG4gICAgICAgICAgYmFuY286IDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbnRlbzp0b3RhbGVzLFxyXG4gICAgICAgIHN1bWE6IDAsXHJcbiAgICAgICAgZ2FzdG86IGdhc3RvLFxyXG4gICAgICAgIGdhc3RvczogZ2FzdG9zXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3VudGVkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmdldEdhc3RvcygpO1xyXG4gICAgICAgIHRoaXMuc2V0SW5ncmVzb3MoKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNyZWF0ZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJCgnLndpbGwtbG9hZCcpLmNzcyh7dmlzaWJpbGl0eTpcInZpc2libGVcIn0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmaWx0ZXJzOiB7XHJcbiAgICAgICAgY3VycmVuY3lGb3JtYXQ6IGZ1bmN0aW9uKG51bWJlcil7XHJcbiAgICAgICAgICByZXR1cm4gQ3VycmVuY3lGb3JtYXQobnVtYmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtZXRob2RzOntcclxuICAgICAgICBjaGFuZ2VUb3RhbDogZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICB2YXIgdW5pdCA9IGUuc3JjRWxlbWVudC5hdHRyaWJ1dGVzWydkYXRhLXVuaXQnXS52YWx1ZVxyXG4gICAgICAgICAgdmFyIGNhbnRpZGFkID0gZS5zcmNFbGVtZW50LnZhbHVlXHJcbiAgICAgICAgICB2YXIgdG90YWwgPSBjYW50aWRhZCAqIHVuaXRcclxuICAgICAgICAgIHRvdGFsZXNbJ3RvdGFsJysgdW5pdF0gPSBjYW50aWRhZCAqIHVuaXQgKiAxLjAwICAgIFxyXG4gICAgICAgIH0sIFxyXG5cclxuICAgICAgICBhZGRHYXN0bzogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgdmFyIGdhc3RvID0gdGhpcy5nYXN0bztcclxuICAgICAgICAgIGdhc3RvLmZlY2hhID0gbm93KCk7XHJcbiAgICAgICAgICBmb3JtID0gJ2RhdGE9JysgSlNPTi5zdHJpbmdpZnkoZ2FzdG8pO1xyXG4gICAgICAgICAgdmFyIHNlbmQgPSBheGlvcy5wb3N0KCBCQVNFX1VSTCArICdjYWphL2FkZF9nYXN0bycsZm9ybSlcclxuICAgICAgICAgIHNlbmQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgICAgICBkaXNwbGF5TWVzc2FnZShkYXRhLm1lbnNhamUpXHJcbiAgICAgICAgICAgIGFwcENpZXJyZS5maWxsR2FzdG9zKGRhdGEuZ2FzdG9zLFwibm9ybWFsXCIpXHJcbiAgICAgICAgICAgIGFwcENpZXJyZS5zZXRHYXN0b1RvdGFsKGRhdGEudG90YWxfZ2FzdG9zKVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBzZW5kLmNhdGNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGZpbGxHYXN0b3M6IGZ1bmN0aW9uKGdhc3Rvc19zZXJ2aWRvcixtb2RlKXtcclxuICAgICAgICAgIGlmKG1vZGUgPT0gXCJncm91cFwiKXtcclxuICAgICAgICAgICAgaWYoZ2FzdG9zX3NlcnZpZG9yICE9IG51bGwgfHwgZ2FzdG9zX3NlcnZpZG9yLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFtnYXN0b3Nfc2Vydmlkb3JdKTtcclxuICAgICAgICAgICAgICBhcHBDaWVycmUuZ2FzdG9zID0gZ2FzdG9zX3NlcnZpZG9yO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICBhcHBDaWVycmUuZ2FzdG9zID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBhcHBDaWVycmUuZ2FzdG9zLnB1c2goSlNPTi5wYXJzZShnYXN0b3Nfc2Vydmlkb3IpWzBdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXRHYXN0b1RvdGFsOiBmdW5jdGlvbih0b3RhbEdhc3Rvcyl7XHJcbiAgICAgICAgICB0aGlzLmRhdGFfY2llcnJlLnRvdGFsX2dhc3RvcyA9IHRvdGFsR2FzdG9zXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0R2FzdG86IGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgdmFyIGdhc3RvID0gdGhpcy5nYXN0bztcclxuICAgICAgICAgIGZvcm0gPSAnZGF0YT0nKyBKU09OLnN0cmluZ2lmeShnYXN0byk7XHJcbiAgICAgICAgICBjb25uZWN0QW5kU2VuZCgnY2FqYS9nZXRfZ2FzdG8nLGZhbHNlLG51bGwsYXBwQ2llcnJlLmZpbGxHYXN0b3MsZm9ybSxudWxsLCBudWxsKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkZWxldGVHYXN0bzogZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgIHZhciBjYWxsZXIgPSBlLnRhcmdldDtcclxuICAgICAgICAgIGlmKGNhbGxlci5sb2NhbG5hbWUgPT0gXCJpXCIpe1xyXG4gICAgICAgICAgICBjYWxsZXIgPSBjYWxsZXIucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHZhciBpZCA9IGNhbGxlci5hdHRyaWJ1dGVzWydkYXRhLWlkJ10udmFsdWVcclxuICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ0VzdMOhIFNlZ3Vybz8nLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlNlZ3VybyBkZSBxdWUgcXVpZXJlIGVsaW1pbmFyIGVzdGUgZ2FzdG8/XCIsXHJcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdFc3RveSBTZWd1cm8hJyxcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ0NhbmNlbGFyJ1xyXG4gICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBmb3JtID0gJ2RhdGE9JysgSlNPTi5zdHJpbmdpZnkoe2lkOiBpZCwgZmVjaGE6bm93KCl9KVxyXG4gICAgICAgICAgICB2YXIgc2VuZCA9IGF4aW9zLnBvc3QoQkFTRV9VUkwgKyAnY2FqYS9kZWxldGVfZ2FzdG8nLGZvcm0pXHJcbiAgICAgICAgICAgIHNlbmQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgdmFyIGRhdGEgPSByZXNwb25zZS5kYXRhXHJcbiAgICAgICAgICAgICAgZGlzcGxheU1lc3NhZ2UoZGF0YS5tZW5zYWplKVxyXG4gICAgICAgICAgICAgIGFwcENpZXJyZS5maWxsR2FzdG9zKGRhdGEuZ2FzdG9zLFwiZ3JvdXBcIilcclxuICAgICAgICAgICAgICBhcHBDaWVycmUuc2V0R2FzdG9Ub3RhbChkYXRhLnRvdGFsX2dhc3RvcykgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzZW5kLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7ICAgICAgXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0R2FzdG9zOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgdmFyIGRhdGEgPSB7ZmVjaGE6IG5vdygpfVxyXG4gICAgICAgICAgZm9ybSA9ICdkYXRhPScrIEpTT04uc3RyaW5naWZ5KGRhdGEpXHJcbiAgICAgICAgICB2YXIgc2VuZCA9IGF4aW9zLnBvc3QoIEJBU0VfVVJMICsgJ2NhamEvZ2V0X2dhc3RvcycsZm9ybSlcclxuICAgICAgICAgIHNlbmQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgICAgICBkaXNwbGF5TWVzc2FnZShkYXRhLm1lbnNhamUpXHJcbiAgICAgICAgICAgIGFwcENpZXJyZS5maWxsR2FzdG9zKGRhdGEuZ2FzdG9zLFwiZ3JvdXBcIilcclxuICAgICAgICAgICAgYXBwQ2llcnJlLnNldEdhc3RvVG90YWwoZGF0YS50b3RhbF9nYXN0b3MpXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHNlbmQuY2F0Y2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXRJbmdyZXNvczogZnVuY3Rpb24oKXtcclxuICAgICAgICAgIHZhciBmb3JtID0gJ2RhdGE9JyArIEpTT04uc3RyaW5naWZ5KHtmZWNoYTogbm93KCl9KVxyXG4gICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLmRhdGFfY2llcnJlO1xyXG4gICAgICAgICAgdmFyIHNlbmQgPSBheGlvcy5wb3N0KCBCQVNFX1VSTCArICdjYWphL2dldF9pbmdyZXNvcycsZm9ybSlcclxuICAgICAgICAgIHNlbmQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgICAgICBzZWxmLnBhZ29zX2ZhY3R1cmFzID0gZGF0YS5wYWdvc19mYWN0dXJhcztcclxuICAgICAgICAgICAgc2VsZi5wYWdvc19leHRyYXMgPSBkYXRhLnBhZ29zX2V4dHJhcztcclxuICAgICAgICAgICAgc2VsZi5wYWdvc19lZmVjdGl2byA9IGRhdGEucGFnb3NfZWZlY3Rpdm87XHJcbiAgICAgICAgICAgIHNlbGYucGFnb3NfYmFuY28gPSBkYXRhLnBhZ29zX2JhbmNvO1xyXG4gICAgICAgICAgICBzZWxmLnRvdGFsX2luZ3Jlc29zID0gcGFyc2VGbG9hdChkYXRhLnBhZ29zX2ZhY3R1cmFzKSArIHBhcnNlRmxvYXQoc2VsZi5wYWdvc19leHRyYXMpO1xyXG4gICAgICAgICAgICBzZWxmLnRvdGFsX2Rlc2N1YWRyZSA9IC0gc2VsZi5wYWdvc19lZmVjdGl2byArIHNlbGYuZWZlY3Rpdm9fY2FqYTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgc2VuZC5jYXRjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNlcnJhckNhamE6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICB2YXIgc2VsZiAgID0gdGhpcztcclxuICAgICAgICAgIHZhciBjaWVycmUgPSB0aGlzLmRhdGFfY2llcnJlO1xyXG4gICAgICAgICAgd2luZG93LmNpZXJyZSA9IGNpZXJyZTtcclxuICAgICAgICAgIGlmKGNpZXJyZS50b3RhbF9kZXNjdWFkcmUgIT0gMCl7XHJcbiAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiAnRXN0w6EgU2VndXJvPycsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJIYXkgdW4gZGVzY3VhZHJlIGVuIGxhIGNhamEsIHF1aWVyZSBoYWNlciBlbCBjaWVycmUgZGUgdG9kb3MgbW9kb3M/XCIsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxyXG4gICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdTaScsXHJcbiAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ05vJ1xyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgc2VsZi5jZXJyYXIoY2llcnJlKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHNlbGYuY2VycmFyKGNpZXJyZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgY2VycmFyOiBmdW5jdGlvbihjaWVycmUpe1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBjaWVycmUuZmVjaGEgPSBub3coKTtcclxuICAgICAgICAgIGZvcm0gPSAnZGF0YT0nKyBKU09OLnN0cmluZ2lmeShjaWVycmUpO1xyXG4gICAgICAgICAgdmFyIHNlbmQgPSBheGlvcy5wb3N0KCBCQVNFX1VSTCArICdjYWphL2FkZF9jaWVycmUnLGZvcm0pXHJcbiAgICAgICAgICBzZW5kLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHJlc3BvbnNlLmRhdGFcclxuICAgICAgICAgICAgZGlzcGxheU1lc3NhZ2UoZGF0YS5tZW5zYWplKVxyXG4gICAgICAgICAgICBzZWxmLmlzSGlkZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGFwcFN1bW1hcnlWaWV3LmlzSGlkZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBhcHBTdW1tYXJ5Vmlldy5jaWVycmUgPSBjaWVycmU7XHJcbiAgICAgICAgICAgICQoXCIjYXBwLWNpZXJyZVwiKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAkKFwiLnRvcC1uYXZcIikuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgJChcIiNwcmludC12aWV3XCIpLmNzcyh7dmlzaWJpbGl0eTogXCJ2aXNpYmxlXCJ9KVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgc2VuZC5jYXRjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjb21wdXRlZDp7XHJcbiAgICAgICAgZ2V0VG90YWw6IGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgdmFyIHQgPSB0b3RhbGVzO1xyXG4gICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLmRhdGFfY2llcnJlO1xyXG4gICAgICAgICAgdmFyIHN1bWEgPSBzdW1hcihbdC50b3RhbDEsdC50b3RhbDUsdC50b3RhbDEwLCB0LnRvdGFsMjAsIHQudG90YWwyNSwgdC50b3RhbDUwLCB0LnRvdGFsMTAwLCB0LnRvdGFsMjAwLCB0LnRvdGFsNTAwLCB0LnRvdGFsMTAwMCwgdC50b3RhbDIwMDBdKTtcclxuICAgICAgICAgIHRoaXMuc3VtYSA9IHN1bWE7XHJcbiAgICAgICAgICBzZWxmLmVmZWN0aXZvX2NhamEgPSBzdW1hLnRvRml4ZWQoMik7XHJcbiAgICAgICAgICBzZWxmLnRvdGFsX2Rlc2N1YWRyZSA9IHBhcnNlRmxvYXQoLXNlbGYucGFnb3NfZWZlY3Rpdm8pICsgcGFyc2VGbG9hdChzZWxmLmVmZWN0aXZvX2NhamEpO1xyXG4gICAgICAgICAgc2VsZi5iYW5jbyA9IHBhcnNlRmxvYXQoc2VsZi5wYWdvc19iYW5jbykgKyBwYXJzZUZsb2F0KHNlbGYucGFnb3NfZWZlY3Rpdm8pIC0gcGFyc2VGbG9hdChzZWxmLnRvdGFsX2dhc3RvcykgKyBwYXJzZUZsb2F0KHNlbGYudG90YWxfZGVzY3VhZHJlKVxyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc3VtYTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkZWNpbWFsczogZnVuY3Rpb24oKXtcclxuICAgICAgICAgIHZhciBmaWVsZHMgPSBbXCJwYWdvc19mYWN0dXJhc1wiLFwicGFnb3NfZXh0cmFcIixcInBhZ29zX2VmZWN0aXZvXCIsXCJwYWdvc19iYW5jb1wiLFwidG90YWxfaW5ncmVzb3NcIixcImVmZWN0aXZvX2NhamFcIixcInRvdGFsX2Rlc2N1YWRyZVwiLFwidG90YWxfZ2FzdG9cIixcImJhbmNvXCJdO1xyXG4gICAgICAgICAgZmllbGRzLmZvckVhY2goZnVuY3Rpb24oZmllbGQpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhX2NpZXJyZVtmaWVsZF0gPSB0aGlzLmRhdGFfY2llcnJlW2ZpZWxkXS50b0ZpeGVkKDIpXHJcbiAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgd2luZG93LmFwcENpZXJyZSA9IGFwcENpZXJyZTtcclxuICAgIGZ1bmN0aW9uIHN1bWFyICh2YWxvcmVzKXtcclxuICAgICAgdmFyIHN1bWEgPSAwO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbG9yZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzdW1hICs9IHBhcnNlRmxvYXQodmFsb3Jlc1tpXSk7IFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzdW1hO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG5vdygpe1xyXG4gICAgICByZXR1cm4gbW9tZW50KCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcclxuICAgIH1cclxuICB9XHJcbiAgVnVlLmNvbXBvbmVudCgnc3VtbWFyeS1wcmludC12aWV3Jyx7XHJcbiAgICB0ZW1wbGF0ZTogJ1xcXHJcbiAgICA8ZGl2IGNsYXNzPVwicHJpbnQtY29udGFpbmVyXCI+XFxcclxuICAgICAgPGRpdiBjbGFzcz1cIl9faGVhZGVyXCI+XFxcclxuICAgICAgPGgyIGNsYXNzPVwiX190aXRsZSB0LWNlbnRlclwiPiB7e3RpdGxlfX08L2gyPlxcXHJcbiAgICAgIDwvZGl2PlxcXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJfX2JvZHlcIj5cXFxyXG4gICAgICA8cHJpbnRlYWJsZT48L3ByaW50ZWFibGU+XFxcclxuICAgICAgPC9kaXY+XFxcclxuICAgIDxkaXY+XFxcclxuICAgIFxcXHJcbiAgICAnLFxyXG4gICAgcHJvcHM6Wydzb21ldmFsdWUnXSxcclxuICAgIG1ldGhvZHM6e1xyXG4gICAgICBnb0JhY2s6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgYXBwU3VtbWFyeVZpZXcuaXNIaWRlID0gdHJ1ZTtcclxuICAgICAgICB3aW5kb3cuYXBwQ2llcnJlLmlzSGlkZSA9IGZhbHNlO1xyXG4gICAgICAgIHNlbGYuaXNIaWRlID0gdHJ1ZTtcclxuICAgICAgICAkKFwiLnRvcC1uYXZcIikucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAkKFwiI2FwcC1jaWVycmVcIikucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgYmFjazoge2xpbms6XCJzb21lbGlua1wiLHRleHQ6XCJ2b2x2ZXIgYSBjaWVycmVcIn0sXHJcbiAgICAgICAgZm93YXJkOiB7bGluazogQkFTRV9VUkwgKyBcImFwcC9sb2dvdXRcIix0ZXh0OlwiY2VycmFyIHNlc3Npb25cIn0sXHJcbiAgICAgICAgdGl0bGU6XCJSZXN1bWVuIGRlIGNpZXJyZSBkZSBob3lcIixcclxuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG5cclxuICB2YXIgYXBwU3VtbWFyeVZpZXcgPSBuZXcgVnVlKHtcclxuICAgIGVsOiBcIiNwcmludC12aWV3XCIsXHJcbiAgICBkYXRhOiB7XHJcbiAgICAgIGlzSGlkZTogdHJ1ZSxcclxuICAgICAgYmFjazoge2xpbms6XCJzb21lbGlua1wiLHRleHQ6XCJ2b2x2ZXIgYSBjaWVycmVcIn0sXHJcbiAgICAgIGZvd2FyZDoge2xpbms6IEJBU0VfVVJMICsgXCJhcHAvbG9nb3V0XCIsdGV4dDpcImNlcnJhciBzZXNzaW9uXCJ9LFxyXG4gICAgICBjaWVycmU6e1xyXG4gICAgICAgICAgYXV0b3I6ICcnLFxyXG4gICAgICAgICAgcGFnb3NfZmFjdHVyYXM6IDAsXHJcbiAgICAgICAgICBwYWdvc19leHRyYXM6IDAsXHJcbiAgICAgICAgICBwYWdvc19lZmVjdGl2bzogMCxcclxuICAgICAgICAgIHBhZ29zX2JhbmNvOiAwLFxyXG4gICAgICAgICAgdG90YWxfaW5ncmVzb3M6IDAsXHJcbiAgICAgICAgICBlZmVjdGl2b19jYWphOiAwLFxyXG4gICAgICAgICAgdG90YWxfZGVzY3VhZHJlOiAwLFxyXG4gICAgICAgICAgdG90YWxfZ2FzdG9zOiAwLFxyXG4gICAgICAgICAgYmFuY286IDBcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZmlsdGVyczoge1xyXG4gICAgICBjdXJyZW5jeUZvcm1hdDogZnVuY3Rpb24obnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gXCJSRCQgXCIrIEN1cnJlbmN5Rm9ybWF0KG51bWJlcik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzcGFuaXNoRGF0ZUZvcm1hdDogZnVuY3Rpb24oZGF0ZSl7XHJcbiAgICAgICAgbW9tZW50LmxvY2FsZSgnZXMtRE8nKTtcclxuICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnZGRkZCBERCBbZGVdIE1NTU0gW2RlbF0gWVlZWScpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtZXRob2RzOntcclxuICAgICAgZ29CYWNrOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGFwcFN1bW1hcnlWaWV3LmlzSGlkZSA9IHRydWU7XHJcbiAgICAgICAgd2luZG93LmFwcENpZXJyZS5pc0hpZGUgPSBmYWxzZTtcclxuICAgICAgICBzZWxmLmlzSGlkZSA9IHRydWU7XHJcbiAgICAgICAgJChcIi50b3AtbmF2XCIpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgJChcIiNhcHAtY2llcnJlXCIpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHByaW50OiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHByaW50KClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pIiwidmFyIGFwcFBhZ29FeHRyYSA9IG5ldyBWdWUoe1xyXG4gIGVsOiBcIiNhcHAtcGFnby1leHRyYVwiLFxyXG4gIGRhdGE6IHtcclxuICAgIHJlY2libzp7XHJcbiAgICAgICBpZF9wYWdvOiAwLFxyXG4gICAgICAgaWRfY29udHJhdG86IDAsXHJcbiAgICAgICBpZF9zZXJ2aWNpbzogMCxcclxuICAgICAgIGlkX2VtcGxlYWRvOiAwLFxyXG4gICAgICAgZmVjaGFfcGFnbyA6ICdkZC9tbS95eXl5JyxcclxuICAgICAgIGNvbmNlcHRvIDogJ2V4dHJhJyxcclxuICAgICAgIGRldGFsbGVzX2V4dHJhIDogJycsXHJcbiAgICAgICBjdW90YTogJycsXHJcbiAgICAgICBtb3JhIDogJycsXHJcbiAgICAgICBtb250b19leHRyYTogJycsXHJcbiAgICAgICB0b3RhbDogJycsXHJcbiAgICAgICBlc3RhZG86ICcnLFxyXG4gICAgICAgZmVjaGFfbGltaXRlOiAnJyxcclxuICAgICAgIGNvbXBsZXRlX2RhdGUgOiAnJyxcclxuICAgICAgIGRlc2N1ZW50bzogJycsXHJcbiAgICAgICByYXpvbl9kZXNjdWVudG86ICcnLFxyXG4gICAgICAgZGV1ZGE6ICcnLFxyXG4gICAgICAgYWJvbm9fYTogJycsXHJcbiAgICAgICB0aXBvOiAnJyxcclxuICAgICAgIGdlbmVyYWRvOiAnJ1xyXG4gICAgfSxcclxuXHJcbiAgICB2aXNpYmxlOiBmYWxzZSxcclxuICAgIGV4dHJhOntcclxuICAgICAgXCJjb250cm9sc1wiOiAnJyxcclxuICAgICAgXCJpZF9leHRyYVwiOiAnJyxcclxuICAgICAgXCJpZF9zZXJ2aWNpb1wiOiAnJyxcclxuICAgICAgXCJjaGVja2JveFwiOiAnJyxcclxuICAgICAgXCJmZWNoYVwiOiAnJyxcclxuICAgICAgXCJjb25jZXB0b1wiOiAnJyxcclxuICAgICAgXCJ1bHRpbW9fcGFnb1wiOiAnJyxcclxuICAgICAgXCJtb250b19wYWdhZG9cIjogJycsXHJcbiAgICAgIFwibW9udG9fdG90YWxcIjogJycsXHJcbiAgICAgIFwiZXN0YWRvXCI6ICcnXHJcbiAgICB9LFxyXG4gICAgZmlyc3RDb250cm9sczoge1xyXG4gICAgICBoaWRlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIHNlY29uZENvbnRyb2xzOiB7XHJcbiAgICAgIGhpZGU6IHRydWVcclxuICAgIH1cclxuICB9LFxyXG4gIGZpbHRlcnM6IHtcclxuXHJcbiAgfSxcclxuICBtZXRob2RzOntcclxuICAgIHB1dEluc3RhbmNlOiBmdW5jdGlvbigpe1xyXG5cclxuICAgIH0sXHJcbiAgICBnb0JhY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgZXh0cmFUYWJsZS5lbC5wYXJlbnRzKFwiLmJvb3RzdHJhcC10YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgIGFwcFBhZ29FeHRyYS52aXNpYmxlID0gZmFsc2VcclxuICAgICAgYXBwUGFnb0V4dHJhLmV4dHJhID0ge2NvbmNlcHRvOiAnJ31cclxuICAgIH0sXHJcblxyXG4gICAgZ2VuZXJhdGVQYXltZW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBmb3JtID0gJ2RhdGE9JyArIEpTT04uc3RyaW5naWZ5KHRoaXMuZXh0cmEpO1xyXG4gICAgICB2YXIgc2VuZCA9IGF4aW9zLnBvc3QoIEJBU0VfVVJMICsgJ2V4dHJhL2dlbmVyYXRlX2V4dHJhX3BheW1lbnQnLGZvcm0pO1xyXG4gICAgICBzZW5kLnRoZW4oZnVuY3Rpb24ocmVzKXtcclxuICAgICAgICB2YXIgZGF0YSA9IHJlcy5kYXRhO1xyXG4gICAgICAgIGRpc3BsYXlNZXNzYWdlKGRhdGEubWVuc2FqZSk7XHJcbiAgICAgICAgc2VsZWN0RXh0cmFQYXltZW50Lmh0bWwoZGF0YS5wYWdvcyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBzZW5kLmNhdGNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIGdldFBheW1lbnQ6IGZ1bmN0aW9uIChpZF9wYWdvKSB7XHJcbiAgICAgIHZhciBmb3JtID0gXCJkYXRhPVwiICsgSlNPTi5zdHJpbmdpZnkoe2lkX3BhZ286IGlkX3BhZ299KTtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICAgIHZhciBzZW5kID0gYXhpb3MucG9zdCggQkFTRV9VUkwgKyAnZXh0cmEvZ2V0X3BheW1lbnQnLGZvcm0pO1xyXG4gICAgICBzZW5kLnRoZW4oZnVuY3Rpb24ocmVzKXtcclxuICAgICAgICB2YXIgZGF0YSA9IHJlcy5kYXRhIFxyXG4gICAgICAgIHNlbGYucmVjaWJvID0gZGF0YS5yZWNpYm9cclxuICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgYXBwbHlQYXltZW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgICB2YXIgcmVjaWJvID0gdGhpcy5yZWNpYm9cclxuICAgICAgdmFyIGluZm8gPSB7XHJcbiAgICAgICAgaWRfZXh0cmE6IHJlY2liby5pZF9leHRyYSxcclxuICAgICAgICBpZF9wYWdvOiByZWNpYm8uaWRfcGFnb1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICBjb25jZXB0bzogcmVjaWJvLmNvbmNlcHRvLCBcclxuICAgICAgICBkZXRhbGxlc19leHRyYTogcmVjaWJvLmRldGFsbGVzX2V4dHJhLFxyXG4gICAgICAgIGZlY2hhX3BhZ286IHJlY2liby5mZWNoYV9wYWdvLFxyXG4gICAgICAgIGN1b3RhOiByZWNpYm8uY3VvdGEsXHJcbiAgICAgICAgdG90YWw6IHJlY2liby5jdW90YSxcclxuICAgICAgICBlc3RhZG86ICdwYWdhZG8nLFxyXG4gICAgICAgIHRpcG86IHJlY2liby50aXBvLFxyXG4gICAgICAgIGdlbmVyYWRvOiB0cnVlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBmb3JtID0gJ2RhdGE9JysgSlNPTi5zdHJpbmdpZnkoZGF0YSkgKyAnJmluZm89JysgSlNPTi5zdHJpbmdpZnkoaW5mbylcclxuICAgICAgdmFyIHNlbmQgPSBheGlvcy5wb3N0KEJBU0VfVVJMICsgJ2V4dHJhL2FwcGx5X3BheW1lbnQnLGZvcm0pXHJcbiAgICAgIHNlbmQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSByZXMuZGF0YVxyXG4gICAgICAgIGRpc3BsYXlNZXNzYWdlKGRhdGEubWVuc2FqZSk7XHJcbiAgICAgICAgZXh0cmFUYWJsZS5yZWZyZXNoKGRhdGEuZXh0cmFzKTtcclxuICAgICAgICBzZWxmLmdvQmFjaygpO1xyXG4gICAgICB9KVxyXG4gICAgICBzZW5kLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIGdldFBheW1lbnRzOiBmdW5jdGlvbiAoaWRfZXh0cmEpIHtcclxuICAgICAgdmFyIGZvcm0gPSBcImRhdGE9XCIrIEpTT04uc3RyaW5naWZ5KHtpZF9leHRyYTogaWRfZXh0cmF9KVxyXG4gICAgICB2YXIgc2VuZCA9IGF4aW9zLnBvc3QoQkFTRV9VUkwgKyAnZXh0cmEvZ2V0X2V4dHJhX3BheW1lbnRfb2YnLCBmb3JtKVxyXG4gICAgICBzZW5kLnRoZW4oZnVuY3Rpb24ocmVzKXtcclxuICAgICAgICB2YXIgZGF0YSA9IHJlcy5kYXRhO1xyXG4gICAgICAgIHNlbGVjdEV4dHJhUGF5bWVudC5odG1sKGRhdGEucGFnb3MpLmNoYW5nZSgpXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIGRlbGV0ZVBheW1lbnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICB2YXIgcmVjaWJvID0gdGhpcy5yZWNpYm9cclxuICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgJ2lkX2V4dHJhJzogcmVjaWJvLmlkX2V4dHJhLFxyXG4gICAgICAgICdpZF9wYWdvJzogcmVjaWJvLmlkX3BhZ29cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGZvcm0gPSAnZGF0YT0nKyBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG4gICAgICB2YXIgc2VuZCA9IGF4aW9zLnBvc3QoQkFTRV9VUkwgKyAnZXh0cmEvZGVsZXRlX3BheW1lbnQnLGZvcm0pXHJcbiAgICAgIHNlbmQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSByZXMuZGF0YVxyXG4gICAgICAgIGRpc3BsYXlNZXNzYWdlKGRhdGEubWVuc2FqZSk7XHJcbiAgICAgICAgZXh0cmFUYWJsZS5yZWZyZXNoKGRhdGEuZXh0cmFzKTtcclxuICAgICAgICBzZWxmLmdldFBheW1lbnRzKGV4dHJhLmlkX2V4dHJhKTtcclxuICAgICAgICBleHRyYVRhYmxlLmVsLnBhcmVudHMoXCIuYm9vdHN0cmFwLXRhYmxlXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgfSlcclxuICAgICAgc2VuZC5jYXRjaChmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0pO1xyXG5cclxuXHJcbmJ1cy4kb24oJ3Jvdy1zZWxlY3RlZCcsZnVuY3Rpb24gKHJvdykge1xyXG4gIGV4dHJhVGFibGUuZWwucGFyZW50cyhcIi5ib290c3RyYXAtdGFibGVcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gIGFwcFBhZ29FeHRyYS52aXNpYmxlID0gdHJ1ZVxyXG4gIGFwcFBhZ29FeHRyYS5leHRyYSA9IHJvd1xyXG5cclxuICBhcHBQYWdvRXh0cmEuZ2V0UGF5bWVudHMocm93LmlkX2V4dHJhKTtcclxufSlcclxuXHJcbnZhciBzZWxlY3RFeHRyYVBheW1lbnQgPSAkKFwiI3NlbGVjdC1leHRyYS1wYXltZW50XCIpO1xyXG5zZWxlY3RFeHRyYVBheW1lbnQub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcclxuICB2YXIgaWRfcGFnbyA9IHNlbGVjdEV4dHJhUGF5bWVudC52YWwoKVxyXG4gIGFwcFBhZ29FeHRyYS5nZXRQYXltZW50KGlkX3BhZ28pXHJcbn0pIiwiLyohIEFkbWluTFRFIGFwcC5qc1xuKiA9PT09PT09PT09PT09PT09XG4qIE1haW4gSlMgYXBwbGljYXRpb24gZmlsZSBmb3IgQWRtaW5MVEUgdjIuIFRoaXMgZmlsZVxuKiBzaG91bGQgYmUgaW5jbHVkZWQgaW4gYWxsIHBhZ2VzLiBJdCBjb250cm9scyBzb21lIGxheW91dFxuKiBvcHRpb25zIGFuZCBpbXBsZW1lbnRzIGV4Y2x1c2l2ZSBBZG1pbkxURSBwbHVnaW5zLlxuKlxuKiBAQXV0aG9yICBBbG1zYWVlZCBTdHVkaW9cbiogQFN1cHBvcnQgPGh0dHBzOi8vd3d3LmFsbXNhZWVkc3R1ZGlvLmNvbT5cbiogQEVtYWlsICAgPGFiZHVsbGFoQGFsbXNhZWVkc3R1ZGlvLmNvbT5cbiogQHZlcnNpb24gMi40LjBcbiogQHJlcG9zaXRvcnkgZ2l0Oi8vZ2l0aHViLmNvbS9hbG1hc2FlZWQyMDEwL0FkbWluTFRFLmdpdFxuKiBAbGljZW5zZSBNSVQgPGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQ+XG4qL1xuaWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIGpRdWVyeSl0aHJvdyBuZXcgRXJyb3IoXCJBZG1pbkxURSByZXF1aXJlcyBqUXVlcnlcIik7K2Z1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBlPWEodGhpcyksZj1lLmRhdGEoYyk7aWYoIWYpe3ZhciBoPWEuZXh0ZW5kKHt9LGQsZS5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIGImJmIpO2UuZGF0YShjLGY9bmV3IGcoaCkpfWlmKFwic3RyaW5nXCI9PXR5cGVvZiBiKXtpZih2b2lkIDA9PT1mW2JdKXRocm93IG5ldyBFcnJvcihcIk5vIG1ldGhvZCBuYW1lZCBcIitiKTtmW2JdKCl9fSl9dmFyIGM9XCJsdGUubGF5b3V0XCIsZD17c2xpbXNjcm9sbDohMCxyZXNldEhlaWdodDohMH0sZT17d3JhcHBlcjpcIi53cmFwcGVyXCIsY29udGVudFdyYXBwZXI6XCIuY29udGVudC13cmFwcGVyXCIsbGF5b3V0Qm94ZWQ6XCIubGF5b3V0LWJveGVkXCIsbWFpbkZvb3RlcjpcIi5tYWluLWZvb3RlclwiLG1haW5IZWFkZXI6XCIubWFpbi1oZWFkZXJcIixzaWRlYmFyOlwiLnNpZGViYXJcIixjb250cm9sU2lkZWJhcjpcIi5jb250cm9sLXNpZGViYXJcIixmaXhlZDpcIi5maXhlZFwiLHNpZGViYXJNZW51OlwiLnNpZGViYXItbWVudVwiLGxvZ286XCIubWFpbi1oZWFkZXIgLmxvZ29cIn0sZj17Zml4ZWQ6XCJmaXhlZFwiLGhvbGRUcmFuc2l0aW9uOlwiaG9sZC10cmFuc2l0aW9uXCJ9LGc9ZnVuY3Rpb24oYSl7dGhpcy5vcHRpb25zPWEsdGhpcy5iaW5kZWRSZXNpemU9ITEsdGhpcy5hY3RpdmF0ZSgpfTtnLnByb3RvdHlwZS5hY3RpdmF0ZT1mdW5jdGlvbigpe3RoaXMuZml4KCksdGhpcy5maXhTaWRlYmFyKCksYShcImJvZHlcIikucmVtb3ZlQ2xhc3MoZi5ob2xkVHJhbnNpdGlvbiksdGhpcy5vcHRpb25zLnJlc2V0SGVpZ2h0JiZhKFwiYm9keSwgaHRtbCwgXCIrZS53cmFwcGVyKS5jc3Moe2hlaWdodDpcImF1dG9cIixcIm1pbi1oZWlnaHRcIjpcIjEwMCVcIn0pLHRoaXMuYmluZGVkUmVzaXplfHwoYSh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpe3RoaXMuZml4KCksdGhpcy5maXhTaWRlYmFyKCksYShlLmxvZ28rXCIsIFwiK2Uuc2lkZWJhcikub25lKFwid2Via2l0VHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBvVHJhbnNpdGlvbkVuZCBtc1RyYW5zaXRpb25FbmQgdHJhbnNpdGlvbmVuZFwiLGZ1bmN0aW9uKCl7dGhpcy5maXgoKSx0aGlzLmZpeFNpZGViYXIoKX0uYmluZCh0aGlzKSl9LmJpbmQodGhpcykpLHRoaXMuYmluZGVkUmVzaXplPSEwKSxhKGUuc2lkZWJhck1lbnUpLm9uKFwiZXhwYW5kZWQudHJlZVwiLGZ1bmN0aW9uKCl7dGhpcy5maXgoKSx0aGlzLmZpeFNpZGViYXIoKX0uYmluZCh0aGlzKSksYShlLnNpZGViYXJNZW51KS5vbihcImNvbGxhcHNlZC50cmVlXCIsZnVuY3Rpb24oKXt0aGlzLmZpeCgpLHRoaXMuZml4U2lkZWJhcigpfS5iaW5kKHRoaXMpKX0sZy5wcm90b3R5cGUuZml4PWZ1bmN0aW9uKCl7YShlLmxheW91dEJveGVkK1wiID4gXCIrZS53cmFwcGVyKS5jc3MoXCJvdmVyZmxvd1wiLFwiaGlkZGVuXCIpO3ZhciBiPWEoZS5tYWluRm9vdGVyKS5vdXRlckhlaWdodCgpfHwwLGM9YShlLm1haW5IZWFkZXIpLm91dGVySGVpZ2h0KCkrYixkPWEod2luZG93KS5oZWlnaHQoKSxnPWEoZS5zaWRlYmFyKS5oZWlnaHQoKXx8MDtpZihhKFwiYm9keVwiKS5oYXNDbGFzcyhmLmZpeGVkKSlhKGUuY29udGVudFdyYXBwZXIpLmNzcyhcIm1pbi1oZWlnaHRcIixkLWIpO2Vsc2V7dmFyIGg7ZD49Zz8oYShlLmNvbnRlbnRXcmFwcGVyKS5jc3MoXCJtaW4taGVpZ2h0XCIsZC1jKSxoPWQtYyk6KGEoZS5jb250ZW50V3JhcHBlcikuY3NzKFwibWluLWhlaWdodFwiLGcpLGg9Zyk7dmFyIGk9YShlLmNvbnRyb2xTaWRlYmFyKTt2b2lkIDAhPT1pJiZpLmhlaWdodCgpPmgmJmEoZS5jb250ZW50V3JhcHBlcikuY3NzKFwibWluLWhlaWdodFwiLGkuaGVpZ2h0KCkpfX0sZy5wcm90b3R5cGUuZml4U2lkZWJhcj1mdW5jdGlvbigpe2lmKCFhKFwiYm9keVwiKS5oYXNDbGFzcyhmLmZpeGVkKSlyZXR1cm4gdm9pZCh2b2lkIDAhPT1hLmZuLnNsaW1TY3JvbGwmJmEoZS5zaWRlYmFyKS5zbGltU2Nyb2xsKHtkZXN0cm95OiEwfSkuaGVpZ2h0KFwiYXV0b1wiKSk7dGhpcy5vcHRpb25zLnNsaW1zY3JvbGwmJnZvaWQgMCE9PWEuZm4uc2xpbVNjcm9sbCYmKGEoZS5zaWRlYmFyKS5zbGltU2Nyb2xsKHtkZXN0cm95OiEwfSkuaGVpZ2h0KFwiYXV0b1wiKSxhKGUuc2lkZWJhcikuc2xpbVNjcm9sbCh7aGVpZ2h0OmEod2luZG93KS5oZWlnaHQoKS1hKGUubWFpbkhlYWRlcikuaGVpZ2h0KCkrXCJweFwiLGNvbG9yOlwicmdiYSgwLDAsMCwwLjIpXCIsc2l6ZTpcIjNweFwifSkpfTt2YXIgaD1hLmZuLmxheW91dDthLmZuLmxheW91dD1iLGEuZm4ubGF5b3V0LkNvbnN0dWN0b3I9ZyxhLmZuLmxheW91dC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4ubGF5b3V0PWgsdGhpc30sYSh3aW5kb3cpLm9uKFwibG9hZFwiLGZ1bmN0aW9uKCl7Yi5jYWxsKGEoXCJib2R5XCIpKX0pfShqUXVlcnkpLGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBlPWEodGhpcyksZj1lLmRhdGEoYyk7aWYoIWYpe3ZhciBnPWEuZXh0ZW5kKHt9LGQsZS5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIGImJmIpO2UuZGF0YShjLGY9bmV3IGgoZykpfVwidG9nZ2xlXCI9PWImJmYudG9nZ2xlKCl9KX12YXIgYz1cImx0ZS5wdXNobWVudVwiLGQ9e2NvbGxhcHNlU2NyZWVuU2l6ZTo3NjcsZXhwYW5kT25Ib3ZlcjohMSxleHBhbmRUcmFuc2l0aW9uRGVsYXk6MjAwfSxlPXtjb2xsYXBzZWQ6XCIuc2lkZWJhci1jb2xsYXBzZVwiLG9wZW46XCIuc2lkZWJhci1vcGVuXCIsbWFpblNpZGViYXI6XCIubWFpbi1zaWRlYmFyXCIsY29udGVudFdyYXBwZXI6XCIuY29udGVudC13cmFwcGVyXCIsc2VhcmNoSW5wdXQ6XCIuc2lkZWJhci1mb3JtIC5mb3JtLWNvbnRyb2xcIixidXR0b246J1tkYXRhLXRvZ2dsZT1cInB1c2gtbWVudVwiXScsbWluaTpcIi5zaWRlYmFyLW1pbmlcIixleHBhbmRlZDpcIi5zaWRlYmFyLWV4cGFuZGVkLW9uLWhvdmVyXCIsbGF5b3V0Rml4ZWQ6XCIuZml4ZWRcIn0sZj17Y29sbGFwc2VkOlwic2lkZWJhci1jb2xsYXBzZVwiLG9wZW46XCJzaWRlYmFyLW9wZW5cIixtaW5pOlwic2lkZWJhci1taW5pXCIsZXhwYW5kZWQ6XCJzaWRlYmFyLWV4cGFuZGVkLW9uLWhvdmVyXCIsZXhwYW5kRmVhdHVyZTpcInNpZGViYXItbWluaS1leHBhbmQtZmVhdHVyZVwiLGxheW91dEZpeGVkOlwiZml4ZWRcIn0sZz17ZXhwYW5kZWQ6XCJleHBhbmRlZC5wdXNoTWVudVwiLGNvbGxhcHNlZDpcImNvbGxhcHNlZC5wdXNoTWVudVwifSxoPWZ1bmN0aW9uKGEpe3RoaXMub3B0aW9ucz1hLHRoaXMuaW5pdCgpfTtoLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7KHRoaXMub3B0aW9ucy5leHBhbmRPbkhvdmVyfHxhKFwiYm9keVwiKS5pcyhlLm1pbmkrZS5sYXlvdXRGaXhlZCkpJiYodGhpcy5leHBhbmRPbkhvdmVyKCksYShcImJvZHlcIikuYWRkQ2xhc3MoZi5leHBhbmRGZWF0dXJlKSksYShlLmNvbnRlbnRXcmFwcGVyKS5jbGljayhmdW5jdGlvbigpe2Eod2luZG93KS53aWR0aCgpPD10aGlzLm9wdGlvbnMuY29sbGFwc2VTY3JlZW5TaXplJiZhKFwiYm9keVwiKS5oYXNDbGFzcyhmLm9wZW4pJiZ0aGlzLmNsb3NlKCl9LmJpbmQodGhpcykpLGEoZS5zZWFyY2hJbnB1dCkuY2xpY2soZnVuY3Rpb24oYSl7YS5zdG9wUHJvcGFnYXRpb24oKX0pfSxoLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oKXt2YXIgYj1hKHdpbmRvdykud2lkdGgoKSxjPSFhKFwiYm9keVwiKS5oYXNDbGFzcyhmLmNvbGxhcHNlZCk7Yjw9dGhpcy5vcHRpb25zLmNvbGxhcHNlU2NyZWVuU2l6ZSYmKGM9YShcImJvZHlcIikuaGFzQ2xhc3MoZi5vcGVuKSksYz90aGlzLmNsb3NlKCk6dGhpcy5vcGVuKCl9LGgucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oKXthKHdpbmRvdykud2lkdGgoKT50aGlzLm9wdGlvbnMuY29sbGFwc2VTY3JlZW5TaXplP2EoXCJib2R5XCIpLnJlbW92ZUNsYXNzKGYuY29sbGFwc2VkKS50cmlnZ2VyKGEuRXZlbnQoZy5leHBhbmRlZCkpOmEoXCJib2R5XCIpLmFkZENsYXNzKGYub3BlbikudHJpZ2dlcihhLkV2ZW50KGcuZXhwYW5kZWQpKX0saC5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oKXthKHdpbmRvdykud2lkdGgoKT50aGlzLm9wdGlvbnMuY29sbGFwc2VTY3JlZW5TaXplP2EoXCJib2R5XCIpLmFkZENsYXNzKGYuY29sbGFwc2VkKS50cmlnZ2VyKGEuRXZlbnQoZy5jb2xsYXBzZWQpKTphKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhmLm9wZW4rXCIgXCIrZi5jb2xsYXBzZWQpLnRyaWdnZXIoYS5FdmVudChnLmNvbGxhcHNlZCkpfSxoLnByb3RvdHlwZS5leHBhbmRPbkhvdmVyPWZ1bmN0aW9uKCl7YShlLm1haW5TaWRlYmFyKS5ob3ZlcihmdW5jdGlvbigpe2EoXCJib2R5XCIpLmlzKGUubWluaStlLmNvbGxhcHNlZCkmJmEod2luZG93KS53aWR0aCgpPnRoaXMub3B0aW9ucy5jb2xsYXBzZVNjcmVlblNpemUmJnRoaXMuZXhwYW5kKCl9LmJpbmQodGhpcyksZnVuY3Rpb24oKXthKFwiYm9keVwiKS5pcyhlLmV4cGFuZGVkKSYmdGhpcy5jb2xsYXBzZSgpfS5iaW5kKHRoaXMpKX0saC5wcm90b3R5cGUuZXhwYW5kPWZ1bmN0aW9uKCl7c2V0VGltZW91dChmdW5jdGlvbigpe2EoXCJib2R5XCIpLnJlbW92ZUNsYXNzKGYuY29sbGFwc2VkKS5hZGRDbGFzcyhmLmV4cGFuZGVkKX0sdGhpcy5vcHRpb25zLmV4cGFuZFRyYW5zaXRpb25EZWxheSl9LGgucHJvdG90eXBlLmNvbGxhcHNlPWZ1bmN0aW9uKCl7c2V0VGltZW91dChmdW5jdGlvbigpe2EoXCJib2R5XCIpLnJlbW92ZUNsYXNzKGYuZXhwYW5kZWQpLmFkZENsYXNzKGYuY29sbGFwc2VkKX0sdGhpcy5vcHRpb25zLmV4cGFuZFRyYW5zaXRpb25EZWxheSl9O3ZhciBpPWEuZm4ucHVzaE1lbnU7YS5mbi5wdXNoTWVudT1iLGEuZm4ucHVzaE1lbnUuQ29uc3RydWN0b3I9aCxhLmZuLnB1c2hNZW51Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5wdXNoTWVudT1pLHRoaXN9LGEoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIixlLmJ1dHRvbixmdW5jdGlvbihjKXtjLnByZXZlbnREZWZhdWx0KCksYi5jYWxsKGEodGhpcyksXCJ0b2dnbGVcIil9KSxhKHdpbmRvdykub24oXCJsb2FkXCIsZnVuY3Rpb24oKXtiLmNhbGwoYShlLmJ1dHRvbikpfSl9KGpRdWVyeSksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9YSh0aGlzKTtpZighZS5kYXRhKGMpKXt2YXIgZj1hLmV4dGVuZCh7fSxkLGUuZGF0YSgpLFwib2JqZWN0XCI9PXR5cGVvZiBiJiZiKTtlLmRhdGEoYyxuZXcgaChlLGYpKX19KX12YXIgYz1cImx0ZS50cmVlXCIsZD17YW5pbWF0aW9uU3BlZWQ6NTAwLGFjY29yZGlvbjohMCxmb2xsb3dMaW5rOiExLHRyaWdnZXI6XCIudHJlZXZpZXcgYVwifSxlPXt0cmVlOlwiLnRyZWVcIix0cmVldmlldzpcIi50cmVldmlld1wiLHRyZWV2aWV3TWVudTpcIi50cmVldmlldy1tZW51XCIsb3BlbjpcIi5tZW51LW9wZW4sIC5hY3RpdmVcIixsaTpcImxpXCIsZGF0YTonW2RhdGEtd2lkZ2V0PVwidHJlZVwiXScsYWN0aXZlOlwiLmFjdGl2ZVwifSxmPXtvcGVuOlwibWVudS1vcGVuXCIsdHJlZTpcInRyZWVcIn0sZz17Y29sbGFwc2VkOlwiY29sbGFwc2VkLnRyZWVcIixleHBhbmRlZDpcImV4cGFuZGVkLnRyZWVcIn0saD1mdW5jdGlvbihiLGMpe3RoaXMuZWxlbWVudD1iLHRoaXMub3B0aW9ucz1jLGEodGhpcy5lbGVtZW50KS5hZGRDbGFzcyhmLnRyZWUpLGEoZS50cmVldmlldytlLmFjdGl2ZSx0aGlzLmVsZW1lbnQpLmFkZENsYXNzKGYub3BlbiksdGhpcy5fc2V0VXBMaXN0ZW5lcnMoKX07aC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5uZXh0KGUudHJlZXZpZXdNZW51KSxkPWEucGFyZW50KCksZz1kLmhhc0NsYXNzKGYub3Blbik7ZC5pcyhlLnRyZWV2aWV3KSYmKHRoaXMub3B0aW9ucy5mb2xsb3dMaW5rJiZcIiNcIiE9YS5hdHRyKFwiaHJlZlwiKXx8Yi5wcmV2ZW50RGVmYXVsdCgpLGc/dGhpcy5jb2xsYXBzZShjLGQpOnRoaXMuZXhwYW5kKGMsZCkpfSxoLnByb3RvdHlwZS5leHBhbmQ9ZnVuY3Rpb24oYixjKXt2YXIgZD1hLkV2ZW50KGcuZXhwYW5kZWQpO2lmKHRoaXMub3B0aW9ucy5hY2NvcmRpb24pe3ZhciBoPWMuc2libGluZ3MoZS5vcGVuKSxpPWguY2hpbGRyZW4oZS50cmVldmlld01lbnUpO3RoaXMuY29sbGFwc2UoaSxoKX1jLmFkZENsYXNzKGYub3BlbiksYi5zbGlkZURvd24odGhpcy5vcHRpb25zLmFuaW1hdGlvblNwZWVkLGZ1bmN0aW9uKCl7YSh0aGlzLmVsZW1lbnQpLnRyaWdnZXIoZCl9LmJpbmQodGhpcykpfSxoLnByb3RvdHlwZS5jb2xsYXBzZT1mdW5jdGlvbihiLGMpe3ZhciBkPWEuRXZlbnQoZy5jb2xsYXBzZWQpO2IuZmluZChlLm9wZW4pLnJlbW92ZUNsYXNzKGYub3BlbiksYy5yZW1vdmVDbGFzcyhmLm9wZW4pLGIuc2xpZGVVcCh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uU3BlZWQsZnVuY3Rpb24oKXtiLmZpbmQoZS5vcGVuK1wiID4gXCIrZS50cmVldmlldykuc2xpZGVVcCgpLGEodGhpcy5lbGVtZW50KS50cmlnZ2VyKGQpfS5iaW5kKHRoaXMpKX0saC5wcm90b3R5cGUuX3NldFVwTGlzdGVuZXJzPWZ1bmN0aW9uKCl7dmFyIGI9dGhpczthKHRoaXMuZWxlbWVudCkub24oXCJjbGlja1wiLHRoaXMub3B0aW9ucy50cmlnZ2VyLGZ1bmN0aW9uKGMpe2IudG9nZ2xlKGEodGhpcyksYyl9KX07dmFyIGk9YS5mbi50cmVlO2EuZm4udHJlZT1iLGEuZm4udHJlZS5Db25zdHJ1Y3Rvcj1oLGEuZm4udHJlZS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4udHJlZT1pLHRoaXN9LGEod2luZG93KS5vbihcImxvYWRcIixmdW5jdGlvbigpe2EoZS5kYXRhKS5lYWNoKGZ1bmN0aW9uKCl7Yi5jYWxsKGEodGhpcykpfSl9KX0oalF1ZXJ5KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1hKHRoaXMpLGY9ZS5kYXRhKGMpO2lmKCFmKXt2YXIgZz1hLmV4dGVuZCh7fSxkLGUuZGF0YSgpLFwib2JqZWN0XCI9PXR5cGVvZiBiJiZiKTtlLmRhdGEoYyxmPW5ldyBoKGUsZykpfVwic3RyaW5nXCI9PXR5cGVvZiBiJiZmLnRvZ2dsZSgpfSl9dmFyIGM9XCJsdGUuY29udHJvbHNpZGViYXJcIixkPXtzbGlkZTohMH0sZT17c2lkZWJhcjpcIi5jb250cm9sLXNpZGViYXJcIixkYXRhOidbZGF0YS10b2dnbGU9XCJjb250cm9sLXNpZGViYXJcIl0nLG9wZW46XCIuY29udHJvbC1zaWRlYmFyLW9wZW5cIixiZzpcIi5jb250cm9sLXNpZGViYXItYmdcIix3cmFwcGVyOlwiLndyYXBwZXJcIixjb250ZW50OlwiLmNvbnRlbnQtd3JhcHBlclwiLGJveGVkOlwiLmxheW91dC1ib3hlZFwifSxmPXtvcGVuOlwiY29udHJvbC1zaWRlYmFyLW9wZW5cIixmaXhlZDpcImZpeGVkXCJ9LGc9e2NvbGxhcHNlZDpcImNvbGxhcHNlZC5jb250cm9sc2lkZWJhclwiLGV4cGFuZGVkOlwiZXhwYW5kZWQuY29udHJvbHNpZGViYXJcIn0saD1mdW5jdGlvbihhLGIpe3RoaXMuZWxlbWVudD1hLHRoaXMub3B0aW9ucz1iLHRoaXMuaGFzQmluZGVkUmVzaXplPSExLHRoaXMuaW5pdCgpfTtoLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7YSh0aGlzLmVsZW1lbnQpLmlzKGUuZGF0YSl8fGEodGhpcykub24oXCJjbGlja1wiLHRoaXMudG9nZ2xlKSx0aGlzLmZpeCgpLGEod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKXt0aGlzLmZpeCgpfS5iaW5kKHRoaXMpKX0saC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKGIpe2ImJmIucHJldmVudERlZmF1bHQoKSx0aGlzLmZpeCgpLGEoZS5zaWRlYmFyKS5pcyhlLm9wZW4pfHxhKFwiYm9keVwiKS5pcyhlLm9wZW4pP3RoaXMuY29sbGFwc2UoKTp0aGlzLmV4cGFuZCgpfSxoLnByb3RvdHlwZS5leHBhbmQ9ZnVuY3Rpb24oKXt0aGlzLm9wdGlvbnMuc2xpZGU/YShlLnNpZGViYXIpLmFkZENsYXNzKGYub3Blbik6YShcImJvZHlcIikuYWRkQ2xhc3MoZi5vcGVuKSxhKHRoaXMuZWxlbWVudCkudHJpZ2dlcihhLkV2ZW50KGcuZXhwYW5kZWQpKX0saC5wcm90b3R5cGUuY29sbGFwc2U9ZnVuY3Rpb24oKXthKFwiYm9keSwgXCIrZS5zaWRlYmFyKS5yZW1vdmVDbGFzcyhmLm9wZW4pLGEodGhpcy5lbGVtZW50KS50cmlnZ2VyKGEuRXZlbnQoZy5jb2xsYXBzZWQpKX0saC5wcm90b3R5cGUuZml4PWZ1bmN0aW9uKCl7YShcImJvZHlcIikuaXMoZS5ib3hlZCkmJnRoaXMuX2ZpeEZvckJveGVkKGEoZS5iZykpfSxoLnByb3RvdHlwZS5fZml4Rm9yQm94ZWQ9ZnVuY3Rpb24oYil7Yi5jc3Moe3Bvc2l0aW9uOlwiYWJzb2x1dGVcIixoZWlnaHQ6YShlLndyYXBwZXIpLmhlaWdodCgpfSl9O3ZhciBpPWEuZm4uY29udHJvbFNpZGViYXI7YS5mbi5jb250cm9sU2lkZWJhcj1iLGEuZm4uY29udHJvbFNpZGViYXIuQ29uc3RydWN0b3I9aCxhLmZuLmNvbnRyb2xTaWRlYmFyLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5jb250cm9sU2lkZWJhcj1pLHRoaXN9LGEoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIixlLmRhdGEsZnVuY3Rpb24oYyl7YyYmYy5wcmV2ZW50RGVmYXVsdCgpLGIuY2FsbChhKHRoaXMpLFwidG9nZ2xlXCIpfSl9KGpRdWVyeSksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9YSh0aGlzKSxmPWUuZGF0YShjKTtpZighZil7dmFyIGc9YS5leHRlbmQoe30sZCxlLmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgYiYmYik7ZS5kYXRhKGMsZj1uZXcgaChlLGcpKX1pZihcInN0cmluZ1wiPT10eXBlb2YgYil7aWYodm9pZCAwPT09ZltiXSl0aHJvdyBuZXcgRXJyb3IoXCJObyBtZXRob2QgbmFtZWQgXCIrYik7ZltiXSgpfX0pfXZhciBjPVwibHRlLmJveHdpZGdldFwiLGQ9e2FuaW1hdGlvblNwZWVkOjUwMCxjb2xsYXBzZVRyaWdnZXI6J1tkYXRhLXdpZGdldD1cImNvbGxhcHNlXCJdJyxyZW1vdmVUcmlnZ2VyOidbZGF0YS13aWRnZXQ9XCJyZW1vdmVcIl0nLGNvbGxhcHNlSWNvbjpcImZhLW1pbnVzXCIsZXhwYW5kSWNvbjpcImZhLXBsdXNcIixyZW1vdmVJY29uOlwiZmEtdGltZXNcIn0sZT17ZGF0YTpcIi5ib3hcIixjb2xsYXBzZWQ6XCIuY29sbGFwc2VkLWJveFwiLGJvZHk6XCIuYm94LWJvZHlcIixmb290ZXI6XCIuYm94LWZvb3RlclwiLHRvb2xzOlwiLmJveC10b29sc1wifSxmPXtjb2xsYXBzZWQ6XCJjb2xsYXBzZWQtYm94XCJ9LGc9e2NvbGxhcHNlZDpcImNvbGxhcHNlZC5ib3h3aWRnZXRcIixleHBhbmRlZDpcImV4cGFuZGVkLmJveHdpZGdldFwiLHJlbW92ZWQ6XCJyZW1vdmVkLmJveHdpZGdldFwifSxoPWZ1bmN0aW9uKGEsYil7dGhpcy5lbGVtZW50PWEsdGhpcy5vcHRpb25zPWIsdGhpcy5fc2V0VXBMaXN0ZW5lcnMoKX07aC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7YSh0aGlzLmVsZW1lbnQpLmlzKGUuY29sbGFwc2VkKT90aGlzLmV4cGFuZCgpOnRoaXMuY29sbGFwc2UoKX0saC5wcm90b3R5cGUuZXhwYW5kPWZ1bmN0aW9uKCl7dmFyIGI9YS5FdmVudChnLmV4cGFuZGVkKSxjPXRoaXMub3B0aW9ucy5jb2xsYXBzZUljb24sZD10aGlzLm9wdGlvbnMuZXhwYW5kSWNvbjthKHRoaXMuZWxlbWVudCkucmVtb3ZlQ2xhc3MoZi5jb2xsYXBzZWQpLGEodGhpcy5lbGVtZW50KS5maW5kKGUudG9vbHMpLmZpbmQoXCIuXCIrZCkucmVtb3ZlQ2xhc3MoZCkuYWRkQ2xhc3MoYyksYSh0aGlzLmVsZW1lbnQpLmZpbmQoZS5ib2R5K1wiLCBcIitlLmZvb3Rlcikuc2xpZGVEb3duKHRoaXMub3B0aW9ucy5hbmltYXRpb25TcGVlZCxmdW5jdGlvbigpe2EodGhpcy5lbGVtZW50KS50cmlnZ2VyKGIpfS5iaW5kKHRoaXMpKX0saC5wcm90b3R5cGUuY29sbGFwc2U9ZnVuY3Rpb24oKXt2YXIgYj1hLkV2ZW50KGcuY29sbGFwc2VkKSxjPXRoaXMub3B0aW9ucy5jb2xsYXBzZUljb24sZD10aGlzLm9wdGlvbnMuZXhwYW5kSWNvbjthKHRoaXMuZWxlbWVudCkuZmluZChlLnRvb2xzKS5maW5kKFwiLlwiK2MpLnJlbW92ZUNsYXNzKGMpLmFkZENsYXNzKGQpLGEodGhpcy5lbGVtZW50KS5maW5kKGUuYm9keStcIiwgXCIrZS5mb290ZXIpLnNsaWRlVXAodGhpcy5vcHRpb25zLmFuaW1hdGlvblNwZWVkLGZ1bmN0aW9uKCl7YSh0aGlzLmVsZW1lbnQpLmFkZENsYXNzKGYuY29sbGFwc2VkKSxhKHRoaXMuZWxlbWVudCkudHJpZ2dlcihiKX0uYmluZCh0aGlzKSl9LGgucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbigpe3ZhciBiPWEuRXZlbnQoZy5yZW1vdmVkKTthKHRoaXMuZWxlbWVudCkuc2xpZGVVcCh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uU3BlZWQsZnVuY3Rpb24oKXthKHRoaXMuZWxlbWVudCkudHJpZ2dlcihiKSxhKHRoaXMuZWxlbWVudCkucmVtb3ZlKCl9LmJpbmQodGhpcykpfSxoLnByb3RvdHlwZS5fc2V0VXBMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2EodGhpcy5lbGVtZW50KS5vbihcImNsaWNrXCIsdGhpcy5vcHRpb25zLmNvbGxhcHNlVHJpZ2dlcixmdW5jdGlvbihhKXthJiZhLnByZXZlbnREZWZhdWx0KCksYi50b2dnbGUoKX0pLGEodGhpcy5lbGVtZW50KS5vbihcImNsaWNrXCIsdGhpcy5vcHRpb25zLnJlbW92ZVRyaWdnZXIsZnVuY3Rpb24oYSl7YSYmYS5wcmV2ZW50RGVmYXVsdCgpLGIucmVtb3ZlKCl9KX07dmFyIGk9YS5mbi5ib3hXaWRnZXQ7YS5mbi5ib3hXaWRnZXQ9YixhLmZuLmJveFdpZGdldC5Db25zdHJ1Y3Rvcj1oLGEuZm4uYm94V2lkZ2V0Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5ib3hXaWRnZXQ9aSx0aGlzfSxhKHdpbmRvdykub24oXCJsb2FkXCIsZnVuY3Rpb24oKXthKGUuZGF0YSkuZWFjaChmdW5jdGlvbigpe2IuY2FsbChhKHRoaXMpKX0pfSl9KGpRdWVyeSksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9YSh0aGlzKSxmPWUuZGF0YShjKTtpZighZil7dmFyIGg9YS5leHRlbmQoe30sZCxlLmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgYiYmYik7ZS5kYXRhKGMsZj1uZXcgZyhlLGgpKX1pZihcInN0cmluZ1wiPT10eXBlb2YgZil7aWYodm9pZCAwPT09ZltiXSl0aHJvdyBuZXcgRXJyb3IoXCJObyBtZXRob2QgbmFtZWQgXCIrYik7ZltiXSgpfX0pfXZhciBjPVwibHRlLnRvZG9saXN0XCIsZD17aUNoZWNrOiExLG9uQ2hlY2s6ZnVuY3Rpb24oKXt9LG9uVW5DaGVjazpmdW5jdGlvbigpe319LGU9e2RhdGE6J1tkYXRhLXdpZGdldD1cInRvZG8tbGlzdFwiXSd9LGY9e2RvbmU6XCJkb25lXCJ9LGc9ZnVuY3Rpb24oYSxiKXt0aGlzLmVsZW1lbnQ9YSx0aGlzLm9wdGlvbnM9Yix0aGlzLl9zZXRVcExpc3RlbmVycygpfTtnLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oYSl7aWYoYS5wYXJlbnRzKGUubGkpLmZpcnN0KCkudG9nZ2xlQ2xhc3MoZi5kb25lKSwhYS5wcm9wKFwiY2hlY2tlZFwiKSlyZXR1cm4gdm9pZCB0aGlzLnVuQ2hlY2soYSk7dGhpcy5jaGVjayhhKX0sZy5wcm90b3R5cGUuY2hlY2s9ZnVuY3Rpb24oYSl7dGhpcy5vcHRpb25zLm9uQ2hlY2suY2FsbChhKX0sZy5wcm90b3R5cGUudW5DaGVjaz1mdW5jdGlvbihhKXt0aGlzLm9wdGlvbnMub25VbkNoZWNrLmNhbGwoYSl9LGcucHJvdG90eXBlLl9zZXRVcExpc3RlbmVycz1mdW5jdGlvbigpe3ZhciBiPXRoaXM7YSh0aGlzLmVsZW1lbnQpLm9uKFwiY2hhbmdlIGlmQ2hhbmdlZFwiLFwiaW5wdXQ6Y2hlY2tib3hcIixmdW5jdGlvbigpe2IudG9nZ2xlKGEodGhpcykpfSl9O3ZhciBoPWEuZm4udG9kb0xpc3Q7YS5mbi50b2RvTGlzdD1iLGEuZm4udG9kb0xpc3QuQ29uc3RydWN0b3I9ZyxhLmZuLnRvZG9MaXN0Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi50b2RvTGlzdD1oLHRoaXN9LGEod2luZG93KS5vbihcImxvYWRcIixmdW5jdGlvbigpe2EoZS5kYXRhKS5lYWNoKGZ1bmN0aW9uKCl7Yi5jYWxsKGEodGhpcykpfSl9KX0oalF1ZXJ5KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZD1hKHRoaXMpLGU9ZC5kYXRhKGMpO2V8fGQuZGF0YShjLGU9bmV3IGYoZCkpLFwic3RyaW5nXCI9PXR5cGVvZiBiJiZlLnRvZ2dsZShkKX0pfXZhciBjPVwibHRlLmRpcmVjdGNoYXRcIixkPXtkYXRhOidbZGF0YS13aWRnZXQ9XCJjaGF0LXBhbmUtdG9nZ2xlXCJdJyxib3g6XCIuZGlyZWN0LWNoYXRcIn0sZT17b3BlbjpcImRpcmVjdC1jaGF0LWNvbnRhY3RzLW9wZW5cIn0sZj1mdW5jdGlvbihhKXt0aGlzLmVsZW1lbnQ9YX07Zi5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKGEpe2EucGFyZW50cyhkLmJveCkuZmlyc3QoKS50b2dnbGVDbGFzcyhlLm9wZW4pfTt2YXIgZz1hLmZuLmRpcmVjdENoYXQ7YS5mbi5kaXJlY3RDaGF0PWIsYS5mbi5kaXJlY3RDaGF0LkNvbnN0cnVjdG9yPWYsYS5mbi5kaXJlY3RDaGF0Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5kaXJlY3RDaGF0PWcsdGhpc30sYShkb2N1bWVudCkub24oXCJjbGlja1wiLGQuZGF0YSxmdW5jdGlvbihjKXtjJiZjLnByZXZlbnREZWZhdWx0KCksYi5jYWxsKGEodGhpcyksXCJ0b2dnbGVcIil9KX0oalF1ZXJ5KTsiLCIvKipcclxuKiBAbGljZW5zZSBJbnB1dCBNYXNrIHBsdWdpbiBmb3IganF1ZXJ5XHJcbiogaHR0cDovL2dpdGh1Yi5jb20vUm9iaW5IZXJib3RzL2pxdWVyeS5pbnB1dG1hc2tcclxuKiBDb3B5cmlnaHQgKGMpIDIwMTAgLSAyMDE0IFJvYmluIEhlcmJvdHNcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxyXG4qIFZlcnNpb246IDAuMC4wXHJcbiovXHJcbihmdW5jdGlvbiAoJCkge1xyXG4gICAgaWYgKCQuZm4uaW5wdXRtYXNrID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAvL2hlbHBlciBmdW5jdGlvbnMgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gaXNJbnB1dEV2ZW50U3VwcG9ydGVkKGV2ZW50TmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpLFxyXG4gICAgICAgICAgICBldmVudE5hbWUgPSAnb24nICsgZXZlbnROYW1lLFxyXG4gICAgICAgICAgICBpc1N1cHBvcnRlZCA9IChldmVudE5hbWUgaW4gZWwpO1xyXG4gICAgICAgICAgICBpZiAoIWlzU3VwcG9ydGVkKSB7XHJcbiAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoZXZlbnROYW1lLCAncmV0dXJuOycpO1xyXG4gICAgICAgICAgICAgICAgaXNTdXBwb3J0ZWQgPSB0eXBlb2YgZWxbZXZlbnROYW1lXSA9PSAnZnVuY3Rpb24nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIGlzU3VwcG9ydGVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiByZXNvbHZlQWxpYXMoYWxpYXNTdHIsIG9wdGlvbnMsIG9wdHMpIHtcclxuICAgICAgICAgICAgdmFyIGFsaWFzRGVmaW5pdGlvbiA9IG9wdHMuYWxpYXNlc1thbGlhc1N0cl07XHJcbiAgICAgICAgICAgIGlmIChhbGlhc0RlZmluaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGlmIChhbGlhc0RlZmluaXRpb24uYWxpYXMpIHJlc29sdmVBbGlhcyhhbGlhc0RlZmluaXRpb24uYWxpYXMsIHVuZGVmaW5lZCwgb3B0cyk7IC8vYWxpYXMgaXMgYW5vdGhlciBhbGlhc1xyXG4gICAgICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgb3B0cywgYWxpYXNEZWZpbml0aW9uKTsgIC8vbWVyZ2UgYWxpYXMgZGVmaW5pdGlvbiBpbiB0aGUgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgb3B0cywgb3B0aW9ucyk7ICAvL3JlYXBwbHkgZXh0cmEgZ2l2ZW4gb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZU1hc2tTZXRzKG9wdHMpIHtcclxuICAgICAgICAgICAgdmFyIG1zID0gW107XHJcbiAgICAgICAgICAgIHZhciBnZW5tYXNrcyA9IFtdOyAvL3VzZWQgdG8ga2VlcCB0cmFjayBvZiB0aGUgbWFza3MgdGhhdCB3aGVyZSBwcm9jZXNzZWQsIHRvIGF2b2lkIGR1cGxpY2F0ZXNcclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TWFza1RlbXBsYXRlKG1hc2spIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLm51bWVyaWNJbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hc2sgPSBtYXNrLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZXNjYXBlZCA9IGZhbHNlLCBvdXRDb3VudCA9IDAsIGdyZWVkeSA9IG9wdHMuZ3JlZWR5LCByZXBlYXQgPSBvcHRzLnJlcGVhdDtcclxuICAgICAgICAgICAgICAgIGlmIChyZXBlYXQgPT0gXCIqXCIpIGdyZWVkeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgLy9pZiAoZ3JlZWR5ID09IHRydWUgJiYgb3B0cy5wbGFjZWhvbGRlciA9PSBcIlwiKSBvcHRzLnBsYWNlaG9sZGVyID0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAobWFzay5sZW5ndGggPT0gMSAmJiBncmVlZHkgPT0gZmFsc2UgJiYgcmVwZWF0ICE9IDApIHsgb3B0cy5wbGFjZWhvbGRlciA9IFwiXCI7IH0gLy9oaWRlIHBsYWNlaG9sZGVyIHdpdGggc2luZ2xlIG5vbi1ncmVlZHkgbWFza1xyXG4gICAgICAgICAgICAgICAgdmFyIHNpbmdsZU1hc2sgPSAkLm1hcChtYXNrLnNwbGl0KFwiXCIpLCBmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb3V0RWxlbSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50ID09IG9wdHMuZXNjYXBlQ2hhcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlc2NhcGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKGVsZW1lbnQgIT0gb3B0cy5vcHRpb25hbG1hcmtlci5zdGFydCAmJiBlbGVtZW50ICE9IG9wdHMub3B0aW9uYWxtYXJrZXIuZW5kKSB8fCBlc2NhcGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXNrZGVmID0gb3B0cy5kZWZpbml0aW9uc1tlbGVtZW50XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hc2tkZWYgJiYgIWVzY2FwZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFza2RlZi5jYXJkaW5hbGl0eTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0RWxlbS5wdXNoKG9wdHMucGxhY2Vob2xkZXIuY2hhckF0KChvdXRDb3VudCArIGkpICUgb3B0cy5wbGFjZWhvbGRlci5sZW5ndGgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dEVsZW0ucHVzaChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVzY2FwZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRDb3VudCArPSBvdXRFbGVtLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dEVsZW07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9hbGxvY2F0ZSByZXBldGl0aW9uc1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlcGVhdGVkTWFzayA9IHNpbmdsZU1hc2suc2xpY2UoKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgcmVwZWF0ICYmIGdyZWVkeTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVwZWF0ZWRNYXNrID0gcmVwZWF0ZWRNYXNrLmNvbmNhdChzaW5nbGVNYXNrLnNsaWNlKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB7IFwibWFza1wiOiByZXBlYXRlZE1hc2ssIFwicmVwZWF0XCI6IHJlcGVhdCwgXCJncmVlZHlcIjogZ3JlZWR5IH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy90ZXN0IGRlZmluaXRpb24gPT4ge2ZuOiBSZWdFeHAvZnVuY3Rpb24sIGNhcmRpbmFsaXR5OiBpbnQsIG9wdGlvbmFsaXR5OiBib29sLCBuZXdCbG9ja01hcmtlcjogYm9vbCwgb2Zmc2V0OiBpbnQsIGNhc2luZzogbnVsbC91cHBlci9sb3dlciwgZGVmOiBkZWZpbml0aW9uU3ltYm9sfVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRUZXN0aW5nQ2hhaW4obWFzaykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMubnVtZXJpY0lucHV0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFzayA9IG1hc2suc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBpc09wdGlvbmFsID0gZmFsc2UsIGVzY2FwZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdCbG9ja01hcmtlciA9IGZhbHNlOyAvL2luZGljYXRlcyB3aGV0ZXIgdGhlIGJlZ2luL2VuZGluZyBvZiBhIGJsb2NrIHNob3VsZCBiZSBpbmRpY2F0ZWRcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJC5tYXAobWFzay5zcGxpdChcIlwiKSwgZnVuY3Rpb24gKGVsZW1lbnQsIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG91dEVsZW0gPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgPT0gb3B0cy5lc2NhcGVDaGFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVzY2FwZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudCA9PSBvcHRzLm9wdGlvbmFsbWFya2VyLnN0YXJ0ICYmICFlc2NhcGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzT3B0aW9uYWwgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdCbG9ja01hcmtlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVsZW1lbnQgPT0gb3B0cy5vcHRpb25hbG1hcmtlci5lbmQgJiYgIWVzY2FwZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNPcHRpb25hbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdCbG9ja01hcmtlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWFza2RlZiA9IG9wdHMuZGVmaW5pdGlvbnNbZWxlbWVudF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXNrZGVmICYmICFlc2NhcGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJldmFsaWRhdG9ycyA9IG1hc2tkZWZbXCJwcmV2YWxpZGF0b3JcIl0sIHByZXZhbGlkYXRvcnNMID0gcHJldmFsaWRhdG9ycyA/IHByZXZhbGlkYXRvcnMubGVuZ3RoIDogMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbWFza2RlZi5jYXJkaW5hbGl0eTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZhbGlkYXRvciA9IHByZXZhbGlkYXRvcnNMID49IGkgPyBwcmV2YWxpZGF0b3JzW2kgLSAxXSA6IFtdLCB2YWxpZGF0b3IgPSBwcmV2YWxpZGF0b3JbXCJ2YWxpZGF0b3JcIl0sIGNhcmRpbmFsaXR5ID0gcHJldmFsaWRhdG9yW1wiY2FyZGluYWxpdHlcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0RWxlbS5wdXNoKHsgZm46IHZhbGlkYXRvciA/IHR5cGVvZiB2YWxpZGF0b3IgPT0gJ3N0cmluZycgPyBuZXcgUmVnRXhwKHZhbGlkYXRvcikgOiBuZXcgZnVuY3Rpb24gKCkgeyB0aGlzLnRlc3QgPSB2YWxpZGF0b3I7IH0gOiBuZXcgUmVnRXhwKFwiLlwiKSwgY2FyZGluYWxpdHk6IGNhcmRpbmFsaXR5ID8gY2FyZGluYWxpdHkgOiAxLCBvcHRpb25hbGl0eTogaXNPcHRpb25hbCwgbmV3QmxvY2tNYXJrZXI6IGlzT3B0aW9uYWwgPT0gdHJ1ZSA/IG5ld0Jsb2NrTWFya2VyIDogZmFsc2UsIG9mZnNldDogMCwgY2FzaW5nOiBtYXNrZGVmW1wiY2FzaW5nXCJdLCBkZWY6IG1hc2tkZWZbXCJkZWZpbml0aW9uU3ltYm9sXCJdIHx8IGVsZW1lbnQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzT3B0aW9uYWwgPT0gdHJ1ZSkgLy9yZXNldCBuZXdCbG9ja01hcmtlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdCbG9ja01hcmtlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0RWxlbS5wdXNoKHsgZm46IG1hc2tkZWYudmFsaWRhdG9yID8gdHlwZW9mIG1hc2tkZWYudmFsaWRhdG9yID09ICdzdHJpbmcnID8gbmV3IFJlZ0V4cChtYXNrZGVmLnZhbGlkYXRvcikgOiBuZXcgZnVuY3Rpb24gKCkgeyB0aGlzLnRlc3QgPSBtYXNrZGVmLnZhbGlkYXRvcjsgfSA6IG5ldyBSZWdFeHAoXCIuXCIpLCBjYXJkaW5hbGl0eTogbWFza2RlZi5jYXJkaW5hbGl0eSwgb3B0aW9uYWxpdHk6IGlzT3B0aW9uYWwsIG5ld0Jsb2NrTWFya2VyOiBuZXdCbG9ja01hcmtlciwgb2Zmc2V0OiAwLCBjYXNpbmc6IG1hc2tkZWZbXCJjYXNpbmdcIl0sIGRlZjogbWFza2RlZltcImRlZmluaXRpb25TeW1ib2xcIl0gfHwgZWxlbWVudCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dEVsZW0ucHVzaCh7IGZuOiBudWxsLCBjYXJkaW5hbGl0eTogMCwgb3B0aW9uYWxpdHk6IGlzT3B0aW9uYWwsIG5ld0Jsb2NrTWFya2VyOiBuZXdCbG9ja01hcmtlciwgb2Zmc2V0OiAwLCBjYXNpbmc6IG51bGwsIGRlZjogZWxlbWVudCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVzY2FwZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3Jlc2V0IG5ld0Jsb2NrTWFya2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Jsb2NrTWFya2VyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvdXRFbGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG1hcmtPcHRpb25hbChtYXNrUGFydCkgeyAvL25lZWRlZCBmb3IgdGhlIGNsZWFyT3B0aW9uYWxUYWlsIGZ1bmN0aW9uYWxpdHlcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcHRzLm9wdGlvbmFsbWFya2VyLnN0YXJ0ICsgbWFza1BhcnQgKyBvcHRzLm9wdGlvbmFsbWFya2VyLmVuZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzcGxpdEZpcnN0T3B0aW9uYWxFbmRQYXJ0KG1hc2tQYXJ0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9uYWxTdGFydE1hcmtlcnMgPSAwLCBvcHRpb25hbEVuZE1hcmtlcnMgPSAwLCBtcGwgPSBtYXNrUGFydC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1wbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hc2tQYXJ0LmNoYXJBdChpKSA9PSBvcHRzLm9wdGlvbmFsbWFya2VyLnN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbmFsU3RhcnRNYXJrZXJzKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXNrUGFydC5jaGFyQXQoaSkgPT0gb3B0cy5vcHRpb25hbG1hcmtlci5lbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uYWxFbmRNYXJrZXJzKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25hbFN0YXJ0TWFya2VycyA+IDAgJiYgb3B0aW9uYWxTdGFydE1hcmtlcnMgPT0gb3B0aW9uYWxFbmRNYXJrZXJzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBtYXNrUGFydHMgPSBbbWFza1BhcnQuc3Vic3RyaW5nKDAsIGkpXTtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgbXBsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFza1BhcnRzLnB1c2gobWFza1BhcnQuc3Vic3RyaW5nKGkgKyAxLCBtcGwpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBtYXNrUGFydHM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gc3BsaXRGaXJzdE9wdGlvbmFsU3RhcnRQYXJ0KG1hc2tQYXJ0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbXBsID0gbWFza1BhcnQubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtcGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXNrUGFydC5jaGFyQXQoaSkgPT0gb3B0cy5vcHRpb25hbG1hcmtlci5zdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgbWFza1BhcnRzID0gW21hc2tQYXJ0LnN1YnN0cmluZygwLCBpKV07XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IG1wbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hc2tQYXJ0cy5wdXNoKG1hc2tQYXJ0LnN1YnN0cmluZyhpICsgMSwgbXBsKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFza1BhcnRzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlTWFzayhtYXNrUHJlZml4LCBtYXNrUGFydCwgbWV0YWRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtYXNrUGFydHMgPSBzcGxpdEZpcnN0T3B0aW9uYWxFbmRQYXJ0KG1hc2tQYXJ0KTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdNYXNrLCBtYXNrVGVtcGxhdGU7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hc2tzID0gc3BsaXRGaXJzdE9wdGlvbmFsU3RhcnRQYXJ0KG1hc2tQYXJ0c1swXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAobWFza3MubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld01hc2sgPSBtYXNrUHJlZml4ICsgbWFza3NbMF0gKyBtYXJrT3B0aW9uYWwobWFza3NbMV0pICsgKG1hc2tQYXJ0cy5sZW5ndGggPiAxID8gbWFza1BhcnRzWzFdIDogXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShuZXdNYXNrLCBnZW5tYXNrcykgPT0gLTEgJiYgbmV3TWFzayAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbm1hc2tzLnB1c2gobmV3TWFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hc2tUZW1wbGF0ZSA9IGdldE1hc2tUZW1wbGF0ZShuZXdNYXNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1hc2tcIjogbmV3TWFzayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2J1ZmZlclwiOiBtYXNrVGVtcGxhdGVbXCJtYXNrXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJidWZmZXJcIjogbWFza1RlbXBsYXRlW1wibWFza1wiXS5zbGljZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXN0c1wiOiBnZXRUZXN0aW5nQ2hhaW4obmV3TWFzayksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImxhc3RWYWxpZFBvc2l0aW9uXCI6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJncmVlZHlcIjogbWFza1RlbXBsYXRlW1wiZ3JlZWR5XCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXBlYXRcIjogbWFza1RlbXBsYXRlW1wicmVwZWF0XCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtZXRhZGF0YVwiOiBtZXRhZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3TWFzayA9IG1hc2tQcmVmaXggKyBtYXNrc1swXSArIChtYXNrUGFydHMubGVuZ3RoID4gMSA/IG1hc2tQYXJ0c1sxXSA6IFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkobmV3TWFzaywgZ2VubWFza3MpID09IC0xICYmIG5ld01hc2sgIT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5tYXNrcy5wdXNoKG5ld01hc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXNrVGVtcGxhdGUgPSBnZXRNYXNrVGVtcGxhdGUobmV3TWFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtYXNrXCI6IG5ld01hc2ssXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIl9idWZmZXJcIjogbWFza1RlbXBsYXRlW1wibWFza1wiXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYnVmZmVyXCI6IG1hc2tUZW1wbGF0ZVtcIm1hc2tcIl0uc2xpY2UoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGVzdHNcIjogZ2V0VGVzdGluZ0NoYWluKG5ld01hc2spLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsYXN0VmFsaWRQb3NpdGlvblwiOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ3JlZWR5XCI6IG1hc2tUZW1wbGF0ZVtcImdyZWVkeVwiXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVwZWF0XCI6IG1hc2tUZW1wbGF0ZVtcInJlcGVhdFwiXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWV0YWRhdGFcIjogbWV0YWRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcGxpdEZpcnN0T3B0aW9uYWxTdGFydFBhcnQobWFza3NbMV0pLmxlbmd0aCA+IDEpIHsgLy9vcHRpb25hbCBjb250YWlucyBhbm90aGVyIG9wdGlvbmFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlTWFzayhtYXNrUHJlZml4ICsgbWFza3NbMF0sIG1hc2tzWzFdICsgbWFza1BhcnRzWzFdLCBtZXRhZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXNrUGFydHMubGVuZ3RoID4gMSAmJiBzcGxpdEZpcnN0T3B0aW9uYWxTdGFydFBhcnQobWFza1BhcnRzWzFdKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlTWFzayhtYXNrUHJlZml4ICsgbWFza3NbMF0gKyBtYXJrT3B0aW9uYWwobWFza3NbMV0pLCBtYXNrUGFydHNbMV0sIG1ldGFkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVNYXNrKG1hc2tQcmVmaXggKyBtYXNrc1swXSwgbWFza1BhcnRzWzFdLCBtZXRhZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3TWFzayA9IG1hc2tQcmVmaXggKyBtYXNrUGFydHM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShuZXdNYXNrLCBnZW5tYXNrcykgPT0gLTEgJiYgbmV3TWFzayAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbm1hc2tzLnB1c2gobmV3TWFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hc2tUZW1wbGF0ZSA9IGdldE1hc2tUZW1wbGF0ZShuZXdNYXNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1hc2tcIjogbmV3TWFzayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2J1ZmZlclwiOiBtYXNrVGVtcGxhdGVbXCJtYXNrXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJidWZmZXJcIjogbWFza1RlbXBsYXRlW1wibWFza1wiXS5zbGljZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXN0c1wiOiBnZXRUZXN0aW5nQ2hhaW4obmV3TWFzayksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImxhc3RWYWxpZFBvc2l0aW9uXCI6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJncmVlZHlcIjogbWFza1RlbXBsYXRlW1wiZ3JlZWR5XCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXBlYXRcIjogbWFza1RlbXBsYXRlW1wicmVwZWF0XCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtZXRhZGF0YVwiOiBtZXRhZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdHMubWFzaykpIHsgLy9hbGxvdyBtYXNrIHRvIGJlIGEgcHJlcHJvY2Vzc2luZyBmbiAtIHNob3VsZCByZXR1cm4gYSB2YWxpZCBtYXNrXHJcbiAgICAgICAgICAgICAgICBvcHRzLm1hc2sgPSBvcHRzLm1hc2suY2FsbCh0aGlzLCBvcHRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoJC5pc0FycmF5KG9wdHMubWFzaykpIHtcclxuICAgICAgICAgICAgICAgICQuZWFjaChvcHRzLm1hc2ssIGZ1bmN0aW9uIChuZHgsIG1zaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtc2tbXCJtYXNrXCJdICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZU1hc2soXCJcIiwgbXNrW1wibWFza1wiXS50b1N0cmluZygpLCBtc2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZU1hc2soXCJcIiwgbXNrLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBnZW5lcmF0ZU1hc2soXCJcIiwgb3B0cy5tYXNrLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG9wdHMuZ3JlZWR5ID8gbXMgOiBtcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhW1wibWFza1wiXS5sZW5ndGggLSBiW1wibWFza1wiXS5sZW5ndGg7IH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG1zaWUxMCA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cChcIm1zaWUgMTBcIiwgXCJpXCIpKSAhPT0gbnVsbCxcclxuICAgICAgICAgICAgaXBob25lID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKFwiaXBob25lXCIsIFwiaVwiKSkgIT09IG51bGwsXHJcbiAgICAgICAgICAgIGFuZHJvaWQgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoXCJhbmRyb2lkLipzYWZhcmkuKlwiLCBcImlcIikpICE9PSBudWxsLFxyXG4gICAgICAgICAgICBhbmRyb2lkY2hyb21lID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKFwiYW5kcm9pZC4qY2hyb21lLipcIiwgXCJpXCIpKSAhPT0gbnVsbCxcclxuICAgICAgICAgICAgcGFzdGVFdmVudCA9IGlzSW5wdXRFdmVudFN1cHBvcnRlZCgncGFzdGUnKSA/ICdwYXN0ZScgOiBpc0lucHV0RXZlbnRTdXBwb3J0ZWQoJ2lucHV0JykgPyAnaW5wdXQnIDogXCJwcm9wZXJ0eWNoYW5nZVwiO1xyXG5cclxuXHJcbiAgICAgICAgLy9tYXNraW5nIHNjb3BlXHJcbiAgICAgICAgLy9hY3Rpb25PYmogZGVmaW5pdGlvbiBzZWUgYmVsb3dcclxuICAgICAgICBmdW5jdGlvbiBtYXNrU2NvcGUobWFza3NldHMsIGFjdGl2ZU1hc2tzZXRJbmRleCwgb3B0cywgYWN0aW9uT2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBpc1JUTCA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdmFsdWVPbkZvY3VzID0gZ2V0QWN0aXZlQnVmZmVyKCkuam9pbignJyksXHJcbiAgICAgICAgICAgICAgICAkZWwsIGNocm9tZVZhbHVlT25JbnB1dCxcclxuICAgICAgICAgICAgICAgIHNraXBLZXlQcmVzc0V2ZW50ID0gZmFsc2UsIC8vU2FmYXJpIDUuMS54IC0gbW9kYWwgZGlhbG9nIGZpcmVzIGtleXByZXNzIHR3aWNlIHdvcmthcm91bmRcclxuICAgICAgICAgICAgICAgIHNraXBJbnB1dEV2ZW50ID0gZmFsc2UsIC8vc2tpcCB3aGVuIHRyaWdnZXJlZCBmcm9tIHdpdGhpbiBpbnB1dG1hc2tcclxuICAgICAgICAgICAgICAgIGlnbm9yYWJsZSA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vbWFza3NldCBoZWxwZXJmdW5jdGlvbnNcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldEFjdGl2ZU1hc2tTZXQoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFza3NldHNbYWN0aXZlTWFza3NldEluZGV4XTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0QWN0aXZlVGVzdHMoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0QWN0aXZlTWFza1NldCgpWyd0ZXN0cyddO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRBY3RpdmVCdWZmZXJUZW1wbGF0ZSgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRBY3RpdmVNYXNrU2V0KClbJ19idWZmZXInXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0QWN0aXZlQnVmZmVyKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEFjdGl2ZU1hc2tTZXQoKVsnYnVmZmVyJ107XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGlzVmFsaWQocG9zLCBjLCBzdHJpY3QpIHsgLy9zdHJpY3QgdHJ1ZSB+IG5vIGNvcnJlY3Rpb24gb3IgYXV0b2ZpbGxcclxuICAgICAgICAgICAgICAgIHN0cmljdCA9IHN0cmljdCA9PT0gdHJ1ZTsgLy9hbHdheXMgc2V0IGEgdmFsdWUgdG8gc3RyaWN0IHRvIHByZXZlbnQgcG9zc2libGUgc3RyYW5nZSBiZWhhdmlvciBpbiB0aGUgZXh0ZW5zaW9ucyBcclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBfaXNWYWxpZChwb3NpdGlvbiwgYWN0aXZlTWFza3NldCwgYywgc3RyaWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3RQb3MgPSBkZXRlcm1pbmVUZXN0UG9zaXRpb24ocG9zaXRpb24pLCBsb29wZW5kID0gYyA/IDEgOiAwLCBjaHJzID0gJycsIGJ1ZmZlciA9IGFjdGl2ZU1hc2tzZXRbXCJidWZmZXJcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGFjdGl2ZU1hc2tzZXRbJ3Rlc3RzJ11bdGVzdFBvc10uY2FyZGluYWxpdHk7IGkgPiBsb29wZW5kOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hycyArPSBnZXRCdWZmZXJFbGVtZW50KGJ1ZmZlciwgdGVzdFBvcyAtIChpIC0gMSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hycyArPSBjO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gaXMgZmFsc2Ugb3IgYSBqc29uIG9iamVjdCA9PiB7IHBvczogPz8sIGM6ID8/fSBvciB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjdGl2ZU1hc2tzZXRbJ3Rlc3RzJ11bdGVzdFBvc10uZm4gIT0gbnVsbCA/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZU1hc2tzZXRbJ3Rlc3RzJ11bdGVzdFBvc10uZm4udGVzdChjaHJzLCBidWZmZXIsIHBvc2l0aW9uLCBzdHJpY3QsIG9wdHMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogKGMgPT0gZ2V0QnVmZmVyRWxlbWVudChhY3RpdmVNYXNrc2V0WydfYnVmZmVyJ10sIHBvc2l0aW9uLCB0cnVlKSB8fCBjID09IG9wdHMuc2tpcE9wdGlvbmFsUGFydENoYXJhY3RlcikgP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBcInJlZnJlc2hcIjogdHJ1ZSwgYzogZ2V0QnVmZmVyRWxlbWVudChhY3RpdmVNYXNrc2V0WydfYnVmZmVyJ10sIHBvc2l0aW9uLCB0cnVlKSwgcG9zOiBwb3NpdGlvbiB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIFBvc3RQcm9jZXNzUmVzdWx0cyhtYXNrRm9yd2FyZHMsIHJlc3VsdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaGFzVmFsaWRBY3R1YWwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAkLmVhY2gocmVzdWx0cywgZnVuY3Rpb24gKG5keCwgcnNsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNWYWxpZEFjdHVhbCA9ICQuaW5BcnJheShyc2x0W1wiYWN0aXZlTWFza3NldEluZGV4XCJdLCBtYXNrRm9yd2FyZHMpID09IC0xICYmIHJzbHRbXCJyZXN1bHRcIl0gIT09IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzVmFsaWRBY3R1YWwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzVmFsaWRBY3R1YWwpIHsgLy9zdHJpcCBtYXNrZm9yd2FyZHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9ICQubWFwKHJlc3VsdHMsIGZ1bmN0aW9uIChyc2x0LCBuZHgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkocnNsdFtcImFjdGl2ZU1hc2tzZXRJbmRleFwiXSwgbWFza0ZvcndhcmRzKSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByc2x0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXNrc2V0c1tyc2x0W1wiYWN0aXZlTWFza3NldEluZGV4XCJdXVtcImxhc3RWYWxpZFBvc2l0aW9uXCJdID0gYWN0dWFsTFZQO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgeyAvL2tlZXAgbWFza2ZvcndhcmRzIHdpdGggdGhlIGxlYXN0IGZvcndhcmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxvd2VzdFBvcyA9IC0xLCBsb3dlc3RJbmRleCA9IC0xLCByc2x0VmFsaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChyZXN1bHRzLCBmdW5jdGlvbiAobmR4LCByc2x0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KHJzbHRbXCJhY3RpdmVNYXNrc2V0SW5kZXhcIl0sIG1hc2tGb3J3YXJkcykgIT0gLTEgJiYgcnNsdFtcInJlc3VsdFwiXSAhPT0gZmFsc2UgJiAobG93ZXN0UG9zID09IC0xIHx8IGxvd2VzdFBvcyA+IHJzbHRbXCJyZXN1bHRcIl1bXCJwb3NcIl0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG93ZXN0UG9zID0gcnNsdFtcInJlc3VsdFwiXVtcInBvc1wiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb3dlc3RJbmRleCA9IHJzbHRbXCJhY3RpdmVNYXNrc2V0SW5kZXhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzID0gJC5tYXAocmVzdWx0cywgZnVuY3Rpb24gKHJzbHQsIG5keCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShyc2x0W1wiYWN0aXZlTWFza3NldEluZGV4XCJdLCBtYXNrRm9yd2FyZHMpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJzbHRbXCJyZXN1bHRcIl1bXCJwb3NcIl0gPT0gbG93ZXN0UG9zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByc2x0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocnNsdFtcInJlc3VsdFwiXSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHBvczsgaSA8IGxvd2VzdFBvczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByc2x0VmFsaWQgPSBfaXNWYWxpZChpLCBtYXNrc2V0c1tyc2x0W1wiYWN0aXZlTWFza3NldEluZGV4XCJdXSwgbWFza3NldHNbbG93ZXN0SW5kZXhdW1wiYnVmZmVyXCJdW2ldLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyc2x0VmFsaWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFza3NldHNbcnNsdFtcImFjdGl2ZU1hc2tzZXRJbmRleFwiXV1bXCJsYXN0VmFsaWRQb3NpdGlvblwiXSA9IGxvd2VzdFBvcyAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEJ1ZmZlckVsZW1lbnQobWFza3NldHNbcnNsdFtcImFjdGl2ZU1hc2tzZXRJbmRleFwiXV1bXCJidWZmZXJcIl0sIGksIG1hc2tzZXRzW2xvd2VzdEluZGV4XVtcImJ1ZmZlclwiXVtpXSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFza3NldHNbcnNsdFtcImFjdGl2ZU1hc2tzZXRJbmRleFwiXV1bXCJsYXN0VmFsaWRQb3NpdGlvblwiXSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9hbHNvIGNoZWNrIGNoZWNrIGZvciB0aGUgbG93ZXN0cG9zIHdpdGggdGhlIG5ldyBpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByc2x0VmFsaWQgPSBfaXNWYWxpZChsb3dlc3RQb3MsIG1hc2tzZXRzW3JzbHRbXCJhY3RpdmVNYXNrc2V0SW5kZXhcIl1dLCBjLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJzbHRWYWxpZCAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEJ1ZmZlckVsZW1lbnQobWFza3NldHNbcnNsdFtcImFjdGl2ZU1hc2tzZXRJbmRleFwiXV1bXCJidWZmZXJcIl0sIGxvd2VzdFBvcywgYywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXNrc2V0c1tyc2x0W1wiYWN0aXZlTWFza3NldEluZGV4XCJdXVtcImxhc3RWYWxpZFBvc2l0aW9uXCJdID0gbG93ZXN0UG9zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJuZHggXCIgKyByc2x0W1wiYWN0aXZlTWFza3NldEluZGV4XCJdICsgXCIgdmFsaWRhdGUgXCIgKyBtYXNrc2V0c1tyc2x0W1wiYWN0aXZlTWFza3NldEluZGV4XCJdXVtcImJ1ZmZlclwiXS5qb2luKCcnKSArIFwiIGx2IFwiICsgbWFza3NldHNbcnNsdFtcImFjdGl2ZU1hc2tzZXRJbmRleFwiXV1bJ2xhc3RWYWxpZFBvc2l0aW9uJ10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnNsdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RyaWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IF9pc1ZhbGlkKHBvcywgZ2V0QWN0aXZlTWFza1NldCgpLCBjLCBzdHJpY3QpOyAvL29ubHkgY2hlY2sgdmFsaWRpdHkgaW4gY3VycmVudCBtYXNrIHdoZW4gdmFsaWRhdGluZyBzdHJpY3RcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHsgXCJwb3NcIjogcG9zIH07IC8vYWx3YXlzIHRha2UgYSBwb3NzaWJsZSBjb3JyZWN0ZWQgbWFza3Bvc2l0aW9uIGludG8gYWNjb3VudFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHRzID0gW10sIHJlc3VsdCA9IGZhbHNlLCBjdXJyZW50QWN0aXZlTWFza3NldEluZGV4ID0gYWN0aXZlTWFza3NldEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgIGFjdHVhbEJ1ZmZlciA9IGdldEFjdGl2ZUJ1ZmZlcigpLnNsaWNlKCksIGFjdHVhbExWUCA9IGdldEFjdGl2ZU1hc2tTZXQoKVtcImxhc3RWYWxpZFBvc2l0aW9uXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIGFjdHVhbFByZXZpb3VzID0gc2Vla1ByZXZpb3VzKHBvcyksXHJcbiAgICAgICAgICAgICAgICAgICAgbWFza0ZvcndhcmRzID0gW107XHJcbiAgICAgICAgICAgICAgICAkLmVhY2gobWFza3NldHMsIGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh2YWx1ZSkgPT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVNYXNrc2V0SW5kZXggPSBpbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXNrUG9zID0gcG9zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbHZwID0gZ2V0QWN0aXZlTWFza1NldCgpWydsYXN0VmFsaWRQb3NpdGlvbiddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnNsdFZhbGlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobHZwID09IGFjdHVhbExWUCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChtYXNrUG9zIC0gYWN0dWFsTFZQKSA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gbHZwID09IC0xID8gMCA6IGx2cDsgaSA8IG1hc2tQb3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByc2x0VmFsaWQgPSBfaXNWYWxpZChpLCBnZXRBY3RpdmVNYXNrU2V0KCksIGFjdHVhbEJ1ZmZlcltpXSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyc2x0VmFsaWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEJ1ZmZlckVsZW1lbnQoZ2V0QWN0aXZlQnVmZmVyKCksIGksIGFjdHVhbEJ1ZmZlcltpXSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocnNsdFZhbGlkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcnNsdFZhbGlkID0geyBcInBvc1wiOiBpIH07IC8vYWx3YXlzIHRha2UgYSBwb3NzaWJsZSBjb3JyZWN0ZWQgbWFza3Bvc2l0aW9uIGludG8gYWNjb3VudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1ZhbGlkUG9zaXRpb24gPSByc2x0VmFsaWQucG9zIHx8IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2V0QWN0aXZlTWFza1NldCgpWydsYXN0VmFsaWRQb3NpdGlvbiddIDwgbmV3VmFsaWRQb3NpdGlvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRBY3RpdmVNYXNrU2V0KClbJ2xhc3RWYWxpZFBvc2l0aW9uJ10gPSBuZXdWYWxpZFBvc2l0aW9uOyAvL3NldCBuZXcgcG9zaXRpb24gZnJvbSBpc1ZhbGlkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2RvZXMgdGhlIGlucHV0IG1hdGNoIG9uIGEgZnVydGhlciBwb3NpdGlvbj9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNNYXNrKG1hc2tQb3MpICYmICFfaXNWYWxpZChtYXNrUG9zLCBnZXRBY3RpdmVNYXNrU2V0KCksIGMsIHN0cmljdCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF4Rm9yd2FyZCA9IHNlZWtOZXh0KG1hc2tQb3MpIC0gbWFza1BvcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBmdyA9IDA7IGZ3IDwgbWF4Rm9yd2FyZDsgZncrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2lzVmFsaWQoKyttYXNrUG9zLCBnZXRBY3RpdmVNYXNrU2V0KCksIGMsIHN0cmljdCkgIT09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2tGb3J3YXJkcy5wdXNoKGFjdGl2ZU1hc2tzZXRJbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbWFza2ZvcndhcmQgJyArIGFjdGl2ZU1hc2tzZXRJbmRleCArIFwiIHBvcyBcIiArIHBvcyArIFwiIG1hc2tQb3MgXCIgKyBtYXNrUG9zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdldEFjdGl2ZU1hc2tTZXQoKVsnbGFzdFZhbGlkUG9zaXRpb24nXSA+PSBhY3R1YWxMVlAgfHwgYWN0aXZlTWFza3NldEluZGV4ID09IGN1cnJlbnRBY3RpdmVNYXNrc2V0SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXNrUG9zID49IDAgJiYgbWFza1BvcyA8IGdldE1hc2tMZW5ndGgoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9pc1ZhbGlkKG1hc2tQb3MsIGdldEFjdGl2ZU1hc2tTZXQoKSwgYywgc3RyaWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7IFwicG9zXCI6IG1hc2tQb3MgfTsgLy9hbHdheXMgdGFrZSBhIHBvc3NpYmxlIGNvcnJlY3RlZCBtYXNrcG9zaXRpb24gaW50byBhY2NvdW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1ZhbGlkUG9zaXRpb24gPSByZXN1bHQucG9zIHx8IG1hc2tQb3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnZXRBY3RpdmVNYXNrU2V0KClbJ2xhc3RWYWxpZFBvc2l0aW9uJ10gPCBuZXdWYWxpZFBvc2l0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0QWN0aXZlTWFza1NldCgpWydsYXN0VmFsaWRQb3NpdGlvbiddID0gbmV3VmFsaWRQb3NpdGlvbjsgLy9zZXQgbmV3IHBvc2l0aW9uIGZyb20gaXNWYWxpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwicG9zIFwiICsgcG9zICsgXCIgbmR4IFwiICsgYWN0aXZlTWFza3NldEluZGV4ICsgXCIgdmFsaWRhdGUgXCIgKyBnZXRBY3RpdmVCdWZmZXIoKS5qb2luKCcnKSArIFwiIGx2IFwiICsgZ2V0QWN0aXZlTWFza1NldCgpWydsYXN0VmFsaWRQb3NpdGlvbiddKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goeyBcImFjdGl2ZU1hc2tzZXRJbmRleFwiOiBpbmRleCwgXCJyZXN1bHRcIjogcmVzdWx0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmVNYXNrc2V0SW5kZXggPSBjdXJyZW50QWN0aXZlTWFza3NldEluZGV4OyAvL3Jlc2V0IGFjdGl2ZU1hc2tzZXRJbmRleFxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBQb3N0UHJvY2Vzc1Jlc3VsdHMobWFza0ZvcndhcmRzLCByZXN1bHRzKTsgLy9yZXR1cm4gcmVzdWx0cyBvZiB0aGUgbXVsdGlwbGUgbWFzayB2YWxpZGF0aW9uc1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXRlcm1pbmVBY3RpdmVNYXNrc2V0SW5kZXgoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudE1hc2tzZXRJbmRleCA9IGFjdGl2ZU1hc2tzZXRJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICBoaWdoZXN0VmFsaWQgPSB7IFwiYWN0aXZlTWFza3NldEluZGV4XCI6IDAsIFwibGFzdFZhbGlkUG9zaXRpb25cIjogLTEsIFwibmV4dFwiOiAtMSB9O1xyXG4gICAgICAgICAgICAgICAgJC5lYWNoKG1hc2tzZXRzLCBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodmFsdWUpID09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlTWFza3NldEluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnZXRBY3RpdmVNYXNrU2V0KClbJ2xhc3RWYWxpZFBvc2l0aW9uJ10gPiBoaWdoZXN0VmFsaWRbJ2xhc3RWYWxpZFBvc2l0aW9uJ10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hlc3RWYWxpZFtcImFjdGl2ZU1hc2tzZXRJbmRleFwiXSA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGVzdFZhbGlkW1wibGFzdFZhbGlkUG9zaXRpb25cIl0gPSBnZXRBY3RpdmVNYXNrU2V0KClbJ2xhc3RWYWxpZFBvc2l0aW9uJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdoZXN0VmFsaWRbXCJuZXh0XCJdID0gc2Vla05leHQoZ2V0QWN0aXZlTWFza1NldCgpWydsYXN0VmFsaWRQb3NpdGlvbiddKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChnZXRBY3RpdmVNYXNrU2V0KClbJ2xhc3RWYWxpZFBvc2l0aW9uJ10gPT0gaGlnaGVzdFZhbGlkWydsYXN0VmFsaWRQb3NpdGlvbiddICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoaGlnaGVzdFZhbGlkWyduZXh0J10gPT0gLTEgfHwgaGlnaGVzdFZhbGlkWyduZXh0J10gPiBzZWVrTmV4dChnZXRBY3RpdmVNYXNrU2V0KClbJ2xhc3RWYWxpZFBvc2l0aW9uJ10pKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGVzdFZhbGlkW1wiYWN0aXZlTWFza3NldEluZGV4XCJdID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdoZXN0VmFsaWRbXCJsYXN0VmFsaWRQb3NpdGlvblwiXSA9IGdldEFjdGl2ZU1hc2tTZXQoKVsnbGFzdFZhbGlkUG9zaXRpb24nXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hlc3RWYWxpZFtcIm5leHRcIl0gPSBzZWVrTmV4dChnZXRBY3RpdmVNYXNrU2V0KClbJ2xhc3RWYWxpZFBvc2l0aW9uJ10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgYWN0aXZlTWFza3NldEluZGV4ID0gaGlnaGVzdFZhbGlkW1wibGFzdFZhbGlkUG9zaXRpb25cIl0gIT0gLTEgJiYgbWFza3NldHNbY3VycmVudE1hc2tzZXRJbmRleF1bXCJsYXN0VmFsaWRQb3NpdGlvblwiXSA9PSBoaWdoZXN0VmFsaWRbXCJsYXN0VmFsaWRQb3NpdGlvblwiXSA/IGN1cnJlbnRNYXNrc2V0SW5kZXggOiBoaWdoZXN0VmFsaWRbXCJhY3RpdmVNYXNrc2V0SW5kZXhcIl07XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudE1hc2tzZXRJbmRleCAhPSBhY3RpdmVNYXNrc2V0SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckJ1ZmZlcihnZXRBY3RpdmVCdWZmZXIoKSwgc2Vla05leHQoaGlnaGVzdFZhbGlkW1wibGFzdFZhbGlkUG9zaXRpb25cIl0pLCBnZXRNYXNrTGVuZ3RoKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdldEFjdGl2ZU1hc2tTZXQoKVtcIndyaXRlT3V0QnVmZmVyXCJdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRlbC5kYXRhKCdfaW5wdXRtYXNrJylbJ2FjdGl2ZU1hc2tzZXRJbmRleCddID0gYWN0aXZlTWFza3NldEluZGV4OyAvL3N0b3JlIHRoZSBhY3RpdmVNYXNrc2V0SW5kZXhcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaXNNYXNrKHBvcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlc3RQb3MgPSBkZXRlcm1pbmVUZXN0UG9zaXRpb24ocG9zKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gZ2V0QWN0aXZlVGVzdHMoKVt0ZXN0UG9zXTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGVzdCAhPSB1bmRlZmluZWQgPyB0ZXN0LmZuIDogZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRldGVybWluZVRlc3RQb3NpdGlvbihwb3MpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwb3MgJSBnZXRBY3RpdmVUZXN0cygpLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TWFza0xlbmd0aCgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcHRzLmdldE1hc2tMZW5ndGgoZ2V0QWN0aXZlQnVmZmVyVGVtcGxhdGUoKSwgZ2V0QWN0aXZlTWFza1NldCgpWydncmVlZHknXSwgZ2V0QWN0aXZlTWFza1NldCgpWydyZXBlYXQnXSwgZ2V0QWN0aXZlQnVmZmVyKCksIG9wdHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL3BvczogZnJvbSBwb3NpdGlvblxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2Vla05leHQocG9zKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWFza0wgPSBnZXRNYXNrTGVuZ3RoKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocG9zID49IG1hc2tMKSByZXR1cm4gbWFza0w7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb24gPSBwb3M7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoKytwb3NpdGlvbiA8IG1hc2tMICYmICFpc01hc2socG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9zaXRpb247XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vcG9zOiBmcm9tIHBvc2l0aW9uXHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZWVrUHJldmlvdXMocG9zKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb24gPSBwb3M7XHJcbiAgICAgICAgICAgICAgICBpZiAocG9zaXRpb24gPD0gMCkgcmV0dXJuIDA7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKC0tcG9zaXRpb24gPiAwICYmICFpc01hc2socG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9zaXRpb247XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldEJ1ZmZlckVsZW1lbnQoYnVmZmVyLCBwb3NpdGlvbiwgZWxlbWVudCwgYXV0b1ByZXBhcmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhdXRvUHJlcGFyZSkgcG9zaXRpb24gPSBwcmVwYXJlQnVmZmVyKGJ1ZmZlciwgcG9zaXRpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gZ2V0QWN0aXZlVGVzdHMoKVtkZXRlcm1pbmVUZXN0UG9zaXRpb24ocG9zaXRpb24pXTtcclxuICAgICAgICAgICAgICAgIHZhciBlbGVtID0gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtICE9IHVuZGVmaW5lZCAmJiB0ZXN0ICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodGVzdC5jYXNpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInVwcGVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtID0gZWxlbWVudC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJsb3dlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbSA9IGVsZW1lbnQudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJbcG9zaXRpb25dID0gZWxlbTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0QnVmZmVyRWxlbWVudChidWZmZXIsIHBvc2l0aW9uLCBhdXRvUHJlcGFyZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGF1dG9QcmVwYXJlKSBwb3NpdGlvbiA9IHByZXBhcmVCdWZmZXIoYnVmZmVyLCBwb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyW3Bvc2l0aW9uXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9uZWVkZWQgdG8gaGFuZGxlIHRoZSBub24tZ3JlZWR5IG1hc2sgcmVwZXRpdGlvbnNcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHByZXBhcmVCdWZmZXIoYnVmZmVyLCBwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGo7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoYnVmZmVyW3Bvc2l0aW9uXSA9PSB1bmRlZmluZWQgJiYgYnVmZmVyLmxlbmd0aCA8IGdldE1hc2tMZW5ndGgoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGogPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChnZXRBY3RpdmVCdWZmZXJUZW1wbGF0ZSgpW2pdICE9PSB1bmRlZmluZWQpIHsgLy9hZGQgYSBuZXcgYnVmZmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoKGdldEFjdGl2ZUJ1ZmZlclRlbXBsYXRlKClbaisrXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBwb3NpdGlvbjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gd3JpdGVCdWZmZXIoaW5wdXQsIGJ1ZmZlciwgY2FyZXRQb3MpIHtcclxuICAgICAgICAgICAgICAgIGlucHV0Ll92YWx1ZVNldChidWZmZXIuam9pbignJykpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhcmV0UG9zICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmV0KGlucHV0LCBjYXJldFBvcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFyQnVmZmVyKGJ1ZmZlciwgc3RhcnQsIGVuZCwgc3RyaXBOb21hc2tzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gc3RhcnQsIG1hc2tMID0gZ2V0TWFza0xlbmd0aCgpIDsgaSA8IGVuZCAmJiBpIDwgbWFza0w7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdHJpcE5vbWFza3MgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc01hc2soaSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRCdWZmZXJFbGVtZW50KGJ1ZmZlciwgaSwgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEJ1ZmZlckVsZW1lbnQoYnVmZmVyLCBpLCBnZXRCdWZmZXJFbGVtZW50KGdldEFjdGl2ZUJ1ZmZlclRlbXBsYXRlKCkuc2xpY2UoKSwgaSwgdHJ1ZSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRSZVRhcmdldFBsYWNlSG9sZGVyKGJ1ZmZlciwgcG9zKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVzdFBvcyA9IGRldGVybWluZVRlc3RQb3NpdGlvbihwb3MpO1xyXG4gICAgICAgICAgICAgICAgc2V0QnVmZmVyRWxlbWVudChidWZmZXIsIHBvcywgZ2V0QnVmZmVyRWxlbWVudChnZXRBY3RpdmVCdWZmZXJUZW1wbGF0ZSgpLCB0ZXN0UG9zKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFBsYWNlSG9sZGVyKHBvcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wdHMucGxhY2Vob2xkZXIuY2hhckF0KHBvcyAlIG9wdHMucGxhY2Vob2xkZXIubGVuZ3RoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2hlY2tWYWwoaW5wdXQsIHdyaXRlT3V0LCBzdHJpY3QsIG5wdHZsLCBpbnRlbGxpQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbnB1dFZhbHVlID0gbnB0dmwgIT0gdW5kZWZpbmVkID8gbnB0dmwuc2xpY2UoKSA6IHRydW5jYXRlSW5wdXQoaW5wdXQuX3ZhbHVlR2V0KCkpLnNwbGl0KCcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmVhY2gobWFza3NldHMsIGZ1bmN0aW9uIChuZHgsIG1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAobXMpID09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXNbXCJidWZmZXJcIl0gPSBtc1tcIl9idWZmZXJcIl0uc2xpY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXNbXCJsYXN0VmFsaWRQb3NpdGlvblwiXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtc1tcInBcIl0gPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChzdHJpY3QgIT09IHRydWUpIGFjdGl2ZU1hc2tzZXRJbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAod3JpdGVPdXQpIGlucHV0Ll92YWx1ZVNldChcIlwiKTsgLy9pbml0aWFsIGNsZWFyXHJcbiAgICAgICAgICAgICAgICB2YXIgbWwgPSBnZXRNYXNrTGVuZ3RoKCk7XHJcbiAgICAgICAgICAgICAgICAkLmVhY2goaW5wdXRWYWx1ZSwgZnVuY3Rpb24gKG5keCwgY2hhckNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZWxsaUNoZWNrID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwID0gZ2V0QWN0aXZlTWFza1NldCgpW1wicFwiXSwgbHZwID0gcCA9PSAtMSA/IHAgOiBzZWVrUHJldmlvdXMocCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3MgPSBsdnAgPT0gLTEgPyBuZHggOiBzZWVrTmV4dChsdnApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGNoYXJDb2RlLCBnZXRBY3RpdmVCdWZmZXJUZW1wbGF0ZSgpLnNsaWNlKGx2cCArIDEsIHBvcykpID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXlwcmVzc0V2ZW50LmNhbGwoaW5wdXQsIHVuZGVmaW5lZCwgdHJ1ZSwgY2hhckNvZGUuY2hhckNvZGVBdCgwKSwgd3JpdGVPdXQsIHN0cmljdCwgbmR4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXByZXNzRXZlbnQuY2FsbChpbnB1dCwgdW5kZWZpbmVkLCB0cnVlLCBjaGFyQ29kZS5jaGFyQ29kZUF0KDApLCB3cml0ZU91dCwgc3RyaWN0LCBuZHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdHJpY3QgPT09IHRydWUgJiYgZ2V0QWN0aXZlTWFza1NldCgpW1wicFwiXSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldEFjdGl2ZU1hc2tTZXQoKVtcImxhc3RWYWxpZFBvc2l0aW9uXCJdID0gc2Vla1ByZXZpb3VzKGdldEFjdGl2ZU1hc2tTZXQoKVtcInBcIl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBlc2NhcGVSZWdleChzdHIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkLmlucHV0bWFzay5lc2NhcGVSZWdleC5jYWxsKHRoaXMsIHN0cik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHRydW5jYXRlSW5wdXQoaW5wdXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0VmFsdWUucmVwbGFjZShuZXcgUmVnRXhwKFwiKFwiICsgZXNjYXBlUmVnZXgoZ2V0QWN0aXZlQnVmZmVyVGVtcGxhdGUoKS5qb2luKCcnKSkgKyBcIikqJFwiKSwgXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFyT3B0aW9uYWxUYWlsKGlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYnVmZmVyID0gZ2V0QWN0aXZlQnVmZmVyKCksIHRtcEJ1ZmZlciA9IGJ1ZmZlci5zbGljZSgpLCB0ZXN0UG9zLCBwb3M7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwb3MgPSB0bXBCdWZmZXIubGVuZ3RoIC0gMTsgcG9zID49IDA7IHBvcy0tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3RQb3MgPSBkZXRlcm1pbmVUZXN0UG9zaXRpb24ocG9zKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2V0QWN0aXZlVGVzdHMoKVt0ZXN0UG9zXS5vcHRpb25hbGl0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTWFzayhwb3MpIHx8ICFpc1ZhbGlkKHBvcywgYnVmZmVyW3Bvc10sIHRydWUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wQnVmZmVyLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHdyaXRlQnVmZmVyKGlucHV0LCB0bXBCdWZmZXIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiB1bm1hc2tlZHZhbHVlKCRpbnB1dCwgc2tpcERhdGVwaWNrZXJDaGVjaykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdldEFjdGl2ZVRlc3RzKCkgJiYgKHNraXBEYXRlcGlja2VyQ2hlY2sgPT09IHRydWUgfHwgISRpbnB1dC5oYXNDbGFzcygnaGFzRGF0ZXBpY2tlcicpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2tWYWwoaW5wdXQsIGZhbHNlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdW1WYWx1ZSA9ICQubWFwKGdldEFjdGl2ZUJ1ZmZlcigpLCBmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzTWFzayhpbmRleCkgJiYgaXNWYWxpZChpbmRleCwgZWxlbWVudCwgdHJ1ZSkgPyBlbGVtZW50IDogbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdW5tYXNrZWRWYWx1ZSA9IChpc1JUTCA/IHVtVmFsdWUucmV2ZXJzZSgpIDogdW1WYWx1ZSkuam9pbignJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdHMub25Vbk1hc2sgIT0gdW5kZWZpbmVkID8gb3B0cy5vblVuTWFzay5jYWxsKHRoaXMsIGdldEFjdGl2ZUJ1ZmZlcigpLmpvaW4oJycpLCB1bm1hc2tlZFZhbHVlKSA6IHVubWFza2VkVmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaW5wdXRbMF0uX3ZhbHVlR2V0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFRyYW5zbGF0ZVBvc2l0aW9uKHBvcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzUlRMICYmIHR5cGVvZiBwb3MgPT0gJ251bWJlcicgJiYgKCFvcHRzLmdyZWVkeSB8fCBvcHRzLnBsYWNlaG9sZGVyICE9IFwiXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJmZnJMZ2h0ID0gZ2V0QWN0aXZlQnVmZmVyKCkubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IGJmZnJMZ2h0IC0gcG9zO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvcztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2FyZXQoaW5wdXQsIGJlZ2luLCBlbmQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBucHQgPSBpbnB1dC5qcXVlcnkgJiYgaW5wdXQubGVuZ3RoID4gMCA/IGlucHV0WzBdIDogaW5wdXQsIHJhbmdlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBiZWdpbiA9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGJlZ2luID0gVHJhbnNsYXRlUG9zaXRpb24oYmVnaW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IFRyYW5zbGF0ZVBvc2l0aW9uKGVuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkKGlucHV0KS5pcygnOnZpc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVuZCA9ICh0eXBlb2YgZW5kID09ICdudW1iZXInKSA/IGVuZCA6IGJlZ2luO1xyXG4gICAgICAgICAgICAgICAgICAgIG5wdC5zY3JvbGxMZWZ0ID0gbnB0LnNjcm9sbFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmluc2VydE1vZGUgPT0gZmFsc2UgJiYgYmVnaW4gPT0gZW5kKSBlbmQrKzsgLy9zZXQgdmlzdWFsaXphdGlvbiBmb3IgaW5zZXJ0L292ZXJ3cml0ZSBtb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5wdC5zZXRTZWxlY3Rpb25SYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBucHQuc2VsZWN0aW9uU3RhcnQgPSBiZWdpbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbnB0LnNlbGVjdGlvbkVuZCA9IGFuZHJvaWQgPyBiZWdpbiA6IGVuZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChucHQuY3JlYXRlVGV4dFJhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlID0gbnB0LmNyZWF0ZVRleHRSYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZS5jb2xsYXBzZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2UubW92ZUVuZCgnY2hhcmFjdGVyJywgZW5kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2UubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCBiZWdpbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlLnNlbGVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkKGlucHV0KS5pcygnOnZpc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcImJlZ2luXCI6IDAsIFwiZW5kXCI6IDAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5wdC5zZXRTZWxlY3Rpb25SYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWdpbiA9IG5wdC5zZWxlY3Rpb25TdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kID0gbnB0LnNlbGVjdGlvbkVuZDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LnNlbGVjdGlvbiAmJiBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2UgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmVnaW4gPSAwIC0gcmFuZ2UuZHVwbGljYXRlKCkubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCAtMTAwMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kID0gYmVnaW4gKyByYW5nZS50ZXh0Lmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYmVnaW4gPSBUcmFuc2xhdGVQb3NpdGlvbihiZWdpbik7XHJcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gVHJhbnNsYXRlUG9zaXRpb24oZW5kKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBcImJlZ2luXCI6IGJlZ2luLCBcImVuZFwiOiBlbmQgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaXNDb21wbGV0ZShidWZmZXIpIHsgLy9yZXR1cm4gdHJ1ZSAvIGZhbHNlIC8gdW5kZWZpbmVkIChyZXBlYXQgKilcclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnJlcGVhdCA9PSBcIipcIikgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHZhciBjb21wbGV0ZSA9IGZhbHNlLCBoaWdoZXN0VmFsaWRQb3NpdGlvbiA9IDAsIGN1cnJlbnRBY3RpdmVNYXNrc2V0SW5kZXggPSBhY3RpdmVNYXNrc2V0SW5kZXg7XHJcbiAgICAgICAgICAgICAgICAkLmVhY2gobWFza3NldHMsIGZ1bmN0aW9uIChuZHgsIG1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAobXMpID09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlTWFza3NldEluZGV4ID0gbmR4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYW1sID0gc2Vla1ByZXZpb3VzKGdldE1hc2tMZW5ndGgoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc1tcImxhc3RWYWxpZFBvc2l0aW9uXCJdID49IGhpZ2hlc3RWYWxpZFBvc2l0aW9uICYmIG1zW1wibGFzdFZhbGlkUG9zaXRpb25cIl0gPT0gYW1sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbXNDb21wbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBhbWw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXNrID0gaXNNYXNrKGkpLCB0ZXN0UG9zID0gZGV0ZXJtaW5lVGVzdFBvc2l0aW9uKGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgobWFzayAmJiAoYnVmZmVyW2ldID09IHVuZGVmaW5lZCB8fCBidWZmZXJbaV0gPT0gZ2V0UGxhY2VIb2xkZXIoaSkpKSB8fCAoIW1hc2sgJiYgYnVmZmVyW2ldICE9IGdldEFjdGl2ZUJ1ZmZlclRlbXBsYXRlKClbdGVzdFBvc10pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zQ29tcGxldGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGUgPSBjb21wbGV0ZSB8fCBtc0NvbXBsZXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlKSAvL2JyZWFrIGxvb3BcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGVzdFZhbGlkUG9zaXRpb24gPSBtc1tcImxhc3RWYWxpZFBvc2l0aW9uXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYWN0aXZlTWFza3NldEluZGV4ID0gY3VycmVudEFjdGl2ZU1hc2tzZXRJbmRleDsgLy9yZXNldCBhY3RpdmVNYXNrc2V0XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcGxldGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGlzU2VsZWN0aW9uKGJlZ2luLCBlbmQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc1JUTCA/IChiZWdpbiAtIGVuZCkgPiAxIHx8ICgoYmVnaW4gLSBlbmQpID09IDEgJiYgb3B0cy5pbnNlcnRNb2RlKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgKGVuZCAtIGJlZ2luKSA+IDEgfHwgKChlbmQgLSBiZWdpbikgPT0gMSAmJiBvcHRzLmluc2VydE1vZGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy9wcml2YXRlIGZ1bmN0aW9uc1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBpbnN0YWxsRXZlbnRSdWxlcihucHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBldmVudHMgPSAkLl9kYXRhKG5wdCkuZXZlbnRzO1xyXG5cclxuICAgICAgICAgICAgICAgICQuZWFjaChldmVudHMsIGZ1bmN0aW9uIChldmVudFR5cGUsIGV2ZW50SGFuZGxlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkLmVhY2goZXZlbnRIYW5kbGVycywgZnVuY3Rpb24gKG5keCwgZXZlbnRIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudEhhbmRsZXIubmFtZXNwYWNlID09IFwiaW5wdXRtYXNrXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudEhhbmRsZXIudHlwZSAhPSBcInNldHZhbHVlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlciA9IGV2ZW50SGFuZGxlci5oYW5kbGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50SGFuZGxlci5oYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVhZE9ubHkgfHwgdGhpcy5kaXNhYmxlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHBhdGNoVmFsdWVQcm9wZXJ0eShucHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZVByb3BlcnR5O1xyXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IpXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVQcm9wZXJ0eSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobnB0LCBcInZhbHVlXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlUHJvcGVydHkgJiYgdmFsdWVQcm9wZXJ0eS5nZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5wdC5fdmFsdWVHZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlR2V0ID0gdmFsdWVQcm9wZXJ0eS5nZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZVNldCA9IHZhbHVlUHJvcGVydHkuc2V0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBucHQuX3ZhbHVlR2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzUlRMID8gdmFsdWVHZXQuY2FsbCh0aGlzKS5zcGxpdCgnJykucmV2ZXJzZSgpLmpvaW4oJycpIDogdmFsdWVHZXQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbnB0Ll92YWx1ZVNldCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVTZXQuY2FsbCh0aGlzLCBpc1JUTCA/IHZhbHVlLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJykgOiB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobnB0LCBcInZhbHVlXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkc2VsZiA9ICQodGhpcyksIGlucHV0RGF0YSA9ICQodGhpcykuZGF0YSgnX2lucHV0bWFzaycpLCBtYXNrc2V0cyA9IGlucHV0RGF0YVsnbWFza3NldHMnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlTWFza3NldEluZGV4ID0gaW5wdXREYXRhWydhY3RpdmVNYXNrc2V0SW5kZXgnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXREYXRhICYmIGlucHV0RGF0YVsnb3B0cyddLmF1dG9Vbm1hc2sgPyAkc2VsZi5pbnB1dG1hc2soJ3VubWFza2VkdmFsdWUnKSA6IHZhbHVlR2V0LmNhbGwodGhpcykgIT0gbWFza3NldHNbYWN0aXZlTWFza3NldEluZGV4XVsnX2J1ZmZlciddLmpvaW4oJycpID8gdmFsdWVHZXQuY2FsbCh0aGlzKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVTZXQuY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VySGFuZGxlcignc2V0dmFsdWUuaW5wdXRtYXNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuX19sb29rdXBHZXR0ZXJfXyAmJiBucHQuX19sb29rdXBHZXR0ZXJfXyhcInZhbHVlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFucHQuX3ZhbHVlR2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZUdldCA9IG5wdC5fX2xvb2t1cEdldHRlcl9fKFwidmFsdWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZVNldCA9IG5wdC5fX2xvb2t1cFNldHRlcl9fKFwidmFsdWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5wdC5fdmFsdWVHZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNSVEwgPyB2YWx1ZUdldC5jYWxsKHRoaXMpLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJykgOiB2YWx1ZUdldC5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBucHQuX3ZhbHVlU2V0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVNldC5jYWxsKHRoaXMsIGlzUlRMID8gdmFsdWUuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKSA6IHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5wdC5fX2RlZmluZUdldHRlcl9fKFwidmFsdWVcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKSwgaW5wdXREYXRhID0gJCh0aGlzKS5kYXRhKCdfaW5wdXRtYXNrJyksIG1hc2tzZXRzID0gaW5wdXREYXRhWydtYXNrc2V0cyddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZU1hc2tzZXRJbmRleCA9IGlucHV0RGF0YVsnYWN0aXZlTWFza3NldEluZGV4J107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXREYXRhICYmIGlucHV0RGF0YVsnb3B0cyddLmF1dG9Vbm1hc2sgPyAkc2VsZi5pbnB1dG1hc2soJ3VubWFza2VkdmFsdWUnKSA6IHZhbHVlR2V0LmNhbGwodGhpcykgIT0gbWFza3NldHNbYWN0aXZlTWFza3NldEluZGV4XVsnX2J1ZmZlciddLmpvaW4oJycpID8gdmFsdWVHZXQuY2FsbCh0aGlzKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbnB0Ll9fZGVmaW5lU2V0dGVyX18oXCJ2YWx1ZVwiLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlU2V0LmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VySGFuZGxlcignc2V0dmFsdWUuaW5wdXRtYXNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFucHQuX3ZhbHVlR2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5wdC5fdmFsdWVHZXQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpc1JUTCA/IHRoaXMudmFsdWUuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKSA6IHRoaXMudmFsdWU7IH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5wdC5fdmFsdWVTZXQgPSBmdW5jdGlvbiAodmFsdWUpIHsgdGhpcy52YWx1ZSA9IGlzUlRMID8gdmFsdWUuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKSA6IHZhbHVlOyB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoJC52YWxIb29rcy50ZXh0ID09IHVuZGVmaW5lZCB8fCAkLnZhbEhvb2tzLnRleHQuaW5wdXRtYXNrcGF0Y2ggIT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVHZXQgPSAkLnZhbEhvb2tzLnRleHQgJiYgJC52YWxIb29rcy50ZXh0LmdldCA/ICQudmFsSG9va3MudGV4dC5nZXQgOiBmdW5jdGlvbiAoZWxlbSkgeyByZXR1cm4gZWxlbS52YWx1ZTsgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlU2V0ID0gJC52YWxIb29rcy50ZXh0ICYmICQudmFsSG9va3MudGV4dC5zZXQgPyAkLnZhbEhvb2tzLnRleHQuc2V0IDogZnVuY3Rpb24gKGVsZW0sIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeS5leHRlbmQoJC52YWxIb29rcywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRlbGVtID0gJChlbGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRlbGVtLmRhdGEoJ19pbnB1dG1hc2snKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRlbGVtLmRhdGEoJ19pbnB1dG1hc2snKVsnb3B0cyddLmF1dG9Vbm1hc2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRlbGVtLmlucHV0bWFzaygndW5tYXNrZWR2YWx1ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlR2V0KGVsZW0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dERhdGEgPSAkZWxlbS5kYXRhKCdfaW5wdXRtYXNrJyksIG1hc2tzZXRzID0gaW5wdXREYXRhWydtYXNrc2V0cyddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVNYXNrc2V0SW5kZXggPSBpbnB1dERhdGFbJ2FjdGl2ZU1hc2tzZXRJbmRleCddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgIT0gbWFza3NldHNbYWN0aXZlTWFza3NldEluZGV4XVsnX2J1ZmZlciddLmpvaW4oJycpID8gcmVzdWx0IDogJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSByZXR1cm4gdmFsdWVHZXQoZWxlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChlbGVtLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGVsZW0gPSAkKGVsZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWVTZXQoZWxlbSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJGVsZW0uZGF0YSgnX2lucHV0bWFzaycpKSAkZWxlbS50cmlnZ2VySGFuZGxlcignc2V0dmFsdWUuaW5wdXRtYXNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dG1hc2twYXRjaDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vc2hpZnQgY2hhcnMgdG8gbGVmdCBmcm9tIHN0YXJ0IHRvIGVuZCBhbmQgcHV0IGMgYXQgZW5kIHBvc2l0aW9uIGlmIGRlZmluZWRcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNoaWZ0TChzdGFydCwgZW5kLCBjLCBtYXNrSnVtcHMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBidWZmZXIgPSBnZXRBY3RpdmVCdWZmZXIoKTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXNrSnVtcHMgIT09IGZhbHNlKSAvL2p1bXBpbmcgb3ZlciBub25tYXNrIHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCFpc01hc2soc3RhcnQpICYmIHN0YXJ0IC0gMSA+PSAwKSBzdGFydC0tO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kICYmIGkgPCBnZXRNYXNrTGVuZ3RoKCkgOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNNYXNrKGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFJlVGFyZ2V0UGxhY2VIb2xkZXIoYnVmZmVyLCBpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGogPSBzZWVrTmV4dChpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSBnZXRCdWZmZXJFbGVtZW50KGJ1ZmZlciwgaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwICE9IGdldFBsYWNlSG9sZGVyKGopKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaiA8IGdldE1hc2tMZW5ndGgoKSAmJiBpc1ZhbGlkKGksIHAsIHRydWUpICE9PSBmYWxzZSAmJiBnZXRBY3RpdmVUZXN0cygpW2RldGVybWluZVRlc3RQb3NpdGlvbihpKV0uZGVmID09IGdldEFjdGl2ZVRlc3RzKClbZGV0ZXJtaW5lVGVzdFBvc2l0aW9uKGopXS5kZWYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRCdWZmZXJFbGVtZW50KGJ1ZmZlciwgaSwgcCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc01hc2soaSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UmVUYXJnZXRQbGFjZUhvbGRlcihidWZmZXIsIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICBzZXRCdWZmZXJFbGVtZW50KGJ1ZmZlciwgc2Vla1ByZXZpb3VzKGVuZCksIGMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChnZXRBY3RpdmVNYXNrU2V0KClbXCJncmVlZHlcIl0gPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdHJidWZmZXIgPSB0cnVuY2F0ZUlucHV0KGJ1ZmZlci5qb2luKCcnKSkuc3BsaXQoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5sZW5ndGggPSB0cmJ1ZmZlci5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGJsID0gYnVmZmVyLmxlbmd0aDsgaSA8IGJsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyW2ldID0gdHJidWZmZXJbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChidWZmZXIubGVuZ3RoID09IDApIGdldEFjdGl2ZU1hc2tTZXQoKVtcImJ1ZmZlclwiXSA9IGdldEFjdGl2ZUJ1ZmZlclRlbXBsYXRlKCkuc2xpY2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGFydDsgLy9yZXR1cm4gdGhlIHVzZWQgc3RhcnQgcG9zaXRpb25cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2hpZnRSKHN0YXJ0LCBlbmQsIGMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBidWZmZXIgPSBnZXRBY3RpdmVCdWZmZXIoKTtcclxuICAgICAgICAgICAgICAgIGlmIChnZXRCdWZmZXJFbGVtZW50KGJ1ZmZlciwgc3RhcnQsIHRydWUpICE9IGdldFBsYWNlSG9sZGVyKHN0YXJ0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBzZWVrUHJldmlvdXMoZW5kKSA7IGkgPiBzdGFydCAmJiBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNNYXNrKGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaiA9IHNlZWtQcmV2aW91cyhpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gZ2V0QnVmZmVyRWxlbWVudChidWZmZXIsIGopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQgIT0gZ2V0UGxhY2VIb2xkZXIoaikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNWYWxpZChqLCB0LCB0cnVlKSAhPT0gZmFsc2UgJiYgZ2V0QWN0aXZlVGVzdHMoKVtkZXRlcm1pbmVUZXN0UG9zaXRpb24oaSldLmRlZiA9PSBnZXRBY3RpdmVUZXN0cygpW2RldGVybWluZVRlc3RQb3NpdGlvbihqKV0uZGVmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEJ1ZmZlckVsZW1lbnQoYnVmZmVyLCBpLCB0LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0UmVUYXJnZXRQbGFjZUhvbGRlcihidWZmZXIsIGopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbHNlIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFJlVGFyZ2V0UGxhY2VIb2xkZXIoYnVmZmVyLCBpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYyAhPSB1bmRlZmluZWQgJiYgZ2V0QnVmZmVyRWxlbWVudChidWZmZXIsIHN0YXJ0KSA9PSBnZXRQbGFjZUhvbGRlcihzdGFydCkpXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0QnVmZmVyRWxlbWVudChidWZmZXIsIHN0YXJ0LCBjKTtcclxuICAgICAgICAgICAgICAgIHZhciBsZW5ndGhCZWZvcmUgPSBidWZmZXIubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdldEFjdGl2ZU1hc2tTZXQoKVtcImdyZWVkeVwiXSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0cmJ1ZmZlciA9IHRydW5jYXRlSW5wdXQoYnVmZmVyLmpvaW4oJycpKS5zcGxpdCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLmxlbmd0aCA9IHRyYnVmZmVyLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgYmwgPSBidWZmZXIubGVuZ3RoOyBpIDwgYmw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXJbaV0gPSB0cmJ1ZmZlcltpXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1ZmZlci5sZW5ndGggPT0gMCkgZ2V0QWN0aXZlTWFza1NldCgpW1wiYnVmZmVyXCJdID0gZ2V0QWN0aXZlQnVmZmVyVGVtcGxhdGUoKS5zbGljZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVuZCAtIChsZW5ndGhCZWZvcmUgLSBidWZmZXIubGVuZ3RoKTsgLy9yZXR1cm4gbmV3IHN0YXJ0IHBvc2l0aW9uXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIEhhbmRsZVJlbW92ZShpbnB1dCwgaywgcG9zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0cy5udW1lcmljSW5wdXQgfHwgaXNSVEwpIHtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBvcHRzLmtleUNvZGUuQkFDS1NQQUNFOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgayA9IG9wdHMua2V5Q29kZS5ERUxFVEU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBvcHRzLmtleUNvZGUuREVMRVRFOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgayA9IG9wdHMua2V5Q29kZS5CQUNLU1BBQ0U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzUlRMKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwZW5kID0gcG9zLmVuZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zLmVuZCA9IHBvcy5iZWdpbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zLmJlZ2luID0gcGVuZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGlzU2VsZWN0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmIChwb3MuYmVnaW4gPT0gcG9zLmVuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3NCZWdpbiA9IGsgPT0gb3B0cy5rZXlDb2RlLkJBQ0tTUEFDRSA/IHBvcy5iZWdpbiAtIDEgOiBwb3MuYmVnaW47XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuaXNOdW1lcmljICYmIG9wdHMucmFkaXhQb2ludCAhPSBcIlwiICYmIGdldEFjdGl2ZUJ1ZmZlcigpW3Bvc0JlZ2luXSA9PSBvcHRzLnJhZGl4UG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zLmJlZ2luID0gKGdldEFjdGl2ZUJ1ZmZlcigpLmxlbmd0aCAtIDEgPT0gcG9zQmVnaW4pIC8qIHJhZGl4UG9pbnQgaXMgbGF0ZXN0PyBkZWxldGUgaXQgKi8gPyBwb3MuYmVnaW4gOiBrID09IG9wdHMua2V5Q29kZS5CQUNLU1BBQ0UgPyBwb3NCZWdpbiA6IHNlZWtOZXh0KHBvc0JlZ2luKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zLmVuZCA9IHBvcy5iZWdpbjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3Rpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoayA9PSBvcHRzLmtleUNvZGUuQkFDS1NQQUNFKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3MuYmVnaW4tLTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChrID09IG9wdHMua2V5Q29kZS5ERUxFVEUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcy5lbmQrKztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocG9zLmVuZCAtIHBvcy5iZWdpbiA9PSAxICYmICFvcHRzLmluc2VydE1vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrID09IG9wdHMua2V5Q29kZS5CQUNLU1BBQ0UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcy5iZWdpbi0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNsZWFyQnVmZmVyKGdldEFjdGl2ZUJ1ZmZlcigpLCBwb3MuYmVnaW4sIHBvcy5lbmQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBtbCA9IGdldE1hc2tMZW5ndGgoKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLmdyZWVkeSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaWZ0TChwb3MuYmVnaW4sIG1sLCB1bmRlZmluZWQsICFpc1JUTCAmJiAoayA9PSBvcHRzLmtleUNvZGUuQkFDS1NQQUNFICYmICFpc1NlbGVjdGlvbikpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3cG9zID0gcG9zLmJlZ2luO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBwb3MuYmVnaW47IGkgPCBwb3MuZW5kOyBpKyspIHsgLy9zZWVrbmV4dCB0byBza2lwIHBsYWNlaG9sZGVycyBhdCBzdGFydCBpbiBzZWxlY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTWFzayhpKSB8fCAhaXNTZWxlY3Rpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdwb3MgPSBzaGlmdEwocG9zLmJlZ2luLCBtbCwgdW5kZWZpbmVkLCAhaXNSVEwgJiYgKGsgPT0gb3B0cy5rZXlDb2RlLkJBQ0tTUEFDRSAmJiAhaXNTZWxlY3Rpb24pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1NlbGVjdGlvbikgcG9zLmJlZ2luID0gbmV3cG9zO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGZpcnN0TWFza1BvcyA9IHNlZWtOZXh0KC0xKTtcclxuICAgICAgICAgICAgICAgIGNsZWFyQnVmZmVyKGdldEFjdGl2ZUJ1ZmZlcigpLCBwb3MuYmVnaW4sIHBvcy5lbmQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgY2hlY2tWYWwoaW5wdXQsIGZhbHNlLCBtYXNrc2V0c1sxXSA9PSB1bmRlZmluZWQgfHwgZmlyc3RNYXNrUG9zID49IHBvcy5lbmQsIGdldEFjdGl2ZUJ1ZmZlcigpKTtcclxuICAgICAgICAgICAgICAgIGlmIChnZXRBY3RpdmVNYXNrU2V0KClbJ2xhc3RWYWxpZFBvc2l0aW9uJ10gPCBmaXJzdE1hc2tQb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBnZXRBY3RpdmVNYXNrU2V0KClbXCJsYXN0VmFsaWRQb3NpdGlvblwiXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIGdldEFjdGl2ZU1hc2tTZXQoKVtcInBcIl0gPSBmaXJzdE1hc2tQb3M7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldEFjdGl2ZU1hc2tTZXQoKVtcInBcIl0gPSBwb3MuYmVnaW47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGtleWRvd25FdmVudChlKSB7XHJcbiAgICAgICAgICAgICAgICAvL1NhZmFyaSA1LjEueCAtIG1vZGFsIGRpYWxvZyBmaXJlcyBrZXlwcmVzcyB0d2ljZSB3b3JrYXJvdW5kXHJcbiAgICAgICAgICAgICAgICBza2lwS2V5UHJlc3NFdmVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcywgJGlucHV0ID0gJChpbnB1dCksIGsgPSBlLmtleUNvZGUsIHBvcyA9IGNhcmV0KGlucHV0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2JhY2tzcGFjZSwgZGVsZXRlLCBhbmQgZXNjYXBlIGdldCBzcGVjaWFsIHRyZWF0bWVudFxyXG4gICAgICAgICAgICAgICAgaWYgKGsgPT0gb3B0cy5rZXlDb2RlLkJBQ0tTUEFDRSB8fCBrID09IG9wdHMua2V5Q29kZS5ERUxFVEUgfHwgKGlwaG9uZSAmJiBrID09IDEyNykgfHwgZS5jdHJsS2V5ICYmIGsgPT0gODgpIHsgLy9iYWNrc3BhY2UvZGVsZXRlXHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvL3N0b3AgZGVmYXVsdCBhY3Rpb24gYnV0IGFsbG93IHByb3BhZ2F0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGsgPT0gODgpIHZhbHVlT25Gb2N1cyA9IGdldEFjdGl2ZUJ1ZmZlcigpLmpvaW4oJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIEhhbmRsZVJlbW92ZShpbnB1dCwgaywgcG9zKTtcclxuICAgICAgICAgICAgICAgICAgICBkZXRlcm1pbmVBY3RpdmVNYXNrc2V0SW5kZXgoKTtcclxuICAgICAgICAgICAgICAgICAgICB3cml0ZUJ1ZmZlcihpbnB1dCwgZ2V0QWN0aXZlQnVmZmVyKCksIGdldEFjdGl2ZU1hc2tTZXQoKVtcInBcIl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC5fdmFsdWVHZXQoKSA9PSBnZXRBY3RpdmVCdWZmZXJUZW1wbGF0ZSgpLmpvaW4oJycpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXQudHJpZ2dlcignY2xlYXJlZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5zaG93VG9vbHRpcCkgeyAvL3VwZGF0ZSB0b29sdGlwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbnB1dC5wcm9wKFwidGl0bGVcIiwgZ2V0QWN0aXZlTWFza1NldCgpW1wibWFza1wiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrID09IG9wdHMua2V5Q29kZS5FTkQgfHwgayA9PSBvcHRzLmtleUNvZGUuUEFHRV9ET1dOKSB7IC8vd2hlbiBFTkQgb3IgUEFHRV9ET1dOIHByZXNzZWQgc2V0IHBvc2l0aW9uIGF0IGxhc3RtYXRjaFxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2FyZXRQb3MgPSBzZWVrTmV4dChnZXRBY3RpdmVNYXNrU2V0KClbXCJsYXN0VmFsaWRQb3NpdGlvblwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3B0cy5pbnNlcnRNb2RlICYmIGNhcmV0UG9zID09IGdldE1hc2tMZW5ndGgoKSAmJiAhZS5zaGlmdEtleSkgY2FyZXRQb3MtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZXQoaW5wdXQsIGUuc2hpZnRLZXkgPyBwb3MuYmVnaW4gOiBjYXJldFBvcywgY2FyZXRQb3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoayA9PSBvcHRzLmtleUNvZGUuSE9NRSAmJiAhZS5zaGlmdEtleSkgfHwgayA9PSBvcHRzLmtleUNvZGUuUEFHRV9VUCkgeyAvL0hvbWUgb3IgcGFnZV91cFxyXG4gICAgICAgICAgICAgICAgICAgIGNhcmV0KGlucHV0LCAwLCBlLnNoaWZ0S2V5ID8gcG9zLmJlZ2luIDogMCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGsgPT0gb3B0cy5rZXlDb2RlLkVTQ0FQRSB8fCAoayA9PSA5MCAmJiBlLmN0cmxLZXkpKSB7IC8vZXNjYXBlICYmIHVuZG9cclxuICAgICAgICAgICAgICAgICAgICBjaGVja1ZhbChpbnB1dCwgdHJ1ZSwgZmFsc2UsIHZhbHVlT25Gb2N1cy5zcGxpdCgnJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICRpbnB1dC5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrID09IG9wdHMua2V5Q29kZS5JTlNFUlQgJiYgIShlLnNoaWZ0S2V5IHx8IGUuY3RybEtleSkpIHsgLy9pbnNlcnRcclxuICAgICAgICAgICAgICAgICAgICBvcHRzLmluc2VydE1vZGUgPSAhb3B0cy5pbnNlcnRNb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmV0KGlucHV0LCAhb3B0cy5pbnNlcnRNb2RlICYmIHBvcy5iZWdpbiA9PSBnZXRNYXNrTGVuZ3RoKCkgPyBwb3MuYmVnaW4gLSAxIDogcG9zLmJlZ2luKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0cy5pbnNlcnRNb2RlID09IGZhbHNlICYmICFlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGsgPT0gb3B0cy5rZXlDb2RlLlJJR0hUKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhcmV0UG9zID0gY2FyZXQoaW5wdXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FyZXQoaW5wdXQsIGNhcmV0UG9zLmJlZ2luKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrID09IG9wdHMua2V5Q29kZS5MRUZUKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhcmV0UG9zID0gY2FyZXQoaW5wdXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FyZXQoaW5wdXQsIGNhcmV0UG9zLmJlZ2luIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudENhcmV0UG9zID0gY2FyZXQoaW5wdXQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMub25LZXlEb3duLmNhbGwodGhpcywgZSwgZ2V0QWN0aXZlQnVmZmVyKCksIG9wdHMpID09PSB0cnVlKSAvL2V4dHJhIHN0dWZmIHRvIGV4ZWN1dGUgb24ga2V5ZG93blxyXG4gICAgICAgICAgICAgICAgICAgIGNhcmV0KGlucHV0LCBjdXJyZW50Q2FyZXRQb3MuYmVnaW4sIGN1cnJlbnRDYXJldFBvcy5lbmQpO1xyXG4gICAgICAgICAgICAgICAgaWdub3JhYmxlID0gJC5pbkFycmF5KGssIG9wdHMuaWdub3JhYmxlcykgIT0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBrZXlwcmVzc0V2ZW50KGUsIGNoZWNrdmFsLCBrLCB3cml0ZU91dCwgc3RyaWN0LCBuZHgpIHtcclxuICAgICAgICAgICAgICAgIC8vU2FmYXJpIDUuMS54IC0gbW9kYWwgZGlhbG9nIGZpcmVzIGtleXByZXNzIHR3aWNlIHdvcmthcm91bmRcclxuICAgICAgICAgICAgICAgIGlmIChrID09IHVuZGVmaW5lZCAmJiBza2lwS2V5UHJlc3NFdmVudCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgc2tpcEtleVByZXNzRXZlbnQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IHRoaXMsICRpbnB1dCA9ICQoaW5wdXQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcclxuICAgICAgICAgICAgICAgIHZhciBrID0gY2hlY2t2YWwgPyBrIDogKGUud2hpY2ggfHwgZS5jaGFyQ29kZSB8fCBlLmtleUNvZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjaGVja3ZhbCAhPT0gdHJ1ZSAmJiAoIShlLmN0cmxLZXkgJiYgZS5hbHRLZXkpICYmIChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5IHx8IGlnbm9yYWJsZSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc3BlY2lhbCB0cmVhdCB0aGUgZGVjaW1hbCBzZXBhcmF0b3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrdmFsICE9PSB0cnVlICYmIGsgPT0gNDYgJiYgZS5zaGlmdEtleSA9PSBmYWxzZSAmJiBvcHRzLnJhZGl4UG9pbnQgPT0gXCIsXCIpIGsgPSA0NDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MsIHJlc3VsdHMsIHJlc3VsdCwgYyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGVja3ZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBjYXJldCA9IHN0cmljdCA/IG5keCA6IGdldEFjdGl2ZU1hc2tTZXQoKVtcImxhc3RWYWxpZFBvc2l0aW9uXCJdICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcyA9IHsgYmVnaW46IHBjYXJldCwgZW5kOiBwY2FyZXQgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcyA9IGNhcmV0KGlucHV0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9zaG91bGQgd2UgY2xlYXIgYSBwb3NzaWJsZSBzZWxlY3Rpb24/P1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNTbGN0biA9IGlzU2VsZWN0aW9uKHBvcy5iZWdpbiwgcG9zLmVuZCksIHJlZGV0ZXJtaW5lTFZQID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsSW5kZXggPSBhY3RpdmVNYXNrc2V0SW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1NsY3RuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVNYXNrc2V0SW5kZXggPSBpbml0aWFsSW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2gobWFza3NldHMsIGZ1bmN0aW9uIChuZHgsIGxtbnQpIHsgLy9pbml0IHVuZG9idWZmZXIgZm9yIHJlY292ZXJ5IHdoZW4gbm90IHZhbGlkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAobG1udCkgPT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVNYXNrc2V0SW5kZXggPSBuZHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEFjdGl2ZU1hc2tTZXQoKVtcInVuZG9CdWZmZXJcIl0gPSBnZXRBY3RpdmVCdWZmZXIoKS5qb2luKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhhbmRsZVJlbW92ZShpbnB1dCwgb3B0cy5rZXlDb2RlLkRFTEVURSwgcG9zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3B0cy5pbnNlcnRNb2RlKSB7IC8vcHJlc2VydmUgc29tZSBzcGFjZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChtYXNrc2V0cywgZnVuY3Rpb24gKG5keCwgbG1udCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChsbW50KSA9PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVNYXNrc2V0SW5kZXggPSBuZHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlmdFIocG9zLmJlZ2luLCBnZXRNYXNrTGVuZ3RoKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0QWN0aXZlTWFza1NldCgpW1wibGFzdFZhbGlkUG9zaXRpb25cIl0gPSBzZWVrTmV4dChnZXRBY3RpdmVNYXNrU2V0KClbXCJsYXN0VmFsaWRQb3NpdGlvblwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZU1hc2tzZXRJbmRleCA9IGluaXRpYWxJbmRleDsgLy9yZXN0b3JlIGluZGV4XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByYWRpeFBvc2l0aW9uID0gZ2V0QWN0aXZlQnVmZmVyKCkuam9pbignJykuaW5kZXhPZihvcHRzLnJhZGl4UG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5pc051bWVyaWMgJiYgY2hlY2t2YWwgIT09IHRydWUgJiYgcmFkaXhQb3NpdGlvbiAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuZ3JlZWR5ICYmIHBvcy5iZWdpbiA8PSByYWRpeFBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zLmJlZ2luID0gc2Vla1ByZXZpb3VzKHBvcy5iZWdpbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zLmVuZCA9IHBvcy5iZWdpbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PSBvcHRzLnJhZGl4UG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3MuYmVnaW4gPSByYWRpeFBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy5lbmQgPSBwb3MuYmVnaW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcCA9IHBvcy5iZWdpbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9IGlzVmFsaWQocCwgYywgc3RyaWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0cmljdCA9PT0gdHJ1ZSkgcmVzdWx0cyA9IFt7IFwiYWN0aXZlTWFza3NldEluZGV4XCI6IGFjdGl2ZU1hc2tzZXRJbmRleCwgXCJyZXN1bHRcIjogcmVzdWx0cyB9XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1pbmltYWxGb3J3YXJkUG9zaXRpb24gPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHJlc3VsdHMsIGZ1bmN0aW9uIChpbmRleCwgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVNYXNrc2V0SW5kZXggPSByZXN1bHRbXCJhY3RpdmVNYXNrc2V0SW5kZXhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRBY3RpdmVNYXNrU2V0KClbXCJ3cml0ZU91dEJ1ZmZlclwiXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnAgPSByZXN1bHRbXCJyZXN1bHRcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnAgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlZnJlc2ggPSBmYWxzZSwgYnVmZmVyID0gZ2V0QWN0aXZlQnVmZmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5wICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZnJlc2ggPSBucFtcInJlZnJlc2hcIl07IC8vb25seSByZXdyaXRlIGJ1ZmZlciBmcm9tIGlzVmFsaWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcCA9IG5wLnBvcyAhPSB1bmRlZmluZWQgPyBucC5wb3MgOiBwOyAvL3NldCBuZXcgcG9zaXRpb24gZnJvbSBpc1ZhbGlkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBucC5jICE9IHVuZGVmaW5lZCA/IG5wLmMgOiBjOyAvL3NldCBuZXcgY2hhciBmcm9tIGlzVmFsaWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlZnJlc2ggIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuaW5zZXJ0TW9kZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdFVubWFza2VkUG9zaXRpb24gPSBnZXRNYXNrTGVuZ3RoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYmZyQ2xvbmUgPSBidWZmZXIuc2xpY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChnZXRCdWZmZXJFbGVtZW50KGJmckNsb25lLCBsYXN0VW5tYXNrZWRQb3NpdGlvbiwgdHJ1ZSkgIT0gZ2V0UGxhY2VIb2xkZXIobGFzdFVubWFza2VkUG9zaXRpb24pICYmIGxhc3RVbm1hc2tlZFBvc2l0aW9uID49IHApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VW5tYXNrZWRQb3NpdGlvbiA9IGxhc3RVbm1hc2tlZFBvc2l0aW9uID09IDAgPyAtMSA6IHNlZWtQcmV2aW91cyhsYXN0VW5tYXNrZWRQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFVubWFza2VkUG9zaXRpb24gPj0gcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0UihwLCBnZXRNYXNrTGVuZ3RoKCksIGMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vc2hpZnQgdGhlIGx2cCBpZiBuZWVkZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbHZwID0gZ2V0QWN0aXZlTWFza1NldCgpW1wibGFzdFZhbGlkUG9zaXRpb25cIl0sIG5sdnAgPSBzZWVrTmV4dChsdnApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChubHZwICE9IGdldE1hc2tMZW5ndGgoKSAmJiBsdnAgPj0gcCAmJiAoZ2V0QnVmZmVyRWxlbWVudChnZXRBY3RpdmVCdWZmZXIoKSwgbmx2cCwgdHJ1ZSkgIT0gZ2V0UGxhY2VIb2xkZXIobmx2cCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEFjdGl2ZU1hc2tTZXQoKVtcImxhc3RWYWxpZFBvc2l0aW9uXCJdID0gbmx2cDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgZ2V0QWN0aXZlTWFza1NldCgpW1wid3JpdGVPdXRCdWZmZXJcIl0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHNldEJ1ZmZlckVsZW1lbnQoYnVmZmVyLCBwLCBjLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1pbmltYWxGb3J3YXJkUG9zaXRpb24gPT0gLTEgfHwgbWluaW1hbEZvcndhcmRQb3NpdGlvbiA+IHNlZWtOZXh0KHApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5pbWFsRm9yd2FyZFBvc2l0aW9uID0gc2Vla05leHQocCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFzdHJpY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRQb3MgPSBwIDwgZ2V0TWFza0xlbmd0aCgpID8gcCArIDEgOiBwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWluaW1hbEZvcndhcmRQb3NpdGlvbiA9PSAtMSB8fCBtaW5pbWFsRm9yd2FyZFBvc2l0aW9uID4gbmV4dFBvcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW1hbEZvcndhcmRQb3NpdGlvbiA9IG5leHRQb3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1pbmltYWxGb3J3YXJkUG9zaXRpb24gPiBnZXRBY3RpdmVNYXNrU2V0KClbXCJwXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRBY3RpdmVNYXNrU2V0KClbXCJwXCJdID0gbWluaW1hbEZvcndhcmRQb3NpdGlvbjsgLy9uZWVkZWQgZm9yIGNoZWNrdmFsIHN0cmljdCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RyaWN0ICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVNYXNrc2V0SW5kZXggPSBpbml0aWFsSW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRlcm1pbmVBY3RpdmVNYXNrc2V0SW5kZXgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod3JpdGVPdXQgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2gocmVzdWx0cywgZnVuY3Rpb24gKG5keCwgcnNsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyc2x0W1wiYWN0aXZlTWFza3NldEluZGV4XCJdID09IGFjdGl2ZU1hc2tzZXRJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByc2x0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgb3B0cy5vbktleVZhbGlkYXRpb24uY2FsbChzZWxmLCByZXN1bHRbXCJyZXN1bHRcIl0sIG9wdHMpOyB9LCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2V0QWN0aXZlTWFza1NldCgpW1wid3JpdGVPdXRCdWZmZXJcIl0gJiYgcmVzdWx0W1wicmVzdWx0XCJdICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYnVmZmVyID0gZ2V0QWN0aXZlQnVmZmVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Q2FyZXRQb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrdmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDYXJldFBvc2l0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdHMubnVtZXJpY0lucHV0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocCA+IHJhZGl4UG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDYXJldFBvc2l0aW9uID0gc2Vla1ByZXZpb3VzKG1pbmltYWxGb3J3YXJkUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09IG9wdHMucmFkaXhQb2ludCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NhcmV0UG9zaXRpb24gPSBtaW5pbWFsRm9yd2FyZFBvc2l0aW9uIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBuZXdDYXJldFBvc2l0aW9uID0gc2Vla1ByZXZpb3VzKG1pbmltYWxGb3J3YXJkUG9zaXRpb24gLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NhcmV0UG9zaXRpb24gPSBtaW5pbWFsRm9yd2FyZFBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0ZUJ1ZmZlcihpbnB1dCwgYnVmZmVyLCBuZXdDYXJldFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrdmFsICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgLy90aW1lb3V0IG5lZWRlZCBmb3IgSUVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNDb21wbGV0ZShidWZmZXIpID09PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXQudHJpZ2dlcihcImNvbXBsZXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNraXBJbnB1dEV2ZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXQudHJpZ2dlcihcImlucHV0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzU2xjdG4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0QWN0aXZlTWFza1NldCgpW1wiYnVmZmVyXCJdID0gZ2V0QWN0aXZlTWFza1NldCgpW1widW5kb0J1ZmZlclwiXS5zcGxpdCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5zaG93VG9vbHRpcCkgeyAvL3VwZGF0ZSB0b29sdGlwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXQucHJvcChcInRpdGxlXCIsIGdldEFjdGl2ZU1hc2tTZXQoKVtcIm1hc2tcIl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL25lZWRlZCBmb3IgSUU4IGFuZCBiZWxvd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGtleXVwRXZlbnQoZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyICRpbnB1dCA9ICQodGhpcyksIGlucHV0ID0gdGhpcywgayA9IGUua2V5Q29kZSwgYnVmZmVyID0gZ2V0QWN0aXZlQnVmZmVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGFuZHJvaWRjaHJvbWUgJiYgayA9PSBvcHRzLmtleUNvZGUuQkFDS1NQQUNFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNocm9tZVZhbHVlT25JbnB1dCA9PSBpbnB1dC5fdmFsdWVHZXQoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ZG93bkV2ZW50LmNhbGwodGhpcywgZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgb3B0cy5vbktleVVwLmNhbGwodGhpcywgZSwgYnVmZmVyLCBvcHRzKTsgLy9leHRyYSBzdHVmZiB0byBleGVjdXRlIG9uIGtleXVwXHJcbiAgICAgICAgICAgICAgICBpZiAoayA9PSBvcHRzLmtleUNvZGUuVEFCICYmIG9wdHMuc2hvd01hc2tPbkZvY3VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRpbnB1dC5oYXNDbGFzcygnZm9jdXMuaW5wdXRtYXNrJykgJiYgaW5wdXQuX3ZhbHVlR2V0KCkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gZ2V0QWN0aXZlQnVmZmVyVGVtcGxhdGUoKS5zbGljZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZUJ1ZmZlcihpbnB1dCwgYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZXQoaW5wdXQsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZU9uRm9jdXMgPSBnZXRBY3RpdmVCdWZmZXIoKS5qb2luKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZUJ1ZmZlcihpbnB1dCwgYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJ1ZmZlci5qb2luKCcnKSA9PSBnZXRBY3RpdmVCdWZmZXJUZW1wbGF0ZSgpLmpvaW4oJycpICYmICQuaW5BcnJheShvcHRzLnJhZGl4UG9pbnQsIGJ1ZmZlcikgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcmV0KGlucHV0LCBUcmFuc2xhdGVQb3NpdGlvbigwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXQuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXJldChpbnB1dCwgVHJhbnNsYXRlUG9zaXRpb24oMCksIFRyYW5zbGF0ZVBvc2l0aW9uKGdldE1hc2tMZW5ndGgoKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaW5wdXRFdmVudChlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2tpcElucHV0RXZlbnQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBza2lwSW5wdXRFdmVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcywgJGlucHV0ID0gJChpbnB1dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2hyb21lVmFsdWVPbklucHV0ID0gZ2V0QWN0aXZlQnVmZmVyKCkuam9pbignJyk7XHJcbiAgICAgICAgICAgICAgICBjaGVja1ZhbChpbnB1dCwgZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHdyaXRlQnVmZmVyKGlucHV0LCBnZXRBY3RpdmVCdWZmZXIoKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNDb21wbGV0ZShnZXRBY3RpdmVCdWZmZXIoKSkgPT09IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0LnRyaWdnZXIoXCJjb21wbGV0ZVwiKTtcclxuICAgICAgICAgICAgICAgICRpbnB1dC5jbGljaygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBtYXNrKGVsKSB7XHJcbiAgICAgICAgICAgICAgICAkZWwgPSAkKGVsKTtcclxuICAgICAgICAgICAgICAgIGlmICgkZWwuaXMoXCI6aW5wdXRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3N0b3JlIHRlc3RzICYgb3JpZ2luYWwgYnVmZmVyIGluIHRoZSBpbnB1dCBlbGVtZW50IC0gdXNlZCB0byBnZXQgdGhlIHVubWFza2VkIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgJGVsLmRhdGEoJ19pbnB1dG1hc2snLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdtYXNrc2V0cyc6IG1hc2tzZXRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYWN0aXZlTWFza3NldEluZGV4JzogYWN0aXZlTWFza3NldEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3B0cyc6IG9wdHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdpc1JUTCc6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vc2hvdyB0b29sdGlwXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuc2hvd1Rvb2x0aXApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsLnByb3AoXCJ0aXRsZVwiLCBnZXRBY3RpdmVNYXNrU2V0KClbXCJtYXNrXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY29ycmVjdCBncmVlZHkgc2V0dGluZyBpZiBuZWVkZWRcclxuICAgICAgICAgICAgICAgICAgICBnZXRBY3RpdmVNYXNrU2V0KClbJ2dyZWVkeSddID0gZ2V0QWN0aXZlTWFza1NldCgpWydncmVlZHknXSA/IGdldEFjdGl2ZU1hc2tTZXQoKVsnZ3JlZWR5J10gOiBnZXRBY3RpdmVNYXNrU2V0KClbJ3JlcGVhdCddID09IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vaGFuZGxlIG1heGxlbmd0aCBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJGVsLmF0dHIoXCJtYXhMZW5ndGhcIikgIT0gbnVsbCkgLy9vbmx5IHdoZW4gdGhlIGF0dHJpYnV0ZSBpcyBzZXRcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXhMZW5ndGggPSAkZWwucHJvcCgnbWF4TGVuZ3RoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXhMZW5ndGggPiAtMSkgeyAvL2hhbmRsZSAqLXJlcGVhdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKG1hc2tzZXRzLCBmdW5jdGlvbiAobmR4LCBtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKG1zKSA9PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc1tcInJlcGVhdFwiXSA9PSBcIipcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNbXCJyZXBlYXRcIl0gPSBtYXhMZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2V0TWFza0xlbmd0aCgpID49IG1heExlbmd0aCAmJiBtYXhMZW5ndGggPiAtMSkgeyAvL0ZGIHNldHMgbm8gZGVmaW5lZCBtYXggbGVuZ3RoIHRvIC0xIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1heExlbmd0aCA8IGdldEFjdGl2ZUJ1ZmZlclRlbXBsYXRlKCkubGVuZ3RoKSBnZXRBY3RpdmVCdWZmZXJUZW1wbGF0ZSgpLmxlbmd0aCA9IG1heExlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnZXRBY3RpdmVNYXNrU2V0KClbJ2dyZWVkeSddID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0QWN0aXZlTWFza1NldCgpWydyZXBlYXQnXSA9IE1hdGgucm91bmQobWF4TGVuZ3RoIC8gZ2V0QWN0aXZlQnVmZmVyVGVtcGxhdGUoKS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsLnByb3AoJ21heExlbmd0aCcsIGdldE1hc2tMZW5ndGgoKSAqIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBwYXRjaFZhbHVlUHJvcGVydHkoZWwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5udW1lcmljSW5wdXQpIG9wdHMuaXNOdW1lcmljID0gb3B0cy5udW1lcmljSW5wdXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLmRpciA9PSBcInJ0bFwiIHx8IChvcHRzLm51bWVyaWNJbnB1dCAmJiBvcHRzLnJpZ2h0QWxpZ25OdW1lcmljcykgfHwgKG9wdHMuaXNOdW1lcmljICYmIG9wdHMucmlnaHRBbGlnbk51bWVyaWNzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsLmNzcyhcInRleHQtYWxpZ25cIiwgXCJyaWdodFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLmRpciA9PSBcInJ0bFwiIHx8IG9wdHMubnVtZXJpY0lucHV0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLmRpciA9IFwibHRyXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbC5yZW1vdmVBdHRyKFwiZGlyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXREYXRhID0gJGVsLmRhdGEoJ19pbnB1dG1hc2snKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXREYXRhWydpc1JUTCddID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsLmRhdGEoJ19pbnB1dG1hc2snLCBpbnB1dERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1JUTCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL3VuYmluZCBhbGwgZXZlbnRzIC0gdG8gbWFrZSBzdXJlIHRoYXQgbm8gb3RoZXIgbWFzayB3aWxsIGludGVyZmVyZSB3aGVuIHJlLW1hc2tpbmdcclxuICAgICAgICAgICAgICAgICAgICAkZWwudW5iaW5kKFwiLmlucHV0bWFza1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2ZvY3VzLmlucHV0bWFzaycpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vYmluZCBldmVudHNcclxuICAgICAgICAgICAgICAgICAgICAkZWwuY2xvc2VzdCgnZm9ybScpLmJpbmQoXCJzdWJtaXRcIiwgZnVuY3Rpb24gKCkgeyAvL3RyaWdnZXIgY2hhbmdlIG9uIHN1Ym1pdCBpZiBhbnlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlT25Gb2N1cyAhPSBnZXRBY3RpdmVCdWZmZXIoKS5qb2luKCcnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsLmNoYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSkuYmluZCgncmVzZXQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsLnRyaWdnZXIoXCJzZXR2YWx1ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsLmJpbmQoXCJtb3VzZWVudGVyLmlucHV0bWFza1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkKHRoaXMpLCBpbnB1dCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghJGlucHV0Lmhhc0NsYXNzKCdmb2N1cy5pbnB1dG1hc2snKSAmJiBvcHRzLnNob3dNYXNrT25Ib3Zlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0Ll92YWx1ZUdldCgpICE9IGdldEFjdGl2ZUJ1ZmZlcigpLmpvaW4oJycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGVCdWZmZXIoaW5wdXQsIGdldEFjdGl2ZUJ1ZmZlcigpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLmJpbmQoXCJibHVyLmlucHV0bWFza1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkKHRoaXMpLCBpbnB1dCA9IHRoaXMsIG5wdFZhbHVlID0gaW5wdXQuX3ZhbHVlR2V0KCksIGJ1ZmZlciA9IGdldEFjdGl2ZUJ1ZmZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXQucmVtb3ZlQ2xhc3MoJ2ZvY3VzLmlucHV0bWFzaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVPbkZvY3VzICE9IGdldEFjdGl2ZUJ1ZmZlcigpLmpvaW4oJycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXQuY2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuY2xlYXJNYXNrT25Mb3N0Rm9jdXMgJiYgbnB0VmFsdWUgIT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChucHRWYWx1ZSA9PSBnZXRBY3RpdmVCdWZmZXJUZW1wbGF0ZSgpLmpvaW4oJycpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0Ll92YWx1ZVNldCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsgLy9jbGVhcm91dCBvcHRpb25hbCB0YWlsIG9mIHRoZSBtYXNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJPcHRpb25hbFRhaWwoaW5wdXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0NvbXBsZXRlKGJ1ZmZlcikgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXQudHJpZ2dlcihcImluY29tcGxldGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5jbGVhckluY29tcGxldGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2gobWFza3NldHMsIGZ1bmN0aW9uIChuZHgsIG1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKG1zKSA9PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc1tcImJ1ZmZlclwiXSA9IG1zW1wiX2J1ZmZlclwiXS5zbGljZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNbXCJsYXN0VmFsaWRQb3NpdGlvblwiXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlTWFza3NldEluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5jbGVhck1hc2tPbkxvc3RGb2N1cylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuX3ZhbHVlU2V0KCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gZ2V0QWN0aXZlQnVmZmVyVGVtcGxhdGUoKS5zbGljZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0ZUJ1ZmZlcihpbnB1dCwgYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KS5iaW5kKFwiZm9jdXMuaW5wdXRtYXNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRpbnB1dCA9ICQodGhpcyksIGlucHV0ID0gdGhpcywgbnB0VmFsdWUgPSBpbnB1dC5fdmFsdWVHZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuc2hvd01hc2tPbkZvY3VzICYmICEkaW5wdXQuaGFzQ2xhc3MoJ2ZvY3VzLmlucHV0bWFzaycpICYmICghb3B0cy5zaG93TWFza09uSG92ZXIgfHwgKG9wdHMuc2hvd01hc2tPbkhvdmVyICYmIG5wdFZhbHVlID09ICcnKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC5fdmFsdWVHZXQoKSAhPSBnZXRBY3RpdmVCdWZmZXIoKS5qb2luKCcnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlQnVmZmVyKGlucHV0LCBnZXRBY3RpdmVCdWZmZXIoKSwgc2Vla05leHQoZ2V0QWN0aXZlTWFza1NldCgpW1wibGFzdFZhbGlkUG9zaXRpb25cIl0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXQuYWRkQ2xhc3MoJ2ZvY3VzLmlucHV0bWFzaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZU9uRm9jdXMgPSBnZXRBY3RpdmVCdWZmZXIoKS5qb2luKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KS5iaW5kKFwibW91c2VsZWF2ZS5pbnB1dG1hc2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGlucHV0ID0gJCh0aGlzKSwgaW5wdXQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5jbGVhck1hc2tPbkxvc3RGb2N1cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkaW5wdXQuaGFzQ2xhc3MoJ2ZvY3VzLmlucHV0bWFzaycpICYmIGlucHV0Ll92YWx1ZUdldCgpICE9ICRpbnB1dC5hdHRyKFwicGxhY2Vob2xkZXJcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQuX3ZhbHVlR2V0KCkgPT0gZ2V0QWN0aXZlQnVmZmVyVGVtcGxhdGUoKS5qb2luKCcnKSB8fCBpbnB1dC5fdmFsdWVHZXQoKSA9PSAnJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuX3ZhbHVlU2V0KCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsgLy9jbGVhcm91dCBvcHRpb25hbCB0YWlsIG9mIHRoZSBtYXNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyT3B0aW9uYWxUYWlsKGlucHV0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KS5iaW5kKFwiY2xpY2suaW5wdXRtYXNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWRDYXJldCA9IGNhcmV0KGlucHV0KSwgYnVmZmVyID0gZ2V0QWN0aXZlQnVmZmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRDYXJldC5iZWdpbiA9PSBzZWxlY3RlZENhcmV0LmVuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbGlja1Bvc2l0aW9uID0gaXNSVEwgPyBUcmFuc2xhdGVQb3NpdGlvbihzZWxlY3RlZENhcmV0LmJlZ2luKSA6IHNlbGVjdGVkQ2FyZXQuYmVnaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGx2cCA9IGdldEFjdGl2ZU1hc2tTZXQoKVtcImxhc3RWYWxpZFBvc2l0aW9uXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0UG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuaXNOdW1lcmljKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQb3NpdGlvbiA9IG9wdHMuc2tpcFJhZGl4RGFuY2UgPT09IGZhbHNlICYmIG9wdHMucmFkaXhQb2ludCAhPSBcIlwiICYmICQuaW5BcnJheShvcHRzLnJhZGl4UG9pbnQsIGJ1ZmZlcikgIT0gLTEgP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9wdHMubnVtZXJpY0lucHV0ID8gc2Vla05leHQoJC5pbkFycmF5KG9wdHMucmFkaXhQb2ludCwgYnVmZmVyKSkgOiAkLmluQXJyYXkob3B0cy5yYWRpeFBvaW50LCBidWZmZXIpKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWVrTmV4dChsdnApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQb3NpdGlvbiA9IHNlZWtOZXh0KGx2cCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbGlja1Bvc2l0aW9uIDwgbGFzdFBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc01hc2soY2xpY2tQb3NpdGlvbikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXJldChpbnB1dCwgY2xpY2tQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgY2FyZXQoaW5wdXQsIHNlZWtOZXh0KGNsaWNrUG9zaXRpb24pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FyZXQoaW5wdXQsIGxhc3RQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLmJpbmQoJ2RibGNsaWNrLmlucHV0bWFzaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXJldChpbnB1dCwgMCwgc2Vla05leHQoZ2V0QWN0aXZlTWFza1NldCgpW1wibGFzdFZhbGlkUG9zaXRpb25cIl0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkuYmluZChwYXN0ZUV2ZW50ICsgXCIuaW5wdXRtYXNrIGRyYWdkcm9wLmlucHV0bWFzayBkcm9wLmlucHV0bWFza1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2tpcElucHV0RXZlbnQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNraXBJbnB1dEV2ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLCAkaW5wdXQgPSAkKGlucHV0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcGFzdGUgZXZlbnQgZm9yIElFOCBhbmQgbG93ZXIgSSBndWVzcyA7LSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUudHlwZSA9PSBcInByb3BlcnR5Y2hhbmdlXCIgJiYgaW5wdXQuX3ZhbHVlR2V0KCkubGVuZ3RoIDw9IGdldE1hc2tMZW5ndGgoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFzdGVWYWx1ZSA9IG9wdHMub25CZWZvcmVQYXN0ZSAhPSB1bmRlZmluZWQgPyBvcHRzLm9uQmVmb3JlUGFzdGUuY2FsbCh0aGlzLCBpbnB1dC5fdmFsdWVHZXQoKSkgOiBpbnB1dC5fdmFsdWVHZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrVmFsKGlucHV0LCB0cnVlLCBmYWxzZSwgcGFzdGVWYWx1ZS5zcGxpdCgnJyksIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ29tcGxldGUoZ2V0QWN0aXZlQnVmZmVyKCkpID09PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpbnB1dC50cmlnZ2VyKFwiY29tcGxldGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXQuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkuYmluZCgnc2V0dmFsdWUuaW5wdXRtYXNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja1ZhbChpbnB1dCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlT25Gb2N1cyA9IGdldEFjdGl2ZUJ1ZmZlcigpLmpvaW4oJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQuX3ZhbHVlR2V0KCkgPT0gZ2V0QWN0aXZlQnVmZmVyVGVtcGxhdGUoKS5qb2luKCcnKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0Ll92YWx1ZVNldCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkuYmluZCgnY29tcGxldGUuaW5wdXRtYXNrJywgb3B0cy5vbmNvbXBsZXRlXHJcbiAgICAgICAgICAgICAgICAgICAgKS5iaW5kKCdpbmNvbXBsZXRlLmlucHV0bWFzaycsIG9wdHMub25pbmNvbXBsZXRlXHJcbiAgICAgICAgICAgICAgICAgICAgKS5iaW5kKCdjbGVhcmVkLmlucHV0bWFzaycsIG9wdHMub25jbGVhcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgKS5iaW5kKFwia2V5dXAuaW5wdXRtYXNrXCIsIGtleXVwRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5kcm9pZGNocm9tZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZWwuYmluZChcImlucHV0LmlucHV0bWFza1wiLCBpbnB1dEV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZWwuYmluZChcImtleWRvd24uaW5wdXRtYXNrXCIsIGtleWRvd25FdmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApLmJpbmQoXCJrZXlwcmVzcy5pbnB1dG1hc2tcIiwga2V5cHJlc3NFdmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobXNpZTEwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZWwuYmluZChcImlucHV0LmlucHV0bWFza1wiLCBpbnB1dEV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9hcHBseSBtYXNrXHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tWYWwoZWwsIHRydWUsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZU9uRm9jdXMgPSBnZXRBY3RpdmVCdWZmZXIoKS5qb2luKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBXcmFwIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaW4gYSB0cnkvY2F0Y2ggYmxvY2sgc2luY2UgSUU5IHRocm93IFwiVW5zcGVjaWZpZWQgZXJyb3JcIiBpZiBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGlzIHVuZGVmaW5lZCB3aGVuIHdlIGFyZSBpbiBhbiBJRnJhbWUuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlRWxlbWVudCA9PT0gZWwpIHsgLy9wb3NpdGlvbiB0aGUgY2FyZXQgd2hlbiBpbiBmb2N1c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZWwuYWRkQ2xhc3MoJ2ZvY3VzLmlucHV0bWFzaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJldChlbCwgc2Vla05leHQoZ2V0QWN0aXZlTWFza1NldCgpW1wibGFzdFZhbGlkUG9zaXRpb25cIl0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdHMuY2xlYXJNYXNrT25Mb3N0Rm9jdXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdldEFjdGl2ZUJ1ZmZlcigpLmpvaW4oJycpID09IGdldEFjdGl2ZUJ1ZmZlclRlbXBsYXRlKCkuam9pbignJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLl92YWx1ZVNldCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhck9wdGlvbmFsVGFpbChlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZUJ1ZmZlcihlbCwgZ2V0QWN0aXZlQnVmZmVyKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFsbEV2ZW50UnVsZXIoZWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2FjdGlvbiBvYmplY3RcclxuICAgICAgICAgICAgaWYgKGFjdGlvbk9iaiAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoYWN0aW9uT2JqW1wiYWN0aW9uXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImlzQ29tcGxldGVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzQ29tcGxldGUoYWN0aW9uT2JqW1wiYnVmZmVyXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwidW5tYXNrZWR2YWx1ZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1JUTCA9IGFjdGlvbk9ialtcIiRpbnB1dFwiXS5kYXRhKCdfaW5wdXRtYXNrJylbJ2lzUlRMJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bm1hc2tlZHZhbHVlKGFjdGlvbk9ialtcIiRpbnB1dFwiXSwgYWN0aW9uT2JqW1wic2tpcERhdGVwaWNrZXJDaGVja1wiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm1hc2tcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFzayhhY3Rpb25PYmpbXCJlbFwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJmb3JtYXRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsID0gJCh7fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbC5kYXRhKCdfaW5wdXRtYXNrJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ21hc2tzZXRzJzogbWFza3NldHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYWN0aXZlTWFza3NldEluZGV4JzogYWN0aXZlTWFza3NldEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29wdHMnOiBvcHRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzUlRMJzogb3B0cy5udW1lcmljSW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLm51bWVyaWNJbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5pc051bWVyaWMgPSBvcHRzLm51bWVyaWNJbnB1dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUlRMID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tWYWwoJGVsLCBmYWxzZSwgZmFsc2UsIGFjdGlvbk9ialtcInZhbHVlXCJdLnNwbGl0KCcnKSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRBY3RpdmVCdWZmZXIoKS5qb2luKCcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAkLmlucHV0bWFzayA9IHtcclxuICAgICAgICAgICAgLy9vcHRpb25zIGRlZmF1bHRcclxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIl9cIixcclxuICAgICAgICAgICAgICAgIG9wdGlvbmFsbWFya2VyOiB7IHN0YXJ0OiBcIltcIiwgZW5kOiBcIl1cIiB9LFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpZmllcm1hcmtlcjogeyBzdGFydDogXCJ7XCIsIGVuZDogXCJ9XCIgfSxcclxuICAgICAgICAgICAgICAgIGdyb3VwbWFya2VyOiB7IHN0YXJ0OiBcIihcIiwgZW5kOiBcIilcIiB9LFxyXG4gICAgICAgICAgICAgICAgZXNjYXBlQ2hhcjogXCJcXFxcXCIsXHJcbiAgICAgICAgICAgICAgICBtYXNrOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgb25jb21wbGV0ZTogJC5ub29wLCAvL2V4ZWN1dGVzIHdoZW4gdGhlIG1hc2sgaXMgY29tcGxldGVcclxuICAgICAgICAgICAgICAgIG9uaW5jb21wbGV0ZTogJC5ub29wLCAvL2V4ZWN1dGVzIHdoZW4gdGhlIG1hc2sgaXMgaW5jb21wbGV0ZSBhbmQgZm9jdXMgaXMgbG9zdFxyXG4gICAgICAgICAgICAgICAgb25jbGVhcmVkOiAkLm5vb3AsIC8vZXhlY3V0ZXMgd2hlbiB0aGUgbWFzayBpcyBjbGVhcmVkXHJcbiAgICAgICAgICAgICAgICByZXBlYXQ6IDAsIC8vcmVwZXRpdGlvbnMgb2YgdGhlIG1hc2s6ICogfiBmb3JldmVyLCBvdGhlcndpc2Ugc3BlY2lmeSBhbiBpbnRlZ2VyXHJcbiAgICAgICAgICAgICAgICBncmVlZHk6IHRydWUsIC8vdHJ1ZTogYWxsb2NhdGVkIGJ1ZmZlciBmb3IgdGhlIG1hc2sgYW5kIHJlcGV0aXRpb25zIC0gZmFsc2U6IGFsbG9jYXRlIG9ubHkgaWYgbmVlZGVkXHJcbiAgICAgICAgICAgICAgICBhdXRvVW5tYXNrOiBmYWxzZSwgLy9hdXRvbWF0aWNhbGx5IHVubWFzayB3aGVuIHJldHJpZXZpbmcgdGhlIHZhbHVlIHdpdGggJC5mbi52YWwgb3IgdmFsdWUgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgX19sb29rdXBHZXR0ZXJfXyBvciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JcclxuICAgICAgICAgICAgICAgIGNsZWFyTWFza09uTG9zdEZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaW5zZXJ0TW9kZTogdHJ1ZSwgLy9pbnNlcnQgdGhlIGlucHV0IG9yIG92ZXJ3cml0ZSB0aGUgaW5wdXRcclxuICAgICAgICAgICAgICAgIGNsZWFySW5jb21wbGV0ZTogZmFsc2UsIC8vY2xlYXIgdGhlIGluY29tcGxldGUgaW5wdXQgb24gYmx1clxyXG4gICAgICAgICAgICAgICAgYWxpYXNlczoge30sIC8vYWxpYXNlcyBkZWZpbml0aW9ucyA9PiBzZWUganF1ZXJ5LmlucHV0bWFzay5leHRlbnNpb25zLmpzXHJcbiAgICAgICAgICAgICAgICBvbktleVVwOiAkLm5vb3AsIC8vb3ZlcnJpZGUgdG8gaW1wbGVtZW50IGF1dG9jb21wbGV0ZSBvbiBjZXJ0YWluIGtleXMgZm9yIGV4YW1wbGVcclxuICAgICAgICAgICAgICAgIG9uS2V5RG93bjogJC5ub29wLCAvL292ZXJyaWRlIHRvIGltcGxlbWVudCBhdXRvY29tcGxldGUgb24gY2VydGFpbiBrZXlzIGZvciBleGFtcGxlXHJcbiAgICAgICAgICAgICAgICBvbkJlZm9yZVBhc3RlOiB1bmRlZmluZWQsIC8vZXhlY3V0ZXMgYmVmb3JlIG1hc2tpbmcgdGhlIHBhc3RlZCB2YWx1ZSB0byBhbGxvdyBwcmVwcm9jZXNzaW5nIG9mIHRoZSBwYXN0ZWQgdmFsdWUuICBhcmdzID0+IHBhc3RlZFZhbHVlID0+IHJldHVybiBwcm9jZXNzZWRWYWx1ZVxyXG4gICAgICAgICAgICAgICAgb25Vbk1hc2s6IHVuZGVmaW5lZCwgLy9leGVjdXRlcyBhZnRlciB1bm1hc2tpbmcgdG8gYWxsb3cgcG9zdHByb2Nlc3Npbmcgb2YgdGhlIHVubWFza2VkdmFsdWUuICBhcmdzID0+IG1hc2tlZFZhbHVlLCB1bm1hc2tlZFZhbHVlXHJcbiAgICAgICAgICAgICAgICBzaG93TWFza09uRm9jdXM6IHRydWUsIC8vc2hvdyB0aGUgbWFzay1wbGFjZWhvbGRlciB3aGVuIHRoZSBpbnB1dCBoYXMgZm9jdXNcclxuICAgICAgICAgICAgICAgIHNob3dNYXNrT25Ib3ZlcjogdHJ1ZSwgLy9zaG93IHRoZSBtYXNrLXBsYWNlaG9sZGVyIHdoZW4gaG92ZXJpbmcgdGhlIGVtcHR5IGlucHV0XHJcbiAgICAgICAgICAgICAgICBvbktleVZhbGlkYXRpb246ICQubm9vcCwgLy9leGVjdXRlcyBvbiBldmVyeSBrZXktcHJlc3Mgd2l0aCB0aGUgcmVzdWx0IG9mIGlzVmFsaWQuIFBhcmFtczogcmVzdWx0LCBvcHRzXHJcbiAgICAgICAgICAgICAgICBza2lwT3B0aW9uYWxQYXJ0Q2hhcmFjdGVyOiBcIiBcIiwgLy9hIGNoYXJhY3RlciB3aGljaCBjYW4gYmUgdXNlZCB0byBza2lwIGFuIG9wdGlvbmFsIHBhcnQgb2YgYSBtYXNrXHJcbiAgICAgICAgICAgICAgICBzaG93VG9vbHRpcDogZmFsc2UsIC8vc2hvdyB0aGUgYWN0aXZlbWFzayBhcyB0b29sdGlwXHJcbiAgICAgICAgICAgICAgICBudW1lcmljSW5wdXQ6IGZhbHNlLCAvL251bWVyaWNJbnB1dCBpbnB1dCBkaXJlY3Rpb24gc3R5bGUgKGlucHV0IHNoaWZ0cyB0byB0aGUgbGVmdCB3aGlsZSBob2xkaW5nIHRoZSBjYXJldCBwb3NpdGlvbilcclxuICAgICAgICAgICAgICAgIC8vbnVtZXJpYyBiYXNpYyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgICAgICBpc051bWVyaWM6IGZhbHNlLCAvL2VuYWJsZSBudW1lcmljIGZlYXR1cmVzXHJcbiAgICAgICAgICAgICAgICByYWRpeFBvaW50OiBcIlwiLCAvL1wiLlwiLCAvLyB8IFwiLFwiXHJcbiAgICAgICAgICAgICAgICBza2lwUmFkaXhEYW5jZTogZmFsc2UsIC8vZGlzYWJsZSByYWRpeHBvaW50IGNhcmV0IHBvc2l0aW9uaW5nXHJcbiAgICAgICAgICAgICAgICByaWdodEFsaWduTnVtZXJpY3M6IHRydWUsIC8vYWxpZ24gbnVtZXJpY3MgdG8gdGhlIHJpZ2h0XHJcbiAgICAgICAgICAgICAgICAvL251bWVyaWMgYmFzaWMgcHJvcGVydGllc1xyXG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnOSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yOiBcIlswLTldXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRpbmFsaXR5OiAxXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnYSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yOiBcIltBLVphLXpcXHUwNDEwLVxcdTA0NEZcXHUwNDAxXFx1MDQ1MV1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZGluYWxpdHk6IDFcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICcqJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3I6IFwiW0EtWmEtelxcdTA0MTAtXFx1MDQ0RlxcdTA0MDFcXHUwNDUxMC05XVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkaW5hbGl0eTogMVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBrZXlDb2RlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgQUxUOiAxOCwgQkFDS1NQQUNFOiA4LCBDQVBTX0xPQ0s6IDIwLCBDT01NQTogMTg4LCBDT01NQU5EOiA5MSwgQ09NTUFORF9MRUZUOiA5MSwgQ09NTUFORF9SSUdIVDogOTMsIENPTlRST0w6IDE3LCBERUxFVEU6IDQ2LCBET1dOOiA0MCwgRU5EOiAzNSwgRU5URVI6IDEzLCBFU0NBUEU6IDI3LCBIT01FOiAzNiwgSU5TRVJUOiA0NSwgTEVGVDogMzcsIE1FTlU6IDkzLCBOVU1QQURfQUREOiAxMDcsIE5VTVBBRF9ERUNJTUFMOiAxMTAsIE5VTVBBRF9ESVZJREU6IDExMSwgTlVNUEFEX0VOVEVSOiAxMDgsXHJcbiAgICAgICAgICAgICAgICAgICAgTlVNUEFEX01VTFRJUExZOiAxMDYsIE5VTVBBRF9TVUJUUkFDVDogMTA5LCBQQUdFX0RPV046IDM0LCBQQUdFX1VQOiAzMywgUEVSSU9EOiAxOTAsIFJJR0hUOiAzOSwgU0hJRlQ6IDE2LCBTUEFDRTogMzIsIFRBQjogOSwgVVA6IDM4LCBXSU5ET1dTOiA5MVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vc3BlY2lmeSBrZXljb2RlcyB3aGljaCBzaG91bGQgbm90IGJlIGNvbnNpZGVyZWQgaW4gdGhlIGtleXByZXNzIGV2ZW50LCBvdGhlcndpc2UgdGhlIHByZXZlbnREZWZhdWx0IHdpbGwgc3RvcCB0aGVpciBkZWZhdWx0IGJlaGF2aW9yIGVzcGVjaWFsbHkgaW4gRkZcclxuICAgICAgICAgICAgICAgIGlnbm9yYWJsZXM6IFs4LCA5LCAxMywgMTksIDI3LCAzMywgMzQsIDM1LCAzNiwgMzcsIDM4LCAzOSwgNDAsIDQ1LCA0NiwgOTMsIDExMiwgMTEzLCAxMTQsIDExNSwgMTE2LCAxMTcsIDExOCwgMTE5LCAxMjAsIDEyMSwgMTIyLCAxMjNdLFxyXG4gICAgICAgICAgICAgICAgZ2V0TWFza0xlbmd0aDogZnVuY3Rpb24gKGJ1ZmZlciwgZ3JlZWR5LCByZXBlYXQsIGN1cnJlbnRCdWZmZXIsIG9wdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FsY3VsYXRlZExlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFncmVlZHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcGVhdCA9PSBcIipcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXRlZExlbmd0aCA9IGN1cnJlbnRCdWZmZXIubGVuZ3RoICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXBlYXQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkTGVuZ3RoICs9IChidWZmZXIubGVuZ3RoICogKHJlcGVhdCAtIDEpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsY3VsYXRlZExlbmd0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXNjYXBlUmVnZXg6IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzcGVjaWFscyA9IFsnLycsICcuJywgJyonLCAnKycsICc/JywgJ3wnLCAnKCcsICcpJywgJ1snLCAnXScsICd7JywgJ30nLCAnXFxcXCddO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoJyhcXFxcJyArIHNwZWNpYWxzLmpvaW4oJ3xcXFxcJykgKyAnKScsICdnaW0nKSwgJ1xcXFwkMScpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXQ6IGZ1bmN0aW9uICh2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9wdHMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgJC5pbnB1dG1hc2suZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZUFsaWFzKG9wdHMuYWxpYXMsIG9wdGlvbnMsIG9wdHMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hc2tTY29wZShnZW5lcmF0ZU1hc2tTZXRzKG9wdHMpLCAwLCBvcHRzLCB7IFwiYWN0aW9uXCI6IFwiZm9ybWF0XCIsIFwidmFsdWVcIjogdmFsdWUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkLmZuLmlucHV0bWFzayA9IGZ1bmN0aW9uIChmbiwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICB2YXIgb3B0cyA9ICQuZXh0ZW5kKHRydWUsIHt9LCAkLmlucHV0bWFzay5kZWZhdWx0cywgb3B0aW9ucyksXHJcbiAgICAgICAgICAgICAgICBtYXNrc2V0cyxcclxuICAgICAgICAgICAgICAgIGFjdGl2ZU1hc2tzZXRJbmRleCA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGZuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm1hc2tcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXNvbHZlIHBvc3NpYmxlIGFsaWFzZXMgZ2l2ZW4gYnkgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlQWxpYXMob3B0cy5hbGlhcywgb3B0aW9ucywgb3B0cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hc2tzZXRzID0gZ2VuZXJhdGVNYXNrU2V0cyhvcHRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hc2tzZXRzLmxlbmd0aCA9PSAwKSB7IHJldHVybiB0aGlzOyB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2tTY29wZSgkLmV4dGVuZCh0cnVlLCB7fSwgbWFza3NldHMpLCAwLCBvcHRzLCB7IFwiYWN0aW9uXCI6IFwibWFza1wiLCBcImVsXCI6IHRoaXMgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ1bm1hc2tlZHZhbHVlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkKHRoaXMpLCBpbnB1dCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkaW5wdXQuZGF0YSgnX2lucHV0bWFzaycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXNrc2V0cyA9ICRpbnB1dC5kYXRhKCdfaW5wdXRtYXNrJylbJ21hc2tzZXRzJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVNYXNrc2V0SW5kZXggPSAkaW5wdXQuZGF0YSgnX2lucHV0bWFzaycpWydhY3RpdmVNYXNrc2V0SW5kZXgnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMgPSAkaW5wdXQuZGF0YSgnX2lucHV0bWFzaycpWydvcHRzJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWFza1Njb3BlKG1hc2tzZXRzLCBhY3RpdmVNYXNrc2V0SW5kZXgsIG9wdHMsIHsgXCJhY3Rpb25cIjogXCJ1bm1hc2tlZHZhbHVlXCIsIFwiJGlucHV0XCI6ICRpbnB1dCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHJldHVybiAkaW5wdXQudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJlbW92ZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkKHRoaXMpLCBpbnB1dCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJGlucHV0LmRhdGEoJ19pbnB1dG1hc2snKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2tzZXRzID0gJGlucHV0LmRhdGEoJ19pbnB1dG1hc2snKVsnbWFza3NldHMnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVNYXNrc2V0SW5kZXggPSAkaW5wdXQuZGF0YSgnX2lucHV0bWFzaycpWydhY3RpdmVNYXNrc2V0SW5kZXgnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzID0gJGlucHV0LmRhdGEoJ19pbnB1dG1hc2snKVsnb3B0cyddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vd3JpdGVvdXQgdGhlIHVubWFza2VkdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5fdmFsdWVTZXQobWFza1Njb3BlKG1hc2tzZXRzLCBhY3RpdmVNYXNrc2V0SW5kZXgsIG9wdHMsIHsgXCJhY3Rpb25cIjogXCJ1bm1hc2tlZHZhbHVlXCIsIFwiJGlucHV0XCI6ICRpbnB1dCwgXCJza2lwRGF0ZXBpY2tlckNoZWNrXCI6IHRydWUgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY2xlYXIgZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpbnB1dC5yZW1vdmVEYXRhKCdfaW5wdXRtYXNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy91bmJpbmQgYWxsIGV2ZW50c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpbnB1dC51bmJpbmQoXCIuaW5wdXRtYXNrXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpbnB1dC5yZW1vdmVDbGFzcygnZm9jdXMuaW5wdXRtYXNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXN0b3JlIHRoZSB2YWx1ZSBwcm9wZXJ0eVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZVByb3BlcnR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVByb3BlcnR5ID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihpbnB1dCwgXCJ2YWx1ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVQcm9wZXJ0eSAmJiB2YWx1ZVByb3BlcnR5LmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQuX3ZhbHVlR2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaW5wdXQsIFwidmFsdWVcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldDogaW5wdXQuX3ZhbHVlR2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldDogaW5wdXQuX3ZhbHVlU2V0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuX19sb29rdXBHZXR0ZXJfXyAmJiBpbnB1dC5fX2xvb2t1cEdldHRlcl9fKFwidmFsdWVcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0Ll92YWx1ZUdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuX19kZWZpbmVHZXR0ZXJfXyhcInZhbHVlXCIsIGlucHV0Ll92YWx1ZUdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5fX2RlZmluZVNldHRlcl9fKFwidmFsdWVcIiwgaW5wdXQuX3ZhbHVlU2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkgeyAvL3RyeSBjYXRjaCBuZWVkZWQgZm9yIElFNyBhcyBpdCBkb2VzIG5vdCBzdXBwb3J0cyBkZWxldGluZyBmbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGlucHV0Ll92YWx1ZUdldDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGlucHV0Ll92YWx1ZVNldDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0Ll92YWx1ZUdldCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuX3ZhbHVlU2V0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZ2V0ZW1wdHltYXNrXCI6IC8vcmV0dXJuIHRoZSBkZWZhdWx0IChlbXB0eSkgbWFzayB2YWx1ZSwgdXNlZnVsbCBmb3Igc2V0dGluZyB0aGUgZGVmYXVsdCB2YWx1ZSBpbiB2YWxpZGF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGEoJ19pbnB1dG1hc2snKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFza3NldHMgPSB0aGlzLmRhdGEoJ19pbnB1dG1hc2snKVsnbWFza3NldHMnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZU1hc2tzZXRJbmRleCA9IHRoaXMuZGF0YSgnX2lucHV0bWFzaycpWydhY3RpdmVNYXNrc2V0SW5kZXgnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtYXNrc2V0c1thY3RpdmVNYXNrc2V0SW5kZXhdWydfYnVmZmVyJ10uam9pbignJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaGFzTWFza2VkVmFsdWVcIjogLy9jaGVjayB3aGV0ZXIgdGhlIHJldHVybmVkIHZhbHVlIGlzIG1hc2tlZCBvciBub3Q7IGN1cnJlbnRseSBvbmx5IHdvcmtzIHJlbGlhYmxlIHdoZW4gdXNpbmcganF1ZXJ5LnZhbCBmbiB0byByZXRyaWV2ZSB0aGUgdmFsdWUgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEoJ19pbnB1dG1hc2snKSA/ICF0aGlzLmRhdGEoJ19pbnB1dG1hc2snKVsnb3B0cyddLmF1dG9Vbm1hc2sgOiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaXNDb21wbGV0ZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXNrc2V0cyA9IHRoaXMuZGF0YSgnX2lucHV0bWFzaycpWydtYXNrc2V0cyddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVNYXNrc2V0SW5kZXggPSB0aGlzLmRhdGEoJ19pbnB1dG1hc2snKVsnYWN0aXZlTWFza3NldEluZGV4J107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMgPSB0aGlzLmRhdGEoJ19pbnB1dG1hc2snKVsnb3B0cyddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWFza1Njb3BlKG1hc2tzZXRzLCBhY3RpdmVNYXNrc2V0SW5kZXgsIG9wdHMsIHsgXCJhY3Rpb25cIjogXCJpc0NvbXBsZXRlXCIsIFwiYnVmZmVyXCI6IHRoaXNbMF0uX3ZhbHVlR2V0KCkuc3BsaXQoJycpIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJnZXRtZXRhZGF0YVwiOiAvL3JldHVybiBtYXNrIG1ldGFkYXRhIGlmIGV4aXN0c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhKCdfaW5wdXRtYXNrJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2tzZXRzID0gdGhpcy5kYXRhKCdfaW5wdXRtYXNrJylbJ21hc2tzZXRzJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVNYXNrc2V0SW5kZXggPSB0aGlzLmRhdGEoJ19pbnB1dG1hc2snKVsnYWN0aXZlTWFza3NldEluZGV4J107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWFza3NldHNbYWN0aXZlTWFza3NldEluZGV4XVsnbWV0YWRhdGEnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBpZiB0aGUgZm4gaXMgYW4gYWxpYXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNvbHZlQWxpYXMoZm4sIG9wdGlvbnMsIG9wdHMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL21heWJlIGZuIGlzIGEgbWFzayBzbyB3ZSB0cnlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vc2V0IG1hc2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMubWFzayA9IGZuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hc2tzZXRzID0gZ2VuZXJhdGVNYXNrU2V0cyhvcHRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hc2tzZXRzLmxlbmd0aCA9PSAwKSB7IHJldHVybiB0aGlzOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFza1Njb3BlKCQuZXh0ZW5kKHRydWUsIHt9LCBtYXNrc2V0cyksIGFjdGl2ZU1hc2tzZXRJbmRleCwgb3B0cywgeyBcImFjdGlvblwiOiBcIm1hc2tcIiwgXCJlbFwiOiB0aGlzIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBmbiA9PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRzID0gJC5leHRlbmQodHJ1ZSwge30sICQuaW5wdXRtYXNrLmRlZmF1bHRzLCBmbik7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZUFsaWFzKG9wdHMuYWxpYXMsIGZuLCBvcHRzKTsgLy9yZXNvbHZlIGFsaWFzZXNcclxuICAgICAgICAgICAgICAgIG1hc2tzZXRzID0gZ2VuZXJhdGVNYXNrU2V0cyhvcHRzKTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXNrc2V0cy5sZW5ndGggPT0gMCkgeyByZXR1cm4gdGhpczsgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFza1Njb3BlKCQuZXh0ZW5kKHRydWUsIHt9LCBtYXNrc2V0cyksIGFjdGl2ZU1hc2tzZXRJbmRleCwgb3B0cywgeyBcImFjdGlvblwiOiBcIm1hc2tcIiwgXCJlbFwiOiB0aGlzIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm4gPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAvL2xvb2sgZm9yIGRhdGEtaW5wdXRtYXNrIGF0cmlidXRlIC0gdGhlIGF0dHJpYnV0ZSBzaG91bGQgb25seSBjb250YWluIG9wdGlwbnNcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyT3B0aW9ucyA9ICQodGhpcykuYXR0cihcImRhdGEtaW5wdXRtYXNrXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyT3B0aW9ucyAmJiBhdHRyT3B0aW9ucyAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyT3B0aW9ucyA9IGF0dHJPcHRpb25zLnJlcGxhY2UobmV3IFJlZ0V4cChcIidcIiwgXCJnXCIpLCAnXCInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhb3B0aW9ucyA9ICQucGFyc2VKU09OKFwie1wiICsgYXR0ck9wdGlvbnMgKyBcIn1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBkYXRhb3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzID0gJC5leHRlbmQodHJ1ZSwge30sICQuaW5wdXRtYXNrLmRlZmF1bHRzLCBkYXRhb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlQWxpYXMob3B0cy5hbGlhcywgZGF0YW9wdGlvbnMsIG9wdHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5hbGlhcyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuaW5wdXRtYXNrKG9wdHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkgeyB9IC8vbmVlZCBhIG1vcmUgcmVsYXggcGFyc2VKU09OXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KShqUXVlcnkpO1xyXG4iLCIvKiEgaUNoZWNrIHYxLjAuMSBieSBEYW1pciBTdWx0YW5vdiwgaHR0cDovL2dpdC5pby9hcmx6ZUEsIE1JVCBMaWNlbnNlZCAqL1xuKGZ1bmN0aW9uKGgpe2Z1bmN0aW9uIEYoYSxiLGQpe3ZhciBjPWFbMF0sZT0vZXIvLnRlc3QoZCk/bTovYmwvLnRlc3QoZCk/czpsLGY9ZD09SD97Y2hlY2tlZDpjW2xdLGRpc2FibGVkOmNbc10saW5kZXRlcm1pbmF0ZTpcInRydWVcIj09YS5hdHRyKG0pfHxcImZhbHNlXCI9PWEuYXR0cih3KX06Y1tlXTtpZigvXihjaHxkaXxpbikvLnRlc3QoZCkmJiFmKUQoYSxlKTtlbHNlIGlmKC9eKHVufGVufGRlKS8udGVzdChkKSYmZil0KGEsZSk7ZWxzZSBpZihkPT1IKWZvcihlIGluIGYpZltlXT9EKGEsZSwhMCk6dChhLGUsITApO2Vsc2UgaWYoIWJ8fFwidG9nZ2xlXCI9PWQpe2lmKCFiKWFbcF0oXCJpZkNsaWNrZWRcIik7Zj9jW25dIT09dSYmdChhLGUpOkQoYSxlKX19ZnVuY3Rpb24gRChhLGIsZCl7dmFyIGM9YVswXSxlPWEucGFyZW50KCksZj1iPT1sLEE9Yj09bSxCPWI9PXMsSz1BP3c6Zj9FOlwiZW5hYmxlZFwiLHA9ayhhLEsreChjW25dKSksTj1rKGEsYit4KGNbbl0pKTtpZighMCE9PWNbYl0pe2lmKCFkJiZcbmI9PWwmJmNbbl09PXUmJmMubmFtZSl7dmFyIEM9YS5jbG9zZXN0KFwiZm9ybVwiKSxyPSdpbnB1dFtuYW1lPVwiJytjLm5hbWUrJ1wiXScscj1DLmxlbmd0aD9DLmZpbmQocik6aChyKTtyLmVhY2goZnVuY3Rpb24oKXt0aGlzIT09YyYmaCh0aGlzKS5kYXRhKHEpJiZ0KGgodGhpcyksYil9KX1BPyhjW2JdPSEwLGNbbF0mJnQoYSxsLFwiZm9yY2VcIikpOihkfHwoY1tiXT0hMCksZiYmY1ttXSYmdChhLG0sITEpKTtMKGEsZixiLGQpfWNbc10mJmsoYSx5LCEwKSYmZS5maW5kKFwiLlwiK0kpLmNzcyh5LFwiZGVmYXVsdFwiKTtlW3ZdKE58fGsoYSxiKXx8XCJcIik7Qj9lLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJ0cnVlXCIpOmUuYXR0cihcImFyaWEtY2hlY2tlZFwiLEE/XCJtaXhlZFwiOlwidHJ1ZVwiKTtlW3pdKHB8fGsoYSxLKXx8XCJcIil9ZnVuY3Rpb24gdChhLGIsZCl7dmFyIGM9YVswXSxlPWEucGFyZW50KCksZj1iPT1sLGg9Yj09bSxxPWI9PXMscD1oP3c6Zj9FOlwiZW5hYmxlZFwiLHQ9ayhhLHAreChjW25dKSksXG51PWsoYSxiK3goY1tuXSkpO2lmKCExIT09Y1tiXSl7aWYoaHx8IWR8fFwiZm9yY2VcIj09ZCljW2JdPSExO0woYSxmLHAsZCl9IWNbc10mJmsoYSx5LCEwKSYmZS5maW5kKFwiLlwiK0kpLmNzcyh5LFwicG9pbnRlclwiKTtlW3pdKHV8fGsoYSxiKXx8XCJcIik7cT9lLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKTplLmF0dHIoXCJhcmlhLWNoZWNrZWRcIixcImZhbHNlXCIpO2Vbdl0odHx8ayhhLHApfHxcIlwiKX1mdW5jdGlvbiBNKGEsYil7aWYoYS5kYXRhKHEpKXthLnBhcmVudCgpLmh0bWwoYS5hdHRyKFwic3R5bGVcIixhLmRhdGEocSkuc3x8XCJcIikpO2lmKGIpYVtwXShiKTthLm9mZihcIi5pXCIpLnVud3JhcCgpO2goRysnW2Zvcj1cIicrYVswXS5pZCsnXCJdJykuYWRkKGEuY2xvc2VzdChHKSkub2ZmKFwiLmlcIil9fWZ1bmN0aW9uIGsoYSxiLGQpe2lmKGEuZGF0YShxKSlyZXR1cm4gYS5kYXRhKHEpLm9bYisoZD9cIlwiOlwiQ2xhc3NcIildfWZ1bmN0aW9uIHgoYSl7cmV0dXJuIGEuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrXG5hLnNsaWNlKDEpfWZ1bmN0aW9uIEwoYSxiLGQsYyl7aWYoIWMpe2lmKGIpYVtwXShcImlmVG9nZ2xlZFwiKTthW3BdKFwiaWZDaGFuZ2VkXCIpW3BdKFwiaWZcIit4KGQpKX19dmFyIHE9XCJpQ2hlY2tcIixJPXErXCItaGVscGVyXCIsdT1cInJhZGlvXCIsbD1cImNoZWNrZWRcIixFPVwidW5cIitsLHM9XCJkaXNhYmxlZFwiLHc9XCJkZXRlcm1pbmF0ZVwiLG09XCJpblwiK3csSD1cInVwZGF0ZVwiLG49XCJ0eXBlXCIsdj1cImFkZENsYXNzXCIsej1cInJlbW92ZUNsYXNzXCIscD1cInRyaWdnZXJcIixHPVwibGFiZWxcIix5PVwiY3Vyc29yXCIsSj0vaXBhZHxpcGhvbmV8aXBvZHxhbmRyb2lkfGJsYWNrYmVycnl8d2luZG93cyBwaG9uZXxvcGVyYSBtaW5pfHNpbGsvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO2guZm5bcV09ZnVuY3Rpb24oYSxiKXt2YXIgZD0naW5wdXRbdHlwZT1cImNoZWNrYm94XCJdLCBpbnB1dFt0eXBlPVwiJyt1KydcIl0nLGM9aCgpLGU9ZnVuY3Rpb24oYSl7YS5lYWNoKGZ1bmN0aW9uKCl7dmFyIGE9aCh0aGlzKTtjPWEuaXMoZCk/XG5jLmFkZChhKTpjLmFkZChhLmZpbmQoZCkpfSl9O2lmKC9eKGNoZWNrfHVuY2hlY2t8dG9nZ2xlfGluZGV0ZXJtaW5hdGV8ZGV0ZXJtaW5hdGV8ZGlzYWJsZXxlbmFibGV8dXBkYXRlfGRlc3Ryb3kpJC9pLnRlc3QoYSkpcmV0dXJuIGE9YS50b0xvd2VyQ2FzZSgpLGUodGhpcyksYy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGM9aCh0aGlzKTtcImRlc3Ryb3lcIj09YT9NKGMsXCJpZkRlc3Ryb3llZFwiKTpGKGMsITAsYSk7aC5pc0Z1bmN0aW9uKGIpJiZiKCl9KTtpZihcIm9iamVjdFwiIT10eXBlb2YgYSYmYSlyZXR1cm4gdGhpczt2YXIgZj1oLmV4dGVuZCh7Y2hlY2tlZENsYXNzOmwsZGlzYWJsZWRDbGFzczpzLGluZGV0ZXJtaW5hdGVDbGFzczptLGxhYmVsSG92ZXI6ITAsYXJpYTohMX0sYSksaz1mLmhhbmRsZSxCPWYuaG92ZXJDbGFzc3x8XCJob3ZlclwiLHg9Zi5mb2N1c0NsYXNzfHxcImZvY3VzXCIsdz1mLmFjdGl2ZUNsYXNzfHxcImFjdGl2ZVwiLHk9ISFmLmxhYmVsSG92ZXIsQz1mLmxhYmVsSG92ZXJDbGFzc3x8XG5cImhvdmVyXCIscj0oXCJcIitmLmluY3JlYXNlQXJlYSkucmVwbGFjZShcIiVcIixcIlwiKXwwO2lmKFwiY2hlY2tib3hcIj09a3x8az09dSlkPSdpbnB1dFt0eXBlPVwiJytrKydcIl0nOy01MD5yJiYocj0tNTApO2UodGhpcyk7cmV0dXJuIGMuZWFjaChmdW5jdGlvbigpe3ZhciBhPWgodGhpcyk7TShhKTt2YXIgYz10aGlzLGI9Yy5pZCxlPS1yK1wiJVwiLGQ9MTAwKzIqcitcIiVcIixkPXtwb3NpdGlvbjpcImFic29sdXRlXCIsdG9wOmUsbGVmdDplLGRpc3BsYXk6XCJibG9ja1wiLHdpZHRoOmQsaGVpZ2h0OmQsbWFyZ2luOjAscGFkZGluZzowLGJhY2tncm91bmQ6XCIjZmZmXCIsYm9yZGVyOjAsb3BhY2l0eTowfSxlPUo/e3Bvc2l0aW9uOlwiYWJzb2x1dGVcIix2aXNpYmlsaXR5OlwiaGlkZGVuXCJ9OnI/ZDp7cG9zaXRpb246XCJhYnNvbHV0ZVwiLG9wYWNpdHk6MH0saz1cImNoZWNrYm94XCI9PWNbbl0/Zi5jaGVja2JveENsYXNzfHxcImljaGVja2JveFwiOmYucmFkaW9DbGFzc3x8XCJpXCIrdSxtPWgoRysnW2Zvcj1cIicrYisnXCJdJykuYWRkKGEuY2xvc2VzdChHKSksXG5BPSEhZi5hcmlhLEU9cStcIi1cIitNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5yZXBsYWNlKFwiMC5cIixcIlwiKSxnPSc8ZGl2IGNsYXNzPVwiJytrKydcIiAnKyhBPydyb2xlPVwiJytjW25dKydcIiAnOlwiXCIpO20ubGVuZ3RoJiZBJiZtLmVhY2goZnVuY3Rpb24oKXtnKz0nYXJpYS1sYWJlbGxlZGJ5PVwiJzt0aGlzLmlkP2crPXRoaXMuaWQ6KHRoaXMuaWQ9RSxnKz1FKTtnKz0nXCInfSk7Zz1hLndyYXAoZytcIi8+XCIpW3BdKFwiaWZDcmVhdGVkXCIpLnBhcmVudCgpLmFwcGVuZChmLmluc2VydCk7ZD1oKCc8aW5zIGNsYXNzPVwiJytJKydcIi8+JykuY3NzKGQpLmFwcGVuZFRvKGcpO2EuZGF0YShxLHtvOmYsczphLmF0dHIoXCJzdHlsZVwiKX0pLmNzcyhlKTtmLmluaGVyaXRDbGFzcyYmZ1t2XShjLmNsYXNzTmFtZXx8XCJcIik7Zi5pbmhlcml0SUQmJmImJmcuYXR0cihcImlkXCIscStcIi1cIitiKTtcInN0YXRpY1wiPT1nLmNzcyhcInBvc2l0aW9uXCIpJiZnLmNzcyhcInBvc2l0aW9uXCIsXCJyZWxhdGl2ZVwiKTtGKGEsITAsSCk7XG5pZihtLmxlbmd0aCltLm9uKFwiY2xpY2suaSBtb3VzZW92ZXIuaSBtb3VzZW91dC5pIHRvdWNoYmVnaW4uaSB0b3VjaGVuZC5pXCIsZnVuY3Rpb24oYil7dmFyIGQ9YltuXSxlPWgodGhpcyk7aWYoIWNbc10pe2lmKFwiY2xpY2tcIj09ZCl7aWYoaChiLnRhcmdldCkuaXMoXCJhXCIpKXJldHVybjtGKGEsITEsITApfWVsc2UgeSYmKC91dHxuZC8udGVzdChkKT8oZ1t6XShCKSxlW3pdKEMpKTooZ1t2XShCKSxlW3ZdKEMpKSk7aWYoSiliLnN0b3BQcm9wYWdhdGlvbigpO2Vsc2UgcmV0dXJuITF9fSk7YS5vbihcImNsaWNrLmkgZm9jdXMuaSBibHVyLmkga2V5dXAuaSBrZXlkb3duLmkga2V5cHJlc3MuaVwiLGZ1bmN0aW9uKGIpe3ZhciBkPWJbbl07Yj1iLmtleUNvZGU7aWYoXCJjbGlja1wiPT1kKXJldHVybiExO2lmKFwia2V5ZG93blwiPT1kJiYzMj09YilyZXR1cm4gY1tuXT09dSYmY1tsXXx8KGNbbF0/dChhLGwpOkQoYSxsKSksITE7aWYoXCJrZXl1cFwiPT1kJiZjW25dPT11KSFjW2xdJiZEKGEsbCk7ZWxzZSBpZigvdXN8dXIvLnRlc3QoZCkpZ1tcImJsdXJcIj09XG5kP3o6dl0oeCl9KTtkLm9uKFwiY2xpY2sgbW91c2Vkb3duIG1vdXNldXAgbW91c2VvdmVyIG1vdXNlb3V0IHRvdWNoYmVnaW4uaSB0b3VjaGVuZC5pXCIsZnVuY3Rpb24oYil7dmFyIGQ9YltuXSxlPS93bnx1cC8udGVzdChkKT93OkI7aWYoIWNbc10pe2lmKFwiY2xpY2tcIj09ZClGKGEsITEsITApO2Vsc2V7aWYoL3dufGVyfGluLy50ZXN0KGQpKWdbdl0oZSk7ZWxzZSBnW3pdKGUrXCIgXCIrdyk7aWYobS5sZW5ndGgmJnkmJmU9PUIpbVsvdXR8bmQvLnRlc3QoZCk/ejp2XShDKX1pZihKKWIuc3RvcFByb3BhZ2F0aW9uKCk7ZWxzZSByZXR1cm4hMX19KX0pfX0pKHdpbmRvdy5qUXVlcnl8fHdpbmRvdy5aZXB0byk7XG4iXX0=
