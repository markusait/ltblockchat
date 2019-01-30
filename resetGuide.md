Reset guide

pm2 status
pm2 stop pId
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 1K

rm -rf ~/.lotion

set intervall time back to 5000 instead of 50

generate new IDS and save in seeds


digitpayID = c44435b1a2f1f6518f8325044abbcec0d9eace72@138.201.93.202:46656
vulture =    601e2578980fd0c5d6f7d4116db76b7b3b7567e4@149.28.37.57:46656


    peers :  ['206.189.97.68:46656','174.138.6.71:46656','138.201.93.202:46656'],

vim ~/.lotion/networks/3f4ee53865976b81f58500fb9ffd20b96e85362ea616ef3dae5b869ff5a6197e/config/config.toml


seeds = "c44435b1a2f1f6518f8325044abbcec0d9eace72@138.201.93.202:46656,601e2578980fd0c5d6f7d4116db76b7b3b7567e4@149.28.37.57:46656"

pm2 start chat-node.js

tail -n 300 /root/.pm2/logs/chat-node-out.log
