<template lang="pug">
  select(class="form-control", :id="theId")
    option(value="0") Escriba el nombre del cliente
</template>


<script>
  import 'select2';

  export default {
    mounted() {
      this.initSelect2();
    },
    props: {
      endpoint: {
        type: String,
        required: true
      },
      theId: {
        type: String,
        required: true
      },
      parentId: {
        type: String,
        required: true
      },
      empty: {
        type: Boolean
      },
      disabled: {
        type: Boolean
      }
    },
    data() {
      return {
        sel: ''
      };
    },

    watch: {
      disabled() {
        if (this.disabled) {
          this.sel.prop('disabled', true);
        } else {
          this.sel.prop('disabled', false);
        }
      },
      empty() {
        this.sel.val(null).trigger('change');
      }
    },

    methods: {
      initSelect2() {
        this.sel = $(`#${this.theId}`).select2({
          dropdownParent: $(this.parentId),
          width: '100%',
          ajax: {
            url: this.endpoint,
            dataType: 'json',
            delay: 250,
            data(params) {
              return {
                q: params.term,
              };
            },

            processResults(data, params) {
              params.page = params.page || 1;
              return {
                results: data.items,
                pagination: {
                  more: (params.page * 30) < data.total_count
                }
              };
            },
            cache: true
          }
        });

        this.sel.on('select2:select', (e) => {
          this.$emit('select', e.params.data);
        });
      },
    }
  };
</script>
