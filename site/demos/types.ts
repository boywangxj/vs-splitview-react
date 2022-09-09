export type SplitViewPaneInfo = {
  /**
   * 可以这样写属性描述
   * @description       也可以显式加上描述名
   * @description.zh-CN 还支持不同的 locale 后缀来实现多语言描述，使用 description 兜底
   */
  paneKey: string;
  /**
   * 可以这样写属性描述
   * @description       minSize
   * @description.zh-CN 还支持不同的 minSize 后缀来实现多语言描述，使用 description 兜底
   */
  minSize: number;
  /**
   * 可以这样写属性描述
   * @description       minSize
   * @description.zh-CN 还支持不同的 minSize 后缀来实现多语言描述，使用 description 兜底
   * @default Infinite
   */
  maxSize?: number;
};

export type SplitViewProps = {
  /**
   * 可以这样写属性描述
   * @description       也可以显式加上描述名
   * @description.zh-CN 还支持不同的 locale 后缀来实现多语言描述，使用 description 兜底
   */
  paneData: SplitViewPaneInfo[];
  /**
   * 可以这样写属性描述
   * @description       也可以显式加上描述名
   * @description.zh-CN 还支持不同的 locale 后缀来实现多语言描述，使用 description 兜底
   * @default 5
   */
  sashSize?: number;
  /**
   * 可以这样写属性描述
   * @description       也可以显式加上描述名
   * @description.zh-CN 还支持不同的 locale 后缀来实现多语言描述，使用 description 兜底
   * @default 300
   */
  hoverDelay?: number;
};
