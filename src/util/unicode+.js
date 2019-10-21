import {
  error
} from 'util'

/**
 *
 * @param {*明文} message
 * @param {*密钥：固定为8个字节,默认为12345678} key
 */

function encode (message, key = '12345678') {
  if (message === '' || message == null) {
    throw error('NOT INPUT MESSAGE')
  }
  if (key.length !== 8) {
    throw error('请输入8位的密钥')
  }
  var length = message.length
  var array = message.split('')
  var keyArray = message.split('')
  var enArray = []
  // 将密钥转为10进制unicode码
  for (let k = 0; k < 8; k++) {
    keyArray[k] = key.charCodeAt(k)
  }
  for (let i = 0, j = 0; i < length; i++, j++) {
    if (j === 8) {
      j = 0
    }
    var bit = message.charCodeAt(i)
    bit += keyArray[j]
    enArray[i] = String.fromCharCode(bit)
  }
  return enArray.join('')
}

/**
 *
 * @param {*明文} message
 * @param {*密钥：固定为8个字节,默认为12345678} key
 */
function decode (message, key = '12345678') {
  if (message === '' || message == null) {
    throw error('NOT INPUT MESSAGE')
  }
  if (key.length !== 8) {
    throw error('请输入8位的密钥')
  }
  var length = message.length
  var keyArray = message.split('')
  var array = message.split('')
  var enArray = []
  // 将密钥转为10进制unicode码
  for (let k = 0; k < 8; k++) {
    keyArray[k] = key.charCodeAt(k)
  }
  for (let i = 0, j = 0; i < length; i++, j++) {
    if (j === 8) {
      j = 0
    }
    var bit = message.charCodeAt(i)
    bit -= keyArray[j]
    enArray[i] = String.fromCharCode(bit)
  }
  return enArray.join('')
}

export default {
  encode,
  decode
}
