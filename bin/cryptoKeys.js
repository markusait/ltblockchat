//crypto part
//managing keys and Tx signing

const secp256k1 = require('secp256k1')
const {
  randomBytes
} = require('crypto')
const createHash = require('sha.js')
const crypto = require('crypto')

let generatePrivateKey = () => {
  let privKey
  do {
    privKey = randomBytes(32)
  } while (!secp256k1.privateKeyVerify(privKey))

  return privKey.toString('hex')
}
let generatePublicKey = (privKey) => {
  let priv = Buffer.from(privKey, 'hex');
  return secp256k1.publicKeyCreate(priv).toString('hex')
}

let toBuffer = (data) => {
  return Buffer.from(data, 'hex')
}

let hashTx = (tx) => {
  return createHash('sha256').update(JSON.stringify(tx)).digest()
}

let signTx = (privKey, tx) => {
  //first we hash the Tx
  let txHash = hashTx(tx)
  //now we sign the hash value by calling sign method of elipticcurv
  //note: we pas priv Key as string so we need to convert to buffer
  let {
    signature
  } = secp256k1.sign(txHash, toBuffer(privKey))
  //make copy of tx now
  let signedTx = Object.assign({}, tx)
  //now the Tx ha all 5 fields including the signature
  signedTx.signature = signature.toString('hex')
  signedTx.txHash = txHash.toString('hex')
  console.log(txHash.toString('hex'));
  return signedTx
}
let genPassword = (data) => {
  let password = data.slice(0, 32)
  return password
}

let encrypt = (text,password) => {
  var cipher = crypto.createCipher('aes-256-cbc',password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

let decrypt = (text,password) => {
  var decipher = crypto.createDecipher('aes-256-cbc',password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
let privKey = generatePrivateKey()
let hashedPrivKey = createHash('sha256').update(privKey).digest().toString('hex')
let password = genPassword(hashedPrivKey).toString('hex')

console.log(privKey,hashedPrivKey,password);

module.exports = {
  generatePrivateKey,
  generatePublicKey,
  toBuffer,
  hashTx,
  signTx,
  genPassword,
  encrypt,
  decrypt,
}
