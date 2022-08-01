import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ErrorBoundary } from './components';
import {store} from './redux'
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.Fragment>
    <ErrorBoundary>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
  </React.Fragment>
);

reportWebVitals();
