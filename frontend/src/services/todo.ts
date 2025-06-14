import http from '@/utils/http';
import { message } from 'antd';

import { BizResp, Todo, TodoListResp, TodoPayload } from '@/types';

export const fetchTodos = async (
  pageNum = 1,
  pageSize = 10,
  keyword?: string,
  done?: string,
): Promise<TodoListResp> => {
  const res: BizResp<Todo[]> = await http.get('/todos/getPage', {
    params: { pageNum, pageSize, keyword, done },
  });

  const { code, msg, data, count } = res;

  if (code !== 1) throw new Error(msg);

  return {
    list: data,
    total: count ?? 0,
    // pageNum,
    // pageSize,
  };
};

export const addTodo = (payload: TodoPayload) =>
  http.post<Todo, Todo>('/todos/add', payload);

export const toggleTodo = async (uuid: string) => {
  const res: BizResp<Todo[]> = await http.patch(`/todos/${uuid}/toggle`);
  if (res?.code !== 1) {
    throw new Error(res.msg || '切换待办状态失败');
  }
  message.success('切换待办状态成功');
  return res;
};

export const deleteTodo = (uuid: string) =>
  http.delete<void, void>(`/todos/${uuid}/delete`);

export const editTodo = (uuid: string, payload: TodoPayload) =>
  http.patch<Todo, Todo>(`/todos/${uuid}/edit`, payload);
