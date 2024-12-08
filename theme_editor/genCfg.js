async function exportTheme () {
    let text = generateThemeCfg()
    let name = exportFileNameInp.value
    if (name == "") name = "customTheme"

    let handle = await showSaveFilePicker({
        suggestedName: name + ".cfg",
        excludeAcceptAllOption: true,
        //startIn: "",
        types: [{
            accept: {
                "*/*": [".cfg"]
            },
            description: ":"
        }]
    })
    let writable = await handle.createWritable()
    await writable.write(text)
    await writable.close()
}; exportThemeBtn.onclick = exportTheme

function generateThemeCfg () {
let infoSection = `\
themeInfo={
    name="${infoNameInp.value}"
    author="${infoAuthorInp.value}"
    version="${infoVersionInp.value}"
}`
let lightSection = `\
lightTheme={
    logoColor=(${lightLogoColInp.value})
    textColor=(${lightTextColInp.value})
    backgroundColor=(${lightBgColInp.value})

    frontWaveColor=(${lightFrontWaveColInp.value})
    middleWaveColor=(${lightMiddleWaveColInp.value})
    backWaveColor=(${lightBackWaveColInp.value})
    
    highlightColor=(${lightSelectCol1Inp.value})
    highlightGradientEdgeColor=(${lightSelectCol2Inp.value})
    
    borderColor=(${lightAppIconBgColInp.value})
    borderTextColor=(${lightAppIconTextColInp.value})

    enableWaveBlending=${lightBlendWavesBoolInp.value}

    separatorColor=(${lightSeparatorColInp.value})
    progressBarColor=(${lightProgressBarColInp.value})
}`
let darkSection = `\
darkTheme={
    logoColor=(${darkLogoColInp.value})
    textColor=(${darkTextColInp.value})
    backgroundColor=(${darkBgColInp.value})

    frontWaveColor=(${darkFrontWaveColInp.value})
    middleWaveColor=(${darkMiddleWaveColInp.value})
    backWaveColor=(${darkBackWaveColInp.value})
    
    highlightColor=(${darkSelectCol1Inp.value})
    highlightGradientEdgeColor=(${darkSelectCol2Inp.value})
    
    borderColor=(${darkAppIconBgColInp.value})
    borderTextColor=(${darkAppIconTextColInp.value})

    enableWaveBlending=${darkBlendWavesBoolInp.value}

    separatorColor=(${darkSeparatorColInp.value})
    progressBarColor=(${darkProgressBarColInp.value})
}`

    infoSection = infoSection.replaceAll(/[^=}\n]+=(\(\)|""|)\n/g, "\n").replaceAll(/\n([^a-z}\n]*\n){2,}/g, "\n\n").replace(/\n([^a-z}\n]*\n){1,}}/g, "\n}")
    lightSection = lightSection.replaceAll(/[^=}\n]+=(\(\)|""|)\n/g, "\n").replaceAll(/\n([^a-z}\n]*\n){2,}/g, "\n\n").replace(/\n([^a-z}\n]*\n){1,}}/g, "\n}")
    darkSection = darkSection.replaceAll(/[^=}\n]+=(\(\)|""|)\n/g, "\n").replaceAll(/\n([^a-z}\n]*\n){2,}/g, "\n\n").replace(/\n([^a-z}\n]*\n){1,}}/g, "\n}")

let text = `\
${infoSection}

${lightSection}
${darkSection}
`

    return text
}
