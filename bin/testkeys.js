const secp256k1 = require('secp256k1')
const {
  randomBytes
} = require('crypto')
const createHash = require('sha.js')
const crypto = require("crypto")


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


let encryptionHelper = (() => {
  function getKeyAndIV(key, callback) {
    crypto.pseudoRandomBytes(16, function(err, ivBuffer) {
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

let privKey = generatePrivateKey()
let pubKey = generatePublicKey(privKey)
let passsword = pubKey.slice(0, 32)

var story = "this is the story of the brave prince who went off to fight the horrible dragon... he set out on his quest one sunny day";
var algorithm = "aes256"

encryptionHelper.getKeyAndIV(passsword, function(data) { //using 32 byte key
  var encText = encryptionHelper.encryptText(algorithm, data.key, data.iv, story, "base64");
  console.log("encrypted text = " + encText);
  var decText = encryptionHelper.decryptText(algorithm, data.key, data.iv, encText, "base64");
  console.log("decrypted text = " + decText);
  console.log('data.key = ' + data.key + ' data.iv = ' + data.iv);

});




// algorithm = 'aes-256-ctr',
// password = '3zTvzr3p67VC61jmV54rIYu1545x4TlY';
//
//
//
//
// let generatePrivateKey = () => {
//   let privKey
//   do {
//     privKey = randomBytes(32)
//   } while(!secp256k1.privateKeyVerify(privKey))
//
//   return privKey.toString('hex')
// }
//
//
// let generatePublicKey = (privKey) => {
//   let priv = Buffer.from(privKey, 'hex');
//   return secp256k1.publicKeyCreate(priv).toString('hex')
// }
//
// let encryptStringWithRsaPublicKey = function(toEncrypt, publicKey) {
//   var buffer = new Buffer(toEncrypt);
//   var encrypted = crypto.publicEncrypt(publicKey, buffer);
//   return encrypted.toString("base64");
// };
//
// let decryptStringWithRsaPrivateKey = function(toDecrypt, privateKey) {
//   var buffer = new Buffer(toDecrypt, "base64");
//   var decrypted = crypto.privateDecrypt(privateKey, buffer);
//   return decrypted.toString("utf8");
// }
//
// var privateKey = generatePrivateKey()
// // console.log(privateKey);
// let pubKey = generatePublicKey(privateKey)
// console.log(typeof pubKey);
//
// console.log(encryptStringWithRsaPublicKey('hans',pubKey))


//
//
// function encrypt(text, algorithm, password){
//   var cipher = crypto.createCipher(algorithm,password)
//   var crypted = cipher.update(text,'utf8','hex')
//   crypted += cipher.final('hex');
//   return crypted;
// }
//
// function decrypt(text){
//   var decipher = crypto.createDecipher(algorithm,password)
//   var dec = decipher.update(text,'hex','utf8')
//   dec += decipher.final('utf8');
//   return dec;
// }
// privKey = privateKey.slice(0,32)
// console.log(privKey, password );
// var hw = encrypt("hello world", algorithm, aes256Key)
// // outputs hello world
// console.log(decrypt(hw));
//
// // let toBuffer = (data) => {
// //   return Buffer.from(data, 'hex')
// // }
// //
// // let hashTx = (tx) => {
// //   let jtx = JSON.stringify(tx)
// //   return createHash('sha256').update(jtx).digest()
// // }
// //
// //
// //
// // // function hashTx(data) {
// // //     let jdata = JSON.stringify(data)
// // //     return crypto.createHash("sha256").update(jdata).digest("hex");
// // //     //                                               ------  binary: hash the byte string
// // // }
// //
// // let signTx = (privKey, tx) => {
// //   //first we hash the Tx
// //   console.log(tx);
// //   let txHash = hashTx(tx)
// //   //now we sign the hash value by calling sign method of elipticcurv
// //   //note: we pas priv Key as string so we need to convert to buffer
// //   let { signature } = secp256k1.sign(txHash, toBuffer(privKey))
// //   //make copy of tx now
// //   let signedTx = Object.assign({}, tx)
// //   //now the Tx ha all 5 fields including the signature
// //   signedTx.signature = signature.toString('hex')
// //   signedTx.txHash = txHash.toString('hex')
// //   return signedTx
// // }
// //
// // //now create Function that veryfies that function has a valid signature
// //
// //
// //
// //
// // let verifyTx = (tx) => {
// //   //still have to implement logic of
// //   //making copy of tx
// //   let rawTx = Object.assign({}, tx)
// //   // removing signature field from copy
// //   delete rawTx.signature
// //   delete rawTx.txHash
// //   //now getting the original hash value see above how did not have the signature yet
// //   let txHash = hashTx(rawTx)
// //   //now we get the eliptic curv verify method passing the 3 parameters to check if tx was sent by sender
// //   return secp256k1.verify(txHash, toBuffer(tx.signature), toBuffer(tx.sender))
// // }
// //
// // var privateKey = generatePrivateKey()
// // var publicKey = generatePublicKey(privateKey)
// // console.log(secp256k1.privateKeyVerify(toBuffer(privateKey)))
// // console.log(secp256k1.publicKeyVerify(toBuffer(publicKey)))
// // var signedTx = signTx(privateKey, {value: 10, sender: publicKey })
// // console.log(signedTx)
// // console.log(verifyTx(signedTx))
// //
// //
// // module.exports = {
// //   signTx,
// //   verifyTx
// // }
