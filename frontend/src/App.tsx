import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Models from './pages/Models';
import Documentation from './pages/Documentation';
import QuantLab from './pages/QuantLab';

function App() {
  const [activePage, setActivePage] = useState<'home' | 'models' | 'docs' | 'lab'>('home');
  const [labPrefills, setLabPrefills] = useState<any>({});

  const handleSetLabPrefills = (prefills: any) => {
    setLabPrefills(prefills);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} setLabPrefills={handleSetLabPrefills} />;
      case 'models':
        return <Models />;
      case 'docs':
        return <Documentation />;
      case 'lab':
        return <QuantLab prefills={labPrefills} clearPrefills={() => setLabPrefills({})} />;
      default:
        return <Home setActivePage={setActivePage} setLabPrefills={handleSetLabPrefills} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-navy flex flex-col font-sans">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-grow pb-16">
        {renderActivePage()}
      </main>
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default App;
