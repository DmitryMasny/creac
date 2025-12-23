import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview as LP,
} from 'react-live';

import { useAppStore } from '@/stores/useAppStore';
import { getComponentsCode } from '@/utils';

const LivePreview = () => {
  const { nodes } = useAppStore();

  const code = getComponentsCode(Object.values(nodes));

  console.log('code', code);
  // const scope = {styled, headerProps};
  const scope = {};

  return (
    <div className="preview">
      <LiveProvider code={code[0]} scope={scope}>
        <LiveEditor />
        <LiveError />
        <LP />
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

export default LivePreview;
