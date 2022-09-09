import { act, screen } from '@testing-library/react';
import { SplitViewPaneInfo, SplitViewProps } from '../lib';
// import { _rs as onEsResize } from 'rc-resize-observer/es/utils/observerUtil';
import { _rs as onLibResize } from 'rc-resize-observer/lib/utils/observerUtil';
import {
  DEFAULT_SNAP_THRESHOLD_SIZE,
  DEFAULT_HOVER_DELAY,
  DEFAULT_SASH_SIZE,
} from '../lib/SplitView';
import userEvent from '@testing-library/user-event';
import { PointerCoords } from '@testing-library/user-event/dist/types/event/types';

export class SplitViewTestContext {
  constructor(props: SplitViewProps) {
    this._props = props;
    this._props.onChange = jest.fn((paneData) => {
      this._paneData = paneData;
      this.onPaneDataChanged?.(paneData);
    });
  }
  public onPaneDataChanged?: (paneData: SplitViewPaneInfo[]) => void;
  private _paneData!: SplitViewPaneInfo[];
  public get paneData(): SplitViewPaneInfo[] {
    return this._paneData;
  }
  private set paneData(value: SplitViewPaneInfo[]) {
    this._paneData = value;
  }
  private _props: SplitViewProps;
  public get props(): SplitViewProps {
    return this._props;
  }
  public set props(value: SplitViewProps) {
    this._props = value;
  }
}

export const triggerResize = (
  target: Element,
  width: number = 510,
  height: number = 903
) => {
  const originGetBoundingClientRect = target.getBoundingClientRect;

  target.getBoundingClientRect = () => ({ width, height } as DOMRect);

  act(() => {
    onLibResize([{ target } as ResizeObserverEntry]);
    // onEsResize([{ target } as ResizeObserverEntry]);
  });

  target.getBoundingClientRect = originGetBoundingClientRect;
};
export const parseFloatWithPrecision = (
  n: string | number,
  precision: number = 100000000000
) => {
  return Math.floor(parseFloat(n.toString()) * precision) / precision;
};

export const floatEquals = (
  a: string | number,
  b: string | number,
  precision: number = 100000000000
) => {
  const fa = parseFloatWithPrecision(a, precision);
  const fb = parseFloatWithPrecision(b, precision);
  return fa === fb;
};

export const getRndInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 重新布局 ,通过容器大小,重新计算Pane大小,并且修改
 * @param containerSize 容器大小
 * @param paneData Pane数据
 */
export const relayoutTestPaneData = (
  containerSize: number,
  paneData: SplitViewPaneInfo[]
) => {
  // 所有设置了maxSize的Panes
  const allHaveMaxSizePanes = paneData.filter(
    (t) => t.maxSize && t.maxSize > 0 && t.maxSize !== Number.POSITIVE_INFINITY
  ).length;
  paneData.forEach((pane, index) => {
    let size = pane.size;
    const minSize = pane.minSize || 0;
    let maxSize: number = pane.maxSize || Number.POSITIVE_INFINITY;
    let collapsable = pane.snapable || false; // 默认不可折叠

    if (minSize === 0) {
      // 仅当minSize>0有效
      collapsable = false;
    }

    if (index === paneData.length - 1) {
      // 最后一条
      if (allHaveMaxSizePanes == paneData.length) {
        maxSize = Number.POSITIVE_INFINITY;
      }
    }
    if (size === undefined) {
      size = minSize;
    }

    if (collapsable && pane.snapped === true) {
      size = 0;
    }
    if (size > 0) {
      pane.snapped = false;
    }
    pane.snapable = collapsable;
    pane.minSize = minSize;
    pane.maxSize = maxSize;
    pane.priority = pane.priority || 0;
    pane.size = size;
  });

  const splitViewSize = paneData.reduce(
    (totalSize, pane) => totalSize + pane.size!!,
    0
  );

  // 尺寸变化后,还需要调整Pane的尺寸
  let adjustableSizeTotal = containerSize - splitViewSize;

  if (adjustableSizeTotal !== 0) {
    // 尺寸增加时1 减小时-1
    const increaseOrDecrease =
      Math.abs(adjustableSizeTotal) / adjustableSizeTotal;
    const adjustablePanes = paneData.filter(
      (t) =>
        (increaseOrDecrease > 0 && t.size!! < t.maxSize!!) ||
        (increaseOrDecrease < 0 && t.size!! > t.minSize)
    );
    if (adjustablePanes.length > 0) {
      // group by priority
      const groupByPriority = new Map<number, SplitViewPaneInfo[]>();
      adjustablePanes.sort((a, b) => b.priority!! - a.priority!!);
      adjustablePanes.forEach((t) => {
        let panes = groupByPriority.get(t.priority!!);
        if (!panes) {
          panes = [];
          groupByPriority.set(t.priority!!, panes);
        }
        panes.push(t);
      });

      //调整大小
      groupByPriority.forEach((panes) => {
        let groupAdjustableSize = panes.reduce((adjustableSize, pane) => {
          if (increaseOrDecrease > 0) {
            return adjustableSize + (pane.maxSize! - pane.size!);
          }
          return adjustableSize + (pane.size! - pane.minSize);
        }, 0);
        if (groupAdjustableSize === Number.POSITIVE_INFINITY) {
          groupAdjustableSize = adjustableSizeTotal;
        }

        if (Math.abs(adjustableSizeTotal) >= groupAdjustableSize) {
          adjustableSizeTotal -= groupAdjustableSize * increaseOrDecrease;
        } else {
          groupAdjustableSize = adjustableSizeTotal * increaseOrDecrease;
          adjustableSizeTotal = 0;
        }

        let count = panes.length;
        let averageSize = groupAdjustableSize / count;
        panes
          .sort((a, b) =>
            increaseOrDecrease > 0
              ? a.maxSize! - a.size! - (b.maxSize! - b.size!)
              : a.size! - a.minSize! - (b.size! - b.minSize!)
          )
          .forEach((pane) => {
            const thePaneAllowed =
              increaseOrDecrease > 0
                ? pane.maxSize! - pane.size!
                : pane.size! - pane.minSize!;
            if (thePaneAllowed < averageSize) {
              pane.size! += thePaneAllowed * increaseOrDecrease;
              groupAdjustableSize -= thePaneAllowed;
            } else {
              pane.size! += averageSize * increaseOrDecrease;
              groupAdjustableSize -= averageSize;
            }
            count--;
            averageSize = groupAdjustableSize / count;
          });
      });
    } else {
      // 滚动条了
    }
  }
};

const resizeTestPaneData = (
  panes: SplitViewPaneInfo[],
  adjustSize: number,
  direction: number,
  commiting: boolean
) => {
  let adjustSizeTotal = adjustSize;
  let adjustableSize = 0;
  if (panes[0].snapped && panes[0].size === 0) {
    return 0;
  }
  for (let i = 0; i < panes.length && adjustSizeTotal > 0; i++) {
    const pane = panes[i];
    const paneAdjustableSize =
      direction > 0
        ? pane.maxSize! - pane.size!
        : pane.snapable && pane.size == pane.minSize && commiting
        ? pane.minSize
        : pane.size! - pane.minSize;
    if (paneAdjustableSize >= adjustSizeTotal) {
      adjustableSize += adjustSizeTotal;
      if (commiting) {
        pane.size! += adjustSizeTotal * direction;
      }
      adjustSizeTotal = 0;
    } else {
      adjustSizeTotal -= paneAdjustableSize;
      if (commiting) {
        pane.size! += paneAdjustableSize * direction;
      }
      adjustableSize += paneAdjustableSize;
    }
    // if (commiting && pane.snaped && pane.size! != 0) {
    //   pane.snaped = false;
    // }
  }
  return adjustableSize;
};

export const calSashDragData = (
  delta: number,
  index: number,
  paneDataState: SplitViewPaneInfo[],
  movementSum: { sum: number }
) => {
  if (delta !== 0) {
    const adjustSize = Math.abs(delta);
    const frontPanes = paneDataState.slice(0, index).reverse();
    const behandPanes = paneDataState.slice(index, paneDataState.length);

    const increasingPanes = delta > 0 ? frontPanes : behandPanes;
    const decreasingPanes = delta < 0 ? frontPanes : behandPanes;

    // 仅计算尺寸
    let increasableSize = resizeTestPaneData(
      increasingPanes,
      adjustSize,
      1,
      false
    );
    let decreasableSize = resizeTestPaneData(
      decreasingPanes,
      adjustSize,
      -1,
      false
    );

    if (
      increasableSize == 0 &&
      increasingPanes[0].snapable &&
      increasingPanes[0].snapped &&
      increasingPanes[0].minSize != increasingPanes[0].maxSize
    ) {
      const fixedPaneCount = increasingPanes.reduce((total, pane) => {
        if (pane.minSize === pane.maxSize) {
          return total + 1;
        }
        return total;
      }, 0);
      if (fixedPaneCount === increasingPanes.length - 1) {
        const increasingPane = increasingPanes[0];
        const decreasableSize1 = resizeTestPaneData(
          decreasingPanes,
          increasingPane.minSize,
          -1,
          false
        );
        if (decreasableSize1 >= increasingPane.minSize) {
          movementSum.sum += Math.abs(delta);
        }
        if (movementSum.sum > DEFAULT_SNAP_THRESHOLD_SIZE) {
          increasableSize = decreasableSize = increasingPane.minSize;
          increasingPane.snapped = false;
          movementSum.sum = 0;
        }
      }
    }

    if (
      decreasableSize == 0 &&
      decreasingPanes.length > 0 &&
      decreasingPanes[0].snapable &&
      !decreasingPanes[0].snapped &&
      decreasingPanes[0].minSize != decreasingPanes[0].maxSize //非固定固定
    ) {
      const fixedPaneCount = decreasingPanes.reduce((total, pane) => {
        if (pane.minSize === pane.maxSize) {
          return total + 1;
        }
        return total;
      }, 0);
      if (fixedPaneCount === decreasingPanes.length - 1) {
        const collapsingPane = decreasingPanes[0];
        if (collapsingPane.snapable) {
          const increasableSize1 = resizeTestPaneData(
            increasingPanes,
            collapsingPane.minSize,
            1,
            false
          );

          if (increasableSize1 >= collapsingPane.minSize) {
            // 停靠
            movementSum.sum += Math.abs(delta);
            if (movementSum.sum > DEFAULT_SNAP_THRESHOLD_SIZE) {
              increasableSize = decreasableSize = collapsingPane.minSize;
              collapsingPane.snapped = true;
              movementSum.sum = 0;
            }
          }
        }
      }
    }
    const commitAdjustSize = Math.min(increasableSize, decreasableSize);
    //提交调整
    resizeTestPaneData(increasingPanes, commitAdjustSize, 1, true);
    resizeTestPaneData(decreasingPanes, commitAdjustSize, -1, true);
  }
};

export const buildSashDragTestData = (
  paneData: SplitViewPaneInfo[],
  index: number
) => {
  const frontPanes = paneData.slice(0, index).reverse();
  const behandPanes = paneData.slice(index, paneData.length);

  const frontPanesDownSize = frontPanes.reduce(
    (total, pane) =>
      pane.size === 0 ? 0 : total + (pane.size! - pane.minSize),
    0
  );
  const behandPanesDownSize = behandPanes.reduce(
    (total, pane) =>
      pane.size === 0 ? 0 : total + (pane.size! - pane.minSize),
    0
  );

  const frontPanesUpSize = frontPanes.reduce(
    (total, pane) => total + (pane.maxSize! - pane.size!),
    0
  );
  const behandPanesUpSize = behandPanes.reduce(
    (total, pane) => total + (pane.maxSize! - pane.size!),
    0
  );

  const maxFrontPanesDownSize = Math.min(frontPanesDownSize, behandPanesUpSize);

  const maxBehandPanesDownSize = Math.min(
    behandPanesDownSize,
    frontPanesUpSize
  );

  const deltaArr = [
    0,
    -1,
    -4,
    -DEFAULT_SNAP_THRESHOLD_SIZE - 1, // snap
    -maxFrontPanesDownSize / 2,
    -maxFrontPanesDownSize,
    -maxFrontPanesDownSize * 2,
    1,
    4,
    DEFAULT_SNAP_THRESHOLD_SIZE + 1, // snap
    maxBehandPanesDownSize / 2,
    maxBehandPanesDownSize,
    maxBehandPanesDownSize * 2,
  ];

  // 回拉
  const length = deltaArr.length;
  for (let i = 0; i < length; i++) {
    const delta = deltaArr[i * 2];
    deltaArr.splice(i * 2 + 1, 0, -delta);
  }
  return {
    frontPanesDownSize,
    behandPanesDownSize,
    frontPanesUpSize,
    behandPanesUpSize,
    deltaArr,
  };
};

export const buildTestContainerSize = () => {
  const testingContainerSizes = [
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
  ];
  return testingContainerSizes;
};

export const user = userEvent.setup();

export const testPaneData = (
  paneData: SplitViewPaneInfo[],
  context: SplitViewTestContext
) => {
  let paneActuralSplitViewSize = 0;
  let currentPanePosition = 0;
  paneData.forEach((pane) => {
    const paneElement = screen.getByTestId(
      `splitview_${context.props.viewName}_pane_${pane.paneKey}`
    );
    const acturalSizeWithUnit =
      context.props.layout! == 'horizontal'
        ? paneElement.style.width
        : paneElement.style.height;
    const panePositionWithUnit =
      context.props.layout! == 'horizontal'
        ? paneElement.style.left
        : paneElement.style.top;

    const acturalSize = parseFloatWithPrecision(acturalSizeWithUnit);
    paneActuralSplitViewSize += acturalSize;
    expect(floatEquals(panePositionWithUnit, currentPanePosition)).toBe(true);
    expect(floatEquals(acturalSize, pane.size!)).toBe(true);

    if (pane.snapped) {
      expect(acturalSize).toBe(0); //snaped
    } else {
      expect(acturalSize).toBeGreaterThanOrEqual(pane.minSize); // minSize
    }

    expect(acturalSize).toBeLessThanOrEqual(
      pane.maxSize || Number.POSITIVE_INFINITY
    ); // maxSize
    currentPanePosition += pane.size!;
  });
  currentPanePosition = 0;
  paneData.forEach((pane, index) => {
    if (index > 0) {
      const sashElement = screen.getByTestId(
        `splitview_${context.props.viewName}_sash_${index}`
      );
      const sashPositionWithUnit =
        context.props.layout! == 'horizontal'
          ? sashElement.style.left
          : sashElement.style.top;
      const acturalSashSizeWithUnit =
        context.props.layout! == 'horizontal'
          ? sashElement.style.width
          : sashElement.style.height;
      expect(
        floatEquals(
          sashPositionWithUnit,
          currentPanePosition -
            (context.props.sashSize || DEFAULT_SASH_SIZE) / 2
        )
      ).toBe(true);
      expect(
        floatEquals(
          acturalSashSizeWithUnit,
          context.props.sashSize || DEFAULT_SASH_SIZE
        )
      ).toBe(true);
    }
    currentPanePosition += pane.size!;
  });
  return paneActuralSplitViewSize;
};
export const testSplitView = async (
  width: number,
  height: number,
  context: SplitViewTestContext
) => {
  const paneData = context.props.paneData.map((t) => ({ ...t }));
  const containerSize = context.props.layout! == 'horizontal' ? width : height;
  const splitViewElement = await screen.findByTestId(
    `splitview_${context.props.viewName}`
  );
  await act(async () => {
    triggerResize(splitViewElement, width, height);
  });
  relayoutTestPaneData(containerSize, paneData); // 重新布局,并计算
  const paneActuralSplitViewSize = testPaneData(paneData, context);
  expect(Math.round(paneActuralSplitViewSize)).toBeGreaterThanOrEqual(
    Math.round(containerSize)
  );
  return splitViewElement;
};

export const testSashDrag = async (context: SplitViewTestContext) => {
  // return;
  const paneData = context.paneData.map((t) => ({ ...t }));
  for (let index = 1; index < paneData.length; index++) {
    // 之前验证过paneData正确性，这里直接使用paneData
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
    const { deltaArr } = buildSashDragTestData(paneData, index);
    for (let i = 0; i < deltaArr.length; i++) {
      const delta = deltaArr[i];
      const base = 20000;
      const coords1: PointerCoords = {};
      if (context.props.layout == 'horizontal') {
        coords1.screenX = base;
        coords1.screenY = 1000;
      } else {
        coords1.screenY = base;
        coords1.screenX = 1000;
      }
      const movementSum = { sum: 0 };
      const coords2: PointerCoords = {};
      if (context.props.layout == 'horizontal') {
        coords2.screenX = base + delta;
        coords2.screenY = 1000;
      } else {
        coords2.screenY = base + delta;
        coords1.screenX = 1000;
      }
      await act(() =>
        user.pointer([
          {
            target: sashElement,
          },
          {
            keys: '[MouseLeft>]',
            coords: coords1,
          },
          {
            coords: coords2,
            target: document.body,
          },
        ])
      );
      expect(sashElement.classList.contains('hover')).toBe(!isFixed);
      // 计算Sash拖动后的位置大小
      calSashDragData(delta, index, paneData, movementSum); //
      testPaneData(paneData, context);
      await user.pointer({
        keys: '[/MouseLeft]',
        target: document.body,
      });
      expect(sashElement.classList.contains('hover')).toBe(false);
    }
  }
};
