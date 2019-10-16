import CryptoJs from 'crypto-js'

/***
 * 把字符串转为比特序列
 * 字符转为32位有符号整数 toint32
 * */
class WordArray {
  constructor (words = [], sigBytes = words.length * 4) {
    this.words = words
    this.sigBytes = sigBytes
  }
  clamp () {
    this.words[this.sigBytes >>> 2] &=
      0xffffffff << (32 - (this.sigBytes % 4) * 8)
    this.words.length = Math.ceil(this.sigBytes / 4)
  }
}

/***
 *把字符串转为比特序列
 * 字符转为32位有符号整数 toint32
 */
function convert (str) {
  let words = []
  let length = str.length
  for (var i = 0; i < length; i++) {
    words[i >>> 2] |= (str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8)
  }
  return new WordArray(words, length)
}

// doAES(M, offset, key) {
//   var nRounds = 10
//   var s0 = M[0]
// }

function ArrayTest () {
  var d = []
  for (var i = 0; i < 256; i++) {
    if (i < 128) {
      d[i] = i << 1
    } else {
      d[i] = (i << 1) ^ 0x11b
    }
  }
  console.log(d)
  var SBOX = []
  var INV_SBOX = []
  var SUB_MIX_0 = []
  var SUB_MIX_1 = []
  var SUB_MIX_2 = []
  var SUB_MIX_3 = []
  var INV_SUB_MIX_0 = []
  var INV_SUB_MIX_1 = []
  var INV_SUB_MIX_2 = []
  var INV_SUB_MIX_3 = []
  var x = 0
  var xi = 0
  for (var i1 = 0; i1 < 256; i1++) {
    // Compute sbox
    var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4)
    sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63
    SBOX[x] = sx
    INV_SBOX[sx] = x

    // Compute multiplication
    var x2 = d[x]
    var x4 = d[x2]
    var x8 = d[x4]

    // Compute sub bytes, mix columns tables
    var t = (d[sx] * 0x101) ^ (sx * 0x1010100)
    SUB_MIX_0[x] = (t << 24) | (t >>> 8)
    SUB_MIX_1[x] = (t << 16) | (t >>> 16)
    SUB_MIX_2[x] = (t << 8) | (t >>> 24)
    SUB_MIX_3[x] = t

    // Compute inv sub bytes, inv mix columns tables
    var t1 = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100)
    INV_SUB_MIX_0[sx] = (t1 << 24) | (t1 >>> 8)
    INV_SUB_MIX_1[sx] = (t1 << 16) | (t1 >>> 16)
    INV_SUB_MIX_2[sx] = (t1 << 8) | (t1 >>> 24)
    INV_SUB_MIX_3[sx] = t1

    // Compute next counter
    if (!x) {
      x = xi = 1
    } else {
      x = x2 ^ d[d[d[x8 ^ x2]]]
      xi ^= d[d[xi]]
    }
  }

  console.log(d)
  console.log(SBOX)
  console.log(INV_SBOX)
  console.log(SUB_MIX_0)
  console.log(SUB_MIX_1)
  console.log(SUB_MIX_2)
}

function keyHandle (key) {
  var keyWords = key.words
  var keySize = key.sigBytes / 4
  var t
  var SBOX
  var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]
  // Compute number of rounds
  var nRounds = keySize + 6

  // Compute number of key schedule rows
  var ksRows = (nRounds + 1) * 4
  // Compute key schedule
  var keySchedule = []
  for (var ksRow = 0; ksRow < ksRows; ksRow++) {
    if (ksRow < keySize) {
      keySchedule[ksRow] = keyWords[ksRow]
    } else {
      t = keySchedule[ksRow - 1]

      if (!(ksRow % keySize)) {
        // Rot word
        t = (t << 8) | (t >>> 24)

        // Sub word
        t =
          (SBOX[t >>> 24] << 24) |
          (SBOX[(t >>> 16) & 0xff] << 16) |
          (SBOX[(t >>> 8) & 0xff] << 8) |
          SBOX[t & 0xff]

        // Mix Rcon
        t ^= RCON[(ksRow / keySize) | 0] << 24
      } else if (keySize > 6 && ksRow % keySize === 4) {
        // Sub word
        t =
          (SBOX[t >>> 24] << 24) |
          (SBOX[(t >>> 16) & 0xff] << 16) |
          (SBOX[(t >>> 8) & 0xff] << 8) |
          SBOX[t & 0xff]
      }

      keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t
    }
  }
  console.log(keySchedule)
}

function enAes (p, key) {
  key = '1234567812345678'
  let offset = '1234567812345678'
  // 准备array
  ArrayTest()
  // 准备key
  this.key = convert(key)
  console.log(this)
  keyHandle(this.key)
  console.log(this)
  // console.log(convert(key))
  // // doAES(p, offset, key)
  // const iv = CryptoJs.enc.Utf8.parse('0321ebeba1f75de2d3cd3471af7418a4')

  // const cryptObj = {
  //   iv: iv,
  //   mode: CryptoJs.mode.CBC,
  //   padding: CryptoJs.pad.Pkcs7
  // }
  // const cp = CryptoJs.enc.Utf8.parse(key)
  // // debugger
  // console.log(cp)
  // console.log(CryptoJs.AES.encrypt('123', cp, cryptObj))
}

export default {
  enAes
}
