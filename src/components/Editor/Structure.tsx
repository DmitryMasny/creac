import { useTreeHandlers, useTreeNodes } from '@/stores';
import { ComponentNode, TreeNode } from '@/types';
import { NodeApi, NodeRendererProps, Tree } from 'react-arborist';
import { useNodes } from '@/stores';
import { useCallback } from 'react';

const StructureNode = ({
  node,
  style,
  dragHandle,
  onSelect,
  selectedNodeId,
}: NodeRendererProps<ComponentNode> & {
  onSelect: (node: TreeNode) => void;
  selectedNodeId?: string | null;
}) => {
  return (
    <div
      style={{
        ...style,
      }}
      className={selectedNodeId === node.id ? 'bg-primary/20' : undefined}
      ref={dragHandle}
      onClick={() => onSelect(node)}
    >
      {node.children?.length ? (node.isOpen ? '📂' : '📁') : '📄'}
      <span>{node.data.title}</span>
    </div>
  );
};

const Structure = () => {
  const { setSelectedNode, selectedNodeId } = useNodes();
  const treeHandlers = useTreeHandlers();
  const { treeNodes } = useTreeNodes();

  const handleNodeSelect = useCallback(
    (node: NodeApi<ComponentNode>) => {
      if (node.id === selectedNodeId) {
        node.toggle();
      }
      setSelectedNode(node.id);
    },
    [setSelectedNode, selectedNodeId]
  );

  return (
    <div aria-label="Файлы" className="gr w-full flex-col" role="grid">
      <Tree
        {...treeHandlers}
        data={treeNodes}
        width={'100%'}
        height={500}
        // indent={20}
        // rowHeight={30}
      >
        {props =>
          StructureNode({
            ...props,
            node: props.node,
            onSelect: handleNodeSelect,
            selectedNodeId,
          })
        }
      </Tree>
    </div>
  );
};

export default Structure;
