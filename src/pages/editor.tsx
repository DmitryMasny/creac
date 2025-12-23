import {
  LivePreview,
  PropsPanel,
  Structure,
  StructureActions,
} from '@/components/Editor';
import { HistoryHandler } from '@/components/HistoryHandler';
import EditorLayout from '@/layouts/editor';

export default function EditorPage() {
  return (
    <EditorLayout>
      <div className="flex h-full flex-row">
        <section className="w-1/4 max-w-100 min-w-50 p-2">
          <StructureActions />
          <Structure />
          {/* <Nodes /> */}
        </section>

        <section className="max-w-1/2 flex-grow p-2">
          <LivePreview />
        </section>

        <section className="w-1/4 max-w-100 p-2">
          <PropsPanel />
        </section>
      </div>
      <HistoryHandler />
    </EditorLayout>
  );
}
