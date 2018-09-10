'use strict'

// const App = require ( '../../node_modules/node-app-couchdb-client/index' )
const App = require ( 'node-app-socket.io-client/index' )


export default new Class({
  Extends: App,


  options: {

    path: '/os',

    stat_host: null,

  	requests : {
      once: [
			],
			periodical: [
			],

		},

    io: {
			// middlewares: [], //namespace.use(fn)
			// rooms: ['root'], //atomatically join connected sockets to this rooms
			routes: {
				'os': [{
					// path: ':param',
					// once: true, //socket.once
					callbacks: ['os'],
					// middlewares: [], //socket.use(fn)
				}],
				// '*': [{// catch all
				// 	path: '',
				// 	callbacks: ['not_found_message'],
				// 	middlewares: [], //socket.use(fn)
				// }]
			}
		}


  },

  os: function(socket, next){
    this.fireEvent('onPeriodicalDoc', [arguments[2], {type: 'periodical', input_type: this, app: null}]);
		// console.log('app_doc...', socket, arguments[2])
		// arguments[1]()
		// this.io.to('root').emit('response', 'a new user has joined the room saying '+arguments[2]);
		// next(socket)
	},

  initialize: function(options){
		this.parent(options);//override default options

		this.profile('root_init');//start profiling

    // console.log('this.io', this.io)
    this.io.emit('host', this.options.stat_host)

		this.profile('root_init');//end profiling

		this.log('root', 'info', 'root started');
  },

});
