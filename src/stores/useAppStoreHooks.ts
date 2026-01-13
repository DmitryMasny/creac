import { useCallback, useMemo, useState } from 'react';
import {
  ComponentNode,
  CreateHandlerArgs,
  DeleteHandlerArgs,
  MoveHandlerArgs,
  RenameHandlerArgs,
  TreeActions,
} from '@/types';
import { useAppStore } from './useAppStore';

export const useNodes = () => {
  const nodes = useAppStore(state => state.nodes);
  const selectedNodeId = useAppStore(state => state.selectedNodeId);
  const setSelectedNode = useAppStore(state => state.setSelectedNode);
  const getNode = useAppStore(state => state.getNode);
  const addNode = useAppStore(state => state.addNode);
  const updateNode = useAppStore(state => state.updateNode);

  // const selectedNode = useMemo<ComponentNode | null>(
  //   () => (selectedNodeId && getNode(selectedNodeId))|| null ,
  //   [selectedNodeId, getNode]
  // );

  // const selectedNode = (selectedNodeId && getNode(selectedNodeId)) || null;
  const selectedNode = (selectedNodeId && nodes[selectedNodeId]) || null;

  const updateSelectedNodeProps = useCallback(
    (props: Partial<ComponentNode['props']>, forced?: boolean) => {
      selectedNode &&
        updateNode(selectedNode.id, {
          props: { ...((!forced && selectedNode.props) || {}), ...props },
          // TODO: index
        });
    },
    [selectedNode]
  );
  console.log('nodes', nodes);
  return {
    nodes, //TODO -? использовать timeStamp
    selectedNode,
    selectedNodeId,
    setSelectedNode,
    getNode,
    addNode,
    updateNode,
    updateSelectedNodeProps,
  };
};
export const useComponents = () => {
  const components = useAppStore(state => state.components);
  const getComponentNode = useAppStore(state => state.getComponentNode);
  const addComponent = useAppStore(state => state.addComponent);
  const updateComponent = useAppStore(state => state.updateComponent);
  const removeComponent = useAppStore(state => state.removeComponent);

  const componentsList = useMemo(() => {
    return Object.values(components)?.sort((a, b) =>
      a.updated && a.updated ? Number(a.updated) - Number(b.updated) : 0
    );
  }, [components]);

  return {
    components,
    getComponentNode,
    addComponent,
    updateComponent,
    removeComponent,
    componentsList,
  };
};

export const usePages = () => {
  // const nodes = useAppStore(state => state.nodes);
  const rootIds = useAppStore(state => state.rootIds);
  const getNode = useAppStore(state => state.getNode);
  const updateNode = useAppStore(state => state.updateNode);
  const selectedPageId = useAppStore(state => state.selectedPageId);
  const setSelectedPage = useAppStore(state => state.setSelectedPage);

  const pagesList = useMemo<ComponentNode[]>(
    () => rootIds.map(id => getNode(id)).filter(Boolean) as ComponentNode[],
    [getNode, rootIds]
  );

  const selectedPageNode = (selectedPageId && getNode(selectedPageId)) || null;

  const updatePageNode = useCallback(
    (data: Partial<ComponentNode>) => {
      selectedPageNode && updateNode(selectedPageNode.id, data);
    },
    [selectedPageNode]
  );
  const updatePageNodeProps = useCallback(
    (props: Partial<ComponentNode['props']>) => {
      selectedPageNode &&
        updateNode(selectedPageNode.id, {
          props: { ...(selectedPageNode.props || {}), ...props },
          // TODO: index
        });
    },
    [selectedPageNode]
  );

  return {
    selectedPageId,
    setSelectedPage,
    selectedPageNode,
    pagesList,
    updatePageNode,
    updatePageNodeProps,
  };
};

export const useTreeHandlers = (): TreeActions => {
  const moveNode = useAppStore(state => state.moveNode);

  const onCreate = useCallback(
    ({ parentId, index, type }: CreateHandlerArgs) => {
      return null;
    },
    []
  );

  const onMove = useCallback(
    async ({ dragIds, parentId }: MoveHandlerArgs) => {
      console.log('dragIds', dragIds);
      if (dragIds?.length) {
        for (let id of dragIds) {
          moveNode(id, parentId);
        }
      }
    },
    [moveNode]
  );

  const onRename = useCallback(({ id, title }: RenameHandlerArgs) => {}, []);
  const onDelete = useCallback(({ ids }: DeleteHandlerArgs) => {}, []);

  return {
    onCreate,
    onRename,
    onMove,
    onDelete,
  };
};

export const useTreeNodes = () => {
  const nodes = useAppStore(state => state.nodes);
  const { selectedPageId } = usePages();

  const treeNodes = useMemo<ComponentNode[]>(() => {
    const buildTree = (id: string): ComponentNode | null => {
      const node = nodes[id];
      if (!node) return null;
      return {
        ...node,
        id: node.id,
        title: node.title,
        children: node.childrenIds?.map(buildTree).filter(Boolean),
      } as ComponentNode;
    };
    return selectedPageId
      ? (nodes[selectedPageId]?.childrenIds
          ?.map(buildTree)
          .filter(Boolean) as ComponentNode[])
      : [];
  }, [nodes, selectedPageId]);
  console.log('=-=-=-=-=-==', { treeNodes, selectedPageId });
  return { treeNodes };
};

export const useNodeProps = () => {
  // const getNode = useAppStore(state => state.getNode);
  const nodes = useAppStore(state => state.nodes);
  const selectedNodeId = useAppStore(state => state.selectedNodeId);
  const selectedNode = (selectedNodeId && nodes[selectedNodeId]) || null;

  const selectedNodeTree = useMemo<ComponentNode | null>(() => {
    const buildTree = (id: string): ComponentNode | null => {
      const node = nodes[id];
      if (!node) return null;
      return {
        ...node,
        id: node.id,
        title: node.title,
        children: node.childrenIds?.map(buildTree).filter(Boolean),
      } as ComponentNode;
    };

    return selectedNode ? buildTree(selectedNode.id) : null;
  }, [nodes, selectedNode]);

  return { selectedNodeTree };
};

export const useHistoryActions = () => {
  const { undo, redo, pastStates, futureStates } =
    useAppStore.temporal.getState();
  return { undo, redo, pastStates, futureStates };
};
