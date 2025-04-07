let cryptoJS = require("crypto-js");

const encrypt = (plainPassword) => {
  return cryptoJS.AES.encrypt(plainPassword, process.env.PASSWORD_SECRET).toString()
}

const decrypt = (encryptedText) => {
  let decryptedLayer = cryptoJS.AES.decrypt(encryptedText, process.env.PASSWORD_SECRET);
  return decryptedLayer.toString(cryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt };