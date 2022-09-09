import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DEFAULT_SASH_SIZE, DEFAULT_SNAP_THRESHOLD_SIZE } from './SplitView';
import Context from './SplitViewContext';
import { SplitViewSashProps, SplitViewSashState } from './types';
/**
 *
 */
const SplitViewSash: React.FC<SplitViewSashProps> = ({
  index,
  position = 0,
  onSashDraging,
  onSashDragStoped,
  sashState = SplitViewSashState.Maximum,
  size = DEFAULT_SASH_SIZE,
  delay = DEFAULT_SNAP_THRESHOLD_SIZE,
}) => {
  const onSashDragingRef = useRef(onSashDraging);
  onSashDragingRef.current = onSashDraging;
  const onSashDragStopedRef = useRef(onSashDragStoped);
  onSashDragStopedRef.current = onSashDragStoped;
  const mousePositionRef = useRef<number>(0);
  const mouseDownRef = useRef<boolean>(false);
  const [state, setState] = useState({ mouseEnter: false, hover: false });
  const { layout, testId } = useContext(Context);

  // 由于Sash移动有一定的延迟(或者超出移动范围后),当鼠标拖拽时,有可能鼠标移出Sash元素.此处解决这个问题
  useEffect(() => {
    const documentMouseMoveListener = (e: MouseEvent) => {
      if (mouseDownRef.current) {
        e.preventDefault(); // 避免拖动时影响到Pane中的类容
        const mousePosition = layout === 'horizontal' ? e.screenX : e.screenY;
        const delta = mousePosition - mousePositionRef.current;
        mousePositionRef.current = mousePosition;
        onSashDragingRef.current?.(delta, index);
      }
    };
    const documentMouseUpListener = (e: MouseEvent) => {
      if (mouseDownRef.current) {
        e.preventDefault();
        mouseDownRef.current = false;
        setState((prev) => ({ ...prev, hover: false, mouseEnter: false }));
        onSashDragStopedRef.current?.();
      }
    };

    window.addEventListener('mousemove', documentMouseMoveListener);
    window.addEventListener('mouseup', documentMouseUpListener);

    return () => {
      window.removeEventListener('mousemove', documentMouseMoveListener);
      window.removeEventListener('mouseup', documentMouseUpListener);
    };
  }, [index, layout]);

  const style: React.CSSProperties = {};
  const classNames: string[] = ['split-view-sash'];
  const center = position - size / 2;
  if (layout == 'horizontal') {
    style.width = size;
    style.left = `${center}px`;
    classNames.push('horizontal');
    if (sashState === SplitViewSashState.Minimum) {
      classNames.push('minimum');
    } else if (sashState === SplitViewSashState.Maximum) {
      classNames.push('maximum');
    } else if (sashState == SplitViewSashState.Enabled) {
      classNames.push('enabled');
    }
  } else {
    style.height = size;
    style.top = `${center}px`;
    classNames.push('vertical');
    if (sashState === SplitViewSashState.Minimum) {
      classNames.push('minimum');
    } else if (sashState === SplitViewSashState.Maximum) {
      classNames.push('maximum');
    } else if (sashState == SplitViewSashState.Enabled) {
      classNames.push('enabled');
    }
  }
  if (state.hover || mouseDownRef.current) {
    classNames.push('hover');
  }
  if (sashState === SplitViewSashState.Disabled) {
    classNames.push('disabled');
  }

  // Delay hover
  useEffect(() => {
    let timerId: any = undefined;
    if (state.mouseEnter) {
      timerId = setTimeout(() => {
        setState((pre) => ({ ...pre, hover: true }));
      }, delay);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [state.mouseEnter, delay]);

  const onMouseDownCallback = useCallback(
    (e: React.MouseEvent) => {
      if (sashState != SplitViewSashState.Disabled) {
        mousePositionRef.current =
          layout === 'horizontal' ? e.screenX : e.screenY;
        mouseDownRef.current = true;
        setState((pre) => ({ ...pre, mouseEnter: true, hover: true }));
      }
    },
    [layout, sashState]
  );

  const onMouseEnter = useCallback(() => {
    if (!mouseDownRef.current && sashState != SplitViewSashState.Disabled) {
      setState((pre) => ({ ...pre, mouseEnter: true }));
    }
  }, [sashState]);

  const onMouseLeave = useCallback(() => {
    if (!mouseDownRef.current) {
      setState((pre) => ({ ...pre, mouseEnter: false, hover: false }));
    }
  }, []);

  const sashTestId = testId ? `${testId}_sash_${index}` : undefined;

  return (
    <div
      data-testid={sashTestId}
      className={classNames.join(' ')}
      style={style}
      onMouseDown={onMouseDownCallback}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    ></div>
  );
};

export default SplitViewSash;
