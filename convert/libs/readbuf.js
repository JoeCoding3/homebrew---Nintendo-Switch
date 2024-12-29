function getBuf (data, pos, size) {
    let buf = data.slice(pos, pos + size)
    return buf
}
function getStr (data, pos, size, mode = "BE") {
    let buf = getBuf(data, pos, size)
    let str = new TextDecoder().decode(buf)
    if (mode == "BE") null
    else if (mode == "LE") str = str.split("").reverse().join("")
    return str
}
function getNum (data, pos, size, mode) {
    let buf = getBuf(data, pos, size)
    let arr = new Uint8Array(buf)
    if (mode == "BE") null
    else if (mode == "LE") arr.reverse()
    let res = ""
    for (let num of arr) res += num.toString(16).padStart(2, "0")
    let num = parseInt(res, 16)
    return num
}
function getByte (data, pos) {
    let byte = getNum(data, pos, 1, "BE")
    return byte
}
function byteGetNibble (byte, pos) {
    let nibble = (byte >> (4 * (1 - pos))) & 0b00001111
    return nibble
}
function byteGetBit (byte, pos) {
    let bit = (byte >> (7 - pos)) & 0b00000001
    return bit
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
