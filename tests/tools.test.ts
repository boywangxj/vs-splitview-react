import { SplitViewPaneInfo } from '../lib';
import {
  paneCut,
  paneMoveToFirst,
  paneMoveToLast,
  paneMoveTo,
  panePaste,
} from '../lib/tools';

describe('tools: the pane move', () => {
  describe('a splitview pane move', () => {
    const panes: SplitViewPaneInfo[] = [
      {
        paneKey: 'pane1',
        minSize: 100,
      },
      {
        paneKey: 'pane2',
        minSize: 100,
      },
      {
        paneKey: 'pane3',
        minSize: 100,
      },
      {
        paneKey: 'pane4',
        minSize: 100,
      },
    ];
    it('paneMoveToPosition()', () => {
      paneMoveTo(panes, 'pane1', 'pane3', true);
      expect(panes[0].paneKey).toBe('pane2');
      expect(panes[1].paneKey).toBe('pane3');
      expect(panes[2].paneKey).toBe('pane1');
      expect(panes[3].paneKey).toBe('pane4');
      paneMoveTo(panes, 'pane1', 'pane2', false);
      expect(panes[0].paneKey).toBe('pane1');
      expect(panes[1].paneKey).toBe('pane2');
      expect(panes[2].paneKey).toBe('pane3');
      expect(panes[3].paneKey).toBe('pane4');
    });

    it('paneMovetoFirst()', () => {
      paneMoveToFirst(panes, 'pane4');
      expect(panes[0].paneKey).toBe('pane4');
      expect(panes[1].paneKey).toBe('pane1');
      expect(panes[2].paneKey).toBe('pane2');
      expect(panes[3].paneKey).toBe('pane3');
    });
    it('paneMoveToLast()', () => {
      paneMoveToLast(panes, 'pane4');
      expect(panes[0].paneKey).toBe('pane1');
      expect(panes[1].paneKey).toBe('pane2');
      expect(panes[2].paneKey).toBe('pane3');
      expect(panes[3].paneKey).toBe('pane4');
    });
  });

  describe('cross splitview pane move', () => {
    it('test cut paste', () => {
      const paneData1: SplitViewPaneInfo[] = [
        {
          paneKey: 'sv1.pane1',
          minSize: 100,
        },
        {
          paneKey: 'sv1.pane2',
          minSize: 100,
        },
        {
          paneKey: 'sv1.pane3',
          minSize: 100,
        },
        {
          paneKey: 'sv1.pane4',
          minSize: 100,
        },
      ];
      const paneData2: SplitViewPaneInfo[] = [
        {
          paneKey: 'sv2.pane1',
          minSize: 100,
        },
        {
          paneKey: 'sv2.pane2',
          minSize: 100,
        },
        {
          paneKey: 'sv2.pane3',
          minSize: 100,
        },
      ];
      const cuttingPane1 = paneCut(paneData1, 'sv1.pane3');
      expect(cuttingPane1.paneKey).toBe('sv1.pane3');
      expect(paneData1.length).toBe(3);
      expect(paneData1[0].paneKey).toBe('sv1.pane1');
      expect(paneData1[1].paneKey).toBe('sv1.pane2');
      expect(paneData1[2].paneKey).toBe('sv1.pane4');
      panePaste(cuttingPane1, paneData2, 'sv2.pane2', true);
      expect(paneData2[0].paneKey).toBe('sv2.pane1');
      expect(paneData2[1].paneKey).toBe('sv2.pane2');
      expect(paneData2[2].paneKey).toBe('sv1.pane3');
      expect(paneData2[3].paneKey).toBe('sv2.pane3');

      const cuttingPane2 = paneCut(paneData2, 'sv1.pane3');
      panePaste(cuttingPane2, paneData1, 'sv1.pane4');
      expect(paneData1[0].paneKey).toBe('sv1.pane1');
      expect(paneData1[1].paneKey).toBe('sv1.pane2');
      expect(paneData1[2].paneKey).toBe('sv1.pane3');
      expect(paneData1[3].paneKey).toBe('sv1.pane4');

      expect(paneData2[0].paneKey).toBe('sv2.pane1');
      expect(paneData2[1].paneKey).toBe('sv2.pane2');
      expect(paneData2[2].paneKey).toBe('sv2.pane3');
    });
  });
});
