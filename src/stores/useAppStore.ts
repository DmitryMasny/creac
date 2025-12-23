import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { temporal } from 'zundo';
import { useMemo } from 'react';
import { ComponentNode } from '@/types';

interface ComponentTreeState {
  selectedNodeId: string | null;
  nodes: Record<string, ComponentNode>;
  rootIds: string[];

  getNode: (id: string) => ComponentNode | undefined;
  getChildren: (id: string) => ComponentNode[];

  addNode: (node: ComponentNode, parentId?: string | null) => void;
  updateNode: (id: string, patch: Partial<ComponentNode>) => void;
  removeNode: (id: string) => void;
  moveNode: (id: string, newParentId: string | null) => void;
  generateCode: () => string;
  setSelectedNode: (id: string | null) => void;
}

export const useAppStore = create<ComponentTreeState>()(
  temporal(
    immer((set, get) => ({
      selectedNodeId: null,
      nodes: {},
      rootIds: [],

      getNode: id => get().nodes[id],

      getChildren: id => {
        const node = get().nodes[id];
        if (!node?.childrenIds) return [];
        return node.childrenIds
          .map(childId => get().nodes[childId])
          .filter(Boolean);
      },

      addNode: (node, parentId = null) =>
        set(state => {
          //@ts-ignore infinite
          state.nodes[node.id] = { ...node, parentId, childrenIds: [] };
          if (parentId && state.nodes[parentId]) {
            state.nodes[parentId].childrenIds?.push(node.id);
          } else if (!parentId) {
            state.rootIds.push(node.id);
          }
        }),

      updateNode: (id, patch) =>
        set(state => {
          if (state.nodes[id]) {
            Object.assign(state.nodes[id], patch);
          }
        }),

      removeNode: id =>
        set(state => {
          const removeRecursively = (nodeId: string) => {
            state.nodes[nodeId]?.childrenIds?.forEach(removeRecursively);
            delete state.nodes[nodeId];
          };
          const parentId = state.nodes[id]?.parentId;
          removeRecursively(id);
          if (parentId) {
            state.nodes[parentId].childrenIds = state.nodes?.[
              parentId
            ]?.childrenIds?.filter(cid => cid !== id);
          } else {
            state.rootIds = state.rootIds.filter(rid => rid !== id);
          }
        }),

      moveNode: (id, newParentId) =>
        set(state => {
          const node = state.nodes[id];
          if (!node) return;
          if (node.parentId) {
            state.nodes[node.parentId].childrenIds = state.nodes[
              node.parentId
            ].childrenIds?.filter(cid => cid !== id);
          } else {
            state.rootIds = state.rootIds.filter(rid => rid !== id);
          }
          if (newParentId) {
            state.nodes[newParentId].childrenIds?.push(id);
          } else {
            state.rootIds.push(id);
          }
          node.parentId = newParentId;
        }),

      setSelectedNode: id => set({ selectedNodeId: id }),
      generateCode: () => '',
    })),
    {
      partialize: state => {
        const { nodes, rootIds } = state;
        return { nodes, rootIds };
      },
    }
  )
);

export const useTreeData = () => {
  const nodes = useAppStore(state => state.nodes);
  const rootIds = useAppStore(state => state.rootIds);

  return useMemo<ComponentNode[]>(() => {
    const buildTree = (id: string): ComponentNode | null => {
      const node = nodes[id];
      if (!node) return null;
      return {
        ...node,
        id: node.id,
        name: node.name,
        children: node.childrenIds?.map(buildTree).filter(Boolean),
        data: node,
      } as ComponentNode;
    };
    return rootIds.map(buildTree).filter(Boolean) as ComponentNode[];
  }, [nodes, rootIds]);
};

export const useHistoryActions = () => {
  const { undo, redo, pastStates, futureStates } =
    useAppStore.temporal.getState();
  return { undo, redo, pastStates, futureStates };
};
