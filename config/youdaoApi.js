URL = "https://aidemo.youdao.com/trans";

result = Request.post(URL, {
  form: {
    q: text,
    from: "ja",
    to: "zh-CHS"
  }
})
  .then(body => {
    return JSON.parse(body).translation[0];
  })
  .catch(err => {
    return "ERROR! API MIGHT CHANGED";
  });
