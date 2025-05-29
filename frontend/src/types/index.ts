export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Todo {
    id: string;
    title: string;
    description?: string;
    done: boolean;
    priority?: Priority;
    createdAt: string;
    updatedAt?: string;
    dueDate?: string | null;
    userId: string;
}

export interface TodoPayload {
    title: string;
    description?: string;
    priority?: Priority;
    dueDate?: string | null;
}

export interface AuthResponse {
    token: string;
}

export interface AuthCtx {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export interface BizResp<T = any> {
    code: number;
    msg: string;
    data: T;
    count?: number;
}

export interface TodoListResp {
    list: Todo[];
    total: number;
}

export interface AuthFormData {
    email: string;
    password: string;
}

export type TodoFormData = TodoPayload;
