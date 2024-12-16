function getBuf (data, pos, size) {
    let buf = data.slice(pos, pos + size)
    return buf
}
function getArr (data, pos, size) {
    let buf = getBuf(data, pos, size)
    let arr = new Uint8Array(buf)
    return arr
}
function getStr (data, pos, size) {
    let buf = getBuf(data, pos, size)
    let str = new TextDecoder().decode(buf)
    return str
}
function getByte (data, pos) {
    let arr = getArr(data, pos, 1)
    let byte = arr[0]
    return byte
}
function byteGetNibble (byte, pos) {
    let nibble = (byte >> (4 * (1 - pos))) & 0b1111
    return nibble
}
function byteGetBit (byte, pos) {
    let bit = (byte >> (7 - pos)) & 0b00000001
    return bit
}
function getNum (data, pos, size, mode) {
    let arr = getArr(data, pos, size)
    if (mode == "BE") null
    else if (mode == "LE") arr.reverse()
    let res = ""
    for (let num of arr) res += num.toString(16).padStart(2, "0")
    let num = parseInt(res, 16)
    return num
}

function expectVal (val, check, info, err) {
    if (val != check) {
        alert(`ERROR: ${info}\n(${err})`)
        throw new Error(err)
    }
}
function expectVals (val, checks, info, err) {
    let found = false
    for (let check of checks) {
        if (val == check) {
            found = true
            break
        }
    }
    if (!found) {
        alert(`ERROR: ${info}\n(${err})`)
        throw new Error(err)
    }
}
