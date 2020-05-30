<h1 align="center">
  <a href="https://github.com/project-yuki/YUKI"><img src="https://raw.githubusercontent.com/project-yuki/YUKI/master/build/icons/icon.png" alt="YUKI" width="200" /></a>
  <br>
  YUKI Galgame 翻译器
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

![它看起来的样子](https://raw.githubusercontent.com/project-yuki/YUKI/master/.github/imgs/how_it_looks.jpg)

## 紧急公告

2020.5.30 晚间，大量用户使用 YUKI 时遇到错误为`ERR: TypeError: Cannot read property 'target' of undefined`的报错窗口。经排查，该报错由彩云 API 目前严重的不稳定状态导致。现已紧急推送 v0.14.3，修复上述问题，但彩云 API 目前仍无法使用，因此请目前所有版本的 YUKI 用户关闭彩云 API（具体方法：打开 YUKI 根目录下的 config\config.json 文件，将 onlineApis 数组中 name = "彩云" 的对象的 enable 属性改为 false）。关闭后，即使不升级至 v0.14.3 也可解决报错问题。

## 下载

1.  点击[这里](https://github.com/project-yuki/YUKI/releases)
2.  点开最新版本介绍下面的 " > Assets "，第一个 ZIP 文件就是编译后的 YUKI :)

## 文档

- [YUKI 配置文件详解](/docs/ConfigFiles_CN.md)
- [YUKI 常见问题](/docs/FAQ_CN.md)

## 挖坑的动力

我们已经有 Visual Novel Reader (VNR)了，为什么还要再开发一个 Galgame 翻译器？

嗯...有以下三个原因：

1.  VNR 用 Python（甚至是 Python 2）来渲染 UI，这导致了极端的卡顿，并且完全没有必要；
2.  sakuradite.com（VNR 官网）挂了，似乎现在并没有针对 VNR 的官方维护，只剩下贴吧零零散散的 BUG 修复与改进；
3.  VNR 的功能（也可以说脚本）太多了，想添加/修改一个功能要读很久的源码，十分费劲。

但是，如果要用 Qt5 重写的话，手动管理内存、配置、国际化什么的又显得太麻烦了。

因此，用 Electron 作为用户交互的前端，而用原始的 Windows API 作为后端（比如文本提取），不失为一种比较好的选择。

## 功能

- 从正在运行的 Galgame 里即时提取文本
- 从离线字典中获取翻译，如 J 北京等
- 从在线翻译 API 中获取翻译，如谷歌、百度、有道等
- 可编程外部翻译 API （参考 config\ 目录下的 JavaScript 文件）
- 在游戏窗口上方浮动显示原文+翻译（就像 VNR 一样）
- 自定义在线 API 翻译获取方式: URL、请求方法、请求报头格式、响应的解析方式等
- 支持扩展

## 计划

- [计划仓库（英文）](https://github.com/project-yuki/planning/issues)
- [各版本计划（英文）](https://github.com/project-yuki/YUKI/projects)

## 尝个鲜？

安装好 Node.js 和 yarn 后，随便找个文件夹，运行以下代码：

    git clone https://github.com/project-yuki/YUKI.git
    cd YUKI
    yarn
    yarn dev

## 许可证

YUKI 使用 GPLv3 许可证开源。

我本来是想用 MIT 的，但是由于上游依赖（如文本提取器）用的是 GPL，所以我也很为难啊。
