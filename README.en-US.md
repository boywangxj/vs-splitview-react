English | [简体中文](./README.md)
# VS-SPLITVIEW-REACT
A VSCode style SplitView component for React.It have all the SplitView features within my cognitive range, if there are no features you need please submit an issue.
## [Live Demo](https://boywangxj.github.io/vs-splitview-react)  
## ✨ Features
- 🌈 VSCode Style SplitView;
- 📦 Support priority. When the parent container changes size or drag sash, the one with high priority will be resized first;
- 🛡 Supports minimum and maximum size constraints;
- ⚙️ Supports snapping;
- 🌍 Supports fixed pane;
- 🎨 Supports chain effect;
- ⛪ Supports hover delay;
- 🎷 Supports persistance;
- 📚 Supports nested layout；
## 🖥 Environment Support

- Modern browsers and Internet Explorer 11 (with [polyfills](https://stackoverflow.com/questions/57020976/polyfills-in-2019-for-ie11))
- Server-side Rendering
- [Electron](https://www.electronjs.org/)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Electron |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                     | last 2 versions                                                                                                                                                                                                  | last 2 versions                                                                                                                                                                                              | last 2 versions                                                                                                                                                                                              | last 2 versions                                                                                                                                                                                                      |

## 📦 Install

```bash
npm install vs-splitview-react
```

```bash
yarn add vs-splitview-react
```
## 🔨 Usage

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
```
> Since the width and height of the splitview container are 100%, the parent container of the splitview must have a height (specify or inherit, etc.).
>
And import style manually:

```jsx
import 'vs-splitview-react/dist/index.css'; // or 'vs-splitview-react/dist/index.scss'
```


## API
### SplitView

| Property   | Description                                                                                                                                                                                                            | Type                                   | Default Value |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------- |
| paneData   | Config of the panes。                                                                                                                                                                                                  | `SplitViewPaneInfo[]`                  | -             |
| layout     | Layout direction;Horizontal: pane arranged horizontally; Vertical: pane is arranged vertically.                                                                                                                        | `horizontal \| vectical`               | horizontal    |
| sashSize   | Width of the separating line between two panes (height when layout = horizontal)                                                                                                                                       | `number`                               | 5             |
| hoverDelay | Mouse hover delay time. 0 is not delayed.                                                                                                                                                                              | `number`                               | 300           |
| onChange   | Triggered when the container size changes or the Sash is dragged. If you need to save the layout, you can save the paneData parameter and pass it to the SplitView.paneData property when you need to load the layout. | `(paneData:SplitViewPaneInfo[])=>void` | -             |
### SplitViewPane

| Property | Description                                                                            | Type     | Default Value |
| -------- | -------------------------------------------------------------------------------------- | -------- | ------------- |
| paneKey  | The unique key of the Pane, which is associated with the paneKey in SplitViewPaneInfo. | `string` | -             |
### SplitViewPaneInfo

| Property | Description                                                                                                         | Type      | Default Value |
| -------- | ------------------------------------------------------------------------------------------------------------------- | --------- | ------------- |
| paneKey  | The unique key of the Pane, which is associated with the paneKey in SplitViewPane Component.                        | `string`  | -             |
| minSize  | Minimum size.                                                                                                       | `number`  | -             |
| size     | The current size of the Pane. The real-time size will be calculated according to the container size, priority, etc. | `number`  | -             |
| maxSize  | Maximum size.If all maxSize in SplitView.paneData are set, the maxSize of the last Pane is invalid.                 | `number`  | -             |
| snapable | Whether it can be snap. The snapped property is valid only when snapable = true.                                    | `boolean` | false         |
| snapped  | Whether it has been snapped. Only valid if snapable is true.                                                        | `boolean` | -             |
| priority | Panes with higher priority will be resized first.                                                                   | `number`  | 0             |
### Global methods
These methods are used to support the movement of processing panes between the same splitview or different splitviews. These methods can help you if you need to implement Pane's drag or layout configuration.
#### paneMoveTo
Move the pane to the specified position.  
| Parameter          | Description                                | Type                  | Default Value |
| ------------------ | ------------------------------------------ | --------------------- | ------------- |
| paneData           | paneData of SplitView.                     | `SplitViewPaneInfo[]` | -             |
| sourcePaneKey      | The paneKey of the Pane to be moved.       | `string`              | -             |
| destinationPaneKey | The paneKey of the target Pane to move to. | `string`              | -             |
| behand             | Whether to move behind the target Pane.    | `boolean`             | false         |
#### paneMoveToLast
Move the pane to the last position.
| Parameter     | Description                          | Type                  | Default Value |
| ------------- | ------------------------------------ | --------------------- | ------------- |
| paneData      | paneData of SplitView.               | `SplitViewPaneInfo[]` | -             |
| sourcePaneKey | The paneKey of the Pane to be moved. | `string`              | -             |
#### paneMoveToFirst
Move the pane to the first position.
| Parameter     | Description                          | Type                  | Default Value |
| ------------- | ------------------------------------ | --------------------- | ------------- |
| paneData      | paneData of SplitView.               | `SplitViewPaneInfo[]` | -             |
| sourcePaneKey | The paneKey of the Pane to be moved. | `string`              | -             |
#### paneCut
Cut the pane from paneData.Remove the Pane of the specified paneKey from the paneData and return the Pane.
| Parameter     | Description                          | Type                  | Default Value |
| ------------- | ------------------------------------ | --------------------- | ------------- |
| paneData      | paneData of SplitView.               | `SplitViewPaneInfo[]` | -             |
| sourcePaneKey | The paneKey of the Pane to be moved. | `string`              | -             |

returnValue：The Pane data that corresponds to sourcePaneKey.
#### panePaste
Paste the pane to the specified position, and support moving between paneData of different SplitViews.
| Parameter    | Description                                                                                              | Type                  | Default Value |
| ------------ | -------------------------------------------------------------------------------------------------------- | --------------------- | ------------- |
| srcPane      | The Pane data to paste. It can be derived from the return value of cutPane or it can be a new Pane data. | `SplitViewPaneInfo`   | -             |
| destPaneData | The panelData to paste into.                                                                             | `SplitViewPaneInfo[]` | -             |
| paneKey      | The panelKey of the target Pane.                                                                         | `string`              | -             |
| behand       | Whether to move behind the target Pane.                                                                  | `boolean`             | false         |


> If you want to move Pane across SplitView, remember that the SplitView should contain the SplitViewPane component corresponding to the panelKey.
#License
MIT
