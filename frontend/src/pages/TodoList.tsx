import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Empty,
  List,
  Pagination,
  Space,
  Input,
  Select,
  Table,
  Popconfirm,
  message,
} from 'antd';
import {
  PlusOutlined,
  LogoutOutlined,
  EditOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  fetchTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
} from '@/services/todo';
import NewTodoModal from '@/components/NewTodoModal';
import EditTodoModal from '@/components/EditTodoModal';
import TodoCard from '@/components/TodoCard';
import { useAuth } from '@/hooks/useAuth';
import { Todo, TodoPayload } from '@/types';
import { utcToDate } from '@/utils/date';
import { priorities } from '@/components/NewTodoModal';

const { useBreakpoint } = Grid;

// 格式化字段
const formatTodo = (todo: Todo) => {
  const formatCreatedAt = utcToDate(todo.createdAt, 'ymdhms');
  const formatPriority = todo.priority
    ? priorities.find((p) => p.value === todo.priority)?.label
    : '--';
  const formatDueDate = todo.dueDate ? utcToDate(todo.dueDate, 'ymdhms') : '--';
  const formatDone = todo.done ? '已完成' : '未完成';
  return {
    ...todo,
    formatCreatedAt,
    formatPriority,
    formatDueDate,
    formatDone,
  };
};

const ResponsiveTodoList: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<'all' | 'done' | 'undone'>('all');
  const { logout } = useAuth();

  const load = async (
    page = pageNum,
    size = pageSize,
    kw = keyword,
    s = status,
  ) => {
    setLoading(true);
    try {
      const doneParam =
        s === 'all' ? undefined : s === 'done' ? 'true' : 'false';
      const { list, total } = await fetchTodos(page, size, kw, doneParam);
      setTodos(list);
      setTotal(total);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '加载待办列表失败';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (payload: TodoPayload) => {
    try {
      await addTodo(payload);
      setModalOpen(false);
      await load(1, pageSize);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '新增待办失败';
      message.error(msg);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTodo(id);
      await load(pageNum, pageSize);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '切换状态失败';
      message.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      message.success('删除成功');
      await load(pageNum, pageSize);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '删除失败';
      message.error(msg);
    }
  };

  const handleUpdate = async (payload: TodoPayload) => {
    if (!editingTodo) return;
    try {
      await editTodo(editingTodo.id, payload);
      message.success('已保存');
      setEditingTodo(null);
      await load(pageNum, pageSize);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '更新失败';
      message.error(msg);
    }
  };

  const handlePageChange = (page: number, size: number) => {
    setPageNum(page);
    setPageSize(size);
    load(page, size);
  };

  // PC 端 Table 列定义
  const columns = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '优先级', dataIndex: 'formatPriority', key: 'priority' },
    { title: '创建时间', dataIndex: 'formatCreatedAt', key: 'createdAt' },
    { title: '截止日期', dataIndex: 'formatDueDate', key: 'dueDate' },
    { title: '状态', dataIndex: 'formatDone', key: 'done' },
    {
      title: '操作',
      key: 'actions',
      render: (_: unknown, record: Todo) => (
        <Space>
          {!record.done && (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => setEditingTodo(record)}
            />
          )}
          <Button
            type="text"
            icon={<CheckSquareOutlined />}
            onClick={() => handleToggle(record.id)}
          />
          <Popconfirm
            title="确定要删除该待办吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 格式化数据
  const dataSource = todos.map(formatTodo);

  return (
    <div className="todo-list">
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          新增
        </Button>
        <Input.Search
          allowClear
          placeholder="搜索标题或描述"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={(v) => {
            setPageNum(1);
            load(1, pageSize, v, status);
          }}
          style={{ width: 200 }}
        />
        <Select
          style={{ width: 120 }}
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPageNum(1);
            load(1, pageSize, keyword, v);
          }}
          options={[
            { label: '全部', value: 'all' },
            { label: '未完成', value: 'undone' },
            { label: '已完成', value: 'done' },
          ]}
        />
        <Button icon={<LogoutOutlined />} onClick={logout}>
          退出
        </Button>
      </Space>

      {todos.length === 0 && !loading ? (
        <Empty description="暂无待办" />
      ) : isMobile ? (
        <>
          <List
            dataSource={todos}
            loading={loading}
            renderItem={(item) => (
              <TodoCard
                todo={item}
                onToggle={() => handleToggle(item.id)}
                onDelete={() => handleDelete(item.id)}
                onUpdated={() => load(pageNum, pageSize)}
              />
            )}
          />
          <Pagination
            style={{ marginTop: 24, textAlign: 'right' }}
            current={pageNum}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            onChange={handlePageChange}
            showTotal={(t) => `共 ${t} 条`}
            hideOnSinglePage
          />
        </>
      ) : (
        <>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
          />
          <Pagination
            style={{ marginTop: 16, textAlign: 'right' }}
            current={pageNum}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            onChange={handlePageChange}
            showTotal={(t) => `共 ${t} 条`}
          />
        </>
      )}

      <NewTodoModal
        open={modalOpen}
        onOk={handleAdd}
        onCancel={() => setModalOpen(false)}
      />
      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          open={!!editingTodo}
          onOk={handleUpdate}
          onUpdated={() => load(pageNum, pageSize)}
          onCancel={() => setEditingTodo(null)}
        />
      )}
    </div>
  );
};

export default ResponsiveTodoList;
