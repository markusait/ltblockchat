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
const ips = ['138.201.93.202', '206.189.97.68', '174.138.6.71']
// const ips = ['localhost', 'localhost', 'localhost']
const p2pPort = 46657
const wsPort = 8081
//TODO
// find a nice blockexplorer?
// include this error handling https://stackoverflow.com/questions/951791/javascript-global-error-handling/10556743#10556743

async function main() {
  try {
    let nodes = [`ws://${ips[0]}:${p2pPort}`,`ws://${ips[1]}:${p2pPort}`,`ws://${ips[2]}:${p2pPort}`]
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
      connectionStatus = document.getElementById('connectionStatus')

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
      switch (messageType) {
        case 'normalMessage':
          await send({
            sender: username,
            message: message
          })
          break
        case 'hashMessage':
          let txHash = hashTx(message).toString('hex')
          await send({
            sender: username,
            message: txHash
          })
          break
        case 'encryptMessage':
          let privKey = privKeyOutput.textContent
          let pubKey = pubKeyOutput.textContent
          let password = passwordOutput.textContent
          if (privKeyOutput.textContent === ' ') {
            alert('generate Keys first')
            return
          }
          let encText = encrypt(message, password)
          await send({
            sender: username,
            message: encText
          })
          break
      }
    }
    // initial Sockets the user is connected to
    let sockets = []
    ips.forEach((node) => {
      sockets.push(io.connect(`http://${node}:${wsPort}`))
    })
    let i = 0;
    connectionStatus.innerHTML = `Connected : ${sockets[i].connected} | Node: ${sockets[i].io.opts.hostname} `
    //change the socket output
    slctnode.addEventListener('change', function() {
      i = this.value
      connectionStatus.innerHTML = `Connected : ${sockets[i].connected} | Node: ${sockets[i].io.opts.hostname} `
    })
    //chat output
    sockets[i].on('chat', (data) => {
      data.forEach((message) => {
        output.innerHTML += '<p class="sender" style="color: black"><strong>' + message.sender + ': </strong>' + message.message + '</p>'
      })
      chatWindow.scrollTop = chatWindow.scrollHeight
    });
  } catch (err) {
    console.log('error occured' + err);
  }
}

process.on('unhandledRejection', function(reason, p) {
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  console.trace();
});

main();
