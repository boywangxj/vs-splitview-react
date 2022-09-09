import { render, screen, act } from '@testing-library/react';
import React from 'react';
import {
  Layout,
  SplitView,
  SplitViewPane,
  SplitViewPaneInfo,
} from '../lib/index';
import { SplitViewTestContext, testSashDrag, triggerResize } from './testUtils';
it.each<
  [string, Layout, SplitViewPaneInfo[], { width: number; height: number }[]]
>([
  [
    'no fixed panes',
    'horizontal',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 160 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
      { paneKey: 'pane3', minSize: 120, maxSize: 200 },
    ],
    [
      { width: 300, height: 300 }, // 容器比splitview的最小尺寸还小
      { width: 600, height: 600 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'fixed pane(has one fixed pane)',
    'horizontal',
    [
      { paneKey: 'pane1', minSize: 44, maxSize: 44 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
      { paneKey: 'pane3', minSize: 80 },
    ],
    [
      { width: 524, height: 524 }, // 容器比splitview的最小尺寸还小
      { width: 1048, height: 1048 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'fixed pane(the first and last Panes are fixed )',
    'horizontal',
    [
      { paneKey: 'pane1', minSize: 44, maxSize: 44 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
      { paneKey: 'pane3', minSize: 80, maxSize: 80 },
    ],
    [
      { width: 524, height: 524 }, // 容器比splitview的最小尺寸还小
      { width: 1048, height: 1048 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'snappable',
    'horizontal',
    [
      {
        paneKey: 'pane1',
        minSize: 44,
        size: 120,
        maxSize: 200,
        snapable: true,
      }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
      { paneKey: 'pane3', minSize: 80, snapable: true },
    ],
    [
      { width: 524, height: 524 }, // 容器比splitview的最小尺寸还小
      { width: 1048, height: 1048 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'priority(maxSize is not set)',
    'horizontal',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 160 }, // maxsize test
      { paneKey: 'pane2', minSize: 400, priority: 1 },
      { paneKey: 'pane3', minSize: 400, priority: 1 },
      { paneKey: 'pane4', minSize: 120, maxSize: 200 },
    ],
    [
      { width: 600, height: 600 }, // 容器比splitview的最小尺寸还小
      { width: 1200, height: 1200 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'priority(group)',
    'horizontal',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 160, priority: 2 }, // maxsize test
      { paneKey: 'pane2', minSize: 400, priority: 1 },
      { paneKey: 'pane3', minSize: 400, priority: 1 },
      { paneKey: 'pane4', minSize: 120, maxSize: 200, priority: 2 },
      { paneKey: 'pane5', minSize: 120, maxSize: 200, priority: 3 },
      { paneKey: 'pane6', minSize: 120, maxSize: 200, priority: 3 },
    ],
    [
      { width: 600, height: 600 }, // 容器比splitview的最小尺寸还小
      { width: 1200, height: 1200 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
])(
  'sash draging(%p %p)',
  async (
    _,
    layout: Layout,
    paneData: SplitViewPaneInfo[],
    sizes: { width: number; height: number }[]
  ) => {
    const context = new SplitViewTestContext({
      viewName: 'splitview1',
      paneData: paneData,
      layout: layout,
    });
    const ui = (
      <SplitView {...context.props}>
        {paneData.map((pane) => (
          <SplitViewPane key={pane.paneKey} paneKey={pane.paneKey}>
            {pane.paneKey}
          </SplitViewPane>
        ))}
      </SplitView>
    );
    render(ui);

    for (let i = 0; i < sizes.length; i++) {
      const { width, height } = sizes[i];
      const splitViewElement = await screen.findByTestId(
        `splitview_${context.props.viewName}`
      );
      await act(async () => {
        triggerResize(splitViewElement, width, height);
      });
      await testSashDrag(context);
    }
  }
);
/**
 * 1.resize
 *  1.1 minSize
 *  1.2 maxSize
 *  1.3 minSize&maxSize
 *  1.4 fixed
 *  1.5 priority
 *  1.5 onchange
 * 2.drag
 *  2.1 minSize
 *  2.2 maxSize
 *  2.3 minSize&maxSize
 *  2.4 snap
 *  2.5 fixed
 *  2.6 onchange
 * 3.delay hover
 * 4.move position
 * 5.cut paste
 */
//
