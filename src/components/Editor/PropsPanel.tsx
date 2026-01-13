import { useComponents, useNodes } from '@/stores';
import { useCallback, ChangeEvent, useState, useEffect, useRef } from 'react';
import { ComponentFilledIcon, ComponentIcon } from '../icons';

const componentTypesPropNames: string[] = ['className', 'onClick', 'key', ''];

const addPropLabel = 'Add prop';

const PropsPanel = () => {
  const { selectedNode, selectedNodeId, updateNode, updateSelectedNodeProps } =
    useNodes();

  const { addComponent } = useComponents();

  const [nodeName, setNodeName] = useState(selectedNode?.title || '');

  useEffect(() => {
    if (selectedNode?.title) {
      setNodeName(selectedNode.title);
    }
  }, [selectedNode?.title]);

  const handleNameChange = useCallback(() => {
    const title = nodeName || '';

    if (selectedNodeId) {
      if (title) {
        updateNode(selectedNodeId, {
          title,
        });
      } else {
        setNodeName(selectedNode?.title || '');
      }
    }
  }, [selectedNodeId, updateNode, nodeName, selectedNode?.title]);

  const getPropNames = (proProps?: Record<string, any>) => {
    const sp = selectedNode?.props ? { ...proProps } : {};
    const keys = Object.keys(sp);
    keys?.length &&
      keys.forEach(k => {
        if (k) {
          sp[k] = k;
        }
      });
    return sp as Record<string, string>;
  };

  const [selectedNodePropsNames, setSelectedNodePropsNames] = useState<
    Record<string, string>
  >(() => getPropNames(selectedNode?.props));

  useEffect(() => {
    if (selectedNode?.props) {
      setSelectedNodePropsNames(getPropNames(selectedNode?.props));
    }
  }, [selectedNode?.props, setSelectedNodePropsNames]);

  const handlePropNameChange = useCallback(
    (key: string) => {
      const selectedNodePropsObj = { ...(selectedNode?.props || {}) };
      const propName = String(selectedNodePropsNames[key] || '');
      const propValue = key && selectedNodePropsObj[key];

      if (selectedNodeId) {
        delete selectedNodePropsObj[key];
        updateSelectedNodeProps(
          {
            ...selectedNodePropsObj,
            [propName]: propValue,
          },
          true
        );
      }
    },
    [
      selectedNodeId,
      updateSelectedNodeProps,
      selectedNodePropsNames,
      selectedNode?.props,
    ]
  );

  const handleAddNewProp = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const propName = e.target.value || '';
      if (selectedNode) {
        updateSelectedNodeProps({ [propName]: '' }); //TODO: index
      }
      e.target.value = addPropLabel;
      // console.log('getNode', selectedNodeId && getNode(selectedNodeId));
    },
    [selectedNode]
  );

  const handleCreateComponent = useCallback(() => {
    selectedNode && addComponent(selectedNode);
  }, [selectedNode?.componentId]);

  const handlePropChange = useCallback(
    (propName: string, value?: any) => {
      updateSelectedNodeProps({ [propName]: value }); //TODO: index
    },
    [updateSelectedNodeProps]
  );

  // console.log('selectedNode', selectedNode);

  if (!selectedNode) return <div>Select a component</div>;

  return (
    <div className="props-panel flex w-full flex-col">
      <div className="mb-2 flex w-full flex-row gap-4">
        <input
          name="propName"
          type="text"
          placeholder="Node name"
          className="input input-ghost input-sm px-2"
          value={nodeName}
          onChange={e => {
            setNodeName(e.target.value || '');
          }}
          onBlur={handleNameChange}
        />
        <button
          className="btn btn-ghost btn-sm px-2"
          onClick={handleCreateComponent}
          title={selectedNode?.componentId ? 'Create component' : ''}
        >
          {selectedNode?.componentId ? (
            <ComponentFilledIcon size={20} />
          ) : (
            <ComponentIcon size={20} />
          )}
        </button>
      </div>

      <select
        defaultValue={addPropLabel}
        className="select mb-2 w-full px-2"
        onChange={handleAddNewProp}
      >
        <option disabled={true}>{addPropLabel}</option>
        {componentTypesPropNames.map(propName => (
          <option key={propName}>{propName}</option>
        ))}
      </select>

      {selectedNode.props &&
        Object.entries(selectedNode.props)
          .reverse()
          .map(([key, value]) => (
            <div key={key} className="mb-1 flex w-full flex-row gap-2">
              <input
                name="propName"
                type="text"
                placeholder="Prop name"
                className="input input-sm input-ghost w-1/3 px-2"
                value={selectedNodePropsNames[key]}
                onChange={e =>
                  setSelectedNodePropsNames(s => ({
                    ...s,
                    [key]: e.target.value,
                  }))
                }
                onBlur={() => handlePropNameChange(key)}
              />
              <input
                name="propValue"
                type="text"
                placeholder="Value"
                className="input input-sm input-ghost w-2/3 px-2"
                value={typeof value === 'string' ? value : ''}
                onChange={e => handlePropChange(key, e.target.value)}
              />
            </div>
          ))}

      <div className="mb-1 flex w-full flex-row gap-2">
        <div className="w-1/3 p-2 text-xs">as</div>
        <input
          name="as"
          type="text"
          placeholder="Element name"
          className="input input-sm input-ghost w-2/3 px-2"
          value={selectedNode.as}
          onChange={e => {
            selectedNodeId &&
              updateNode(selectedNodeId, {
                as: e.target.value || '',
              });
          }}
        />
      </div>
    </div>
  );
};

export default PropsPanel;
