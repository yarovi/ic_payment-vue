<template lang="pug">
   .modal.fade(tabindex="-1", role="dialog", id="client-modal")
    .modal-dialog.modal-lg(role="document")
      .modal-content
        .modal-header
          button(type="button", class="close", data-dismiss="modal", aria-label="Close"): span(aria-hidden="true") &times;
          h4.modal-title {{ modalTitle }}
        .modal-body
          .tab-container
            ul.nav.nav-tabs(role="tablist")
              li(role="presentation" class="active"): a(href="#client-required" aria-controls="client-required" role="tab" data-toggle="tab") Datos Principales
              li(role="presentation"): a(href="#client-direction" aria-controls="client-direction" role="tab" data-toggle="tab") Direccion
              li(role="presentation"): a(href="#client-optional" aria-controls="client-optional" role="tab" data-toggle="tab") Opcionales


            .tab-content
              .tab-pane.active.fade.in#client-required(role="tabpanel")
                form
                  .row
                    .col-md-6
                      h4 Datos Personales
                      .form-group
                        label(for="client-name") Nombres
                        input(type="text", class="form-control", id="client-name", tabindex="1", v-model="store.client.nombres")
                      .form-group
                        label(for="client-dni") Cedula
                        PhoneInput(placeholder="cedula", types="text",ids="client-dni" role="dni" data="cedula", :value="store.client.cedula" v-on:change="inputChange", class="form-control")
                      .form-group
                        label(for="client-telephone") Telefono
                        PhoneInput(placeholder="telefono", types="tel", data="telefono", :value="store.client.telefono" v-on:change="inputChange", class="form-control")


                    .col-md-6
                      h4.placeholder ...
                      .form-group
                        label(for="client-lastname") Apellidos
                        input(type="text", class="form-control", id="client-lastname", tabindex="2", v-model="store.client.apellidos")
                      .form-group
                        label(for="client-phone") Celular
                        PhoneInput(placeholder="celular", types="tel", data="celular", :value="store.client.celular" v-on:change="inputChange", class="form-control")

              .tab-pane.fade.in#client-direction(role="tabpanel")
                form
                  .row
                    .col-md-6
                      h4 Dirección
                      .form-group
                        label(for="client-provincia") Provincia
                        input(type="text", class="form-control password-confirm", id="client-provincia", list="provincias" tabindex="5", v-model="store.client.provincia")
                        datalist#provincias
                          option(value="La Romana")
                          option(value="Santo Domingo")
                          option(value="La Altagracia")

                      .form-group
                        label(for="cient-sector") Sector
                        input(class="form-control", id="client-sector", tabindex="6", v-model="store.client.sector")

                    .col-md-6
                      h4.placeholder ...
                      .form-group
                        label(for="client-street") Calle
                        input(type="text", class="form-control", id="client-street", tabindex="6", v-model="store.client.calle")

                      .form-group
                        label(for="client-house") Casa #
                        input(type="text", class="form-control", id="client-house", tabindex="7", v-model="store.client.casa")

                    .col-md-12
                    .form-group
                      label(for="u-client-house") Detalle de Direccion
                      textarea(name="", class="form-control", id="client-direction-details", tabindex="8", cols="30", rows="5", v-model="store.client.direccion")

              .tab-pane.fade.in#client-optional(role="tabpanel")
                form
                  .row
                    .col-md-6
                      h4 Datos Personales +
                      .form-group
                        label(for="client-job") Lugar de Trabajo
                        input(type="text", class="form-control", id="client-job", v-model="store.client.lugar_trabajo")
                      .form-group
                        label(for="client-salary") Salario
                        input(type="number", class="form-control", id="client-salary", value="0", v-model="store.client.ingresos")

                    .col-md-6
                      h4.placeholder ...
                      .form-group
                        label(for="client-job-number") Telefono del trabajo
                        input(type="tel", class="form-control", id="client-job-telephone", v-model="store.client.tel_trabajo")

        .modal-footer
          button(type="button", class="btn", data-dismiss="modal") Cancelar
          button(type="button", class="btn save", id="btn-save-client", @click.stop.prevent='save') {{ buttonTitle }}
</template>

<script>
  import PhoneInput from './../../sharedComponents/PhoneInput.vue';
  import utils from './../../sharedComponents/utils';

  export default {
    components: {
      PhoneInput
    },
    props: {
      client: {
        type: Object,
        required: true,
      },
      modalMode: {
        type: String,
        required: true
      },
      store: {
        type: Object,
        required: true
      }
    },

    mounted() {
      $('#client-modal').on('hide.bs.modal', () => {
        this.$emit('dimiss');
        this.store.clientEmpty();
        this.store.setClientMode('add');
      });
    },

    methods: {
      save() {
        this.addUpdate(this.modalMode);
      },

      emitChange() {
        this.$emit('save');
      },

      inputChange(param) {
        const current = this.store.client;
        current[param.key] = param.value;
        this.store.setClient(current);
      },

      addUpdate(method) {
        const { client } = this.store;
        const requiredFields = [
          client.nombres,
          client.apellidos,
          client.cedula,
          client.celular,
          client.provincia,
          client.calle,
          client.sector,
          client.casa,
        ];

        const empty = utils.isEmpty(requiredFields);

        if (!empty) {
          this.$http.post(`clients/${method}`, this.getDataForm(client))
            .then((res) => {
              this.emitChange();
              this.showMessage(res.data.message);
              if (res.data.message.type === 'success') {
                $('#client-modal').modal('hide');
              }
            })
            .catch((err) => {
              this.$toasted.error(err);
            });
        } else {
          this.$toasted.info('LLene todos los campos por favor');
        }
      },
    },

    computed: {
      modalTitle() {
        return (this.modalMode === 'add') ? 'Nuevo Cliente' : `Editando a ${this.client.nombres}`;
      },

      buttonTitle() {
        return (this.modalMode === 'add') ? 'Guardar' : 'Actualizar';
      }
    }
  };
</script>
