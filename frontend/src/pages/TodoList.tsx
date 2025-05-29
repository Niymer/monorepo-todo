import React, {useEffect, useState} from 'react';
import {Button, Empty, List, Pagination, Space} from 'antd';
import {PlusOutlined, LogoutOutlined} from '@ant-design/icons';
import {
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
} from '@/services/todo';
import NewTodoModal from '@/components/NewTodoModal';
import TodoCard from '@/components/TodoCard';
import {useAuth} from '@/hooks/useAuth';
import {Todo, TodoPayload} from "@/types";

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    /** 分页状态 */
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState<number | undefined>(undefined);

    const {logout} = useAuth();

    /** 拉取数据 */
    const load = async (page = pageNum, size = pageSize) => {
        setLoading(true);
        const {list, total} = await fetchTodos(page, size);
        console.log('拉取待办列表', {list, total});
        setTodos(list);
        setTotal(total);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    /** 新增 */
    const handleAdd = async (payload: TodoPayload) => {
        await addTodo(payload);
        setModalOpen(false);
        await load(1, pageSize);                            // 新增后回第一页
    };

    /** 翻页 / 改 pageSize */
    const handlePageChange = (page: number, size: number) => {
        setPageNum(page);
        setPageSize(size);
        load(page, size);
    };

    return (
        <div className={'todo-list'}>
            <Space style={{marginBottom: 16}}>
                <Button
                    type="primary"
                    icon={<PlusOutlined/>}
                    onClick={() => setModalOpen(true)}
                >
                    新增
                </Button>
                <Button icon={<LogoutOutlined/>} onClick={logout}>
                    退出
                </Button>
            </Space>

            {todos.length === 0 && !loading ? (
                <Empty description="暂无待办"/>
            ) : (
                <>
                    <List
                        dataSource={todos}
                        loading={loading}
                        renderItem={item => (
                            <TodoCard
                                todo={item}
                                onToggle={() => toggleTodo(item.id).then(() => load(pageNum, pageSize))}
                                onDelete={() => deleteTodo(item.id).then(() => load(pageNum, pageSize))}
                                onUpdated={() => load(pageNum, pageSize)}
                            />
                        )}
                    />

                    {/* 分页器 */}
                    <Pagination
                        style={{marginTop: 24, textAlign: 'right'}}
                        current={pageNum}
                        pageSize={pageSize}
                        total={total}
                        showSizeChanger
                        onChange={handlePageChange}
                        showTotal={t => `共 ${t} 条`}
                        align={'end'}
                        hideOnSinglePage={true}
                    />
                </>
            )}

            <NewTodoModal
                open={modalOpen}
                onOk={handleAdd}
                onCancel={() => setModalOpen(false)}
            />
        </div>
    );
};

export default TodoList;
