TRANSLATION_URL = "https://www.yeekit.com/site/dotranslate"
USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"


Request.post(TRANSLATION_URL, {
  gzip: true,
  headers: {
    "User-Agent": USER_AGENT
  },
  form: {
    sourceLang: "nja",
    targetLang: "nzh",
    "content[]": text
  }
}).then(body => {
  var result = JSON.parse(JSON.parse(body)[0])
  if (result.translation[0].translated[0].text) {
    callback(result.translation[0].translated[0].text)
  }
  else {
    callback("error: API updated. Please rewrite calls")
  }
}).catch(err => {
  callback(`error: ${err}`)
})
