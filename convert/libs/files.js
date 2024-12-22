async function importFile (ext) {
    if (typeof ext == "string") ext = [ext]
    for (let index in ext) ext[index] = `.${ext[index]}`

    let [handle] = await showOpenFilePicker({
        multiple: false,
        excludeAcceptAllOption: false,
        startIn: "downloads",
        types: [{
            accept: {
                "*/*": ext
            },
            description: ":"
        }]
    })
    let file = await handle.getFile()
    let buf = await file.arrayBuffer()
    let name = file.name
        name = name.substring(0, name.lastIndexOf(`.${ext}`))
    return {buf, name}
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
