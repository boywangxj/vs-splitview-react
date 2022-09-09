import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { SplitView, SplitViewPane } from '../lib/index';
import { SplitViewTestContext, testSashDrag, testSplitView } from './testUtils';

let splitViewEditorTestContext: SplitViewTestContext;
let splitViewContentTestContext: SplitViewTestContext;
let splitViewMainTestContext: SplitViewTestContext;

beforeEach(() => {
  splitViewEditorTestContext = new SplitViewTestContext({
    layout: 'horizontal',
    viewName: 'splitview_editors',
    paneData: [
      {
        paneKey: 'editorsPane',
        minSize: 80,
        priority: 1,
      },
      {
        paneKey: 'consolePane',
        minSize: 80,
        snapable: true,
      },
    ],
  });
  splitViewContentTestContext = new SplitViewTestContext({
    layout: 'horizontal',
    viewName: 'splitview_content',
    paneData: [
      {
        paneKey: 'sideMenuPane',
        minSize: 48,
        maxSize: 48,
      },
      {
        paneKey: 'subMenuPane',
        minSize: 120,
        size: 180,
        maxSize: 800,
        snapable: true,
      },
      {
        paneKey: 'editorPane',
        minSize: 160,
        priority: 1,
      },
      {
        paneKey: 'propertySheetPane',
        minSize: 120,
        size: 180,
        maxSize: 800,
        snapable: true,
      },
    ],
  });
  splitViewMainTestContext = new SplitViewTestContext({
    layout: 'vertical',
    viewName: 'splitview_main',
    paneData: [
      {
        paneKey: 'menuBarPane',
        minSize: 30,
        maxSize: 30,
      },
      {
        paneKey: 'contentPane',
        minSize: 120,
      },
      {
        paneKey: 'statusBarPane',
        minSize: 22,
        maxSize: 22,
      },
    ],
  });
});
const renderTestComponent = () => {
  const splitViewMain = (
    <SplitView {...splitViewMainTestContext.props}>
      <SplitViewPane paneKey="menuBarPane">menuBar</SplitViewPane>
      <SplitViewPane paneKey="contentPane">
        <SplitView {...splitViewContentTestContext.props}>
          <SplitViewPane paneKey="sideMenuPane">sideMenu</SplitViewPane>
          <SplitViewPane paneKey="subMenuPane">subMenu</SplitViewPane>
          <SplitViewPane paneKey="editorPane">
            <SplitView {...splitViewEditorTestContext.props}>
              <SplitViewPane paneKey="editorsPane">editorsPane</SplitViewPane>
              <SplitViewPane paneKey="consolePane">consolePane</SplitViewPane>
            </SplitView>
          </SplitViewPane>
          <SplitViewPane paneKey="propertySheetPane">
            propertySheetArea
          </SplitViewPane>
        </SplitView>
      </SplitViewPane>
      <SplitViewPane paneKey="statusBarPane">statusBar</SplitViewPane>
    </SplitView>
  );
  act(() => {
    render(splitViewMain);
  });
};

it.each([
  [448, 172, 4, 200],
  [224, 86, 4, 200],
  [896, 346, 4, 200],
  [2000, 2000, 4, 200],
  [10000, 10000, 4, 200],
  /* ********************** */
  [448, 172],
  [224, 86],
  [896, 346],
  [2000, 2000],
  [10000, 10000],
])(
  'nested layout:(width:%p height:%p sashSize:%i hoverDelay:%i)',
  async (
    width: number,
    height: number,
    sashSize: number | undefined = undefined,
    hoverDelay: number | undefined = undefined
  ) => {
    splitViewMainTestContext.props.sashSize = sashSize;
    splitViewMainTestContext.props.hoverDelay = hoverDelay;
    splitViewContentTestContext.props.sashSize = sashSize;
    splitViewContentTestContext.props.hoverDelay = hoverDelay;
    splitViewEditorTestContext.props.sashSize = sashSize;
    splitViewEditorTestContext.props.hoverDelay = hoverDelay;
    await renderTestComponent();

    await testSplitView(width, height, splitViewMainTestContext);

    const contentPaneElement = await screen.findByTestId(
      'splitview_splitview_main_pane_contentPane'
    );
    await testSplitView(
      width, // 100%
      parseFloat(contentPaneElement.style.height),
      splitViewContentTestContext
    );

    const editorPaneElement = await screen.findByTestId(
      'splitview_splitview_content_pane_editorPane'
    );
    await testSplitView(
      parseFloat(editorPaneElement.style.width),
      parseFloat(contentPaneElement.style.height),
      splitViewEditorTestContext
    );

    await testSashDrag(splitViewMainTestContext);
    await testSashDrag(splitViewContentTestContext);
    await testSashDrag(splitViewEditorTestContext);
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
