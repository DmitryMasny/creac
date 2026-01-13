import {
  LivePreview,
  LiveView,
  PropsPanel,
  Structure,
  StructureActions,
} from '@/components/Editor';
import NodesLibrary from '@/components/Editor/NodesLibrary';
import { HistoryHandler } from '@/components/HistoryHandler';
import EditorLayout from '@/layouts/editor';

export default function EditorPage() {
  return (
    <EditorLayout>
      <div className="flex h-full flex-row px-2">
        <section className="w-1/4 max-w-100 min-w-60 p-2">
          <StructureActions />
          <Structure />
          <NodesLibrary />
          {/* <Nodes /> */}
        </section>

        <section className="max-w-1/2 flex-grow p-2">
          <LivePreview />
          <LiveView />
        </section>

        <section className="w-1/4 max-w-200 min-w-70 p-2">
          <PropsPanel />
        </section>
      </div>
      <HistoryHandler />
    </EditorLayout>
  );
}
