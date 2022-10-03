import { MutableRefObject, PropsWithChildren } from 'react';

export type Layout = 'horizontal' | 'vertical';

export type SplitViewPaneInfo = {
  paneKey: string;
  /**
   * 初始尺寸。 约束：minSize>=initialSize<=maxSize，否则自动计算。
   */
  size?: number;
  /**
   * 最小尺寸。如果都到达minSize，那么父容器将出现滚动条
   */
  minSize: number;
  /**
   * 最大尺寸。约束：必须有一个Pane不设置maxSize，否则排列在最后的一个Pane的maxSize无效。
   */
  maxSize?: number;
  /**
   * 是否可以折叠。
   * 约束：
   *  1. minSize>0时有效。
   *  2. 仅当排序在第一个和最后一个Pane可以设置，否则无效
   */
  snapable?: boolean;
  /**
   * 是否已经折叠
   */
  snapped?: boolean;
  /**
   * 折叠后的大小,默认0
   */
  snappedSize?: number;
  /**
   * 夫容器尺寸发生变化时调整Pane尺寸的优先级
   */
  priority?: number;
};

export type SplitViewProps = PropsWithChildren<{
  /**
   * @description layout
   * @description.zh-CN 布局方向
   */
  layout?: Layout;
  paneData: SplitViewPaneInfo[];
  onChange?: (paneInfo: SplitViewPaneInfo[]) => void;
  hoverDelay?: number;
  sashSize?: number;
  viewName?: string;
  actionRef?: MutableRefObject<{ updatePaneData?: () => void }>;
}>;

export type SplitViewPaneProps = PropsWithChildren<{
  paneKey: string;
  className?: string | undefined;
}>;

export type SplitViewSashProps = {
  index: number;
  /**
   * 当前位置
   */
  position: number;
  /**
   * 布局方向
   */
  layout: Layout;
  sashState?: SplitViewSashState;
  onSashDraging?: (delta: number, index: number) => void;
  onSashDragStoped?: () => void;
  size?: number;
  delay?: number;
};

export const enum SplitViewSashState {
  Disabled,
  Minimum,
  Maximum,
  Enabled,
}
