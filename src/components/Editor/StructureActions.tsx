import { useRef, useCallback, useEffect } from 'react';

import { useAppStore } from '@/stores/useAppStore';
import { ComponentNode } from '@/types';

const componentTypes: string[] = ['button', 'div'];

const StructureActions = () => {
  const { addNode, selectedNodeId } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddNewNode = useCallback(() => {
    const typeName = inputRef.current?.value;
    if (typeName) {
      addNode({
        id: String(Math.random()),
        type: typeName,
        name: typeName,
        // importPath: lazy(() => import('./MarkdownPreview.js')),
        position: {
          x: Math.random() * 250,
          y: Math.random() * 250,
        },
      });
      inputRef.current!.value = '';
    }
  }, [inputRef.current]);

  useEffect(() => {
    console.log('yyyy');
  }, [inputRef.current?.value]);

  return (
    <div aria-label="Файлы" className="mb-4 w-full flex-col" role="grid">
      {/* <div aria-label="Файлы" className="h-1/2 w-full flex-col" role="grid"> */}
      <div className="flex flex-row gap-2">
        <div className="form-control w-3/4">
          <input
            list="options"
            placeholder="Add..."
            className="input input-bordered w-full"
            ref={inputRef}
            onChange={() => {
              console.log('ppp');
            }}
          />
          <datalist
            id="options"
            onSelect={() => {
              console.log('datalist');
            }}
          >
            {componentTypes.map(typeName => (
              <option
                value={typeName}
                onClick={() => {
                  console.log('option');
                }}
              />
            ))}
          </datalist>
        </div>

        <button className="btn btn-primary w-1/4" onClick={handleAddNewNode}>
          Add
        </button>
      </div>
    </div>
  );
};

export default StructureActions;
