import {
  SplitView,
  SplitViewPane,
  SplitViewPaneInfo,
} from 'vs-splitview-react';
import React from 'react';
import 'vs-splitview-react/dist/index.scss';
import { useState } from 'react';
const BasicUsage = () => {
  const [paneData, setPaneData] = useState<SplitViewPaneInfo[]>([
    {
      paneKey: 'Pane1',
      minSize: 180,
      snapable: true,
      snappedSize: 24,
    },
    { paneKey: 'Pane2', minSize: 180 },
    { paneKey: 'Pane3', minSize: 400 },
  ]);
  return (
    <div
      style={{ height: 300, minWidth: 600, overflow: 'auto' }}
      className="demo-basic"
    >
      <SplitView
        viewName="base.view1"
        paneData={paneData}
        onChange={(p) => setPaneData([...p])}
      >
        <SplitViewPane paneKey="Pane1">
          <div
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid red',
              boxSizing: 'border-box',
            }}
          >
            pane1
          </div>
        </SplitViewPane>
        <SplitViewPane paneKey="Pane2">
          <div
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid blue',
              boxSizing: 'border-box',
            }}
          >
            <button
              onClick={() => {
                setPaneData((pre) => {
                  const p = pre[0];
                  p.snapped = !p.snapped;
                  return pre.map((t) => ({ ...t }));
                });
              }}
            >
              折叠
            </button>
          </div>
        </SplitViewPane>
        <SplitViewPane paneKey="Pane3" className="content-pane">
          <div
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid pink',
              boxSizing: 'border-box',
            }}
          >
            pane3
          </div>
        </SplitViewPane>
      </SplitView>
    </div>
  );
};

export default BasicUsage;
