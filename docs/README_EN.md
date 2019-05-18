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
</p>

<p align="center">
  <a href="/README.md">中文</a> •
  <a href="/docs/README_EN.md">English</a>
</p>

![how it looks](https://raw.githubusercontent.com/project-yuki/yuki/master/.github/imgs/how_it_looks.jpg)

## WARNING

Project YUKI is more like a propose than an actual working progress. Since I'm not a professor in either NodeJS or C++, this project can be in ugly slow progress ¯\\\_(ツ)\_/¯

However, if you're interested in the same idea, forks and PRs are sincerely welcomed ╰(\*°▽°\*)╯

## Motivation

We already have Visual Novel Reader (VNR), so why another galgame translator?

Well, there are three reasons:

1. VNR uses Python (even Python 2) for UI generation, which is extremely slow and unnecessary.
2. sakuradite.com is down, seems there is no official maintenance for VNR.
3. VNR has so many features (I mean, Python scripts), which can cause desperation when trying to modify/add one.

However, if using Qt5, it can be such an annoy thing to manage memory/i18n/configuration manually.

So, using Electron as frontend and traditional Windows API (Text Hooker wrapped as a native Node module) as backend seems a good idea.

## Features

- Real-time text extractor from running Galgame
- Get translation from dictionary: JBeijing, etc.
- Get translation from online translator API: Google, Baidu, Youdao, etc.
- Show on floating window on top of game window
- Custom online API settings: URL, request format, response regex parser
- Support extension

## TODO

- [x] Technical feasibility assessment
- [x] Wrapping text hooker as a native Node module
- [x] Main window UI
- [x] Text window UI
- [x] Online translator API call
- [x] JBeijing translator DLL access
- [ ] Others: [planning repo](https://github.com/project-yuki/planning/issues)

## Usage

    git clone https://github.com/project-yuki/YUKI.git
    cd yuki
    npm install (or yarn)
    npm run rebuild
    npm run dev

## License

YUKI is licensed under GPLv3.

I'd like to use MIT license, but the upstream softwares (Text Hooker for example) are licensed under GPL, so, no choice.
