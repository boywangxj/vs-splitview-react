import { SplitViewPaneInfo } from './types';

/**
 * Move the pane to an absolute position
 * @param paneData the SplitView PaneData
 * @param sourcePaneKey 要移动的Pane的 paneKey
 * @param destinationPaneKey 要移动到的Pane的paneKey
 * @param behand 是否在目标Pane的后面
 */
export const paneMoveTo = (
  paneData: SplitViewPaneInfo[],
  sourcePaneKey: string,
  destinationPaneKey: string,
  behand: boolean = false
) => {
  const sourceIndex = paneData.findIndex(
    (pane) => pane.paneKey === sourcePaneKey
  );
  const from = paneData.splice(sourceIndex, 1);
  const destinationIndex = paneData.findIndex(
    (pane) => pane.paneKey === destinationPaneKey
  );

  paneData.splice(destinationIndex + (behand ? 1 : 0), 0, ...from);
};

export const paneMoveToLast = (
  paneData: SplitViewPaneInfo[],
  sourcePaneKey: string
) => {
  const last = paneData[paneData.length - 1];
  paneMoveTo(paneData, sourcePaneKey, last.paneKey, true);
};

export const paneMoveToFirst = (
  paneData: SplitViewPaneInfo[],
  sourcePaneKey: string
) => {
  const first = paneData[0];
  paneMoveTo(paneData, sourcePaneKey, first.paneKey, false);
};

export const paneCut = (paneData: SplitViewPaneInfo[], paneKey: string) => {
  const paneIndex = paneData.findIndex((t) => t.paneKey === paneKey);
  return paneData.splice(paneIndex, 1)[0];
};

export const panePaste = (
  srcPane: SplitViewPaneInfo,
  destPaneData: SplitViewPaneInfo[],
  paneKey: string,
  behand: boolean = false
) => {
  const paneIndex = destPaneData.findIndex((t) => t.paneKey === paneKey);
  destPaneData.splice(paneIndex + (behand ? 1 : 0), 0, srcPane);
};

export default {
  paneCut,
  paneMoveTo,
  paneMoveToFirst,
  paneMoveToLast,
  panePaste,
};
