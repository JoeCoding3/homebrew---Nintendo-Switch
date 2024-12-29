async function importFile (exts) {
    if (typeof exts == "string") exts = [exts]
    for (let index in exts) exts[index] = `.${exts[index]}`

    let [handle] = await showOpenFilePicker({
        multiple: false,
        excludeAcceptAllOption: false,
        startIn: "downloads",
        types: [{
            accept: {
                "*/*": exts
            },
            description: ":"
        }]
    })
    let file = await handle.getFile()
    let buf = await file.arrayBuffer()
    let name = file.name
        let ext = name.substring(name.lastIndexOf(".") + 1)
        name = name.substring(0, name.lastIndexOf("."))
    return {buf, name, ext}
}

async function exportFile (buf, name, ext) {
    let handle = await showSaveFilePicker({
        suggestedName: `${name}.${ext}`,
        excludeAcceptAllOption: false,
        startIn: "downloads",
        types: [{
            accept: {
                "*/*": [`.${ext}`]
            },
            description: ":"
        }]
    })
    let writable = await handle.createWritable()
    await writable.write(buf)
    await writable.close()
}
async function exportZip (obj, name) {
    let zip = new JSZip()
    exportZip_parseObj(zip, obj)
    let data = await zip.generateAsync({type: "blob"})
    await exportFile(data, name, "zip")
}
function exportZip_parseObj (zip, obj) {
    for (let key of Object.keys(obj)) {
        let content = obj[key]
        if (typeof content.resize != "function") {
            let folder = zip.folder(key)
            exportZip_parseObj(folder, content)
        } else zip.file(key, content)
    }
}

function getFileType (data) {
    let name = null
    let ext = null

    if (getStr(data, 0, 4) == "Yaz0") {
        name = `Yaz0`
        ext = "szs"
    }
    
    else if (getStr(data, 0, 4) == "SARC") {
        let mode = null
        let byteOrder = getNum(data, 6, 2, "BE")
            byteOrder = byteOrder.toString(16)
            if (byteOrder == "feff") mode = "BE"
            else if (byteOrder == "fffe") mode = "LE"
            name = `SARC_${mode}`
            ext = "sarc"
    }

    else if (getStr(data, 0, 4) == "RARC") {
        let mode = "BE"
        name = `RARC_${mode}`
        ext = "rarc"
    } else if (getStr(data, 0, 4) == "CRAR") {
        let mode = "LE"
        name = `RARC_${mode}`
        ext = "rarc"
    }
    
    else if (getStr(data, 0, 2) == "BY") {
        let mode = "BE"
        let ver = getNum(data, 2, 2, mode)
        name = `BYML_${mode}_V${ver}`
        ext = "byml"
    } else if (getStr(data, 0, 2) == "YB") {
        let mode = "LE"
        let ver = getNum(data, 2, 2, mode)
        name = `BYML_${mode}_V${ver}`
        ext = "byml"
    }
    
    else {
        name = "?"
        ext = "bin"
    }
    return {name, ext}
}
