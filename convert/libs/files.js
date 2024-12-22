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
    for (let key of Object.keys(obj)) {
        let content = obj[key]
        zip.file(key, content)
    }
    let data = await zip.generateAsync({type: "blob"})
    await exportFile(data, name, "zip")
}
