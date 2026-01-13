import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview as LP,
  LiveContext,
} from 'react-live';

import { generateComponentCode } from '@/utils';
import { useNodes } from '@/stores';

const LiveView = () => {
  const { selectedNode } = useNodes();

  const code =
    (selectedNode && generateComponentCode(selectedNode)) || undefined;

  console.log('code', code);
  // const scope = {styled, headerProps};
  const scope = {};

  return (
    <div className="preview h-full">
      <LiveProvider code={code} scope={scope}>
        {/* <LiveEditor className="h-full w-full flex-1" /> */}
        <LP />
        <LiveError className="text-base-content/70 h-full w-full overflow-auto p-4 text-xs text-wrap @[pre]:h-full" />
      </LiveProvider>
    </div>
  );
};

// const LivePreview = () => {
//   const { components } = useAppStore();

//   const renderComponent = (node: ComponentNode) => {
//     // Динамический рендеринг компонентов
//     const componentMap: Record<string, React.ComponentType<any>> = {
//       Button: ({ children, ...props }) => (
//         <button {...props}>{children}</button>
//       ),
//       Div: ({ children, ...props }) => <div {...props}>{children}</div>,
//       // Добавьте другие компоненты
//     };

//     const Component = componentMap[node.type];

//     if (!Component) return null;

//     return (
//       <Component {...node.props}>
//         {node.children?.map(renderComponent)}
//       </Component>
//     );
//   };

//   return <div className="preview">{components.map(renderComponent)}</div>;
// };

export default LiveView;
