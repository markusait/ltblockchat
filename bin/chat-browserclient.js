const axios = require('axios');
let connect = require('lotion-connect')
const port = 3000;
//TODO
//1. add to server and make cors possible
// 2. connect different nodes
// add socet connection?
// add another encryption layer
// search for chatbot api
// search for how to push down nodes!
// show block height? and make tendermint mine empty blocks false
// make text for which node to trust
// make intro
// find a nice blockexplorer?

async function main() {
    try {
        /**
         * Append ws:// to the front of each validator IP address and the
         * tendermint port 46657 to the end. ws means connect via websockets
         * this step is required in order for connect to work
         */
        let nodes = 'ws://localhost:46657'

        //all clients share the same genesis file
        // TODO: acutally load the file
        let genesis = {
          "app_hash": "b600cc693f96924721e7e55944663e41e6410fe24a1dfbbb9befe8368673a372",
          "chain_id": "test-chain-OgmGOm",
          "genesis_time": "2018-10-07T22:09:10.308916005+02:00",
          "validators": [
            {
              "name": "Winkel",
              "power": 10,
              "pub_key": {
                "type": "AC26791624DE60",
                "value": "hNER7QpFepPULZU1HI4QwEdBrWT0ttCfegggEICt1y8="
              }
            }
          ]
        }

        // let { send, state } = await connect(null, { genesis, nodes}); not working
        /**
         * Use Javascript object literal syntax to grab the current state of the data in the blockchain
         * and to grab the send function. Note the keyword async in the function above and the keyword
         * await here below. This is an async function.
         */

        let { send } = await connect(null, {
        genesis: genesis,
        nodes: [ 'ws://localhost:46657' ]
        })
        /**
         * This listens for when a user presses enter on the shell after
         * entering some text. If it is for the username, save it in the username variable
         * If it is a message use the Lotion.connect.send function
         */
         let message = document.getElementById('message'),
               username = document.getElementById('username'),
               btn = document.getElementById('send'),
               output = document.getElementById('output'),
               feedback = document.getElementById('feedback');

          // when user hits enter message is sent
          message.addEventListener('keydown', (e) => {
           // if(message.value ==='kill node 1'){
           //    sendMessage(username.value, 'killed node 1/2/3')
           //
           //  }
           if(e.keyCode === 13) {
             sendMessage(username.value, message.value)
             message.value = ""
           }

         })
          //when user clicks send button message is sent
          btn.addEventListener('click', () => {
            if (message.value && message.value.length >= 1 && message.value !== '') {
               sendMessage(username.value, message.value)
               message.value = "";
             }
         })
         async function sendMessage(username, message) {
               const result = await send({sender: username, message: message})

         }
        let lastMessagesLength = 0
        //instead of setInterval one could use sockets to update the state
        async function updateState() {
          // let messages = await axios.get('http://localhost:' + 3000 + '/state').then(res => res.data)
          let { data } = await axios.get('http://localhost:' + 3000 + '/state')
          let messages = await data.messages
          if (messages !== undefined && messages.length >= lastMessagesLength) {
            for (let i = lastMessagesLength; i < messages.length; i++) {
              // console.log(messages[i], i)
              let {sender, message} = messages[i]
              feedback.innerHTML = ''
              output.innerHTML += `<p class=sender> <strong> ${sender} : </strong> ${message}</p>`
            }
            lastMessagesLength = messages.length
          }
          }
          setInterval(async () => {
            updateState()
          }, 50)

    } catch (err) {
        console.log('error occured' + err);
    }
}

process.on('unhandledRejection', function(reason, p){
    console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
    console.trace();
});

main();
