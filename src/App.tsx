import './App.css';
import { Layout } from './pages';
import Router from './Router';
import {ToastContainer} from 'react-toastify';

function App() {
  return (<>
    <Layout>
      <Router></Router>
    </Layout>
    <ToastContainer></ToastContainer>
  </>
  );
}

export default App;