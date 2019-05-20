SESSION_URL = "https://www.hjdict.com/app/trans"
TRANSLATE_URL =
  "https://www.hjdict.com/v10/dict/translation/jp/cn"
USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"

var session
var bv
var requestTranslation
var initSession

if (!session) {
  session = Request.jar()
  session.setCookie(
    "HJ_UID=bbdfd16e-4b5d-bb9b-6ac9-2d963ed57366; _REF=; _REG=direct|; _SREF_3=; _SREG_3=direct|; TRACKSITEMAP=3%2C; HJ_SID=ab8ccf38-4913-9b56-7ac9-cab621be9af2; HJ_SSID_3=345b746e-c837-9119-201a-b49b50b561cb; HJ_CST=0; HJ_CSST_3=0", 
    "https://www.hjdict.com"
  )
}

Request.post(TRANSLATE_URL, {
  jar: session,
  gzip: true,
  headers: {
    Referer: SESSION_URL,
    "User-Agent": USER_AGENT
  },
  form: {
    content: text
  }
})
  .then(body => {
    var result = JSON.parse(body).data.content
    // eliminate weird per word translations
    result = result.replace(/({[^}]*})|(\([^\)]*\))/g, '')
    callback(result)
  })
  .catch(err => {
    callback(err)
  })