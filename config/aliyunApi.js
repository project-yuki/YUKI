var SecretId = 'abcde'; //https://homenew.console.aliyun.com/ 阿里云控制台获取
var SecretKey = '12345'; //https://homenew.console.aliyun.com/ 阿里云控制台获取

// md5+Base64
var MD5Base64 = function (data) {
	
	var hash=crypto.createHash('md5').update(data).digest('base64');
  
    return hash;
}

// HMAC-SHA1
var HMACSha1 = function (data, key) {
	
	var hash=crypto.createHmac('sha1', key).update(data).digest('base64');
  
    return hash;
}


var client = {
    accessKeyId: SecretId,
    accessKeySecret: SecretKey,
    endpoint: 'mt.cn-hangzhou.aliyuncs.com',
	path: '/api/translate/web/general',
    apiVersion: '2019-01-02'
};

// generate uuid
var getUuid = function() {
    return  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' .replace(/[xy]/g,  function (c) {
        var  r = Math.random()*16|0, v = c ==  'x'  ? r : (r&0x3|0x8);
        return  v.toString(16);
    });
}
		


var requestTranslation = function (){

    let method = "POST";
	let accept = "application/json";
	let content_type = "application/json;chrset=utf-8";
	let path = client.path;
	let date = new Date().toUTCString();
	let host = client.endpoint;
	
	let postBody={
		"FormatType": "text",
		"Scene": "general",
		"SourceLanguage": "ja",
		"SourceText": text, 
		"TargetLanguage": "zh",			
	}
	
		
	let bodyMd5 = MD5Base64(JSON.stringify(postBody));
	let uuid = getUuid();
	
	let stringToSign = method + "\n" + accept + "\n" + bodyMd5 + "\n" + content_type + "\n" + date + "\n"
                    + "x-acs-signature-method:HMAC-SHA1\n"
                    + "x-acs-signature-nonce:" + uuid + "\n"
                    + "x-acs-version:2019-01-02\n"
                    + path;
					
	let signature = HMACSha1(stringToSign, client.accessKeySecret);
	let authHeader = "acs " + client.accessKeyId + ":" + signature;
	
	let postHeaders={
			"Authorization": authHeader,
			"Accept": accept,
			"Content-MD5": bodyMd5,
			"Content-Type": content_type,
			"Date": date,
			"Host": host,
			"x-acs-signature-method":"HMAC-SHA1",
			"x-acs-signature-nonce":  uuid,
			"x-acs-version": client.apiVersion
	}


	return new Promise(
        (resolve, reject) => {
            Request.post(`https://${client.endpoint}${client.path}`, {
                headers: postHeaders,
                body: postBody,
				json:true
            }).then(json => {
				
                try {
                    var result = json.Data.Translated;
                    
                    callback(result);
                } catch {
                    callback(
                        "Error." + JSON.stringify(json)
                    );
                }
            }).catch(err => {
                callback(`error: ${err}`);
            })
        }
    )
	

}


requestTranslation();
