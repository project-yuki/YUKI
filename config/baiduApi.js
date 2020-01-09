SESSION_URL = "https://fanyi.baidu.com/";
TRANSLATE_URL = "https://fanyi.baidu.com/v2transapi";
USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36";

var getSign;
var session;
var requestTranslation;
var initSession;
var token;
var window;

if (!getSign) {
  getSign = (function(r, o, t) {
    "use strict";
    function a(r) {
      if (Array.isArray(r)) {
        for (var o = 0, t = Array(r.length); o < r.length; o++) t[o] = r[o];
        return t;
      }
      return Array.from(r);
    }
    function n(r, o) {
      for (var t = 0; t < o.length - 2; t += 3) {
        var a = o.charAt(t + 2);
        (a = a >= "a" ? a.charCodeAt(0) - 87 : Number(a)),
          (a = "+" === o.charAt(t + 1) ? r >>> a : r << a),
          (r = "+" === o.charAt(t) ? (r + a) & 4294967295 : r ^ a);
      }
      return r;
    }
    function e(r) {
      var o = r.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
      if (null === o) {
        var t = r.length;
        t > 30 &&
          (r =
            "" +
            r.substr(0, 10) +
            r.substr(Math.floor(t / 2) - 5, 10) +
            r.substr(-10, 10));
      } else {
        for (
          var e = r.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/),
            C = 0,
            h = e.length,
            f = [];
          h > C;
          C++
        )
          "" !== e[C] && f.push.apply(f, a(e[C].split(""))),
            C !== h - 1 && f.push(o[C]);
        var g = f.length;
        g > 30 &&
          (r =
            f.slice(0, 10).join("") +
            f.slice(Math.floor(g / 2) - 5, Math.floor(g / 2) + 5).join("") +
            f.slice(-10).join(""));
      }
      var u = void 0,
        l =
          "" +
          String.fromCharCode(103) +
          String.fromCharCode(116) +
          String.fromCharCode(107);
      u = null !== i ? i : (i = window[l] || "") || "";
      for (
        var d = u.split("."),
          m = Number(d[0]) || 0,
          s = Number(d[1]) || 0,
          S = [],
          c = 0,
          v = 0;
        v < r.length;
        v++
      ) {
        var A = r.charCodeAt(v);
        128 > A
          ? (S[c++] = A)
          : (2048 > A
              ? (S[c++] = (A >> 6) | 192)
              : (55296 === (64512 & A) &&
                v + 1 < r.length &&
                56320 === (64512 & r.charCodeAt(v + 1))
                  ? ((A =
                      65536 + ((1023 & A) << 10) + (1023 & r.charCodeAt(++v))),
                    (S[c++] = (A >> 18) | 240),
                    (S[c++] = ((A >> 12) & 63) | 128))
                  : (S[c++] = (A >> 12) | 224),
                (S[c++] = ((A >> 6) & 63) | 128)),
            (S[c++] = (63 & A) | 128));
      }
      for (
        var p = m,
          F =
            "" +
            String.fromCharCode(43) +
            String.fromCharCode(45) +
            String.fromCharCode(97) +
            ("" +
              String.fromCharCode(94) +
              String.fromCharCode(43) +
              String.fromCharCode(54)),
          D =
            "" +
            String.fromCharCode(43) +
            String.fromCharCode(45) +
            String.fromCharCode(51) +
            ("" +
              String.fromCharCode(94) +
              String.fromCharCode(43) +
              String.fromCharCode(98)) +
            ("" +
              String.fromCharCode(43) +
              String.fromCharCode(45) +
              String.fromCharCode(102)),
          b = 0;
        b < S.length;
        b++
      )
        (p += S[b]), (p = n(p, F));
      return (
        (p = n(p, D)),
        (p ^= s),
        0 > p && (p = (2147483647 & p) + 2147483648),
        (p %= 1e6),
        p.toString() + "." + (p ^ m)
      );
    }
    var i = null;
    return e;
  })();
}

if (!session) {
  window = {};
  window.gtk = "320305.131321201";
  session = Request.jar();

  requestTranslation = () => {
    return new Promise((resolve, reject) => {
      Request.post(TRANSLATE_URL, {
        gzip: true,
        headers: {
          Referer: SESSION_URL,
          "User-Agent": USER_AGENT
        },
        form: {
          from: "jp",
          to: "zh",
          query: text,
          transtype: "translang",
          simple_means_flag: 3,
          sign: getSign(text),
          token
        },
        jar: session
      })
        .then(body => {
          var sentences = JSON.parse(body);
          if (sentences.trans_result) {
            sentences = sentences.trans_result.data;
            let result = "";
            for (let i in sentences) {
              result += sentences[i].dst;
            }
            callback(result);
          } else {
            callback(
              `Error. Raw result: ${JSON.stringify(sentences)} Sign: ${getSign(
                text
              )} Token: ${token}`
            );
          }
        })
        .catch(err => {
          callback(err);
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
    }).then(body => {
      Request.get(SESSION_URL, {
        jar: session,
        gzip: true,
        headers: {
          Referer: SESSION_URL,
          "User-Agent": USER_AGENT
        }
      })
        .then(body => {
          token = /token: '([^\']+)',/.exec(body)[1];
        })
        .then(requestTranslation)
        .catch(err => {
          callback(err);
        });
    });
  };

  initSession();
} else {
  requestTranslation();
}
