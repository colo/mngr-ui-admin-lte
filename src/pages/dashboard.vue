<template>
  <!-- Main content -->
  <section class="content" v-if="!$route.params.host">
    <div class="row">
      <section class="col-lg-12 connectedSortable">
        <admin-lte-box-solid
          :docs_per_sec="docs_per_sec"
          :number_of_hosts="number_of_hosts"
        >
        </admin-lte-box-solid>
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

import { mapState } from 'vuex'

export default {
  name: 'Dashboard',

  components: {
    AdminLteBoxSolid
  },

  computed: Object.merge(mapState({
    // arrow functions can make the code very succinct!
    docs_per_sec: state => state.app.docs.count,
    number_of_hosts: state => state.hosts.all.length,
  })),
  updated: function(){
    this.$store.commit('hosts/current', this.$route.params.host || '')
  }

}


</script>
