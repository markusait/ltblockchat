// const axios = require('axios');
// async function getState(){
//   let { data } = await axios.get('138.201.93.202:' + 3000 + '/state')
//   console.log(data.messages)
// }
// getState()
// // let result = await axios({
// //           url: 'http://localhost:' + port + '/txs',
// //           method: 'post',
// //           params: {
// //             return_state: true
// //           },
// //           data: {
// //             message,
// //             sender: username
// //           }
// // })

//
// const connect = require('lotion-connect');
//
//
// async function main() {
//   let { state } = await connect('88df7327f153449c80f2c936febb3f320fae2d60ebca78e1d4d53edd9432405e',{})
//   console.log(await state)
// }
//
// main()
//
// process.on('unhandledRejection', function(err) {
//   console.log(err)
// })

// let lotion = require('lotion')
//
// let { state } = lotion.connect('55dd80b13c625c636b2b6fc483889de7cecef3a79020785a695a6010c84d00ca')
//   .then(async function (result) {
//
//     console.log(state)
//   })
//
// console.log('Hey')







let { RpcClient } = require('tendermint')

async function getClient() {
  let client = await RpcClient('ws://149.28.137.69:46657')
  // let res = await client.block({height: 100})
  // console.log(await res);
  client.block(JSON.stringify({ height: 100 }))
  .then((res) => console.log(res))
  .catch((error) => {
    console.log(error,'Promise error');
  })
}
getClient()

  // request a block
//
// let  {connect}  = require('lotion')
// let GCI = '55dd80b13c625c636b2b6fc483889de7cecef3a79020785a695a6010c84d00ca';
//
// async function main() {
//   let { state, send } = await connect(GCI);
//   console.log(await state); // { count: 0 }
//   // console.log(await send({ nonce: 0 })); // { ok: true }
//   // console.log(await state); // { count: 1 }
// }
//
// main();
