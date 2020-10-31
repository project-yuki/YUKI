var requestTranslation = function (){

    return new Promise(
        (resolve, reject) => {
            Request.post("https://www.yeekit.com/site/dotranslate", {
				form:{
					'content[]': text ,
					'sourceLang':'nja' ,
					'targetLang':'nzh'
				}
            }).then(string => {
				var json=JSON.parse(string);
				json = json[0];
				json=JSON.parse(json);
				json = (json.translation)[0];
				json = (json.translated)[0];

				var result = json.text;
				callback(result);
						
            }).catch(err => {
                callback(`error: ${err}`);
            })
		})
}

requestTranslation();