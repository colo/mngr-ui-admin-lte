<template>
  <!-- Main content -->
  <section class="content" v-if="!$route.params.host">
    <div class="row">
      <section class="col-lg-12 connectedSortable">
        <admin-lte-box-solid/>
      </section>
    </div>

  </section>
  <router-view v-else></router-view>


</template>

<style>
</style>

<script>

import AdminLTE from 'admin-lte/dist/js/adminlte.min.js'

import AdminLteBoxSolid from 'components/admin-lte/dashboard/boxSolid'

export default {
  name: 'Dashboard',

  components: {
    AdminLteBoxSolid
  },

  updated: function(){
    this.$store.commit('hosts/current', this.$route.params.host || '')
  }

}


</script>
