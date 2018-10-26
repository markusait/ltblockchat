# LotionTendermintBlockchat

this is a simple chatapp based on lotion and awesome tendermint

it is mostly based on this repo: https://github.com/devslopes/blockchat

---

**Getting Started**

1. install dependencies

`npm install`

2. switch to branch "master" on machine A

3. switch to branch "raysnode" on machine B

4. switch to branch "ocean" on machine C

4. put the ips of each node in config.js 

5. run node chat-node.js on all both machines

6. copy the ips of all nodes and populate the config.toml seeds with nodeid@ip:46656  ( example:"9e86c44bf1c08bd9f0a437e49c176483a23066b3@138.201.93.202:46656"

7. use browserify chat-browserclient.js -o bundle.js to make changes to the front end 

8. open index.html with your browser of choice and start chatting!





Note: only branch master with 1 node works currently
