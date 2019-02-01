'use strict'

import InputIOHost from '@libs/input/poller/io.host'

import DefaultConn from '@etc/default.io'

import store from 'src/store'

let buffer = {}

import * as Debug from "debug"

const debug = Debug("mngr-ui-admin-lte:libs:pipelines:host"),
      debug_internals = Debug("mngr-ui-admin-lte:libs:pipelines:host:Internals"),
      debug_events = Debug("mngr-ui-admin-lte:libs:pipelines:host:Events");


export default  {
	input: [
		{
			poll: {
				id: "input.os",
				conn: [
          Object.merge(
            Object.clone(DefaultConn),
            {
              id: 'os',
              module: InputIOHost,
            }
          )

				],
				// connect_retry_count: 5,
				// connect_retry_periodical: 1000,
				requests: {
					periodical: 1000,
				},
			},
		},

	],
	// filters: [
	// 	function(doc, opts, next){
  //
	// 		// //console.log('search_pipeline ', doc)
  //
	// 		buffer = Object.merge(buffer, doc.data)
  //
	// 		if(buffer.hosts && buffer.paths){
	// 			next(buffer)
	// 			buffer = {}
	// 		}
	// 	}
	// ],
	output: [
		function(payload){
			debug_internals('OUTPUT', payload)
      // console.log('HOST OUTPUT', payload)
			// //console.log('app/doc output', doc)
			// store.commit('app/doc', doc)

			// if(payload.type == 'host'){
			if(!payload.err)
				EventBus.$emit(payload.type, payload)

			// }
			// else{
			// 	EventBus.$emit('os', payload)
			// }



		}
	]
}
