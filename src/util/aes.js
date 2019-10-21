import CryptoJs from 'crypto-js'
import { Message } from 'element-ui'

/***
 * 把字符串转为比特序列
 * 字符转为32位有符号整数 toint32
 * */
class WordArray {
  constructor (words1 = [], sigBytes1 = words1.length * 4) {
    this.words = words1
    console.log(words1, this.words)
    this.sigBytes = sigBytes1
  }
  // clamp () {
  //   this.words[this.sigBytes >>> 2] &=
  //     0xffffffff << (32 - (this.sigBytes % 4) * 8)
  //   this.words.length = Math.ceil(this.sigBytes / 4)

  //   // test:
  //   if (this.words.length < 4) {
  //     this.words[this.words.length] = 0
  //     this.words[this.words.length + 1] = 0
  //   }
  // }
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
  console.log(words)
  return new WordArray(words, length)
}

function stringify (wordArray) {
  // Shortcuts
  var words = wordArray.words
  var sigBytes = wordArray.sigBytes

  // Convert
  var latin1Chars = []
  for (var i = 0; i < sigBytes; i++) {
    var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
    latin1Chars.push(String.fromCharCode(bite))
  }

  return latin1Chars.join('')
}

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
var M = [] // 明文
var keySchedule = []
var invKeySchedule = []
var nRounds

/**
 * 初始化S盒
 */
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
    // console.log('t', t)
    // console.log('d', d)
    SUB_MIX_0[x] = (t << 24) | (t >>> 8)
    SUB_MIX_1[x] = (t << 16) | (t >>> 16)
    SUB_MIX_2[x] = (t << 8) | (t >>> 24)
    SUB_MIX_3[x] = t
    // console.log('SUB_MIX_0[x]:', SUB_MIX_0[x])
    // console.log('SUB_MIX_1[x]', SUB_MIX_1[x])
    // console.log('SUB_MIX_2[x]', SUB_MIX_2[x])
    // console.log('SUB_MIX_3[x]', SUB_MIX_3[x])
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
  // console.log(SUB_MIX_0, SUB_MIX_1, SUB_MIX_2)
  console.log('SBOX', SBOX)
  console.log('INV_SBOX', INV_SBOX)
  console.log('SUB_MIX_0', SUB_MIX_0)
  console.log('SUB_MIX_1', SUB_MIX_1)
  console.log('SUB_MIX_2', SUB_MIX_2)
  console.log('SUB_MIX_3', SUB_MIX_3)
}

function keyHandle (key) {
  var keyWords = key.words
  var keySize = key.sigBytes / 4
  var t
  var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36] // 轮系数
  // Compute number of rounds
  nRounds = keySize + 6

  // Compute number of key schedule rows
  var ksRows = (nRounds + 1) * 4
  // Compute key schedule
  for (var ksRow = 0; ksRow < ksRows; ksRow++) {
    if (ksRow < keySize) {
      keySchedule[ksRow] = keyWords[ksRow]
    } else {
      t = keySchedule[ksRow - 1]
      // ksrow能被4整除  ksrow的结果是 上一项和上一项-3 做G函数运算，完后做异或
      /** **G算法
       *函数G()首先将4个输入字节进行翻转，并执行一个按字节的S盒代换，
       最后用第一个字节与轮系数Rcon进行异或运算。轮系数是一个有10个元素的一维数组，
       一个元素1个字节。G()函数存在的目的有两个，一是增加密钥编排中的非线性；
       二是消除AES中的对称性。这两种属性都是抵抗某些分组密码攻击必要的。
       */
      if (!(ksRow % keySize)) {
        // Rot word 上一项为t
        // 循环左移8位
        t = (t << 8) | (t >>> 24)
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

  // Compute inv key schedule
  for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
    var ksRow1 = ksRows - invKsRow
    var keyt1
    if (invKsRow % 4) {
      keyt1 = keySchedule[ksRow1]
    } else {
      keyt1 = keySchedule[ksRow1 - 4]
    }

    if (invKsRow < 4 || ksRow1 <= 4) {
      invKeySchedule[invKsRow] = keyt1
    } else {
      invKeySchedule[invKsRow] =
        INV_SUB_MIX_0[SBOX[keyt1 >>> 24]] ^
        INV_SUB_MIX_1[SBOX[(keyt1 >>> 16) & 0xff]] ^
        INV_SUB_MIX_2[SBOX[(keyt1 >>> 8) & 0xff]] ^
        INV_SUB_MIX_3[SBOX[keyt1 & 0xff]]
      console.log(' invKeySchedule[invKsRow]', invKeySchedule[invKsRow])
    }
  }

  console.log('keyshedule:', keySchedule)
  console.log('invkeyshedule:', invKeySchedule)
}

/**
 * 加解密步骤
 */
function doAES (
  M,
  keySchedule,
  SUB_MIX_0,
  SUB_MIX_1,
  SUB_MIX_2,
  SUB_MIX_3,
  SBOX
) {
  /*
   *密钥加法
   *1.明文和密钥（子密钥K[0,3]）进行按字节异或
   *s0为对明文加密后的密文
   */
  console.log('M')
  console.log(M)
  var s0 = M[0] ^ keySchedule[0]
  var s1 = M[1] ^ keySchedule[1]
  var s2 = M[2] ^ keySchedule[2]
  var s3 = M[3] ^ keySchedule[3]

  /***
   * 2.字节代换层
   * 让输入的数据通过S_box表（s盒SBOX）完成从一个字节到另一个字节的映射
   */
  // Key schedule row counter
  var ksRow = 4
  // Rounds 128位 nrounds是10圈 已经在keyHandle函数计算出
  console.log(SUB_MIX_0)
  for (var round = 1; round < nRounds; round++) {
    // Shift rows, sub bytes, mix columns, add round key
    var t0 =
      SUB_MIX_0[s0 >>> 24] ^
      SUB_MIX_1[(s1 >>> 16) & 0xff] ^
      SUB_MIX_2[(s2 >>> 8) & 0xff] ^
      SUB_MIX_3[s3 & 0xff] ^
      keySchedule[ksRow++]
    var t1 =
      SUB_MIX_0[s1 >>> 24] ^
      SUB_MIX_1[(s2 >>> 16) & 0xff] ^
      SUB_MIX_2[(s3 >>> 8) & 0xff] ^
      SUB_MIX_3[s0 & 0xff] ^
      keySchedule[ksRow++]
    var t2 =
      SUB_MIX_0[s2 >>> 24] ^
      SUB_MIX_1[(s3 >>> 16) & 0xff] ^
      SUB_MIX_2[(s0 >>> 8) & 0xff] ^
      SUB_MIX_3[s1 & 0xff] ^
      keySchedule[ksRow++]
    var t3 =
      SUB_MIX_0[s3 >>> 24] ^
      SUB_MIX_1[(s0 >>> 16) & 0xff] ^
      SUB_MIX_2[(s1 >>> 8) & 0xff] ^
      SUB_MIX_3[s2 & 0xff] ^
      keySchedule[ksRow++]

    // Update state
    s0 = t0
    s1 = t1
    s2 = t2
    s3 = t3
    console.log('s')
    console.log(s0, s1, s2, s3)
  }

  console.log('M')
  console.log(M)
  /**
   * 3.行位移
   * 行位移操作最为简单，它是用来将输入数据作为一个4·4的字节矩阵进行处理的
   * 在加密时，保持矩阵的第一行不变，第二行向左移动8Bit(一个字节)、第三行向左移动2个字节、
   * 第四行向左移动3个字节。而在解密时恰恰相反，依然保持第一行不变，
   * 将第二行向右移动一个字节、第三行右移2个字节、第四行右移3个字节。
   */
  var ts0 =
    ((SBOX[s0 >>> 24] << 24) |
      (SBOX[(s1 >>> 16) & 0xff] << 16) |
      (SBOX[(s2 >>> 8) & 0xff] << 8) |
      SBOX[s3 & 0xff]) ^
    keySchedule[ksRow++]
  var ts1 =
    ((SBOX[s1 >>> 24] << 24) |
      (SBOX[(s2 >>> 16) & 0xff] << 16) |
      (SBOX[(s3 >>> 8) & 0xff] << 8) |
      SBOX[s0 & 0xff]) ^
    keySchedule[ksRow++]
  var ts2 =
    ((SBOX[s2 >>> 24] << 24) |
      (SBOX[(s3 >>> 16) & 0xff] << 16) |
      (SBOX[(s0 >>> 8) & 0xff] << 8) |
      SBOX[s1 & 0xff]) ^
    keySchedule[ksRow++]
  var ts3 =
    ((SBOX[s3 >>> 24] << 24) |
      (SBOX[(s0 >>> 16) & 0xff] << 16) |
      (SBOX[(s1 >>> 8) & 0xff] << 8) |
      SBOX[s2 & 0xff]) ^
    keySchedule[ksRow++]
  M[0] = ts0
  M[1] = ts1
  M[2] = ts2
  M[3] = ts3
  console.log('M1')
  console.log(M)
}

/**
 *
 * @param {文本} p
 *如果文本不够16位进行补全
 */
function messageNotEnough (p) {
  var length = p.length
  if (p.length < 16) {
    p = p + Math.pow(10, 16 - p.length)
  }
  return {
    text: p,
    lengthInit: length
  }
}
/**
 *
 * @param {文本：明文或密文} p
 * @param {密钥} key
 */
function enAes (p, key) {
  p = '1234567812345678'
  key = '1234567812345678'
  // 准备array 必须为第一步
  ArrayTest()
  // 准备key 得到keySchedule或invschedule
  var keyConvert = convert(key)
  keyHandle(keyConvert)
  // 执行加密步骤
  var Message = convert(p)
  console.log('message1:')
  console.log(Message)
  // Message.clamp()
  doAES(
    Message.words,
    keySchedule,
    SUB_MIX_0,
    SUB_MIX_1,
    SUB_MIX_2,
    SUB_MIX_3,
    SBOX
  )
  console.log('加密后：' + stringify(Message))
  // deAes(stringify(Message), key)
}

function deAes (p, key) {
  // 准备array 必须为第一步
  ArrayTest()
  // 准备key 得到keySchedule或invschedule
  keyHandle(convert(key))
  // 执行解密步骤
  var Message = convert(p)
  // Message.clamp()
  M = Message.words
  // Swap 2nd and 4th rows
  var offset = 0
  var t = M[offset + 1]
  M[offset + 1] = M[offset + 3]
  M[offset + 3] = t
  doAES(
    M,
    invKeySchedule,
    INV_SUB_MIX_0,
    INV_SUB_MIX_1,
    INV_SUB_MIX_2,
    INV_SUB_MIX_3,
    INV_SBOX
  )
  // console.log(stringify(Message))
  var t1 = M[offset + 1]
  M[offset + 1] = M[offset + 3]
  M[offset + 3] = t1

  console.log('解密后：' + stringify(Message))
}

export default {
  enAes
}
