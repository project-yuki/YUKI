# Yagt - Yet Another Galgame Translator

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

[中文](https://github.com/Yagt/Yagt/blob/master/README.md)

![how it looks](https://raw.githubusercontent.com/Yagt/Yagt/master/.github/imgs/how_it_looks.png)

## Warning

The Yagt Project is more like a propose than an actual working progress. Since I'm not a professor in either NodeJS or C++, this project can be in ugly slow progress ¯\\\_(ツ)\_/¯

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
- [ ] Others: [planning repo](https://github.com/Yagt/planning/issues)

## Usage

    git clone https://github.com/Yagt/Yagt.git
    cd yagt
    npm install (or yarn)
    npm run rebuild
    npm run dev

## License

Yagt is licensed under GPLv3.

I'd like to use MIT license, but the upstream softwares (Text Hooker for example) are licensed under GPL, so, no choice.
