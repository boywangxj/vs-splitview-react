import React from 'react';
import { Layout, SplitViewPaneInfo } from './types';

const Context = React.createContext<{
  layout: Layout;
  paneMap: Map<string, SplitViewPaneInfo & { position: number }>;
  testId?: string;
}>({
  layout: 'horizontal',
  paneMap: new Map(),
});
export default Context;
