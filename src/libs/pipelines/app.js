'use strict'

import InputIOApp from '@libs/input/poller/app'

import DefaultConn from '@etc/default.io'

import store from 'src/store'

let buffer = {}

export default  {
	input: [
		{
			poll: {
				id: "input.app",
				conn: [
          Object.merge(
            Object.clone(DefaultConn),
            {
              id: 'input.app',
              module: InputIOApp,
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
	// 		// console.log('search_pipeline ', doc)
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
		function(doc){
			store.commit('app/doc', {type: 'search', 'value': doc})

		}
	]
}
