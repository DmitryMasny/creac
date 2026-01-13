import { useCallback, useRef, useState, KeyboardEvent, useEffect } from 'react';

import { useNodes, usePages } from '@/stores';
import { ComponentNode, ProjectData } from '@/types';
import { axios } from '@/utils';

const pagesLabel = 'Page';

const StructureActions = () => {
  const addNewPageRef = useRef<HTMLInputElement>(null);
  const newPageNameModalRef = useRef<HTMLDialogElement>(null);

  const [newPageName, setNewPageName] = useState('');
  useEffect(() => {
    axios.get('/projects').then(response => {
      const data = response.data;
      const r = data?.map(
        (c: any) =>
          ({
            ...c,
            nodes: (c.nodes && JSON.parse(c.nodes)) || {},
            components: (c.components && JSON.parse(c.components)) || {},
          }) as ProjectData
      );
      console.log('ret', r);
    });
    // axios.post('/posts', { id: '3', title2: 'another title', views: 300 });
  }, []);
  const { addNode, selectedNode, setSelectedNode } = useNodes();
  const { selectedPageId, setSelectedPage, pagesList } = usePages();

  const handleAddNewNode = useCallback(
    (typeName: ComponentNode['type'], props?: Partial<ComponentNode>) => {
      if (typeName) {
        const id = String(Math.random());
        addNode(
          {
            id,
            type: typeName,
            title: typeName,
            ...props,
          },
          undefined
        );

        setSelectedNode(id);
        return id;
      }
    },
    [selectedNode, selectedPageId]
  );

  const handleAddNewPageOk = useCallback(() => {
    const id = handleAddNewNode('page', {
      title: addNewPageRef.current?.value,
    });
    id && setSelectedPage(id);
    console.log('id', id);
    setNewPageName('');
  }, [selectedNode, selectedPageId]);

  const handlePageNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        handleAddNewPageOk();
        newPageNameModalRef.current?.close();

      // case 'Escape':
      //   setAddNodeQuery('');
      //   setAddNodeOpen(false);
      //   break;
    }
  };

  const handleAddNewPage = () => {
    newPageNameModalRef.current?.showModal();
    if (addNewPageRef.current) {
      setTimeout(() => {
        addNewPageRef.current?.focus();
        addNewPageRef.current?.select();
      }, 100);
    }
  };

  return (
    <div className="mb-4 flex w-full flex-row gap-2">
      <div className="flex-1">
        <select
          value={selectedPageId}
          className="select w-full"
          onChange={e => {
            setSelectedPage(e.target.value);
          }}
        >
          <option disabled={true} value={''}>
            {pagesLabel}
          </option>
          {pagesList.map(pageNode => (
            <option
              key={pageNode.id}
              value={pageNode.id}
              className={`${
                pageNode.id === selectedPageId
                  ? 'bg-primary text-primary-content'
                  : 'hover:bg-base-200'
              }`}
            >
              {pageNode.title}
            </option>
          ))}
        </select>
      </div>

      <button className="btn" onClick={handleAddNewPageOk}>
        +
      </button>

      <dialog className="modal modal-xs" ref={newPageNameModalRef}>
        <div className="modal-box w-10/12 max-w-sm">
          <input
            ref={addNewPageRef}
            name="addNewPage"
            type="text"
            placeholder="Page name"
            className="input w-full"
            value={newPageName}
            onChange={e => setNewPageName(e.target.value)}
            onKeyDown={handlePageNameKeyDown}
            autoComplete="on"
            autoFocus
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={handleAddNewPageOk}>
                Add
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default StructureActions;
