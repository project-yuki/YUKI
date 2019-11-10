# YUKI 配置文件详解

YUKI 的配置文件存放在程序主目录下的 config 子目录下，分为配置普通项的 JSON 文件和用于自定义翻译 API 的 JS 文件。

### 配置文件的生成与修改

在程序启动时，会检查 config 目录下是否存在配置文件，如果不存在，则会自动创建一个包含全部项默认参数的配置文件。如果存在，则不会对该文件进行覆盖，程序直接读取文件并保存在内存中以供查阅。

根据这种处理配置文件的逻辑，我们可以得出以下几点：

- 在下载更新版本的 YUKI 后，如果没有说明配置文件存在「破坏性更新」，则可以直接将原来的 config 目录直接复制到新的程序目录下，正常运行即可恢复以前的配置
- 由于程序中部分功能不检查配置文件中是否存在所需的项，因此尽量**不要删除配置文件中的项**，有可能会导致程序出错。请尽量只进行项的添加或修改
- 每次修改配置文件后需要重启 YUKI（此项不适用于自定义翻译 API 的 JS 文件，因为程序具有修改 JS 文件后保存即重新加载的功能，当然以后可能会对 JSON 文件添加同样的功能）
- 如果某一翻译 API 失效，且最新版本的 YUKI 修复了该 API，则应重新生成默认 config.json 并替换 onlineApis 对象（后面有详解）。

### 与 JSON 文件格式有关的几个注意事项

由于 YUKI 不验证配置文件的「合法性」（即是否存在违犯 JSON 语法规范的配置文件写法），偏偏 JSON 想要不写错又比较的困难，因此需要特别指出， JSON 语法规定：

- 不允许存在注释，即不能使用`//`或`/**/`
- 任何非数字和布尔类型的值均为字符串类型，必须使用`""`（双引号）包括，而非`''`（单引号）
- 任何在字符串值中出现的`"`（双引号）必须使用转义字符`\`（反斜杠），例如`"\""`表示仅有一个双引号的字符串。`\`（反斜杠）自身则需要表示为`\\`。在后续的配置文件中，我们会发现大量使用转义字符描述的场合。

如果对自己没有自信的话，请使用支持显示 JSON 语法错误的文本编辑器，如[Visual Studio Code](https://code.visualstudio.com/)。

## config.json

config.json 是程序最基本的配置文件，包含一系列跟程序运行有关的配置项和一些无法拆分为单独 JSON 文件的杂项。

### 默认配置文件（以 v0.9.1 为例，后续可能发生变化，下同）

```json
{
  "localeChangers": {
    "localeEmulator": {
      "name": "Locale Emulator",
      "enable": false,
      "exec": ""
    },
    "ntleas": {
      "name": "Ntleas",
      "enable": false,
      "exec": ""
    },
    "noChanger": {
      "name": "No Changer",
      "enable": true,
      "exec": "%GAME_PATH%"
    }
  },
  "onlineApis": [
    {
      "enable": false,
      "external": true,
      "jsFile": "config\\hjdictApi.js",
      "name": "沪江"
    },
    {
      "enable": true,
      "external": true,
      "jsFile": "config\\hjdictApi.js",
      "name": "有道"
    },
    {
      "enable": true,
      "method": "POST",
      "name": "谷歌",
      "requestBodyFormat": "X{\"q\": %TEXT%, \"sl\": \"ja\", \"tl\": \"zh-CN\"}",
      "responseBodyPattern": "Rclass=\"t0\">([^<]*)<",
      "url": "https://translate.google.cn/m"
    },
    {
      "enable": true,
      "method": "POST",
      "name": "彩云",
      "requestBodyFormat": "J{\"source\": %TEXT%, \"trans_type\": \"ja2zh\", \"request_id\": \"demo\", \"detect\": \"true\"}",
      "requestHeaders": "{\"X-Authorization\": \"token 3975l6lr5pcbvidl6jl2\"}",
      "responseBodyPattern": "J%RESPONSE%.target",
      "url": "https://api.interpreter.caiyunai.com/v1/translator"
    },
    {
      "enable": true,
      "external": true,
      "jsFile": "config\\qqApi.js",
      "name": "腾讯"
    }
  ],
  "translators": {
    "jBeijing": {
      "enable": false,
      "path": "",
      "dictPath": ""
    }
  },
  "mecab": {
    "enable": false,
    "path": ""
  },
  "librariesRepoUrl": "https://github.com/project-yuki/libraries/raw/master/_pack/",
  "language": "zh"
}
```

### .localeChangers

存储区域转换器信息的对象，其中每个 key 代表一个区域转换器的 ID，可以自行取，但是不能重复，value 为包含 name、enable 和 exec 的对象，分别代表区域转换器的名字，是否启用和区域转换器的执行方式。

#### 区域转换器的执行方式

即最终的运行命令。存在一些可能的*转义段*用以合成该命令。目前仅有`%GAME_PATH%`，代表目标游戏所在的绝对路径。

以 Locale Emulator 为例，该区域转换器的运行方式即为

```
<Locale Emulator所在文件夹>\\LEProc.exe %GAME_PATH%
```

注意目录中的`\`（反斜杠）必须转义，因此为`\\`。

### .onlineApis

在线翻译 API 数组，包含相对简单的，可以通过指定一些参数访问的 _API_ 和必须要运行 JS 脚本文件才能得到结果的 _外部 API_ 两种。

#### name

API 名称。该项的值会显示在翻译器窗口每项结果的左侧。

#### enable

是否启用。默认为 false。

#### external

该 API 是否为外部 API。如果该项设置为 true，则必须指定 jsFile，同时其它简单配置项将会失效。默认为 false。

#### jsFile

脚本文件所在的路径。

#### url

请求（Request）的 URL 地址。

#### method

请求的类型，可以为 GET、POST、PUT 等任何 HTTP 标准中支持的类型。一般为 GET 或 POST。

#### requestBodyFormat

请求体格式。该项比较复杂，说明如下：

- 字符串的第一个值为 X 或者 J。X 表示作为表单（Form）发送网络请求，J 表示作为 JSON 对象发送网络请求
- 之后的`{}`包含的部分为请求体的具体格式。注意，由于解析时使用 JSON 格式，因此每项都需要以`""`（双引号）包含，而 JSON 字符串中的`"`（双引号）又必须以`\`（反斜杠）转义，因此就是目前看到的`"{\"key1\": \"value1\", \"key2\": \"value2\"}"`样式
- 转义段目前仅为%TEXT%，表示实际需要翻译的文本

#### requestHeaders

任何需要手动指定的请求头（Request Headers）都可以在此处指定，格式同样为 JSON。

常见用于指定 User-Agent 或 Referer。

#### responseBodyPattern

响应（Response）解析格式。说明如下：

- 字符串的第一个值为 R 或者 J。R 表示将响应作为字符串，并在其中调用正则表达式（Regex）进行翻译文本提取，常见于返回结果为嵌入翻译结果的网页的情况。发送网络请求，J 表示将响应作为 JS 对象，并对其进行后续的解析
- 如果以正则表达式解析，R 后跟的部分即为正则表达式的语法。如`class=\"t0\">([^<]*)<`对应 JS 中的`/class=\"t0\">([^<]*)</`正则表达式。程序将会把该正则表达式运行结果的**第一项**作为正式的翻译结果返回
- 如果以 JS 对象解析，J 后跟的部分为实际运行的参数。转义段目前仅为`%RESPONSE%`，表示实际获取到的响应体 JS 对象。如`%RESPONSE%.target`，则说明响应体对象下的 target 属性即为所需翻译结果。此处语法与 JS 相同。

### .translators

离线翻译器对象。目前仅支持 J 北京（`jBeijing`属性）。

#### enable

是否启用 J 北京离线翻译。

#### path

J 北京所在的目录。

#### dictPath

J 北京自定义词典所在的目录。

### .mecab

[MeCab](https://taku910.github.io/mecab/) 是一个日语分词器，用于将日语文本进行分词并标注词性。经过分词的文本会更加清晰并易于与翻译结果进行对照。

由于实现问题，YUKI 依赖对 MeCab 直接的 DLL 调用，因此请下载[经过测试的 MeCab 版本](https://github.com/project-yuki/libraries/raw/master/_pack/pos.mecab-ipadic.zip)。

#### enable

是否启用 MeCab。

#### path

MeCab 所在的目录。注意，该目录下应包含 libmecab.dll。

### .librariesRepoUrl

模块下载的主域名。目前尚处在实现中，建议保留默认值。

### .language

翻译器的显示语言。可选项为简体中文（zh）或英文（en）。

## games.json

games.json 存放着所有与游戏相关的信息。

### 默认配置文件

```json
{
  "games": []
}
```

### .games

游戏信息数组。包含游戏的名称，目录，区域转换器与特殊码。

#### name

游戏名称。

#### path

游戏所在的绝对路径。

#### localeChanger

运行游戏时应当使用的区域转换器 ID。注意，一定要与 localeChangers 里的对象 key 保持对应。

#### code

游戏使用的特殊码。具体细节请参考 [Textractor](https://github.com/Artikash/Textractor) 实现。Textractor 本身兼容 VNR 特殊码。

## gui.json

gui.json 保存与翻译器窗口位置和颜色有关的显示信息。

由于翻译器内配置该部分的功能较为完备，因此不建议直接修改此配置文件。

如果翻译器窗口「跑飞了」，可以删除 gui.json 以恢复其默认位置。

### 默认配置文件

```json
{
  "mainWindow": {
    "bounds": {
      "x": 第一次运行时计算,
      "y": 第一次运行时计算,
      "width": 第一次运行时计算,
      "height": 第一次运行时计算
    }
  },
  "translatorWindow": {
    "bounds": {
      "width": 第一次运行时计算,
      "height": 第一次运行时计算,
      "x": 第一次运行时计算,
      "y": 第一次运行时计算
    },
    "alwaysOnTop": true,
    "originalText": {
      "fontSize": 24,
      "color": "white"
    },
    "translationText": {
      "fontSize": 18,
      "color": "white",
      "margin": 18
    },
    "background": "#000000BD"
  }
}
```

## texts.json

texts.json 保存着所有与翻译文本有关的中间件（Middlewares）的配置信息。

中间件的执行顺序为：

```
Merger -> Interceptor -> Modifier -> Mecab（如果启用的话）-> Filter -> Publish
```

### 默认配置文件

```json
{
  "interceptor": {
    "shouldBeIgnore": [
      "value",
      "sys",
      "\u00020",
      "windowbtn",
      "00_プロローグ１",
      "menu",
      "WndDisp"
    ],
    "ignoreAsciiOnly": false,
    "maxLength": 1000
  },
  "modifier": {
    "removeAscii": false,
    "deduplicate": false
  },
  "merger": {
    "enable": true,
    "timeout": 500
  }
}
```

### .merger

合并器（Merger）中间件，将短时间内快速出现的小型文本片段进行合并，以减少文本获取不全的问题。

#### enable

是否启用合并器。

#### timeout

合并器的超时时间。超过该时间之后出现的文本将会作为下一次文本合并，并重新开始计时。

### .interceptor

拦截器（Interceptor）中间件，当满足一些条件时阻止该文本参与后续的翻译获取与显示。常见于遇到一些不应该出现的「无效」文本时使用。

#### shouldBeIgnore

当文本中出现该数组中的任一文字时拦截。

#### ignoreAsciiOnly

当文本仅包含 ASCII 字符时拦截。用于任何**非英文**游戏。

#### maxLength

文本允许的最大长度。当文本长度超过该数值时拦截。

### .modifier

修改器（Modifier）中间件，进行文本的修改操作。

#### removeAscii

去除文本中出现的 ASCII 字符。

#### deduplicate

去除文本中出现的**任何**重复片段，以最大可能性进行匹配。

因为文本去重功能可能会修改语句本身的语义，因此仅当没有其他任何手段时作为最后的文本修正手段使用。
