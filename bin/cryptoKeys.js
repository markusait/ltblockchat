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

let encryptionHelper = (() => {
  getKeyAndIV = (key, callback) => {
    crypto.pseudoRandomBytes(16, (err, ivBuffer) => {
      var keyBuffer = (key instanceof Buffer) ? key : new Buffer(key);
      callback({
        iv: ivBuffer,
        key: keyBuffer
      });
    });
  }
  let encryptText = (cipher_alg, key, iv, text, encoding) => {
    var cipher = crypto.createCipheriv(cipher_alg, key, iv);
    encoding = encoding || "binary";
    var result = cipher.update(text, "utf8", encoding);
    result += cipher.final(encoding);
    return result;
  }
  let decryptText = (cipher_alg, key, iv, text, encoding) => {
    var decipher = crypto.createDecipheriv(cipher_alg, key, iv);
    encoding = encoding || "binary";
    var result = decipher.update(text, encoding);
    result += decipher.final();
    return result;
  }
  return {
    getKeyAndIV: getKeyAndIV,
    encryptText: encryptText,
    decryptText: decryptText
  };
})()

module.exports = {
  generatePrivateKey,
  generatePublicKey,
  toBuffer,
  hashTx,
  signTx,
}
