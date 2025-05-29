import axios from 'axios';
import {message, Modal} from 'antd';


let isAuthModalShow = false;

const http = axios.create({
    baseURL: '/api',
    timeout: 10_000,
    withCredentials: true,               // 让浏览器带上 Cookie
    xsrfCookieName: 'XSRF-TOKEN',        // axios 默认也是这个名字，可自定义
    xsrfHeaderName: 'X-XSRF-TOKEN',      // axios 会把 Cookie 的值塞进这个 header
});

/** 请求拦截：携带 JWT */
http.interceptors.request.use(cfg => {
    const token = localStorage.getItem('token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

/** 响应拦截：统一处理 */
http.interceptors.response.use(
    res => {
        const {code, msg} = res.data;
        if (code === 1) return res.data;
        message.error(msg || '请求失败');
        return Promise.reject(new Error(msg));
    },
    err => {
        if (err?.status === 401) {
            if (!isAuthModalShow) {
                isAuthModalShow = true;
                const modal = Modal.error({
                    title: '认证失效',
                    content: `登录已过期，请重新登录`,
                    okText: '知道了',
                    onOk: () => {
                        isAuthModalShow = false;
                    },
                    onCancel: () => {
                        isAuthModalShow = false;
                    }
                });
                setTimeout(() => {
                    modal.destroy();
                    isAuthModalShow = false;
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }, 2500);
            }
        } else if (err?.status === 403) {
            message.error('无权限操作');
        } else {
            message.error(err?.data?.msg || err.message || '请求异常');
        }
        return Promise.reject(err);
    }
);

export default http;
