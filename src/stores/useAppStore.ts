import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { temporal } from 'zundo';
import { ComponentNode } from '@/types';

interface ComponentTreeState {
  selectedNodeId: string | null;
  selectedPageId: string | undefined;
  nodes: Record<string, ComponentNode>;
  rootIds: string[];
  components: Record<string, ComponentNode>;

  getNode: (id: string) => ComponentNode | undefined;
  getComponentNode: (id: string) => ComponentNode | undefined;
  getChildren: (id: string) => ComponentNode[];

  addNode: (node: ComponentNode, parentId?: string | null) => void;
  updateNode: (id: string, patch: Partial<ComponentNode>) => void;
  moveNode: (id: string, newParentId: string | null) => void;
  removeNode: (id: string) => void;
  addComponent: (node: ComponentNode) => void;
  updateComponent: (id: string, patch: Partial<ComponentNode>) => void;
  removeComponent: (id: string) => void;
  generateCode: () => string;
  setSelectedNode: (id: string | null) => void;
  setSelectedPage: (id: string) => void;
}

const defaultNodes: Record<string, ComponentNode> = {
  index: {
    childrenIds: [],
    id: 'index',
    title: 'Главная страница',
    type: 'page',
    parentId: null,
  },
};

const defaultComponents: Record<string, ComponentNode> = {
  box: {
    id: 'box',
    as: 'div',
    title: 'Box',
    type: 'component',
    childrenIds: [],
    props: {
      onClick: () => {},
    },
  },
  button: {
    id: 'button',
    as: 'button',
    title: 'Button',
    type: 'component',
    childrenIds: [],
    props: {
      onClick: () => {},
    },
  },
};

export const useAppStore = create<ComponentTreeState>()(
  temporal(
    immer((set, get) => ({
      selectedNodeId: 'index',
      selectedPageId: 'index',
      nodes: defaultNodes,
      components: defaultComponents,
      rootIds: ['index'],

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
          state.nodes[node.id] = {
            ...node,
            parentId,
            childrenIds: [],
            props: undefined,
          };
          console.log('====>', {
            parentId,
            id: node.id,
            nodes: state.nodes,
            pppp: parentId && state.nodes[parentId],
          });
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
          console.log('===>', { id, newParentId });

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

      getComponentNode: id => get().components[id],

      addComponent: node =>
        set(state => {
          state.components['c_' + node.id] = {
            ...node,
            id: 'c_' + node.id,
            parentId: null,
            props: undefined, //TODO
          };
        }),

      updateComponent: (id, patch) =>
        set(state => {
          if (state.components[id]) {
            Object.assign(state.components[id], patch);
          }
        }),

      removeComponent: id =>
        set(state => {
          delete state.components[id];
          return state;
        }),

      setSelectedNode: id => set({ selectedNodeId: id }),
      setSelectedPage: id => set({ selectedPageId: id }),
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
