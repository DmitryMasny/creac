import { ComponentNode } from '@/types';

export const generateComponentCode = (node: ComponentNode): string => {
  // console.log('node', node);
  const propsString =
    (node.props &&
      Object.entries(node.props)
        .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
        .join(' ')) ||
    '';

  // FIXME !!!!!
  // if (node.children && node.children.length > 0) {
  //   const childrenCode = node.children?.map(generateComponentCode).join('\n');

  //   return `<${node.type} ${propsString}>\n${childrenCode}\n</${node.type}>`;
  // }

  return `<${node.as || node.type} ${propsString} />`;
};

export const getComponentsCode = (components: ComponentNode[]) => {
  return components.map(generateComponentCode);
};

export const generateAppCode = (components: ComponentNode[]): string => {
  const componentsCode = getComponentsCode(components).join('\n');
  //   const componentsVars = components
  //     .map((node: ComponentNode) => {
  //       return (
  //         (node.props &&
  //           Object.entries(node.props)
  //             .map(([key, value]) => `const ${key} = "${value}"`)
  //             .join(" ")) ||
  //         ""
  //       );
  //     })
  //     .join("\n");

  return `
import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {

  return (
    <div>
      ${componentsCode}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  `.trim();
};
