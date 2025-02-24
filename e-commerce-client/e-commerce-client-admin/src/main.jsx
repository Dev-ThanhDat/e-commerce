import { persistor, store } from '@/redux/store';
import { ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import './index.scss';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#232f3e',
              colorText: '#131921',
              controlOutline: 'none',
              colorLinkHover: '#febd69'
            }
          }}
        >
          <App />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
