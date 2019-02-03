'use strict'

// const App = require ( '../../node_modules/node-app-couchdb-client/index' )
const App = require ( 'node-app-socket.io-client/index' )

// import { throttle } from 'quasar'
import * as Debug from "debug"

const debug = Debug("mngr-ui-admin-lte:libs:input:io.host"),
      debug_internals = Debug("mngr-ui-admin-lte:libs:input:io.host:Internals"),
      debug_events = Debug("mngr-ui-admin-lte:libs:input:io.host:Events");


export default new Class({
  Extends: App,


  options: {

    path: '/hosts',

    status: undefined,

    stat_host: null,

  	requests : {
      range: [
    		{
					// sort_by_path: throttle(function(req, next, app){
          sort_by_path: function(req, next, app){
            // console.log('SORT_BY_PATH RANGE', req, new Date(req.opt.range.start), new Date(req.opt.range.end))
            debug_internals('SORT_BY_PATH RANGE', req)

            if(!Array.isArray(req.opt.range))
              req.opt.range = [req.opt.range]

            let tabulars_events_paths = []
            let tabulars_events_biggest_range = {start: 0, end: 0}
            let stats_events_paths = []
            let stats_events_biggest_range = {start: 0, end: 0}

            if(app.options.stat_host && this.status == 'ok'){
              Array.each(req.opt.range, function(range, index){
                let event = req[index]


                if(!app.options.paths_blacklist || app.options.paths_blacklist.test( event.path ) == false){
                  if(event.tabular == true){
                    tabulars_events_paths.push(event.path)
                    tabulars_events_biggest_range.start = (tabulars_events_biggest_range.start > range.start) ? tabulars_events_biggest_range.start : range.start
                    tabulars_events_biggest_range.end = (tabulars_events_biggest_range.end > range.end) ? tabulars_events_biggest_range.end : range.end
                  }
                  else{
                    stats_events_paths.push(event.path)
                    stats_events_biggest_range.start = (stats_events_biggest_range.start > range.start) ? stats_events_biggest_range.start : range.start
                    stats_events_biggest_range.end = (stats_events_biggest_range.end > range.end) ? stats_events_biggest_range.end : range.end
                  }
                  // this.io.emit('stats', {
                  //   host: app.options.stat_host,
                  //   stat: event.path,
                  //   format: (event.tabular == true) ? 'tabular' : undefined,
                  //   // range: req.opt.range
                  //   range: event.Range
      						// })
                }
                else if (!event.path) {
                  this.io.emit('stats', {
                    host: app.options.stat_host,
                    format: (event.tabular == true) ? 'tabular' : undefined,
                    range: event.Range
      						})
                }

                if(index == req.opt.range.length - 1){
                  console.log('SORT_BY_PATH RANGE', JSON.stringify(tabulars_events_paths), JSON.stringify(stats_events_paths))

                  if(tabulars_events_paths.length > 0)
                    this.io.emit('stats', {
                      host: app.options.stat_host,
                      stat: JSON.stringify(tabulars_events_paths),
                      format: 'tabular',
                      // range: req.opt.range
                      range: "posix "+tabulars_events_biggest_range.start+"-"+tabulars_events_biggest_range.end+"/*"
                    })

                  if(stats_events_paths.length > 0)
                    this.io.emit('stats', {
                      host: app.options.stat_host,
                      stat: JSON.stringify(stats_events_paths),
                      format: undefined,
                      // range: req.opt.range
                      range: "posix "+stats_events_biggest_range.start+"-"+stats_events_biggest_range.end+"/*"
                    })
                }



              }.bind(this))
            }




					// }, 500)
          }

				},

			],
      once: [
        // {
				// 	charts: function(req, next, app){
        //
        //     if(app.options.stat_host){
        //
        //       this.io.emit('charts', app.options.stat_host)
        //
        //     }
        //
				// 	}
				// },
        // {
				// 	instances: function(req, next, app){
        //
        //     if(app.options.stat_host){
        //
        //       this.io.emit('instances', app.options.stat_host)
        //
        //     }
        //
				// 	}
				// },
        // {
				// 	stats: function(req, next, app){
        //
        //     if(app.options.stat_host){
        //
        //       this.io.emit('stats', {
        //         host: app.options.stat_host
        //       })
        //
        //     }
        //
				// 	}
				// },
        // {
				// 	tabulars: function(req, next, app){
        //
        //     if(app.options.stat_host){
        //
        //       this.io.emit('stats', {
        //         host: app.options.stat_host,
        //         format: 'tabular',
        //       })
        //
        //     }
        //
				// 	}
				// },

			],
			periodical: [
        // {
				// 	sort_by_host: function(req, next, app){
        //
        //     if(app.options.stat_host){
        //
        //       this.io.emit('periodical', {
        //         host: app.options.stat_host,
        //       })
        //
        //     }
        //
				// 	}
				// }
			],

		},

    io: {
			// middlewares: [], //namespace.use(fn)
			// rooms: ['root'], //atomatically join connected sockets to this rooms
			routes: {
        // 'data': [{
				// 	// path: ':param',
				// 	// once: true, //socket.once
				// 	callbacks: ['data'],
				// 	// middlewares: [], //socket.use(fn)
				// }],
        'stat': [{
					// path: ':param',
					// once: true, //socket.once
					callbacks: ['data'],
					// middlewares: [], //socket.use(fn)
				}],
        'tabular': [{
					// path: ':param',
					// once: true, //socket.once
					callbacks: ['data'],
					// middlewares: [], //socket.use(fn)
				}],
        'instances': [{
					// path: ':param',
					// once: true, //socket.once
					callbacks: ['instances'],
					// middlewares: [], //socket.use(fn)
				}],
        // 'paths': [{
				// 	// path: ':param',
				// 	// once: true, //socket.once
				// 	callbacks: ['paths'],
				// 	// middlewares: [], //socket.use(fn)
				// }],
        'on': [{
					// path: ':param',
					// once: true, //socket.once
					callbacks: ['register'],
					// middlewares: [], //socket.use(fn)
				}],
        // // 'charts':[{
        // //   callbacks: ['charts']
        // // }],
        // 'charts': [{
				// 	// path: ':param',
				// 	// once: true, //socket.once
				// 	callbacks: ['charts'],
				// 	// middlewares: [], //socket.use(fn)
				// }],
        // 'instances': [{
				// 	// path: ':param',
				// 	// once: true, //socket.once
				// 	callbacks: ['instances'],
				// 	// middlewares: [], //socket.use(fn)
				// }],
				// 'stats': [{
				// 	// path: ':param',
				// 	// once: true, //socket.once
				// 	callbacks: ['stats'],
				// 	// middlewares: [], //socket.use(fn)
				// }],
				// // '*': [{// catch all
				// // 	path: '',
				// // 	callbacks: ['not_found_message'],
				// // 	middlewares: [], //socket.use(fn)
				// // }]
			}
		}


  },
  register: function(socket, next, result){
    debug_internals('register %o', result)

  },


  // paths: function(socket, next, paths){
  //   debug_internals('paths %o', paths)
  //
  //   // store.commit('hosts/clear')
  //   // store.commit('hosts/set', hosts)
  // },

  // charts: function(socket, next){
  //   let {host, status, charts} = arguments[2]
  //   console.log('IO.HOST charts', host, status, charts)
  //   this.status = status
  //
  //   this.fireEvent('onDoc', [Object.merge({type: 'charts'}, arguments[2]), {type: 'doc', input_type: this, app: null}]);
  //
  //   // this.charts(socket, next, {host: host, charts: charts})
  //   // this.fireEvent('onDoc', [{type: 'charts', charts: charts}, {type: 'doc', input_type: this, app: null}]);
  //   //
  //   // if(status == 'ok')
  //   //   this.io.emit('range', )
  // },
  instances: function(socket, next){
    // let {host, status, instances} = arguments[2]
    debug_internals('IO.HOST instances', arguments[2])
    // this.status = status

    // this.fireEvent('onDoc', [Object.merge({type: 'instances'}, arguments[2]), {type: 'doc', input_type: this, app: null}]);
    this.fireEvent('onDoc', [arguments[2], {type: 'doc', input_type: this, app: null}])

    // this.charts(socket, next, {host: host, charts: charts})
    // this.fireEvent('onDoc', [{type: 'charts', charts: charts}, {type: 'doc', input_type: this, app: null}]);
    //
    // if(status == 'ok')
    //   this.io.emit('range', )
  },
  data: function(socket, next, doc){
    debug_internals('data %o', doc)
    // let {type, doc, tabular} = stats
    // stats.key = stats.host
    // let stats = {
    //   key: doc.host,
    // }


    // if(stats.type == 'range')
    //   console.log('IO.HOST stats', arguments[2])

    // if(tabular != true)
      this.fireEvent((doc.range) ? 'onRangeDoc' : 'onPeriodicalDoc', [
        Object.merge(
          doc,
          {key : doc.host, type: (doc.stat) ? 'stat' : 'tabular'}
        ),
        {type: (doc.stat) ? 'stat' : 'tabular', input_type: this, app: null}
      ])

    if(doc.tabular){
      // this.io.emit('/', {host: this.options.stat_host, prop: 'instances'})
      this.io.emit('instances', {host: this.options.stat_host, prop: 'instances'})
    }

		// //////console.log('app_doc...', socket, arguments[2])
		// arguments[1]()
		// this.io.to('root').emit('response', 'a new user has joined the room saying '+arguments[2]);
		// next(socket)
	},

  initialize: function(options){
		this.parent(options);//override default options

		this.profile('root_init');//start profiling

    this.addEvent('onConnect', function(){
      debug_internals('initialize socket.onConnect')
      // this.io.emit('on', 'paths')
      // this.io.emit('/', {host: this.options.stat_host, prop: 'paths'})

      this.io.emit('on', 'stat')
      this.io.emit('/', {host: this.options.stat_host, prop: 'data', format: 'stat'})

      this.io.emit('on', 'tabular')
      this.io.emit('/', {host: this.options.stat_host, prop: 'data', format: 'tabular'})

      // this.io.emit('on', 'instances')
      // this.io.emit('/', {host: this.options.stat_host, prop: 'instances'})
    })

    this.addEvent('onExit', function(){
      //////console.log('EXITING...')

      if(this.io.disconnected == false)
        this.io.close()
    })
    // //////console.log('this.io', this.io)
    // this.io.emit('host', this.options.stat_host)

		this.profile('root_init');//end profiling

		this.log('root', 'info', 'root started');
  },

});
