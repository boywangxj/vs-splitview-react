---
nav:
  title: Guides
  order: 1
order: 1
title: Getting Started
---
# SplitView of React
A VSCode style SplitView component for React.It have all the SplitView features within my cognitive range, if there are no features you need please submit an issue.
## [Live Demo](http://#)  
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
```
> Since the width and height of the splitview container are 100%, the parent container of the splitview must have a height (specify or inherit, etc.).
>
And import style manually:

```tsx | pure
import 'vs-splitview-react/dist/index.css'; // or 'vs-splitview-react/dist/index.scss'
```

### TypeScript

`vs-split-view` is written in TypeScript with complete definitions, don't install @types/vs-split-view.
