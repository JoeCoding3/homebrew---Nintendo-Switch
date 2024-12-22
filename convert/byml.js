async function decompressFileFromBYML () {
    let file = await importFile("byml")
    let result = decompressFromBYML(file.buf)
    await exportFile(result, file.name, "json")
}
let hashKeyTable = null
let stringTable = null
function decompressFromBYML (data) {
    hashKeyTable = null
    stringTable = null
    fileStructure = null

    let numMode = null
    let header = getBuf(data, 0, 16)
        let header_name = getStr(header, 0, 2)
            expectVals(header_name, ["BY", "YB"], "Invalid file", "BYML header does not start with 'BY' or 'YB'")
            if (header_name == "BY") numMode = "BE"
            else if (header_name == "YB") numMode = "LE"
        let header_version = getNum(header, 2, 2, numMode)
        let header_hashKeyTableOffset = getNum(header, 4, 4, numMode)
        let header_stringTableOffset = getNum(header, 8, 4, numMode)
        let header_rootNodeOffset = getNum(header, 12, 4, numMode)
    let src = getBuf(data, 16, data.byteLength - 16)
        hashKeyTable = getNode(data, header_hashKeyTableOffset, header_version, numMode)
        stringTable = getNode(data, header_stringTableOffset, header_version, numMode)
        let rootNode = getNode(data, header_rootNodeOffset, header_version, numMode)
            let rootNodeType = getByte(data, header_rootNodeOffset)
            let rootNodeContainerType = getContainerNode(rootNodeType, header_version)
    
    fileStructure = rootNodeContainerType
    traverseNodes(data, rootNode, [], header_version, numMode)
        let json = JSON.stringify(fileStructure, null, 4) + "\n"
    return json
}
let fileStructure = null
function traverseNodes (data, nodes, outArr, version, numMode) {
    let structure = []
    let out = fileStructure
    for (let outPart of outArr) {
        structure.push(out)
        out = out[outPart]
    }

    for (let node of nodes) {
        let type = node.type
        let value = node.value
        let valueValue = getValueNode(type, value, version)
        let containerValue = getContainerNode(type, version)
        let convertValue = valueValue
        let hashKeyIndex = node.hashKeyIndex
        let hashKey = hashKeyTable[hashKeyIndex]
        if (convertValue == null) convertValue = containerValue
        
        let nextOutArr = outArr
        if (hashKeyIndex == undefined) {
            out.push(containerValue)
            if (containerValue != null) nextOutArr.push(out.length - 1)
        } else {
            out[hashKey] = convertValue
            if (containerValue != null) nextOutArr.push(hashKey)
        }

        if (valueValue == null) {
            let outNodes = getNode(data, value, version, numMode)
            traverseNodes(data, outNodes, nextOutArr, version, numMode)
            nextOutArr.splice(nextOutArr.length - 1, 1)
        }
    }
}
function ceil4 (val) {
    return Math.ceil(val / 4) * 4
}
function d2h (dec) {
    return dec.toString(16).toUpperCase()
}
function h2d (hex) {
    return parseInt(hex, 16)
}
function getNode (data, offset, version, numMode) {
    let type = getByte(data, offset)
    let buf = getBuf(data, offset, data.byteLength - offset)
    if (version >= 2) {
        if (type == 0xA0) {
            let index = getNum(buf, 1, 4, numMode)
            return index
        } else if (type == 0xC0) {
            let numEntries = getNum(buf, 1, 3, numMode)
            let nodes = []
            let typesBuf = getBuf(buf, 4, numEntries)
                let types = [...new Uint8Array(typesBuf)]
            let valuesBuf = getBuf(buf, 4 + ceil4(numEntries), 4 * numEntries)
                for (let i = 0; i < numEntries; i++) {
                    let type = types[i]
                    let value = getNum(valuesBuf, i * 4, 4, numMode)
                    nodes.push({type, value})
                }
            return nodes
        } else if (type == 0xC1) {
            let numEntries = getNum(buf, 1, 3, numMode)
            let entries = new Array(numEntries)
            for (let i = 0; i < numEntries; i++) {
                let entry = getBuf(buf, 4 + (i * 8), 8)
                    let hashKeyIndex = getNum(entry, 0, 3, numMode)
                    let type = getByte(entry, 3)
                    let value = getNum(entry, 4, 4, numMode)
                entries[i] = {type, value, hashKeyIndex}
            }
            return entries
        } else if (type == 0xC2) {
            let numEntries = getNum(buf, 1, 3, numMode)
                let offsetsArrSize = 4 * (numEntries + 1)
            let offsetsBuf = getBuf(buf, 4, offsetsArrSize)
                let stringsStart = getNum(offsetsBuf, 0, 4, numMode)
                let stringsEnd = getNum(offsetsBuf, numEntries * 4, 4, numMode)
            let stringsBuf = getBuf(buf, stringsStart, stringsEnd - stringsStart)
                let stringsStr = getStr(stringsBuf, 0, stringsBuf.byteLength)
                let strings = stringsStr.slice(0, -1).split("\x00")
            return strings
        } else if (type == 0xD0) {
        } else if (type == 0xD1) {
            let num = getNum(buf, 1, 4, numMode)
            return num
        } else if (type == 0xD2) {
        } else if (type == 0xD3) {
        }
    }
    if (version >= 3) {
        if (type == 0xD4) {
        } else if (type == 0xD5) {
        } else if (type == 0xD6) {
        } else if (type == 0xFF) {
        }
    }
    if (version >= 4) {
        /*if (type == 0xA1) {
        }*/
    }
    if (version >= 5) {
        /*if (type == 0xA2) {
        }*/
    }
    if (version >= 7) {
        /*if (type == 0x20) {
        } *//*else if (type == 0x21) {
        }*/
    }

    expectVal(0, 1, "Error reading file", `Unknown node type: 0x${d2h(type)} (${type}). File offset: 0x${d2h(offset)} (${offset})`)
}
function getContainerNode (type, version) {
    if (version >= 2) {
        if (type == 0xA0) {
            return null
        } else if (type == 0xC0) {
            return []
        } else if (type == 0xC1) {
            return {}
        } else if (type == 0xC2) {
            return null
        } else if (type == 0xD0) {
            return null
        } else if (type == 0xD1) {
            return null
        } else if (type == 0xD2) {
            return null
        } else if (type == 0xD3) {
            return null
        }
    }
    if (version >= 3) {
        if (type == 0xD4) {
            return null
        } else if (type == 0xD5) {
            return null
        } else if (type == 0xD6) {
            return null
        } else if (type == 0xFF) {
            return null
        }
    }
    if (version >= 4) {
        /*if (type == 0xA1) {
        }*/
    }
    if (version >= 5) {
        /*if (type == 0xA2) {
        }*/
    }
    if (version >= 7) {
        /*if (type == 0x20) {
        } *//*else if (type == 0x21) {
        }*/
    }
    
    expectVal(0, 1, "Error reading file", `Unknown node type: 0x${d2h(type)} (${type}). Function: Parse container node`)
}
function getValueNode (type, value, version) {
    if (version >= 2) {
        if (type == 0xA0) {
            return stringTable[value]
        } else if (type == 0xC0) {
            return null
        } else if (type == 0xC1) {
            return null
        } else if (type == 0xC2) {
            return null
        } else if (type == 0xD0) {
            return value
        } else if (type == 0xD1) {
            return value
        } else if (type == 0xD2) {
            return value
        } else if (type == 0xD3) {
            return value
        }
    }
    if (version >= 3) {
        if (type == 0xD4) {
            // special - offset from start of file
            // int64
        } else if (type == 0xD5) {
            // special - offset from start of file
            // uint64
        } else if (type == 0xD6) {
            // special - offset from start of file
            // double (binary64)
        } else if (type == 0xFF) {
            return value
        }
    }
    if (version >= 4) {
        /*if (type == 0xA1) {
        }*/
    }
    if (version >= 5) {
        /*if (type == 0xA2) {
        }*/
    }
    if (version >= 7) {
        /*if (type == 0x20) {
        } *//*else if (type == 0x21) {
        }*/
    }
    
    expectVal(0, 1, "Error reading file", `Unknown node type: 0x${d2h(type)} (${type}). Function: Parse value node`)
}
