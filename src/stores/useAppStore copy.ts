// stores/useAppStore.ts
import { create } from 'zustand';

import { generateAppCode } from '@/utils';
import { ComponentNode } from '@/types';

interface AppState {
  components: ComponentNode[];
  selectedNodeId: string | null;
  // addComponent: (component: ComponentNode) => void;
  updateComponent: (id: string, updates: Partial<ComponentNode>) => void;
  setSelectedNode: (id: string | null) => void;
  generateCode: () => string;
  addComponent: (
    component: ComponentNode,
    position?: InsertPosition,
    referenceNodeId?: string
  ) => void;
  // updateComponent: (id: string, updates: Partial<ComponentNode>) => void;
  // deleteComponent: (id: string) => void;
  // setSelectedNode: (id: string | null) => void;
  // generateCode: () => string;
  // findComponent: (id: string) => ComponentNode | null;
}

export type InsertPosition = 'inside' | 'before' | 'after';

// export const addComponent = (
//   components: ComponentNode[],
//   component: ComponentNode
// ): ComponentNode[] => {
//   if (!components?.length) {
//     return [component];
//   }

//   return components;
// };

// export const useAppStore = create<AppState>((set, get) => ({
//   components: [],
//   selectedNodeId: null,

//   addComponent: component =>
//     set(state => ({ components: addComponent(state.components, component) })),

//   updateComponent: (id, updates) =>
//     set(state => ({
//       components: state.components.map(comp =>
//         comp.id === id ? { ...comp, ...updates } : comp
//       ),
//     })),

//   setSelectedNode: id => set({ selectedNodeId: id }),

//   generateCode: () => {
//     const { components } = get();

//     // Генерация полного кода приложения
//     return generateAppCode(components);
//   },
// }));

// -------------------------

//  import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ComponentTreeState {
  selectedNodeId: string | null;
  nodes: Record<string, ComponentNode>;

  /** корневые компоненты */
  rootIds: string[];

  /** ===== SELECTORS ===== */

  getNode: (id: string) => ComponentNode | undefined;
  getChildren: (id: string) => ComponentNode[];

  /** ===== ACTIONS ===== */
  addNode: (node: ComponentNode, parentId?: string | null) => void;
  updateNode: (id: string, patch: Partial<ComponentNode>) => void;
  removeNode: (id: string) => void;
  moveNode: (id: string, newParentId: string | null) => void;
  generateCode: () => string;
  setSelectedNode: (id: string | null) => void;
}

export const useAppStore = create<ComponentTreeState>()(
  immer((set, get) => ({
    selectedNodeId: null,
    nodes: {},
    rootIds: [],

    /* ================= SELECTORS ================= */

    getNode: id => get().nodes[id],

    getChildren: id => {
      const node = get().nodes[id];
      if (!node?.childrenIds) return [];
      return node.childrenIds
        .map(childId => get().nodes[childId])
        .filter(Boolean);
    },

    /* ================= ACTIONS ================= */

    addNode: (node, parentId = null) =>
      set(state => {
        const newNode: ComponentNode = {
          ...node,
          parentId,
          childrenIds: [],
        };

        //@ts-ignore
        state.nodes[node.id] = newNode;

        if (parentId) {
          state.nodes[parentId]?.childrenIds?.push(node.id);
        } else {
          state.rootIds.push(node.id);
        }
      }),

    updateNode: (id, patch) =>
      set(state => {
        if (!state.nodes[id]) return;
        state.nodes[id] = {
          ...state.nodes[id],
          ...patch,
        };
      }),

    removeNode: id =>
      set(state => {
        const node = state.nodes[id];
        if (!node) return;

        /** рекурсивное удаление потомков */
        const removeRecursively = (nodeId: string) => {
          const n = state.nodes[nodeId];
          n?.childrenIds?.forEach(removeRecursively);
          delete state.nodes[nodeId];
        };

        removeRecursively(id);

        /** убрать из родителя */
        if (node.parentId) {
          const parent = state.nodes[node.parentId];
          if (parent?.childrenIds) {
            parent.childrenIds = parent.childrenIds.filter(
              childId => childId !== id
            );
          }
        } else {
          state.rootIds = state.rootIds.filter(rootId => rootId !== id);
        }
      }),

    moveNode: (id, newParentId) =>
      set(state => {
        const node = state.nodes[id];
        if (!node) return;

        /** удалить из старого родителя */
        if (node.parentId) {
          const oldParent = state.nodes[node.parentId];
          oldParent.childrenIds = oldParent.childrenIds?.filter(
            childId => childId !== id
          );
        } else {
          state.rootIds = state.rootIds.filter(rootId => rootId !== id);
        }

        /** добавить в нового родителя */
        if (newParentId) {
          state.nodes[newParentId]?.childrenIds?.push(id);
        } else {
          state.rootIds.push(id);
        }

        node.parentId = newParentId;
      }),
    generateCode: () => {
      const { getNode } = get();

      // Генерация полного кода приложения
      const n = getNode(' ');
      return n ? generateAppCode([n]) : '';
    },
    setSelectedNode: id => set({ selectedNodeId: id }),
  }))
);
