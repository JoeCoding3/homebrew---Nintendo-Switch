function parseCfgFile (text) {
    text = text.replaceAll("\r\n", "\n")

    let themeInfoData = cfgFileGetGroup(text, "themeInfo")
    let lightThemeData = cfgFileGetGroup(text, "lightTheme")
    let darkThemeData = cfgFileGetGroup(text, "darkTheme")

    let info = cfgFileGroupDataParseInfoData(themeInfoData)
    let light = cfgFileGroupDataParseThemeData(lightThemeData)
    let dark = cfgFileGroupDataParseThemeData(darkThemeData)
    
    return {info, light, dark}
}
function cfgFileGetGroup (text, key) {
    let keyIndex = text.indexOf(key + "={")
    if (keyIndex == -1) return undefined

    let dataIndex = keyIndex + key.length + 3
    let dataEndIndex = text.indexOf("\n}", keyIndex) + 1
    let data = text.substring(dataIndex, dataEndIndex)
    return data
}
function cfgFileGroupGetData (group, key) {
    let keyIndex = group.indexOf(key + "=")
    if (keyIndex == -1) return undefined

    let dataIndex = keyIndex + key.length + 1
    let dataEndIndex = group.indexOf("\n", dataIndex)
    let data = group.substring(dataIndex, dataEndIndex)
    return data
}
function cfgFileGroupDataParseInfoData (group) {
    let name = cfgDataParseStr(cfgFileGroupGetData(group, "name"))
    let author = cfgDataParseStr(cfgFileGroupGetData(group, "author"))
    let version = cfgDataParseStr(cfgFileGroupGetData(group, "version"))

    return {name, author, version}
}
function cfgFileGroupDataParseThemeData (group) {
    if (group == undefined) return undefined

    let logoCol = cfgDataParseCol(cfgFileGroupGetData(group, "logoColor"))
    let textCol = cfgDataParseCol(cfgFileGroupGetData(group, "textColor"))
    let bgCol = cfgDataParseCol(cfgFileGroupGetData(group, "backgroundColor"))
    
    let frontWaveCol = cfgDataParseCol(cfgFileGroupGetData(group, "frontWaveColor"))
    let middleWaveCol = cfgDataParseCol(cfgFileGroupGetData(group, "middleWaveColor"))
    let backWaveCol = cfgDataParseCol(cfgFileGroupGetData(group, "backWaveColor"))
    
    let selectCol1 = cfgDataParseCol(cfgFileGroupGetData(group, "highlightColor"))
    let selectCol2 = cfgDataParseCol(cfgFileGroupGetData(group, "highlightGradientEdgeColor"))
    
    let appIconBgCol = cfgDataParseCol(cfgFileGroupGetData(group, "borderColor"))
    let appIconTextCol = cfgDataParseCol(cfgFileGroupGetData(group, "borderTextColor"))
    
    let blendWavesBool = cfgDataParseBool(cfgFileGroupGetData(group, "enableWaveBlending"))
    
    let separatorCol = cfgDataParseCol(cfgFileGroupGetData(group, "separatorColor"))
    let progressBarCol = cfgDataParseCol(cfgFileGroupGetData(group, "progressBarColor"))


    return {
        logoCol, textCol, bgCol,
        frontWaveCol, middleWaveCol, backWaveCol,
        selectCol1, selectCol2,
        appIconBgCol, appIconTextCol,
        blendWavesBool,
        separatorCol, progressBarCol,
    }
}

function cfgDataParseStr (data) {
    if (data == undefined || data == "") return ""

    let newData = data.slice(1, -1)
    return newData
}
function cfgDataParseCol (col) {
    if (col == undefined || col == "" || col == "()") return ""

    let newCol = col.slice(1, -1)
    return newCol
}
function cfgDataParseBool (bool) {
    if (bool == undefined || bool == "") return ""

    let newBool = bool
    return newBool
}

function applyCfgObj (obj) {
    infoNameInp.value = obj.info.name
    infoAuthorInp.value = obj.info.author
    infoVersionInp.value = obj.info.version


    if (obj.light != undefined) {
        lightLogoColInp.value = obj.light.logoCol
        lightTextColInp.value = obj.light.textCol
        lightBgColInp.value = obj.light.bgCol
        
        lightFrontWaveColInp.value = obj.light.frontWaveCol
        lightMiddleWaveColInp.value = obj.light.middleWaveCol
        lightBackWaveColInp.value = obj.light.backWaveCol
        
        lightSelectCol1Inp.value = obj.light.selectCol1
        lightSelectCol2Inp.value = obj.light.selectCol2
        
        lightAppIconBgColInp.value = obj.light.appIconBgCol
        lightAppIconTextColInp.value = obj.light.appIconTextCol
        
        lightBlendWavesBoolInp.value = obj.light.blendWavesBool
        
        lightSeparatorColInp.value = obj.light.separatorCol
        lightProgressBarColInp.value = obj.light.progressBarCol
    }


    if (obj.dark != undefined) {
        darkLogoColInp.value = obj.dark.logoCol
        darkTextColInp.value = obj.dark.textCol
        darkBgColInp.value = obj.dark.bgCol
        
        darkFrontWaveColInp.value = obj.dark.frontWaveCol
        darkMiddleWaveColInp.value = obj.dark.middleWaveCol
        darkBackWaveColInp.value = obj.dark.backWaveCol
        
        darkSelectCol1Inp.value = obj.dark.selectCol1
        darkSelectCol2Inp.value = obj.dark.selectCol2
        
        darkAppIconBgColInp.value = obj.dark.appIconBgCol
        darkAppIconTextColInp.value = obj.dark.appIconTextCol
        
        darkBlendWavesBoolInp.value = obj.dark.blendWavesBool
        
        darkSeparatorColInp.value = obj.dark.separatorCol
        darkProgressBarColInp.value = obj.dark.progressBarCol
    }
}
