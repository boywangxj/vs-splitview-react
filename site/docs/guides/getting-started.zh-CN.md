---
nav:
  title: 指南
  order: 1
order: 1
title: 快速开始
---
# SplitView of React
仿VS Code SplitView 的React组件。我的认知范围内SplitView功能都有，如果没有请提交Issue。
## [演示](http://#)  
## ✨ 特性
- 🌈 VSCode 类似的SplitView功能；
- 📦 支持优先级，在父容器改变大小或拖动Sash时，优先级高的先调整大小；
- 🛡 支持最小尺寸和最大尺寸约束;
- ⚙️ 支持停靠;
- 🌍 支持固定Pane;
- 🎨 支持连锁反应;
- ⛪ 支持Hover Delay;
- 🎷 支持布局存储;
- 📚 支持嵌套布局。
## 🖥 环境

- Modern browsers and Internet Explorer 11 (with [polyfills](https://stackoverflow.com/questions/57020976/polyfills-in-2019-for-ie11))
- Server-side Rendering
- [Electron](https://www.electronjs.org/)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Electron |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                     | last 2 versions                                                                                                                                                                                                  | last 2 versions                                                                                                                                                                                              | last 2 versions                                                                                                                                                                                              | last 2 versions                                                                                                                                                                                                      |

## 📦 安装

```bash
npm install vs-splitview-react
```

```bash
yarn add vs-splitview-react
```
## 🔨 使用

```tsx | pure
import { useState } from 'react';
import {
  SplitView,
  SplitViewPane,
  SplitViewPaneInfo,
} from 'vs-splitview-react';

const BasicUsage = () => {
  const [state, setState] = useState<{ paneData: SplitViewPaneInfo[] }>({
    paneData: [
      {
        paneKey: 'Pane1',
        minSize: 44,
        maxSize: 44,
      },
      {
        paneKey: 'Pane2',
        minSize: 120,
        maxSize: 240,
        size: 180,
        snapable: true,
      },
      {
        paneKey: 'Pane3',
        minSize: 160,
      },
      {
        paneKey: 'Pane4',
        minSize: 120,
        maxSize: 240,
      },
    ],
  });
  return (
    <div style={{ height: 800 }}>
      <SplitView
        paneInfo={state.paneData}
      >
        <SplitViewPane paneKey="Pane1">fixed</SplitViewPane>
        <SplitViewPane paneKey="Pane2">Snapable</SplitViewPane>
        <SplitViewPane paneKey="Pane3">Content</SplitViewPane>
        <SplitViewPane paneKey="Pane4">Property</SplitViewPane>
      </SplitView>
    </div>
  );
};

export default BasicUsage;
/**
 * 由于SplitView的容器width和height指定的是100%，所以SplitView的父容器必须指定高度。
 * */
```
> 由于SplitView的容器width和height指定的是100%，所以SplitView的父容器必须有高度（指定或继承等）。
>
手动添加样式:

```tsx | pure
import 'vs-splitview-react/dist/index.css'; // or 'vs-splitview-react/dist/index.scss'
```

### TypeScript

`vs-split-view` is written in TypeScript with complete definitions, don't install @types/vs-split-view.
