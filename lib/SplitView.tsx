import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SplitViewPaneInfo, SplitViewProps, SplitViewSashState } from './types';
// import ResizeObserver from 'resize-observer-polyfil
import Context from './SplitViewContext';
import SplitViewSash from './SplitViewSash';
import ResizeObserver from 'rc-resize-observer';

export const DEFAULT_SASH_SIZE = 5;
export const DEFAULT_HOVER_DELAY = 300;
export const DEFAULT_SNAP_THRESHOLD_SIZE = 50;

const isPaneEquals = (pane1: SplitViewPaneInfo, pane2: SplitViewPaneInfo) => {
  return (
    pane1.maxSize === pane2.maxSize &&
    pane1.minSize === pane2.minSize &&
    pane1.paneKey === pane2.paneKey &&
    pane1.priority === pane2.priority &&
    // pane1.size === pane2.size &&
    pane1.snapable === pane2.snapable &&
    pane1.snapped === pane2.snapped &&
    pane1.snappedSize === pane2.snappedSize
  );
};

const relayout = (containerSize: number, paneData: SplitViewPaneInfo[]) => {
  // 所有设置了maxSize的Panes
  const allHaveMaxSizePanes = paneData.filter(
    (t) => t.maxSize && t.maxSize > 0 && t.maxSize !== Number.POSITIVE_INFINITY
  ).length;
  paneData.forEach((pane, index) => {
    let size = pane.size;
    const minSize = pane.minSize || 0;
    let maxSize: number = pane.maxSize || Number.POSITIVE_INFINITY;
    pane.snapable = pane.snapable || false; // 默认不可折叠

    if (minSize === 0) {
      // 仅当minSize>0有效
      pane.snapable = false;
    }

    if (index === paneData.length - 1) {
      // 最后一条
      if (allHaveMaxSizePanes == paneData.length) {
        maxSize = Number.POSITIVE_INFINITY;
      }
    }
    if (pane.snapable) {
      pane.snappedSize = pane.snappedSize || 0; // 默认0
    }
    if (pane.snapable && pane.snapped === true) {
      size = pane.snappedSize!;
    } else {
      size = pane.minSize;
    }

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
        (increaseOrDecrease > 0 && t.size!! < t.maxSize!! && !t.snapped) ||
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

const resize = (
  panes: SplitViewPaneInfo[],
  adjustSize: number,
  direction: number,
  commiting: boolean
) => {
  let adjustSizeTotal = adjustSize;
  let adjustableSize = 0;
  if (panes[0].snapped && panes[0].size === panes[0].snappedSize) {
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
    if (commiting && pane.snapped && pane.size! != pane.snappedSize) {
      pane.snapped = false;
    }
  }
  return adjustableSize;
};
const SplitView: React.FC<SplitViewProps> = ({
  viewName,
  paneData,
  onChange,
  layout = 'horizontal',
  children,
  hoverDelay = DEFAULT_HOVER_DELAY,
  sashSize = DEFAULT_SASH_SIZE,
  actionRef,
}) => {
  const [paneDataState, setPaneDataState] = useState(
    paneData.map((t) => ({ ...t }))
  );
  const [containerSize, setContainerSize] = useState(0);
  const containerSizeRef = useRef(0);
  const initedRef = useRef(false);
  const updatedRef = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  containerSizeRef.current = containerSize;
  console.log('containerSize', containerSize);
  useEffect(() => {
    if (!initedRef.current) {
      initedRef.current = true;
      setPaneDataState((prevPaneData) => {
        relayout(containerSize, prevPaneData);
        return prevPaneData.map((t) => ({ ...t }));
      });
    }
  }, [containerSize]);
  const updatePaneData = useCallback(() => {
    // 仅当paneInfo属性变化时
    setPaneDataState((prevPaneData) => {
      console.log('ooo0000o2342342342', containerSizeRef.current);
      if (
        containerSizeRef.current > 0
        //  &&
        // (prevPaneData.length != paneData.length ||
        //   paneData.some((pane1, index) => {
        //     const pane2 = prevPaneData[index];
        //     return pane2 && pane1 && !isPaneEquals(pane1, pane2);
        //   }))
      ) {
        console.log('ooo0000o');
        const paneDataCloned = paneData.map((t) => ({ ...t }));
        relayout(containerSizeRef.current, paneDataCloned);
        return [...paneDataCloned];
      }
      return prevPaneData;
    });
  }, [paneData]);
  useEffect(() => {
    if (!updatedRef.current && containerSize > 0) {
      console.log('updated');
      updatedRef.current = true;
      updatePaneData();
    }
  }, [updatePaneData, containerSize]);

  useEffect(() => {
    if (actionRef) {
      actionRef.current = updatePaneData;
    }
  }, [actionRef, updatePaneData]);
  // useEffect(() => {}, [paneData]);

  const sumRef = useRef(0);
  const onSashDragStopedCallback = useCallback(() => {
    sumRef.current = 0;
  }, []);
  const onSashDragingCallback = useCallback(
    (delta: number, index: number) => {
      if (delta !== 0) {
        const adjustSize = Math.abs(delta);
        const frontPanes = paneDataState.slice(0, index).reverse();
        const behandPanes = paneDataState.slice(index, paneDataState.length);

        const increasingPanes = delta > 0 ? frontPanes : behandPanes;
        const decreasingPanes = delta < 0 ? frontPanes : behandPanes;

        // 仅计算尺寸
        let increasableSize = resize(increasingPanes, adjustSize, 1, false);
        let decreasableSize = resize(decreasingPanes, adjustSize, -1, false);
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
            const a =
              increasingPanes[0].minSize - increasingPanes[0].snappedSize!;

            const decreasableSize1 = resize(decreasingPanes, a, -1, false);

            if (decreasableSize1 >= a) {
              sumRef.current += Math.abs(delta);
            }
            if (sumRef.current > DEFAULT_SNAP_THRESHOLD_SIZE) {
              sumRef.current = 0;
              increasableSize = decreasableSize = a;
              increasingPanes[0].snapped = false;
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
              const as = collapsingPane.minSize - collapsingPane.snappedSize!;
              const increasableSize1 = resize(
                increasingPanes,
                collapsingPane.minSize - collapsingPane.snappedSize!,
                1,
                false
              );

              if (increasableSize1 >= as) {
                // 停靠
                sumRef.current += Math.abs(delta);
                if (sumRef.current > DEFAULT_SNAP_THRESHOLD_SIZE) {
                  sumRef.current = 0;
                  increasableSize = decreasableSize =
                    collapsingPane.minSize - collapsingPane.snappedSize!;
                  collapsingPane.snapped = true;
                }
              }
            }
          }
        }
        const commitAdjustSize = Math.min(increasableSize, decreasableSize);
        //提交调整
        resize(increasingPanes, commitAdjustSize, 1, true);
        resize(decreasingPanes, commitAdjustSize, -1, true);

        setPaneDataState([...paneDataState]);
      }
    },
    [paneDataState]
  );

  const paneAndSash = useMemo(() => {
    let currentPosition = 0;
    const paneKeys: string[] = [];
    const sashes: React.ReactNode[] = [];
    const paneMap = new Map<string, SplitViewPaneInfo & { position: number }>();
    paneDataState.forEach((t, i) => {
      const position = currentPosition;
      currentPosition += t.size!;
      const paneDataWithPosition: SplitViewPaneInfo & { position: number } = {
        ...t,
        position: position,
      };
      paneKeys.push(t.paneKey);
      paneMap.set(t.paneKey, paneDataWithPosition);
      if (i > 0) {
        const frontPaneData = paneDataState[i - 1];
        const behandPaneData = paneDataState[i];
        let state = SplitViewSashState.Enabled;
        if (
          frontPaneData.minSize == frontPaneData.maxSize ||
          behandPaneData.minSize == behandPaneData.maxSize
        ) {
          state = SplitViewSashState.Disabled;
        } else if (frontPaneData.minSize == frontPaneData.size) {
          state = SplitViewSashState.Minimum;
        } else if (frontPaneData.maxSize == frontPaneData.size) {
          state = SplitViewSashState.Maximum;
        }
        // index从1开始
        sashes.push(
          <SplitViewSash
            index={i}
            key={`__svs_${t.paneKey}`}
            onSashDraging={onSashDragingCallback}
            onSashDragStoped={onSashDragStopedCallback}
            position={position}
            layout={layout}
            delay={hoverDelay}
            sashState={state}
            size={sashSize}
          />
        );
      }
    });

    return {
      paneKeys,
      sashes,
      paneMap,
    };
  }, [
    hoverDelay,
    layout,
    onSashDragingCallback,
    onSashDragStopedCallback,
    paneDataState,
    sashSize,
  ]);

  const childMap = useMemo(() => {
    const map = new Map();
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props.paneKey) {
        map.set(child.props.paneKey, child);
      }
    });
    return map;
  }, [children]);

  useEffect(() => {
    if (
      paneDataState.length != paneData.length ||
      paneData.some((pane1, index) => {
        const pane2 = paneDataState[index];
        return pane2 && pane1 && !isPaneEquals(pane1, pane2);
      })
    ) {
      console.log('o');
      onChangeRef.current?.(paneDataState);
    }
  }, [paneDataState, paneData]);

  // 测试需要
  const testId =
    viewName && process && process.env && process.env.NODE_ENV == 'test'
      ? `splitview_${viewName}`
      : undefined;
  const sashContainerTestId = testId ? `${testId}_sash_container` : undefined;
  const paneContainerTestId = testId ? `${testId}_pane_container` : undefined;

  return (
    <Context.Provider value={{ layout, paneMap: paneAndSash.paneMap, testId }}>
      <ResizeObserver
        onResize={({ width, height }) => {
          const containerSize = layout === 'horizontal' ? width : height;
          setContainerSize(containerSize);
        }}
      >
        <div data-testid={testId} className="split-view">
          {initedRef.current && (
            <>
              <div
                data-testid={sashContainerTestId}
                className="split-view-sash-container"
              >
                {paneAndSash.sashes}
              </div>
              <div
                data-testid={paneContainerTestId}
                className="split-view-pane-contaienr"
              >
                {
                  paneAndSash.paneKeys.map((key) => childMap.get(key)) // 按照paneInfo的顺序输出
                }
              </div>
            </>
          )}
        </div>
      </ResizeObserver>
    </Context.Provider>
  );
};

export default SplitView;
