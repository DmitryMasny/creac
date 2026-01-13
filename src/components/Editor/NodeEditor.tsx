import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview as LP,
  LiveContext,
} from 'react-live';
import { useNodeProps, useNodes } from '@/stores';

import { generateComponentCode } from '@/utils';

import React, { useRef } from 'react';

import { useTreeHandlers, useTreeNodes } from '@/stores';
import { ComponentNode, TreeNode } from '@/types';
import { NodeApi, NodeRendererProps, Tree } from 'react-arborist';

// <div className="preview h-full">
//     <LiveProvider code={code} scope={scope}>
//       <LiveEditor className="h-full w-full flex-1" />
//       <LiveError className="text-base-content/70 h-full w-full overflow-auto p-4 text-xs text-wrap  " />
//       <LP />
//     </LiveProvider>
//   </div>

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
  const props = node?.data?.props;
  return (
    <div
      style={{
        ...style,
      }}
      className={selectedNodeId === node.id ? 'bg-primary/20' : undefined}
      ref={dragHandle}
      onClick={() => onSelect(node)}
    >
      <span className={undefined}>
        {'<'}
        {String(node.data.as || node.data?.props?.as || 'div')}{' '}
      </span>
      {props &&
        Object.keys(props)?.map(pKey => (
          <span className={'text-primary-content/60 text-xs'}>
            {pKey}="{String(props[pKey])}"{' '}
          </span>
        ))}
      {' />'}
    </div>
  );
};

const NodeEditor = () => {
  const { setSelectedNode, selectedNodeId } = useNodes();
  const treeHandlers = useTreeHandlers();
  const projectNameModalRef = useRef<HTMLDialogElement>(null);

  const { selectedNodeTree } = useNodeProps();

  const code =
    (selectedNodeTree && generateComponentCode(selectedNodeTree)) || undefined;

  console.log('code', code);
  const scope = {};
  // const scope = {styled, headerProps};

  const handleNodeSelect = React.useCallback(
    (node: NodeApi<ComponentNode>) => {
      console.log('node', node);
      node.toggle();
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  return (
    <div aria-label="Файлы" className="gr w-full flex-col" role="grid">
      <Tree
        {...treeHandlers}
        data={selectedNodeTree ? [selectedNodeTree] : undefined}
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

export default NodeEditor;
