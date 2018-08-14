<template>
<div class="wrapper">

  <admin-lte-header/>
  <!-- Left side column. contains the logo and sidebar -->
  <admin-lte-left-sidebar/>

  <!-- Content Wrapper. Contains page content -->
    <!-- <router-view :EventBus="EventBus"/> -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <h1>
          {{$route.name}}
          <!-- <small>{{$route.params.host}}</small> -->
        </h1>
        <ol class="breadcrumb">
          <li>
            <router-link :to="{name: 'Home'}">
              <i class="fa fa-dashboard"></i> Home
            </router-link>
          </li>
          <li class="active">{{$route.name}}</li>
        </ol>
      </section>

      <!-- Main content -->
       <router-view></router-view>


      <!-- /.content -->
    </div>

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
      // leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    // openURL
  },
  created: function(){
    // Resolve conflict in jQuery UI tooltip with Bootstrap tooltip
    jQuery.widget.bridge('uibutton', jQuery.ui.button)
  },
  mounted: function(){
    console.log('admin-lte this.$route',this.$route)
    // Make the dashboard widgets sortable Using jquery UI
    $('.connectedSortable').sortable({
      placeholder         : 'sort-highlight',
      connectWith         : '.connectedSortable',
      handle              : '.box-header, .nav-tabs',
      forcePlaceholderSize: true,
      zIndex              : 999999
    });
    $('.connectedSortable .box-header, .connectedSortable .nav-tabs-custom').css('cursor', 'move');
  }
}

import 'admin-lte/dist/js/adminlte.min.js'
</script>

<style>
</style>
