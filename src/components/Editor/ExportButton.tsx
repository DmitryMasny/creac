import { HeartFilledIcon } from '../icons';

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
      <HeartFilledIcon className="text-danger" />
      Export
    </button>
  );
};

export default ExportButton;
