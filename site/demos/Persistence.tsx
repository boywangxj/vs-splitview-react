import { useEffect, useState } from 'react';
import {
  SplitView,
  SplitViewPane,
  SplitViewPaneInfo,
} from 'vs-splitview-react';
import React from 'react';
const saveLayout = (layoutName: string, paneData: SplitViewPaneInfo[]) => {
  localStorage.setItem(layoutName, JSON.stringify(paneData));
};
const loadLayout = (layoutName: string): SplitViewPaneInfo[] | undefined => {
  const jsonString = localStorage.getItem(layoutName);
  if (jsonString) {
    return JSON.parse(jsonString);
  }
  return undefined;
};

const Persistence = () => {
  const [state, setState] = useState<{
    paneData1: SplitViewPaneInfo[];
    paneData2: SplitViewPaneInfo[];
    paneData3: SplitViewPaneInfo[];
  }>({
    paneData1: loadLayout('paneData1') || [
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
    ],
    paneData2: loadLayout('paneData2') || [
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
    ],
    paneData3: loadLayout('paneData3') || [
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
    ],
  });

  useEffect(() => {
    // Save layout
    saveLayout('paneData1', state.paneData1);
    saveLayout('paneData2', state.paneData2);
    saveLayout('paneData3', state.paneData3);
  }, [state.paneData1, state.paneData2, state.paneData3]);

  return (
    <div style={{ height: '90vh' }}>
      <SplitView
        paneData={state.paneData1}
        onChange={(paneData) => {
          setState({ ...state, paneData1: paneData });
        }}
        layout="vertical"
      >
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
          <SplitView
            paneData={state.paneData2}
            onChange={(paneData) => {
              setState({ ...state, paneData2: paneData });
            }}
          >
            <SplitViewPane paneKey="Pane1">
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#333333',
                }}
              ></div>
            </SplitViewPane>
            <SplitViewPane paneKey="Pane2">
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#252526',
                  outlineColor: 'rgba(83, 89, 93, 0.5)',
                }}
              ></div>
            </SplitViewPane>
            <SplitViewPane paneKey="Pane3">
              <SplitView
                paneData={state.paneData3}
                onChange={(paneData) => {
                  setState({ ...state, paneData3: paneData });
                }}
                layout="vertical"
              >
                <SplitViewPane paneKey="content">
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgb(30, 30, 30)',
                    }}
                  ></div>
                </SplitViewPane>
                <SplitViewPane paneKey="console">
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
                    ></div>
                  </div>
                </SplitViewPane>
              </SplitView>
            </SplitViewPane>
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

export default Persistence;
