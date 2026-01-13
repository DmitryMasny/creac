// Базовые пропсы, которые есть у всех компонентов
export interface BaseComponentProps {
  key?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Тип для значения пропса (может быть разных типов)
export type PropValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | Function
  | PropValue[]
  | { [key: string]: PropValue };

// Позиция ноды в редакторе
export interface NodePosition {
  x: number;
  y: number;
}

// Размер ноды
export interface NodeSize {
  width: number;
  height: number;
}

// Мета-информация о компоненте
export interface ComponentMeta {
  category: string; // "basic", "layout", "form", etc.
  icon: string; // название иконки или URL
  description?: string;
  isContainer: boolean; // может ли содержать дочерние элементы
  allowedChildren?: string[]; // какие компоненты можно вкладывать
}

export interface ComponentNode {
  id: string;
  type: string;
  title: string;

  props?: Record<string, PropValue>;

  /** связи */
  parentId?: string | null;
  childrenIds?: string[];
  children?: string[];
  componentId?: string | null;

  /** UI */
  position?: NodePosition;
  size?: NodeSize;
  isSelected?: boolean;
  isExpanded?: boolean;

  updated?: Date;

  /** код / импорт */
  // importPath?: LazyExoticComponent<any> | string;

  /** мета */
  meta?: ComponentMeta;
  requiredProps?: string[];
  // propTypes?: Record<string, string>;

  /** стили */
  css?: string;
  className?: string;
  as?: string;

  /** события */
  // eventHandlers?: Record<string, string>;
}
