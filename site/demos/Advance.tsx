import { useState } from 'react';
import React from 'react';

import {
  SplitView,
  SplitViewPane,
  SplitViewPaneInfo,
  SplitViewTools,
} from 'vs-splitview-react';

const Advance = () => {
  const [paneData1] = useState<SplitViewPaneInfo[]>([
    {
      paneKey: 'menu',
      minSize: 30,
      maxSize: 30,
    },
    {
      paneKey: 'content',
      minSize: 120,
    },
    {
      paneKey: 'statusbar',
      minSize: 22,
      maxSize: 22,
    },
  ]);
  const [paneData2, setPaneData2] = useState<SplitViewPaneInfo[]>([
    {
      paneKey: 'Pane1',
      minSize: 48,
      maxSize: 48,
    },
    {
      paneKey: 'Pane2',
      minSize: 120,
      size: 180,
      snapable: true,
    },
    {
      paneKey: 'Pane3',
      minSize: 160,
      priority: 1,
    },
    // {
    //   paneKey: 'console',
    //   minSize: 80,
    //   snapable: true,
    // },
  ]);
  const [paneData3, setPaneData3] = useState<SplitViewPaneInfo[]>([
    {
      paneKey: 'content',
      minSize: 80,
      priority: 1,
    },
    {
      paneKey: 'console',
      minSize: 80,
      snapable: true,
    },
  ]);

  const consolePane = (
    <SplitViewPane key="console" paneKey="console">
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgb(30, 30, 30)',
          borderLeftColor: 'rgba(128, 128, 128, 0.35)',
          borderRightColor: 'rgba(128, 128, 128, 0.35)',
        }}
      >
        <div
          style={{
            width: '100%',
            borderTop: '1px solid rgba(128, 128, 128, 0.35)',
          }}
        >
          <button
            onClick={() => {
              if (paneData3.length === 2) {
                const pasting = SplitViewTools.paneCut(paneData3, 'console');
                SplitViewTools.panePaste(pasting, paneData2, 'Pane3', true);
              } else {
                const pasting = SplitViewTools.paneCut(paneData2, 'console');
                SplitViewTools.panePaste(pasting, paneData3, 'content', true);
              }
              setPaneData2([...paneData2]);
              setPaneData3([...paneData3]);
            }}
          >
            置于
            {paneData3.length === 2 ? '右' : '下'}方
          </button>
          aaaaaaaaaaaaaaaaaa
        </div>
      </div>
    </SplitViewPane>
  );
  return (
    <div style={{ height: '480px' }}>
      <SplitView viewName="view1" paneData={paneData1} layout="vertical">
        <SplitViewPane paneKey="menu">
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#323233',
            }}
          ></div>
        </SplitViewPane>
        <SplitViewPane paneKey="content">
          <SplitView viewName="view2" paneData={paneData2}>
            <SplitViewPane key="pane1" paneKey="Pane1">
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#333333',
                }}
              ></div>
            </SplitViewPane>
            <SplitViewPane key="pane2" paneKey="Pane2">
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#252526',
                  outlineColor: 'rgba(83, 89, 93, 0.5)',
                }}
              >
                <button
                  onClick={() => {
                    paneData2.splice(1, 0, ...paneData2.splice(2, 1));
                    setPaneData2([...paneData2]);
                  }}
                >
                  移动
                  {paneData2.findIndex((t) => t.paneKey === 'Pane2') === 1
                    ? '右'
                    : '左'}
                  侧
                </button>
              </div>
            </SplitViewPane>
            <SplitViewPane key="pane3" paneKey="Pane3">
              <SplitView
                viewName="view3"
                paneData={paneData3}
                layout="vertical"
              >
                <SplitViewPane key="content" paneKey="content">
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgb(30, 30, 30)',
                    }}
                  ></div>
                </SplitViewPane>
                {consolePane}
              </SplitView>
            </SplitViewPane>
            {consolePane}
          </SplitView>
        </SplitViewPane>
        <SplitViewPane paneKey="statusbar">
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgb(0, 122, 204)',
            }}
          ></div>
        </SplitViewPane>
      </SplitView>
    </div>
  );
};

export default Advance;
