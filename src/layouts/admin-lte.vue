<template>
<div class="wrapper">

  <admin-lte-header/>
  <!-- Left side column. contains the logo and sidebar -->
  <admin-lte-left-sidebar/>

  <!-- Content Wrapper. Contains page content -->
    <!-- <router-view :EventBus="EventBus"/> -->
    <router-view />
    
  <!-- /.content-wrapper -->

  <!-- Main Footer -->
  <admin-lte-footer/>

  <!-- Control Sidebar -->
  <admin-lte-control-sidebar/>
</div>
<!-- ./wrapper -->


</template>

<script>
// import { openURL } from 'quasar'

import AdminLteHeader from './admin-lte/header'
import AdminLteLeftSidebar from './admin-lte/leftSidebar'
import AdminLteFooter from './admin-lte/footer'
import AdminLteControlSidebar from './admin-lte/controlSidebar'

export default {
  name: 'admin-lte',

  components: {
    AdminLteHeader,
    AdminLteLeftSidebar,
    AdminLteFooter,
    AdminLteControlSidebar
  },
  props: {
    // EventBus: {
    //   type: [Object],
    //    default: () => ({})
    // },
  },

  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    // openURL
  },
  created: function(){
    // Resolve conflict in jQuery UI tooltip with Bootstrap tooltip
    jQuery.widget.bridge('uibutton', jQuery.ui.button)
  }
}

import 'admin-lte/dist/js/adminlte.min.js'
</script>

<style>
</style>
