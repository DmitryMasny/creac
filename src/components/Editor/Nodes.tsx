import ReactFlow, { Controls, Background, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, MouseEvent } from 'react';

import { useAppStore } from '@/stores/useAppStore';

const Nodes = () => {
  const { nodes: components, setSelectedNode } = useAppStore();

  console.log('component', components);
  const nodes = Object.values(components).map(component => ({
    id: component.id,
    type: 'default',
    position: component.position || {
      x: Math.random() * 250,
      y: Math.random() * 250,
    },
    data: {
      label: component.type,
    },
  }));

  const onNodeClick = useCallback((_e: MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  return (
    <div className="h-1/2 w-full flex-col">
      <ReactFlow fitView nodes={nodes} onNodeClick={onNodeClick}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Nodes;
