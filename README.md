<h1 align="center">
  <a href="https://github.com/Yagt/Yagt"><img src="https://raw.githubusercontent.com/Yagt/Yagt/master/build/icons/icon.png" alt="Yet Another Galgame Translator" width="200" /></a>
  <br>
  另一个 Galgame 翻译器
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

![它看起来的样子](https://raw.githubusercontent.com/Yagt/Yagt/master/.github/imgs/how_it_looks.png)

## 警告！

与实际正在推进的项目相比，Yagt 更像是一个倡议。因为我本人并不是 Node.js 或者 C++方面的专家，所以本项目很可能只会以极其缓慢的进度向前推进... ¯\\\_(ツ)\_/¯

但是，如果你和我一样对本项目感兴趣，欢迎各种 fork 和 PR！ ╰(\*°▽°\*)╯

## 挖坑的动力

我们已经有 Visual Novel Reader (VNR)了，为什么还要再开发一个 Galgame 翻译器？

嗯...有以下三个原因：

1. VNR 用 Python（甚至是 Python 2）来渲染 UI，这导致了极端的卡顿，并且完全没有必要；
2. sakuradite.com（VNR 官网）挂了，似乎现在并没有针对 VNR 的官方维护，只剩下贴吧零零散散的 BUG 修复与改进；
3. VNR 的功能（也可以说脚本）太多了，想添加/修改一个功能要读很久的源码，十分费劲。

但是，如果要用 Qt5 重写的话，手动管理内存、配置、国际化什么的又显得太麻烦了。

因此，用 Electron 作为用户交互的前端，而用原始的 Windows API 作为后端（比如文本提取），不失为一种比较好的选择。

## 功能

- 从正在运行的 Galgame 里即时提取文本
- 从离线字典中获取翻译，如 J 北京等
- 从在线翻译 API 中获取翻译，如谷歌、百度、有道等
- 在游戏窗口上方浮动显示原文+翻译（就像 VNR 一样）
- 自定义在线 API 翻译获取方式: URL、请求方法、请求报头格式、响应的解析方式等
- 支持扩展

## 计划

- [x] 技术可行性评估
- [x] 把文本提取器包装成 Node.js 原生组件
- [x] 主窗口 UI
- [x] 文本展示窗口 UI
- [x] 在线翻译 API 调用
- [x] J 北京翻译 DLL 调用
- [ ] 其它最新的：[计划仓库（英文）](https://github.com/Yagt/planning/issues)

## 尝个鲜？

随便找个文件夹，运行以下代码：

    git clone https://github.com/Yagt/Yagt.git
    cd yagt
    npm install (或 yarn)
    npm run rebuild
    npm run dev

## 许可证

Yagt 使用 GPLv3 许可证开源。

我本来是想用 MIT 的，但是由于上游依赖（如文本提取器）用的是 GPL，所以我也很为难啊。
