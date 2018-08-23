'use strict'

import cron from 'node-cron'

// import store from 'src/store'

import Watcher from '@libs/input/vue/watcher'

// import Vue from 'vue'
//
// Vue.component('watcher', watcher)
// Vue.component('input-watcher', watcher)

export default {
	input: [
		{
			vue: new Watcher()
		}
	],
	filters: [
		// decompress,
		function(docs, opts, next, pipeline){

		},

	],
	output: [
		function(doc){
			//console.log('output sizeof', sizeof(doc))

		}
	]
}
