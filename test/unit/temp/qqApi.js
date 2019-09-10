SESSION_URL = "https://fanyi.qq.com/"
TRANSLATE_URL =
  "https://fanyi.qq.com/api/translate"
USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"

var session
var bv
var requestTranslation
var initSession
var qtv
var qtk

if (!session) {
  session = Request.jar()

  requestTranslation = () => {
    return new Promise((resolve, reject) => {
      Request.post(TRANSLATE_URL, {
        jar: session,
        gzip: true,
        headers: {
          Referer: SESSION_URL,
          "User-Agent": USER_AGENT
        },
        form: {
          source: "jp",
          target: "zh",
          sourceText: text,
          qtv: qtv,
          qtk: qtk
        }
      })
        .then(body => {
          let sentences = JSON.parse(body).translate.records
          let result = "";
          for (let i in sentences) {
            result += sentences[i].targetText
          }
          result = result.replace(/({[^}]*})|(\(\([^\)]*\)\))/g, '')
          if (result === '') initSession()
          else callback(result)
        })
        .catch(err => {
          callback(qtv, qtk)
        });
    });
  };

  initSession = () => {
    return Request.get(SESSION_URL, {
      jar: session,
      gzip: true,
      headers: {
        Referer: SESSION_URL,
        "User-Agent": USER_AGENT
      }
    })
      .then(body => {
        qtv = /var qtv = "([^\"]+)";/.exec(body)[1]
        qtk = /var qtk = "([^\"]+)";/.exec(body)[1]
      })
      .then(requestTranslation)
  };

  initSession()
} else {
  requestTranslation()
}
