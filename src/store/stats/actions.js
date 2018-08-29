import PouchDB from 'pouchdb-browser'
// import PouchDB from 'pouchdb'
// // import websql from 'pouchdb-adapter-websql'
// import memory from 'pouchdb-adapter-memory'
//
// // import * as $PouchDB from 'pouchdb'
// // const PouchDB = $PouchDB['default']
// PouchDB.plugin(memory)
const db = new PouchDB('live')
//
// import ddocs from '@libs/_views/sort'
//
// Array.each(ddocs, function(ddoc){
//   db.put(ddoc).then(function (info) {
//     //////console.log('sortView info', info)
//
//   }).catch(function (err) {
//     //////console.log('sortView err', err)
//   });
//
//   let keys = Object.keys(ddoc.views)
//
//   Array.each(keys, function(key){
//     let doc = ddoc._id.replace('_design/', '')+'/'+key
//     //////console.log('quering', doc)
//     db.query(doc, {
//       limit: 0 // don't return any results
//     }).then(function (res) {
//       //////console.log('build index res', res)
//     }).catch(function (err) {
//       //////console.log('build index err', err)
//     });
//
//   })
//
// })
//
// // // // import PouchDB from 'pouchdb-memory'
// // // PouchDB.plugin(require('pouchdb-adapter-memory'))
// // //
// // let mem = new PouchDB('MemStats', {adapter: 'memory'})

import Deque from 'double-ended-queue'

const QUEUE_SIZE = 300
let deque = new Deque(QUEUE_SIZE)
let compacted = false

export const get = ({ commit, dispatch }, payload) => {

  //console.log('action get...')

  return new Promise((resolve, reject) => {
    let length = payload.length || deque.length
    let range = payload.range || []
    let docs = []



    if(deque.length > 0){
      let arr = deque.toArray()
      //////console.log('fetching deque.length', deque.length, arr)
      // let reg = new RegExp(payload.path+'\/'+payload.host)
      while (length > 0 && arr.length > 0){
        // //////console.log('fetching while...', length)
        let doc = arr.pop()
        // delete doc._rev
        if(doc._id.indexOf(payload.host+'/'+payload.path+'/'+payload.key) > -1){
          ////console.log('DOC', doc, (doc.metadata.timestamp > range[0] && doc.metadata.timestamp < range[1]))
          if(
            payload.range && (doc.metadata.timestamp > range[0] && doc.metadata.timestamp < range[1])
            || !payload.range
          ){

            // if(doc.metadata.timestamp > range[0])
            //   range[0] = doc.metadata.timestamp

            docs[length - 1] = doc
            length--
          }

        }
      }
    }

    ////console.log('fetching doc', docs, range)

    if(length > 0 || payload.range){//from db
      let options = {
        startkey: payload.host+'/'+payload.path+'/'+payload.key+'\ufff0',
        endkey: payload.host+'/'+payload.path+'/'+payload.key,
        inclusive_end: true,
        descending: true,
        include_docs: true
      }

      if(payload.length){
        options.limit = length
      }

      if(payload.range){
        // let range = payload.range
        options.startkey = payload.host+'/'+payload.path+'/'+payload.key+'@'+range[1]+'\ufff0'
        options.endkey = payload.host+'/'+payload.path+'/'+payload.key+'@'+range[0]
      }

      ////console.log('OPTIONS', options)

      db.allDocs(options).then(function (res) {
        ////console.log('fetching from db', res)

        res.rows.reverse()
        while (length > 0 && res.rows.length > 0){
          //////console.log('fetching while...', length)
          docs[length - 1] = res.rows.pop().doc
          length--
        }

        resolve(Array.clean(docs))
      }).catch(function (err) {
        //////console.log('fetching from db err', err)
        resolve(Array.clean(docs))
      })
    }
    else{
      resolve(docs)
    }

    // setTimeout(() => {
    //   // commit('someMutation')
    //   //////console.log('stats get')
    //   resolve()
    // }, 1000)
  })
}

export const add = ({ commit, dispatch }, payload) => {
  //console.log('action add...')
  // //////console.log('length', deque.length)

  if(deque.length >= QUEUE_SIZE)
    dispatch('flush', payload)

  if(Array.isArray(payload.data)){
    //firts soft data by timestamp
    payload.data.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} );

    // //console.log('ACTION', payload.data)

    let docs = []
    Array.each(payload.data, function(data, index){
      let doc = new Object()
      doc._id = payload.host+'/'+payload.path+'/'+payload.key+'@'+data.timestamp
      doc.data = data.value
      doc.metadata = new Object()
      doc.metadata.timestamp = data.timestamp
      doc.metadata.host = payload.host
      doc.metadata.path = payload.path+'/'+payload.key
      // doc.metadata.key = payload.key
      doc.metadata.type = 'periodical'
      docs.push(doc)
      deque.push(doc)

      // if(index == payload.data.length -1)
      //   commit('add', {
      //     host: payload.host,
      //     path:payload.path,
      //     key:payload.key,
      //     data: {
      //       timestamp: doc.metadata.timestamp,
      //       value: doc
      //     }
      //   })
    })

    // let commit_docs = []
    // Array.each(docs, function(doc){
    //   let commit_doc = new Object()
    //   commit_doc.host = payload.host
    //   commit_doc.path = payload.path
    //   commit_doc.key = payload.key
    //   commit_doc.value = doc._id
    //   commit_docs.push(commit_doc)
    // })
    commit('add', {
      host: payload.host,
      path:payload.path,
      key:payload.key,
      data: {
        timestamp: docs[docs.length - 1].metadata.timestamp,
        value: docs[docs.length - 1]
      }
    })
  }
  else{
    let doc = new Object()
    doc._id = payload.host+'/'+payload.path+'/'+payload.key+'@'+payload.data.timestamp
    doc.data = payload.data.value
    doc.metadata = new Object()
    doc.metadata.timestamp = payload.data.timestamp
    doc.metadata.host = payload.host
    doc.metadata.path = payload.path+'/'+payload.key
    // doc.metadata.key = payload.key
    doc.metadata.type = 'periodical'

    deque.push(doc)
    // commit('add', doc)
    commit('add', {
      host: payload.host,
      path:payload.path,
      key:payload.key,
      data: {
        timestamp: doc.metadata.timestamp,
        value: doc
      }
    })

    // let commit_doc = new Object()
    // commit_doc.host = payload.host
    // commit_doc.path = payload.path
    // commit_doc.key = payload.key
    // commit_doc.value = doc._id
    // commit('add', commit_doc)

  }

  //////console.log('length', deque.length)

}

export const flush = ({ commit, state }, payload) => {
  //console.log('action flushing...')

  if(deque.isEmpty() !== true){
    let docs = deque.toArray()
    deque.clear()

    db.bulkDocs(docs)
    .then(function (status) {

      // commit('clear', payload)

    }).catch(function (err) {
      //////console.log('bulkDocs err', err)
    });
  }

}

export const splice = ({ commit, state }, payload) => {
  //console.log('action splice', payload)
  // let spliced = state[payload.host][payload.path][payload.key]
  let _id = payload.host+'/'+payload.path+'/'+payload.key

  //////console.log('splice', state[payload.host][payload.path][payload.key].length)

  db.allDocs({
    // startkey: spliced.split('@')[0],
    // endkey: spliced.split('@')[0]+'\ufff0'
    startkey: _id,
    endkey: _id+'\ufff0'
  }).then(function (result) {
    //////console.log('allDocs result', result);
    // // handle result

    let deleted = []

    Array.each(result.rows, function(row){
      // //////console.log('result', row);
      let doc = {}
      if(!_id.contains(row.id)){
        doc['_deleted'] = true
        doc['_id'] = row.id
        doc['_rev'] = row.value.rev
        deleted.push(doc)
      }

    })

    //////console.log('to delete', deleted)
    if(deleted.length > 0){
      db.bulkDocs(deleted).then(function (result) {
        //console.log('action bulkDocs delete result', result);

        if(compacted === false){
          compacted = true
          db.compact().then(function (result) {
            //console.log('action compact result ',result);
            compacted = false
          }).catch(function (err) {
            //console.log('action  compact err ',err);
          });
        }

      }).catch(function (err) {
        //console.log('action  bulkDocs delete err', err);
      });
    }
  }).catch(function (err) {
    //console.log('action allDocs', err);
  });

//   commit('splice', payload)
//   let spliced = state[payload.host][payload.path][payload.key]
//
//   //////console.log('splice', state[payload.host][payload.path][payload.key].length)
//
//   disk.allDocs({
//     startkey: spliced[0].split('@')[0],
//     endkey: spliced[0].split('@')[0]+'\ufff0'
//   }).then(function (result) {
//     // //////console.log('result', result);
//     // // handle result
//
//     let deleted = []
//
//     Array.each(result.rows, function(row){
//       // //////console.log('result', row);
//       let doc = {}
//       if(!spliced.contains(row.id)){
//         doc['_deleted'] = true
//         doc['_id'] = row.id
//         doc['_rev'] = row.value.rev
//         deleted.push(doc)
//       }
//
//     })
//
//     // //////console.log('to delete', deleted)
//     if(deleted.length > 0){
//       disk.bulkDocs(deleted).then(function (result) {
//         //////console.log('bulkDocs result', result);
//
//         disk.compact().then(function (result) {
//           //////console.log('compact result ',result);
//         }).catch(function (err) {
//           //////console.log('compact err ',err);
//         });
//
//       }).catch(function (err) {
//         //////console.log('bulkDocs delete', err);
//       });
//     }
//   }).catch(function (err) {
//     //////console.log('allDocs', err);
//   });
}
