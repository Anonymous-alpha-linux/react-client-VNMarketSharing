import './App.css';
import { HubContainer, Layout } from './pages';
import Router from './Router';
import {ToastContainer} from 'react-toastify';

function App() {
  return (<>
    <Layout>
      <HubContainer>
        <Router></Router>
      </HubContainer>
    </Layout>
    <ToastContainer></ToastContainer>
  </>
  );
}

export default App;