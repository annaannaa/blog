import CryptoJs from 'crypto-js'
/*
 *base64:2GV31BliBRfk7Aw8Dot8SiSuCQS3sT+ouKJAeeVnHm4=
 *const key = CryptoJs.enc.Utf8.parse('1234567812345678')
 */

const key = CryptoJs.enc.Base64.parse('2GV31BliBRfk7Aw8Dot8SiSuCQS3sT+ouKJAeeVnHm4=')
const iv = CryptoJs.enc.Utf8.parse('0321ebeba1f75de2d3cd3471af7418a4')

const cryptObj = {
  iv: iv,
  mode: CryptoJs.mode.CBC,
  padding: CryptoJs.pad.Pkcs7
}

// 加密方法
function enCodeAes (word) {
  console.log('key', key)
  console.log('iv', iv)
  console.log('cc', CryptoJs.enc.Utf8.parse('•ýãQF╣ìõ0Èp¢Uæ_v'))

  return CryptoJs.AES.encrypt(word, key, cryptObj).toString()
}

// 解密
function deCodeAes (word) {
  return CryptoJs.AES.decrypt(word, key, cryptObj).toString(CryptoJs.enc.Utf8)
}

export default {
  enCodeAes,
  deCodeAes
}
