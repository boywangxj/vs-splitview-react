# VS-SPLITVIEW-REACT
仿VS Code SplitView 的React组件。我的认知范围内SplitView功能都有，如果没有请提交Issue。
## [演示](https://boywangxj.github.io/vs-splitview-react)  
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

```jsx
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
And import style manually:

```jsx
import 'vs-splitview-react/dist/index.css'; // or 'vs-splitview-react/dist/index.scss'
```


## API
### SplitView

| Property   | Description                                                                                                                                      | Type                                   | Default Value |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ------------- |
| paneData   | Pane的配置数据。                                                                                                                                 | `SplitViewPaneInfo[]`                  | -             |
| layout     | 布局方向；horizontal:Pane横向排列 vertical:Pane纵向排列。                                                                                        | `horizontal \| vectical`               | horizontal    |
| sashSize   | 两个Pane中间的分隔线的宽度（layout=horizontal时是高度）                                                                                          | `number`                               | 5             |
| hoverDelay | 鼠标Hover 延迟。0不延迟。                                                                                                                        | `number`                               | 300           |
| onChange   | 当由于容器大小变化、拖动Sash后产生布局变化时触发。如果需要保存布局，可以保存paneData参数，在需要加载布局的时候传递给SplitView.paneData属性即可。 | `(paneData:SplitViewPaneInfo[])=>void` | -             |
### SplitViewPane

| Property | Description                                                                                           | Type     | Default Value |
| -------- | ----------------------------------------------------------------------------------------------------- | -------- | ------------- |
| paneKey  | Pane的唯一Key，与SplitViewPaneInfo中的paneKey对应。使用paneKey练习SplitViewPane组件于paneData的关系。 | `string` | -             |
### SplitViewPaneInfo

| Property | Description                                                                                          | Type      | Default Value |
| -------- | ---------------------------------------------------------------------------------------------------- | --------- | ------------- |
| paneKey  | Pane的唯一Key，对应于SplitViewPane.paneKey。使用paneKey练习SplitViewPane组件于paneData的关系。       | `string`  | -             |
| minSize  | 最小尺寸。                                                                                           | `number`  | -             |
| size     | 当前尺寸。会根据容器大小、优先级等计算出实时尺寸。                                                   | `number`  | -             |
| maxSize  | 最大尺寸。最大尺寸。如果SplitView.paneData中的所有maxSize都设置了值，那么最后一个Pane的maxSize无效。 | `number`  | -             |
| snapable | 是否可以停靠。true时snaped属性才有效。                                                               | `boolean` | false         |
| snapped  | 是否已经停靠。仅当snapable是true是有效。                                                             | `boolean` | -             |
| priority | 优先级。数值越高的Pane优先调整大小。                                                                 | `number`  | 0             |
### 全局方法
用于支持处理Pane在同一个SplitView或不同SplitView之间移动。如果你需要实现Pane的移动拖放、布局配置等操作，这些方法可以帮到你。
#### paneMoveTo
移动paneKey对应的Pane的到指定的位置。  
| Parameter          | Description             | Type                  | Default Value |
| ------------------ | ----------------------- | --------------------- | ------------- |
| paneData           | Pane数据。              | `SplitViewPaneInfo[]` | -             |
| sourcePaneKey      | 要移动的Pane的paneKey。 | `string`              | -             |
| destinationPaneKey | 移动到的目标paneKey。   | `string`              | -             |
| behand             | 是否在目标Pane的后面。  | `boolean`             | false         |
#### paneMoveToLast
移动paneKey对应的Pane到最后的位置。
| Parameter     | Description             | Type                  | Default Value |
| ------------- | ----------------------- | --------------------- | ------------- |
| paneData      | Pane数据。              | `SplitViewPaneInfo[]` | -             |
| sourcePaneKey | 要移动的Pane的paneKey。 | `string`              | -             |
#### paneMoveToFirst
移动paneKey对应的Pane到最前的位置。
| Parameter     | Description             | Type                  | Default Value |
| ------------- | ----------------------- | --------------------- | ------------- |
| paneData      | Pane数据。              | `SplitViewPaneInfo[]` | -             |
| sourcePaneKey | 要移动的Pane的paneKey。 | `string`              | -             |
#### paneCut
剪切paneKey对应的Pane。从paneData中移除指定paneKay的Pane，并返回这个Pane。
| Parameter     | Description             | Type                  | Default Value |
| ------------- | ----------------------- | --------------------- | ------------- |
| paneData      | Pane数据。              | `SplitViewPaneInfo[]` | -             |
| sourcePaneKey | 要剪切的Pane的paneKey。 | `string`              | -             |

返回值：对应sourcePaneKey的Pane数据。
#### panePaste
粘贴paneKey对应的Pane到指定位置，支持在不同SplitView的paneData之间剪切粘贴。
| Parameter    | Description                                                             | Type                  | Default Value |
| ------------ | ----------------------------------------------------------------------- | --------------------- | ------------- |
| srcPane      | 要粘贴的Pane数据。可以来源于cutPane的返回值，也可以是一个新的Pane数据。 | `SplitViewPaneInfo`   | -             |
| destPaneData | 要粘贴到的paneData                                                      | `SplitViewPaneInfo[]` | -             |
| paneKey      | 粘贴到的目标paneKey。                                                   | `string`              | -             |
| behand       | 是否在目标Pane的后面。                                                  | `boolean`             | false         |


> 如果要跨SplitView移动Pane,切记SplitView中应该包含对应paneKey的SplitViewPane组件。
