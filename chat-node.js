const lotion = require('lotion');
const lotionPort = 3011;
const config = require('./config.js');
const socket = require('socket.io');
const express = require('express');
const axios = require('axios');

async function main() {
  console.log('starting a blockchain interface on port ' + lotionPort + '...\n');
  console.log(
    `
        chain state : http://localhost:${lotionPort}/state
        transactions: http://localhost:${lotionPort}/txs
        `
  )
  let opts = {
    peers :  ['149.28.137.69:46656','174.138.6.71:46656','138.201.93.202:46656'],
    genesis: './genesis.json',
    keys: './priv_validator.json',
    p2pPort: 46656,
    tendermintPort: 46657,
    logTendermint: true,
    createEmptyBlocks: false,

    initialState: {
      messages: [{
          sender: 'Markus',
          message: 'welcome to tendermint '
        },
        {
          sender: 'Markus',
          message: 'on the blockchain'
        }
      ]
    }
  };
  //   * Create a new instance of Lotion
  let app = lotion(opts);
  let msgHandler = (state, tx, chainInfo) => {
    if (
      typeof tx.sender === 'string' &&
      typeof tx.message === 'string' &&
      tx.message.length <= 1000
    ) {
      if (tx.message !== '') {
        state.messages.push({
          sender: tx.sender,
          message: tx.message
        });
      }
    }
  }
  app.use(msgHandler);
  // Start the Lotion app
  const server = app.listen(lotionPort).then(genesis => {
    console.log(genesis);
  }, err => {
    console.log(err);
  })

  const socketServer = express().listen(8080)

  const io = socket(socketServer, {
    origins: '*:*'
  });

  lastMessagesLength = 0
  async function updateState() {
    let {
      data
    } = await axios.get('http://localhost:' + lotionPort + '/state')
    let messages = await data.messages
    if (messages !== undefined && messages.length > lastMessagesLength) {
      let newMessages = messages.slice(lastMessagesLength, messages.length)
      io.sockets.emit('chat', newMessages)
      lastMessagesLength = messages.length
    }
  }
  io.on('connection', async (socket) => {
    console.log('made socket connection', socket.id);
    // on new socket connection emmit all messages
    try {
      let {
        data
      } = await axios.get('http://localhost:' + lotionPort + '/state')
      let messages = await data.messages
      io.sockets.connected[socket.id].emit('chat', messages)
    } catch (e) {
      console.log('Error caught:' + e);
    }
    //setting Interval to fetch data from local host and send it when new message occurs
    let interval = setInterval(() => {
      updateState()
    }, 50)

    socket.on('disconnect', function() {
      clearTimeout(interval)
      console.log('user disconnected');
    })
  })
}

process.on('unhandledRejection', function(reason, p) {
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  console.trace();
});

main()
