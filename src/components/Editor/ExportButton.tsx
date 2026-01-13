// import { HeartFilledIcon } from '../icons';

import { useAppStore } from '@/stores/useAppStore';

const ExportButton = () => {
  const generateCode = useAppStore(state => state.generateCode);

  const handleExport = () => {
    const code = generateCode();
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'App.jsx';
    a.click();
  };

  return (
    <button className="btn" onClick={handleExport}>
      Export →
    </button>
  );
};

export default ExportButton;
