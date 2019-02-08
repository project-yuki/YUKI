result = new Promise(resolve => {
  Request(
    {
      url: "https://aidemo.youdao.com/trans",
      method: "POST",
      form: {
        q: text,
        from: "ja",
        to: "zh-CHS"
      }
    },
    function(error, response, body) {
      if (error || response.statusCode !== 200 || body.errorCode !== 0)
        result = "ERROR! API MIGHT CHANGED";

      resolve(JSON.parse(body).translation[0]);
    }
  );
});
