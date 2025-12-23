import { useAppStore } from '@/stores/useAppStore';

const PropsPanel = () => {
  const { selectedNodeId, getNode, updateNode } = useAppStore();

  // console.log('selectedNodeId', { components, selectedNodeId });
  const selectedNode = getNode(selectedNodeId || '');

  if (!selectedNode) return <div>Select a component</div>;

  const handlePropChange = (propName: string, value?: any) => {
    selectedNodeId &&
      updateNode(selectedNodeId, {
        props: { ...selectedNode.props, [propName]: value },
      });
  };

  return (
    <div className="props-panel">
      <h3>Properties: {selectedNode.type}</h3>
      {selectedNode.props &&
        Object.entries(selectedNode.props).map(([key, value]) => (
          <div key={key}>
            <label>{key}:</label>
            <input
              type="text"
              value={typeof value === 'string' ? value : ''}
              onChange={e => handlePropChange(key, e.target.value)}
            />
          </div>
        ))}
      <button className="btn" onClick={e => handlePropChange('key')}>
        +
      </button>
    </div>
  );
};

export default PropsPanel;
