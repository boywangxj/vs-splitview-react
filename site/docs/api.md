---
nav:
  title: API
menus: false
---
<API src="../../lib/index.ts"></API>

### SplitViewPaneInfo
| Property | Description                                                                                                         | Type      | Default |
| -------- | ------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| paneKey  | The unique key of the Pane, which is associated with the paneKey in SplitViewPane Component.                        | `string`  | -       |
| minSize  | Minimum size.                                                                                                       | `number`  | -       |
| size     | The current size of the Pane. The real-time size will be calculated according to the container size, priority, etc. | `number`  | -       |
| maxSize  | Maximum size.If all maxSize in SplitView.paneData are set, the maxSize of the last Pane is invalid.                 | `number`  | -       |
| snapable | Whether it can be snap. The snapped property is valid only when snapable = true.                                    | `boolean` | false   |
| snapped  | Whether it has been snapped. Only valid if snapable is true.                                                        | `boolean` | -       |
| priority | Panes with higher priority will be resized first.                                                                   | `number`  | 0       |


### SplitViewTools 

These methods are used to support the movement of processing panes between the same splitview or different splitviews. These methods can help you if you need to implement Pane's drag or layout configuration.
#### paneMoveTo
Move the pane to the specified position.  
| Parameter          | Description                                | Type                  | Default |
| ------------------ | ------------------------------------------ | --------------------- | ------- |
| paneData           | paneData of SplitView.                     | `SplitViewPaneInfo[]` | -       |
| sourcePaneKey      | The paneKey of the Pane to be moved.       | `string`              | -       |
| destinationPaneKey | The paneKey of the target Pane to move to. | `string`              | -       |
| behand             | Whether to move behind the target Pane.    | `boolean`             | false   |

#### paneMoveToLast

Move the pane to the last position.
| Parameter     | Description                          | Type                  | Default |
| ------------- | ------------------------------------ | --------------------- | ------- |
| paneData      | paneData of SplitView.               | `SplitViewPaneInfo[]` | -       |
| sourcePaneKey | The paneKey of the Pane to be moved. | `string`              | -       |

#### paneMoveToFirst

Move the pane to the first position.
| Parameter     | Description                          | Type                  | Default |
| ------------- | ------------------------------------ | --------------------- | ------- |
| paneData      | paneData of SplitView.               | `SplitViewPaneInfo[]` | -       |
| sourcePaneKey | The paneKey of the Pane to be moved. | `string`              | -       |

#### paneCut

Cut the pane from paneData.Remove the Pane of the specified paneKey from the paneData and return the Pane.
| Parameter     | Description                          | Type                  | Default |
| ------------- | ------------------------------------ | --------------------- | ------- |
| paneData      | paneData of SplitView.               | `SplitViewPaneInfo[]` | -       |
| sourcePaneKey | The paneKey of the Pane to be moved. | `string`              | -       |

returnValue：The Pane data that corresponds to sourcePaneKey.

#### panePaste

Paste the pane to the specified position, and support moving between paneData of different SplitViews.
| Parameter    | Description                                                                                              | Type                  | Default |
| ------------ | -------------------------------------------------------------------------------------------------------- | --------------------- | ------- |
| srcPane      | The Pane data to paste. It can be derived from the return value of cutPane or it can be a new Pane data. | `SplitViewPaneInfo`   | -       |
| destPaneData | The panelData to paste into.                                                                             | `SplitViewPaneInfo[]` | -       |
| paneKey      | The panelKey of the target Pane.                                                                         | `string`              | -       |
| behand       | Whether to move behind the target Pane.                                                                  | `boolean`             | false   |


> If you want to move Pane across SplitView, remember that the SplitView should contain the SplitViewPane component corresponding to the panelKey.
