SESSION_URL = "https://fanyi-api.baidu.com/"
TRANSLATE_URL =
    "https://fanyi-api.baidu.com/api/trans/vip/translate"
USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"

var appid = '123456';  // 从 https://api.fanyi.baidu.com/ 获取
var key = 'abcdefg'; // 从 https://api.fanyi.baidu.com/ 获取

// md5
var MD5 = function (string) {

	var temp=crypto.createHash('md5').update(string).digest('hex');

    return temp;
}

var requestTranslation;
var from = 'auto';
var to = 'zh';

requestTranslation = () => {
    var salt = (new Date).getTime();
    var str1 = appid + text + salt + key;
    var sign = MD5(str1);
    return new Promise((resolve, reject) => {
        Request.get(TRANSLATE_URL, {
            gzip: true,
            headers: {
                Referer: SESSION_URL,
                "User-Agent": USER_AGENT
            },
            qs: {
                q: text,
                appid: appid,
                salt: salt,
                from: from,
                to: to,
                sign: sign
            }
        })
            .then(body => {
                var sentences = JSON.parse(body);
                if (sentences.trans_result) {
                    sentences = sentences.trans_result;
                    let result = "";
                    for (let i in sentences) {
                        result += sentences[i].dst;
                    }
                    callback(result);
                } else {
                    callback(
                        `Error. Raw result: ${body}`
                    );
                }
            }).catch(err => {
                callback(err);
            });
    });
};
requestTranslation();