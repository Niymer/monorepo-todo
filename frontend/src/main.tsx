import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import App from './App';
import { AuthProvider } from '@/context/AuthProvider';
import './styles/index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ConfigProvider
            theme={{ token: { borderRadius: 8 } }}
        >
            <AuthProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AuthProvider>
        </ConfigProvider>
    </React.StrictMode>
);
