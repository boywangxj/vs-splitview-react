import React, { useContext } from 'react';
import Context from './SplitViewContext';
import { SplitViewPaneProps } from './types';

const SplitViewPane: React.FC<SplitViewPaneProps> = ({
  paneKey,
  children,
  className,
}) => {
  const { layout, paneMap, testId } = useContext(Context);
  const paneData = paneMap.get(paneKey);
  if (paneData) {
    const style: React.CSSProperties = {};
    if (layout === 'horizontal') {
      style.height = '100%';
      style.width = paneData?.size!;
      style.left = paneData.position;
      style.top = 0;
    } else {
      style.width = '100%';
      style.height = paneData?.size!;
      style.top = paneData.position;
      style.left = 0;
    }

    const cn = ['split-view-pane'];
    if (className) {
      cn.push(className);
    }
    const paneTestId = testId ? `${testId}_pane_${paneKey}` : undefined;
    return (
      <div data-testid={paneTestId} className={cn.join(' ')} style={style}>
        {children}
      </div>
    );
  } else return <></>;
};

export default SplitViewPane;
