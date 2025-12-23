import React from 'react';
import { clsx } from 'clsx';

import { useAppStore, useTreeData } from '@/stores/useAppStore';
import { ComponentNode } from '@/types';
import { NodeApi, NodeRendererProps, Tree } from 'react-arborist';

interface StructureItemProps {
  component: ComponentNode;
  selectedNodeId?: string | null;
  onSelect?: (component: ComponentNode) => void;
  onMove?: (id: string, newParentId: string | null) => void;
}

const data2 = [
  { id: '1', name: 'Unread' },
  { id: '2', name: 'Threads' },
  {
    id: '3',
    name: 'Chat Rooms',
    children: [
      { id: 'c1', name: 'General' },
      { id: 'c2', name: 'Random' },
      { id: 'c3', name: 'Open Source Projects' },
    ],
  },
  {
    id: '4',
    name: 'Direct Messages',
    children: [
      { id: 'd1', name: 'Alice' },
      { id: 'd2', name: 'Bob' },
      { id: 'd3', name: 'Charlie' },
    ],
  },
];

// const StructureItem = React.forwardRef<HTMLDetailsElement, StructureItemProps>(
//   ({ selectedNodeId, onSelect, component, onMove }, ref) => {
//     const isSelected = selectedNodeId === component.id;

//     if (component.childrenIds?.length) {
//       return (
//         <details
//           key={component.id}
//           ref={ref}
//           className={clsx(
//             'bg-base-100 border-primary collapse',
//             isSelected && 'border'
//           )}
//           name={component.name}
//           onClick={() => onSelect?.(component)}
//         >
//           <summary className="collapse-title font-semibold">
//             {component.name}
//           </summary>
//           <div className="collapse-content text-sm">{}</div>
//         </details>
//       );
//     }

//     return (
//       <div
//         className={clsx('text-sm', isSelected && 'text-primary')}
//         onClick={() => onSelect?.(component)}
//       >
//         {component.name}
//       </div>
//     );
//   }
// );

const StructureNode = ({
  node,
  style,
  dragHandle,
  onSelect,
}: NodeRendererProps<ComponentNode> & {
  onSelect: (component: ComponentNode) => void;
}) => {
  console.log('node!!!', node);
  return (
    <div style={style} ref={dragHandle} onClick={() => onSelect(node.data)}>
      {node.isInternal ? (node.isOpen ? '📂' : '📁') : '📄'}
      <span>{node.data.name}</span>
    </div>
  );
};

const Structure = () => {
  const { nodes, setSelectedNode, getNode, moveNode, rootIds, selectedNodeId } =
    useAppStore();

  const treeData = useTreeData();

  const handleNodeClick = React.useCallback((node: ComponentNode) => {
    setSelectedNode(node.id);
  }, []);

  console.log('treeData', treeData);
  // console.log('rootIds', { rootIds, getNode: rootIds && getNode(rootIds[0]) });

  return (
    <div aria-label="Файлы" className="gr w-full flex-col" role="grid">
      <Tree
        key={treeData?.length}
        initialData={treeData}
        openByDefault={false}
        width={300}
        height={500}
        indent={20}
        rowHeight={30}
      >
        {props => StructureNode({ ...props, onSelect: handleNodeClick })}
        {/* {StructureNode} */}
      </Tree>
      {/* {Object.values(nodes).map(component => (
        <StructureItem
          key={component.id}
          component={component}
          selectedNodeId={selectedNodeId}
          onSelect={handleNodeClick}
          onMove={moveNode}
        />
      ))} */}
    </div>
  );
};

export default Structure;
