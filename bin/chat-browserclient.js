const axios = require('axios');
const connect = require('lotion-connect')
const port = 3000;
const io = require('socket.io-client');
const {
  generatePrivateKey,
  generatePublicKey,
  genPassword,
  toBuffer,
  hashTx,
  signTx,
  encrypt,
  decrypt,
} = require('./cryptoKeys.js')

//TODO
// 2. make socket connection that changes only on output
// 3. connect different nodes
// search for how to push down nodes!
//show tendermint log
// make text for which node to trust
// find a nice blockexplorer?
// include this error handling https://stackoverflow.com/questions/951791/javascript-global-error-handling/10556743#10556743

async function main() {
  try {
    let nodes = ['ws://localhost:46657']
    // let nodes = ['ws://138.201.93.202:46657', 'ws://149.28.137.69:46657', 'ws://174.138.6.71:46657']
    let {
      send
    } = await connect(null, {
      genesis: {},
      nodes: nodes
    })
    let chatWindow = document.getElementById('chat-window'),
      message = document.getElementById('message'),
      username = document.getElementById('username'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback'),
      privKeyOutput = document.getElementById('privKeyOutput'),
      pubKeyOutput = document.getElementById('pubKeyOutput'),
      passwordOutput = document.getElementById('passwordOutput'),
      genKeys = document.getElementById('genKeys'),
      option = document.getElementById('optionSelection'),
      inputDecryptText = document.getElementById('inputDecryptText'),
      decryptPassword = document.getElementById('decryptPassword'),
      decryptTextOutput = document.getElementById('decryptTextOutput'),
      decryptTextButton = document.getElementById('decryptText'),
      slctnode = document.getElementById('slctnode'),
      connectionStatus = document.getElementById('connectionStatus'),
      connectSocket = document.getElementById('connectSocket'),
      disconnectSocket = document.getElementById('disconnectSocket')


    decryptTextButton.addEventListener('click', () => {
      let password = decryptPassword.value
      let message = inputDecryptText.value
      let res = decrypt(message, password)
      decryptTextOutput.innerHTML = res
    })
    genKeys.addEventListener('click', () => {
      let privKey = generatePrivateKey()
      let pubKey = generatePublicKey(privKey)
      let password = genPassword(pubKey)

      privKeyOutput.innerHTML = privKey
      pubKeyOutput.innerHTML = pubKey
      passwordOutput.innerHTML = password
    })
    // when user hits enter message is sent
    message.addEventListener('keydown', (e) => {
      if (e.keyCode === 13 && message.value.length >= 1 && message.value !== '') {
        let type = document.getElementById('slctmsg')
        let messageType = type.options[type.selectedIndex].value
        sendMessage(username.value, message.value, messageType)
        message.value = ""
      }
    })
    //when user clicks send button message is sent
    btn.addEventListener('click', () => {
      if (message.value.length >= 1 && message.value !== '') {
        let type = document.getElementById('slctmsg')
        let messageType = type.options[type.selectedIndex].value
        sendMessage(username.value, message.value, messageType)
        message.value = ""
      }
    })

    async function sendMessage(username, message, messageType) {
      if (messageType !== 'normalMessage' && privKeyOutput.textContent === ' ') {
        alert('generate Keys first')
        return
      }
      let privKey = privKeyOutput.textContent
      let pubKey = pubKeyOutput.textContent
      let password = genPassword(pubKey)
      switch (messageType) {
        case 'chooseOption':
          option.style.color = 'red'
          alert('choose an Option')
          break
        case 'normalMessage':
          await send({
            sender: username,
            message: message
          })
          break
        case 'hashMessage':
          let {
            txHash
          } = signTx(privKey, {
            sender: pubKey,
            message: message
          })
          await send({
            sender: username,
            message: txHash
          })
          break
        case 'encryptMessage':
          let encText = encrypt(message, password)
          console.log(encText);
          await send({
            sender: username,
            message: encText
          })
          break
      }
    }
    // innitial Sockete the user is connected to
    // let socket = io.connect('http://138.201.93.202:8080/');
    // slctnode.addEventListener('change', function() {
    //   socket.close()
    //   socket = io.connect(`http://${this.value}:8080/`)
    // })
    // //improve here
    // setInterval(() => {
    //   setStatus(socket.connected,socket.io.uri)
    // }, 1000)
    // //
    // function setStatus(connected,uri){
    //   let subUri = uri.slice(0,uri.length-6)
    //   connectionStatus.innerHTML = `Connected : ${connected} | Node: ${subUri} `
    // }
    //chat output

    connectSocket.addEventListener('click', () =>{
      console.log('connect clicked');
      connectSocketConnection()
    })

    disconnectSocket.addEventListener('click', () =>{
      console.log('disconnect clicked');
      disconnectSocketConnection()
    })

    async function disconnectSocketConnection () {
      try{
        // socket.close()
        socket.disconnect
      }catch(e){
        console.log(e);
      }
    }
    let lastMessagesLength = 0
    async function connectSocketConnection (){
      try {
        let socket = io.connect('http://localhost:8080/')
        socket.on('chat', (data) => {
          let currentMessageLength = data.length
          if(currentMessageLength > lastMessagesLength){
            let newData = data.slice(lastMessagesLength, currentMessageLength-1)
            console.log(newData);
            newData.forEach((message) => {
              output.innerHTML += '<p class="sender" style="color: black"><strong>' + message.sender + ': </strong>' + message.message + '</p>'
            })
            lastMessagesLength = currentMessageLength
          }
          chatWindow.scrollTop = chatWindow.scrollHeight
        });
        console.log('sucess');
      } catch (e) {
        console.log(e);
      }
    }



  } catch (err) {
    console.log('error occured' + err);
  }
}

process.on('unhandledRejection', function(reason, p) {
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  console.trace();
});

main();
