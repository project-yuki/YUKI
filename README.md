# Yagt - Yet Another Galgame Translator

## Warning

The Yagt Project is more like a propose than an actual working progress. Since I'm not a professor in either NodeJS or C++, this project can be in ugly slow progress ¯\_(ツ)_/¯

However, if you're interested in the same idea, forks and PRs are sincerely welcomed ╰(*°▽°*)╯

## Motivation

We already have Visual Novel Reader (VNR), so why another galgame translator?

Well, there are three reasons:

1. VNR uses Python (even Python 2) for UI generation, which is extremely slow and unnecessary.
2. sakuradite.com is down, seems there is no official maintenance for VNR.
3. VNR has so many features (I mean, Python scripts), which can cause desperation when trying to modify/add one.

However, if using Qt5, it can be such an annoy thing to manage memory/i18n/configuration manually.

So, using Electron as frontend and traditional Windows API (Text Hooker wrapped as a native Node module) as backend seems a good idea.

## Features

* Real-time text extractor from running Galgame
* Get translation from dictionary: JBeijing, etc.
* Get translation from online translator API: Google, Baidu, Youdao, etc.
* Show on floating window on top of game window
* Custom online API settings: URL, request format, response regex parser
* Support extension

## TODO

1. Technical feasibility assessment
2. Wrap Text Hooker as a native Node module
3. Basic UI Design
4. UI implementation
5. Online translator API call
6. ...

## License

Yagt is licensed under GPLv3.

I'd like to use MIT license, but the upstream softwares (Text Hooker for example) are licensed under GPL, so, no choice.
