import http from '@/utils/http';
import {message} from "antd";

import {BizResp, Todo, TodoListResp, TodoPayload} from '@/types';


export const fetchTodos = async (
    pageNum = 1,
    pageSize = 10
): Promise<TodoListResp> => {

    const res: BizResp<Todo[]> = await http.get('/todos/getPage', {
        params: {pageNum, pageSize},
    });

    const {code, msg, data, count} = res;

    if (code !== 1) throw new Error(msg);

    return {
        list: data,
        total: count?? 0,
        // pageNum,
        // pageSize,
    };
}

export const addTodo = (payload: TodoPayload) =>
    http.post<Todo, Todo>('/todos/add', payload);

export const toggleTodo = async (id: string) => {
    const res: BizResp<Todo[]> = await http.patch(`/todos/${id}/toggle`);
    if (res?.code !== 1) {
        throw new Error(res.msg || '切换待办状态失败');
    }
    message.success('切换待办状态成功');
    return res
}


export const deleteTodo = (id: string) =>
    http.delete<void, void>(`/todos/${id}/delete`);

export const editTodo = (id: string, payload: TodoPayload) =>
    http.patch<Todo, Todo>(`/todos/${id}/edit`, payload);
