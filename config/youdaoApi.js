SESSION_URL = "http://fanyi.youdao.com";
TRANSLATE_URL =
  "http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule";
USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0";

var session;
var bv;
var requestTranslation;

if (!session) {
  session = Request.jar();

  requestTranslation = () => {
    let p = new Promise((resolve, reject) => {
      let ts = "" + new Date().getTime();
      let salt = ts + parseInt(10 * Math.random(), 10);
      let sign = md5(
        "fanyideskweb" + text + salt + "p09@Bn{h02_BIEe]$P^nG",
        "hex"
      );

      Request.post(TRANSLATE_URL, {
        jar: session,
        gzip: true,
        headers: {
          Referer: SESSION_URL,
          "User-Agent": USER_AGENT
        },
        form: {
          from: "ja",
          to: "zh-CHS",
          i: text,
          salt: salt,
          ts: ts,
          smartresult: "dict",
          client: "fanyideskweb",
          doctype: "json",
          version: "2.1",
          keyfrom: "fanyi.web",
          action: "FY_BY_CLICKBUTTION",
          typoResult: false,
          sign: sign,
          bv: bv
        }
      })
        .then(body => {
          let sentences = JSON.parse(body).translateResult[0];
          let result = "";
          for (let i in sentences) {
            result += sentences[i].tgt;
          }
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
    return p;
  };

  result = Request.get(SESSION_URL, {
    jar: session,
    gzip: true,
    headers: {
      Referer: SESSION_URL,
      "User-Agent": USER_AGENT
    }
  })
    .then(() => {
      bv = md5("5.0 (Windows)", "hex");
      let ts = "" + new Date().getTime();
      session.setCookie(Request.cookie(`___rl__test__cookies=${ts - 10}`));
    })
    .then(requestTranslation);
} else {
  result = requestTranslation();
}
