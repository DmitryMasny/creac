import {
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  useCallback,
  HTMLAttributes,
} from 'react';

import { ComponentNode } from '@/types';
import { useComponents, useNodes } from '@/stores';

const NodesLibraryItem = ({
  title,
  isSelected,
  ...rest
}: HTMLAttributes<HTMLElement> & { isSelected?: boolean; title: string }) => {
  return (
    <li>
      <a
        className={`block rounded px-2 py-1 ${
          isSelected ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
        }`}
        {...rest}
      >
        {title}
      </a>
    </li>
  );
};

const NodesLibrary = () => {
  const addNodeQueryRef = useRef<HTMLInputElement>(null);

  const [addNodeQuery, setAddNodeQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { addNode, selectedNodeId, selectedNode, setSelectedNode } = useNodes();
  const { componentsList, getComponentNode } = useComponents();

  const filteredList = componentsList.filter(c =>
    c.title.toLowerCase().includes(addNodeQuery.toLowerCase())
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredList[selectedIndex]) {
          handleSelectType(filteredList[selectedIndex].id);
        } else if (addNodeQuery.trim()) {
          console.log('Adding:', addNodeQuery);
          setAddNodeQuery('');
        }
        break;

      case 'Escape':
        setAddNodeQuery('');
        break;

      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredList.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : filteredList.length - 1
        );
        break;
    }
  };

  const handleAddNewNode = useCallback(
    (componentId: string, props?: Partial<ComponentNode>) => {
      if (componentId) {
        const id = String(Math.random());
        const componentData = getComponentNode(componentId);
        addNode(
          {
            ...componentData,
            id,
            type: 'component',
            title: componentData?.title || '',
            ...props,
            componentId,
          },
          selectedNode?.id
        );

        setSelectedNode(id);
        return id;
      }
    },
    [selectedNode]
  );

  const handleSelectType = (id: string) => {
    handleAddNewNode(id);

    setAddNodeQuery('');
    setSelectedIndex(-1);
  };

  // Очистка выделения при изменении запроса
  useEffect(() => {
    setSelectedIndex(-1);
  }, [addNodeQuery]);

  return (
    <div aria-label="Файлы" className="gr h-1/4 w-full flex-col" role="grid">
      <ul className="menu dropdown-content bg-base-100 rounded-box z-50 max-h-80 w-52 overflow-y-auto p-2 shadow-sm">
        <li className="bg-base-100 sticky top-0 z-10 pb-2">
          <input
            ref={addNodeQueryRef}
            name="addNodeQuery"
            type="text"
            placeholder="Node name"
            className="input input-ghost input-sm w-full"
            value={addNodeQuery}
            onChange={e => setAddNodeQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
        </li>

        {filteredList.length === 0 ? (
          <li className="p-2 text-center text-sm text-gray-500">
            No matches found
          </li>
        ) : (
          filteredList.map((item, index) => (
            <NodesLibraryItem
              title={item.title}
              isSelected={index === selectedIndex}
              onClick={() => handleSelectType(item.id)}
              onMouseEnter={() => setSelectedIndex(index)}
              key={item.id}
            />
          ))
        )}
      </ul>
      {}
    </div>
  );
};

export default NodesLibrary;
