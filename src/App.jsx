import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';

const App = () => {
  return (
    <div className="app">
      <Header />
      <main className="content">
        <Home />
      </main>
    </div>
  );
};

export default App;
