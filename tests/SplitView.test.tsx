import { render, screen, act } from '@testing-library/react';
import React from 'react';
import {
  Layout,
  SplitView,
  SplitViewPane,
  SplitViewPaneInfo,
} from '../lib/index';
import {
  SplitViewTestContext,
  testSplitView,
  triggerResize,
  user,
} from './testUtils';
import { DEFAULT_HOVER_DELAY } from '../lib/SplitView';
console.log('start');
it.each<
  [string, Layout, SplitViewPaneInfo[], { width: number; height: number }[]]
>([
  [
    'all panes have maxSize',
    'horizontal',
    [
      { paneKey: 'pane1', minSize: 80 },
      { paneKey: 'pane2', minSize: 400 },
      { paneKey: 'pane3', minSize: 120 },
    ],
    [
      { width: 500, height: 500 }, // 容器比splitview的最小尺寸还小
      { width: 600, height: 600 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'only one pane has maxSize',
    'horizontal',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 160 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
      { paneKey: 'pane3', minSize: 120, maxSize: 200 },
    ],
    [
      { width: 500, height: 500 }, // 容器比splitview的最小尺寸还小
      { width: 600, height: 600 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'priority',
    'horizontal',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 160, priority: 2 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
      { paneKey: 'pane3', minSize: 120, maxSize: 200, priority: 1 },
      { paneKey: 'pane4', minSize: 120, maxSize: 200, priority: 1 },
    ],
    [
      { width: 500, height: 500 }, // 容器比splitview的最小尺寸还小
      { width: 720, height: 720 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'all panes have maxSize',
    'vertical',
    [
      { paneKey: 'pane1', minSize: 80 },
      { paneKey: 'pane2', minSize: 400 },
      { paneKey: 'pane3', minSize: 120 },
    ],
    [
      { width: 500, height: 500 }, // 容器比splitview的最小尺寸还小
      { width: 600, height: 600 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'only one pane has maxSize',
    'vertical',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 160 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
      { paneKey: 'pane3', minSize: 120, maxSize: 200 },
    ],
    [
      { width: 500, height: 500 }, // 容器比splitview的最小尺寸还小
      { width: 600, height: 600 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'priority',
    'vertical',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 160, priority: 2 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
      { paneKey: 'pane3', minSize: 120, maxSize: 200, priority: 1 },
      { paneKey: 'pane4', minSize: 120, maxSize: 200, priority: 1 },
    ],
    [
      { width: 500, height: 500 }, // 容器比splitview的最小尺寸还小
      { width: 720, height: 720 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
])(
  'container size change(%p) ',
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
      await testSplitView(width, height, context);
    }
  }
);

it.each<
  [string, Layout, SplitViewPaneInfo[], { width: number; height: number }[]]
>([
  [
    'no fixed Pane',
    'horizontal',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 160 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
    ],
    [
      { width: 300, height: 300 }, // 容器比splitview的最小尺寸还小
      { width: 480, height: 480 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'one fixed pane',
    'horizontal',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 80 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
    ],
    [
      { width: 300, height: 300 }, // 容器比splitview的最小尺寸还小
      { width: 480, height: 480 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'no fixed pane',
    'vertical',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 160 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
    ],
    [
      { width: 300, height: 300 }, // 容器比splitview的最小尺寸还小
      { width: 480, height: 480 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'a fixed pane',
    'vertical',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 80 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
    ],
    [
      { width: 300, height: 300 }, // 容器比splitview的最小尺寸还小
      { width: 480, height: 480 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
])(
  'sash mouse hover(%p %p)',
  async (
    _,
    layout: Layout,
    paneData: SplitViewPaneInfo[],
    sizes: { width: number; height: number }[]
  ) => {
    const context = new SplitViewTestContext({
      viewName: 'splitview1',
      paneData,
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

      for (let index = 1; index < paneData.length; index++) {
        const frontPaneData = paneData[index - 1];
        const behandPaneData = paneData[index];

        const isFixed =
          frontPaneData.minSize == frontPaneData.maxSize ||
          behandPaneData.minSize == behandPaneData.maxSize;
        const sashElement = screen.getByTestId(
          `splitview_${context.props.viewName}_sash_${index}`
        );

        expect(sashElement.classList.contains('disabled')).toBe(isFixed);

        // hover delay
        expect(sashElement.classList.contains('hover')).toBe(false);
        await user.pointer({
          target: sashElement,
        });
        await act(
          () =>
            new Promise<void>((resolve) => {
              setTimeout(() => {
                resolve();
              }, context.props.hoverDelay || DEFAULT_HOVER_DELAY);
            })
        );
        expect(sashElement.classList.contains('hover')).toBe(!isFixed);

        await user.pointer({
          target: document.body,
        });
        expect(sashElement.classList.contains('hover')).toBe(false);
      }
    }
  }
);
it.each<
  [string, Layout, SplitViewPaneInfo[], { width: number; height: number }[]]
>([
  [
    'no fixed pane',
    'horizontal',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 160 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
    ],
    [
      { width: 300, height: 300 }, // 容器比splitview的最小尺寸还小
      { width: 480, height: 480 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'one fixed pane',
    'horizontal',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 80 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
    ],
    [
      { width: 300, height: 300 }, // 容器比splitview的最小尺寸还小
      { width: 480, height: 480 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'no fixed pane',
    'vertical',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 160 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
    ],
    [
      { width: 300, height: 300 }, // 容器比splitview的最小尺寸还小
      { width: 480, height: 480 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
  [
    'one fixed pane',
    'vertical',
    [
      { paneKey: 'pane1', minSize: 80, maxSize: 80 }, // maxsize test
      { paneKey: 'pane2', minSize: 400 },
    ],
    [
      { width: 300, height: 300 }, // 容器比splitview的最小尺寸还小
      { width: 480, height: 480 }, // 容器和splitview尺寸一样大
      { width: 2000, height: 2000 }, // 容器比splitview尺寸大
    ],
  ],
])(
  'sash mouse down(%p %p)',
  async (
    _,
    layout: Layout,
    paneData: SplitViewPaneInfo[],
    sizes: { width: number; height: number }[]
  ) => {
    const context = new SplitViewTestContext({
      viewName: 'splitview1',
      paneData,
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

      for (let index = 1; index < paneData.length; index++) {
        const frontPaneData = paneData[index - 1];
        const behandPaneData = paneData[index];

        const isFixed =
          frontPaneData.minSize == frontPaneData.maxSize ||
          behandPaneData.minSize == behandPaneData.maxSize;
        const sashElement = screen.getByTestId(
          `splitview_${context.props.viewName}_sash_${index}`
        );
        expect(sashElement.classList.contains('disabled')).toBe(isFixed);

        expect(sashElement.classList.contains('hover')).toBe(false);

        // mouse down hover immediately
        await user.pointer([
          {
            target: sashElement,
          },
          {
            keys: '[MouseLeft>]',
          },
        ]);
        expect(sashElement.classList.contains('hover')).toBe(!isFixed);
        await user.pointer({
          keys: '[/MouseLeft]',
          target: document.body,
        });
        expect(sashElement.classList.contains('hover')).toBe(false);
      }
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
