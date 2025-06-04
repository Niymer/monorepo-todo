import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore
import path from 'path';

export default defineConfig(({mode}) => {
    // 1. 加载 .env、.env.development、.env.production 等
    const env = loadEnv(mode, process.cwd());
    return {
        define: {
            'process.env': {
                ...env,
            },
        },

        plugins: [react()],

        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },

        server: {
            proxy: {
                '/api': {
                    // 优先用 .env 里配的 VITE_API_BASE_URL
                    target: env.VITE_API_BASE_URL || 'http://192.168.31.73:3000',
                    changeOrigin: true,
                    // 如果后端接口里不需要 /api 前缀，可以再去掉它：
                    rewrite: (p) => p.replace(/^\/api/, ''),
                },
            },
        },
    };
});
