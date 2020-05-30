<h1 align="center">
  <a href="https://github.com/project-yuki/YUKI"><img src="https://raw.githubusercontent.com/project-yuki/YUKI/master/build/icons/icon.png" alt="YUKI" width="200" /></a>
  <br>
  YUKI - Yummy Utterance Knowledge Interface
  <br>
  <br>
</h1>

<p align="center">
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="JavaScript Style Guide"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/license-GPL%203.0-blue.svg" alt="GPL 3.0 LICENSE"></a>
  <a href="https://ci.appveyor.com/project/tinyAdapter/yuki"><img src="https://ci.appveyor.com/api/projects/status/g54ttjac4w36v5hx?svg=true" alt="Build status"></a>
</p>

<p align="center">
  <a href="/README.md">中文</a> •
  <a href="/docs/README_EN.md">English</a>
</p>

![how it looks](https://raw.githubusercontent.com/project-yuki/yuki/master/.github/imgs/how_it_looks.jpg)

## Emergency Announcement

In the evening of May 30th, 2020, many users faced an error reporting window with error `ERR: TypeError: Cannot read property 'target' of undefined`. Through investigation, this report is due to the highly instability of ColorfulClouds API. Now a emergency patch of version 0.14.3 has been released to repair that problem. However, at present ColorfulClouds API still cannot be used, hence users of all versions please kindly disable ColorfulClouds API (Method: open config\config.json in YUKI root directory, change the enable property of the object with name = '彩云' in the onlineApis array from true to false). After disabling, the problem will be resolved without upgrading to v0.14.3.

## Download

1.  Click [Here](https://github.com/project-yuki/YUKI/releases)
2.  Click " > Assets " under the description of latest version, and the first ZIP file is the compiled version of YUKI

## Motivation

We already have Visual Novel Reader (VNR), so why another galgame translator?

Well, there are three reasons:

1.  VNR uses Python (even Python 2) for UI generation, which is extremely slow and unnecessary.
2.  sakuradite.com is down, seems there is no official maintenance for VNR.
3.  VNR has so many features (I mean, Python scripts), which can cause desperation when trying to modify/add one.

However, if using Qt5, it can be such an annoy thing to manage memory/i18n/configuration manually.

So, using Electron as frontend and traditional Windows API (Text Hooker wrapped as a native Node module) as backend seems a good idea.

## Features

- Real-time text extractor from running Galgame
- Get translation from dictionary: JBeijing, etc.
- Get translation from online translator API: Google, Baidu, Youdao, etc.
- Programmable external translator API (refer to JavaScript files in config\ folder for examples)
- Show on floating window on top of game window
- Custom online API settings: URL, request format, response regex parser
- Support extension

## TODO

- [planning repo](https://github.com/project-yuki/planning/issues)
- [planning of various versions](https://github.com/project-yuki/YUKI/projects)

## Usage

After installing Node.js and yarn, run the following commands in any folder:

    git clone https://github.com/project-yuki/YUKI.git
    cd YUKI
    yarn
    yarn dev

## License

YUKI is licensed under GPLv3.

I'd like to use MIT license, but the upstream softwares (Text Hooker for example) are licensed under GPL, so, no choice.
