import {
  CreateHandler,
  DeleteHandler,
  MoveHandler,
  NodeApi,
  RenameHandler,
} from 'react-arborist';
import { ComponentNode } from './componentNode';

export type TreeNode = NodeApi<ComponentNode>;

export interface TreeActions {
  onCreate?: CreateHandler<ComponentNode>;
  onMove?: MoveHandler<ComponentNode>;
  onRename?: RenameHandler<ComponentNode>;
  onDelete?: DeleteHandler<ComponentNode>;
}

export interface CreateHandlerArgs {
  parentId: string | null;
  parentNode: TreeNode | null;
  index: number;
  type: 'internal' | 'leaf';
}

export interface MoveHandlerArgs {
  dragIds: string[];
  dragNodes: TreeNode[];
  parentId: string | null;
  parentNode: TreeNode | null;
  index: number;
}

export interface RenameHandlerArgs {
  id: string;
  title: string;
  node: TreeNode;
}

export interface DeleteHandlerArgs {
  ids: string[];
  nodes: TreeNode[];
}
