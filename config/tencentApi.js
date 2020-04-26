var from = 'auto';
var to = 'zh';
var SecretId = '123465'; //https://console.cloud.tencent.com/cam/capi 腾讯云控制台获取
var SecretKey = 'abcdefg'; //https://console.cloud.tencent.com/cam/capi 腾讯云控制台获取

var sign = (secretKey, signStr, date) => {
    SecretDate = crypto.createHmac('sha256', "TC3" + secretKey).update(date).digest();
    SecretService = crypto.createHmac('sha256', SecretDate).update('tmt').digest();
    SecretSigning = crypto.createHmac('sha256', SecretService).update("tc3_request").digest();
    ret = crypto.createHmac('sha256', SecretSigning).update(signStr).digest('hex');
    return ret
}

var hash = (str) => {
    let hash = crypto.createHash('sha256');
    return hash.update(str).digest('hex')
}

var client = {
    path: "/",
    credential: {
        SecretId, SecretKey
    },
    region: "ap-shanghai",
    apiVersion: "2018-03-21",
    endpoint: "tmt.tencentcloudapi.com"
}

var formatRequestData = (action, params) => {
    params.headers = {
        "Host": client.endpoint,
        "X-TC-Action": action,
        "X-TC-RequestClient": "APIExplorer",
        "X-TC-Timestamp": Math.round(Date.now() / 1000),
        "X-TC-Version": client.apiVersion,
        "X-TC-Region": client.region,
        "X-TC-Language": "zh-CN",
        "Content-Type": "application/json",
    };
    params.Service = "/tmt/tc3_request";
    params.Date = new Date(Date.now()).toISOString().slice(0, 10);
    params.SecretId = client.credential.SecretId;
    let CredentialScope = `${params.Date}${params.Service}`
    let requestStr = formatSignString(params);
    let signStr = `TC3-HMAC-SHA256\n${params.headers["X-TC-Timestamp"]}\n${CredentialScope}\n${hash(requestStr).toLowerCase()}`
    let signature = sign(client.credential.SecretKey, signStr, params.Date).toLowerCase();
    params.headers["Authorization"] = `TC3-HMAC-SHA256 Credential=${params.SecretId}/${CredentialScope}, SignedHeaders=content-type;host, Signature=${signature}`;
    return params;
};

var formatSignString = (params) => {
    let requestStr = `POST\n/\n\ncontent-type:application/json\nhost:tmt.tencentcloudapi.com\n\ncontent-type;host\n${hash(JSON.stringify(params.body)).toLowerCase()}`;
    return requestStr;
}

var requestTranslation = () => {
    let params = {
        body: {
            SourceText: text,
            Source: from,
            Target: to,
            ProjectId: 0
        }
    }
    params = formatRequestData('TextTranslate', params);

    return new Promise(
        (resolve, reject) => {
            Request.post(`https://${client.endpoint}${client.path}`, {
                headers: params.headers,
                body: params.body,
                json: true,
            }).then(json => {
                if (!json.Response) {
                    callback(`Error: UNKNOWN ERROR`);
                } if (json.Response.Error) {
                    var result = json.Response.Error.Message;
                    callback(result);
                } else {
                    callback(json.Response.TargetText)
                }
            }).catch(err => {
                callback(`error: ${err}`);
            })
        }
    )
}

requestTranslation()