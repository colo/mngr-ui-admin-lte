import PouchDB from 'pouchdb-browser'
// import PouchDB from 'pouchdb'
// // import websql from 'pouchdb-adapter-websql'
// import memory from 'pouchdb-adapter-memory'
//
// // import * as $PouchDB from 'pouchdb'
// // const PouchDB = $PouchDB['default']
// PouchDB.plugin(memory)
const db = new PouchDB('live')

import ddocs from '@libs/_views/sort'

Array.each(ddocs, function(ddoc){
  db.put(ddoc).then(function (info) {
    console.log('sortView info', info)

  }).catch(function (err) {
    console.log('sortView err', err)
  });

  let keys = Object.keys(ddoc.views)

  Array.each(keys, function(key){
    let doc = ddoc._id.replace('_design/', '')+'/'+key
    console.log('quering', doc)
    db.query(doc, {
      limit: 0 // don't return any results
    }).then(function (res) {
      console.log('build index res', res)
    }).catch(function (err) {
      console.log('build index err', err)
    });

  })

})

// // // import PouchDB from 'pouchdb-memory'
// // PouchDB.plugin(require('pouchdb-adapter-memory'))
// //
// let mem = new PouchDB('MemStats', {adapter: 'memory'})

import Deque from 'double-ended-queue'

const QUEUE_SIZE = 300
let deque = new Deque(QUEUE_SIZE)
let compacted = false

export const add = ({ commit, dispatch }, payload) => {

  // console.log('length', deque.length)

  if(deque.length >= QUEUE_SIZE)
    dispatch('flush', payload)

  if(Array.isArray(payload.value)){

    let docs = []
    Array.each(payload.value, function(value){
      let doc = new Object()
      doc._id = payload.host+'/'+payload.path+'/'+payload.key+'@'+value.timestamp
      doc.data = value.value
      doc.metadata = new Object()
      doc.metadata.host = payload.host
      doc.metadata.path = payload.path
      doc.metadata.key = payload.key
      doc.metadata.type = 'periodical'
      docs.push(doc)
      deque.push(doc)
    })

    let commit_docs = []
    Array.each(docs, function(doc){
      let commit_doc = new Object()
      commit_doc.host = payload.host
      commit_doc.path = payload.path
      commit_doc.key = payload.key
      commit_doc.value = doc._id
      commit_docs.push(commit_doc)
    })


    commit('add', commit_docs)
  }
  else{
    let doc = new Object()
    doc._id = payload.host+'/'+payload.path+'/'+payload.key+'@'+payload.value.timestamp
    doc.data = payload.value.value
    doc.metadata = new Object()
    doc.metadata.host = payload.host
    doc.metadata.path = payload.path
    doc.metadata.key = payload.key
    doc.metadata.type = 'periodical'

    deque.push(doc)

    let commit_doc = new Object()
    commit_doc.host = payload.host
    commit_doc.path = payload.path
    commit_doc.key = payload.key
    commit_doc.value = doc._id
    commit('add', commit_doc)
  }

  console.log('length', deque.length)

}

export const flush = ({ commit, state }, payload) => {
  console.log('flushing...')

  if(deque.isEmpty() !== true){
    let docs = Array.clone(deque.toArray())
    deque.clear()

    db.bulkDocs(docs)
    .then(function (status) {
      console.log('bulkDocs status', status)

    }).catch(function (err) {
      console.log('bulkDocs err', err)
    });
  }

}

export const splice = ({ commit, state }, payload) => {
  commit('splice', payload)
  let spliced = state[payload.host][payload.path][payload.key][0]

  console.log('splice', state[payload.host][payload.path][payload.key].length)

  db.allDocs({
    startkey: spliced.split('@')[0],
    endkey: spliced.split('@')[0]+'\ufff0'
  }).then(function (result) {
    console.log('allDocs result', result);
    // // handle result

    let deleted = []

    Array.each(result.rows, function(row){
      // console.log('result', row);
      let doc = {}
      if(!spliced.contains(row.id)){
        doc['_deleted'] = true
        doc['_id'] = row.id
        doc['_rev'] = row.value.rev
        deleted.push(doc)
      }

    })

    console.log('to delete', deleted)
    if(deleted.length > 0){
      db.bulkDocs(deleted).then(function (result) {
        console.log('bulkDocs delete result', result);

        if(compacted === false){
          compacted = true
          db.compact().then(function (result) {
            console.log('compact result ',result);
            compacted = false
          }).catch(function (err) {
            console.log('compact err ',err);
          });
        }

      }).catch(function (err) {
        console.log('bulkDocs delete err', err);
      });
    }
  }).catch(function (err) {
    console.log('allDocs', err);
  });

//   commit('splice', payload)
//   let spliced = state[payload.host][payload.path][payload.key]
//
//   console.log('splice', state[payload.host][payload.path][payload.key].length)
//
//   disk.allDocs({
//     startkey: spliced[0].split('@')[0],
//     endkey: spliced[0].split('@')[0]+'\ufff0'
//   }).then(function (result) {
//     // console.log('result', result);
//     // // handle result
//
//     let deleted = []
//
//     Array.each(result.rows, function(row){
//       // console.log('result', row);
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
//     // console.log('to delete', deleted)
//     if(deleted.length > 0){
//       disk.bulkDocs(deleted).then(function (result) {
//         console.log('bulkDocs result', result);
//
//         disk.compact().then(function (result) {
//           console.log('compact result ',result);
//         }).catch(function (err) {
//           console.log('compact err ',err);
//         });
//
//       }).catch(function (err) {
//         console.log('bulkDocs delete', err);
//       });
//     }
//   }).catch(function (err) {
//     console.log('allDocs', err);
//   });
}
