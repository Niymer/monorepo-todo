import http from '@/utils/http';
import {message} from "antd";
import {AuthResponse, BizResp} from "@/types";

/** 登录 */
export async function loginApi(
    email: string,
    password: string
): Promise<{ token: string }> {
    const resp: BizResp<AuthResponse> = await http.post('/auth/login', {
        email, password
    });
    if (resp?.code !== 1) {
        throw new Error(resp.msg || '登录失败');
    }
    message.success('登录成功');
    return resp.data;
}

/** 注册 */
export async function registerApi(
    email: string,
    password: string
): Promise<{ token: string }> {
    const resp: BizResp<{ token: string }> = await http.post('/auth/register', {
        email, password
    });
    return resp.data;
}


