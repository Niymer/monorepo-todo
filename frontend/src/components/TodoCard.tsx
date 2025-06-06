import { Card, Space, Button, Descriptions, message, Popconfirm } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { editTodo } from '@/services/todo';
import React, { useState } from 'react';
import { utcToDate } from '@/utils/date';
import { priorities } from '@/components/NewTodoModal';
import EditTodoModal from '@/components/EditTodoModal';
import { Todo, TodoPayload } from '@/types';

interface Props {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onUpdated: () => void;
}

const formatTodo = (todo: Todo) => {
  const formatCreatedAt = utcToDate(todo.createdAt, 'ymdhms');
  const formatPriority = todo.priority
    ? priorities.find((p) => p.value === todo.priority)?.label
    : '--';
  const formatUpdatedAt = todo.updatedAt
    ? utcToDate(todo.updatedAt, 'ymdhms')
    : '--';
  const formatDueDate = todo.dueDate ? utcToDate(todo.dueDate, 'ymdhms') : '--';
  const formatDone = todo.done ? '已完成' : '未完成';
  return {
    ...todo,
    createdAt: formatCreatedAt,
    description: todo.description || '--',
    priority: formatPriority,
    updatedAt: formatUpdatedAt,
    done: formatDone,
    dueDate: formatDueDate,
  };
};

const TodoCard: React.FC<Props> = ({ todo, onToggle, onDelete, onUpdated }) => {
  const ft = formatTodo(todo);
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = async (payload: TodoPayload) => {
    try {
      await editTodo(todo.id, payload);
      message.success('已保存');
      setEditOpen(false);
      onUpdated();
    } catch {
      message.error('保存失败');
    }
  };

  return (
    <Card
      className="todo-card"
      style={{ marginBottom: 16, borderRadius: 8 }}
      styles={{
        body: { padding: 16 },
      }}
    >
      <Descriptions
        bordered
        title={ft.title}
        size="middle"
        column={{ xs: 1, sm: 2 }}
        extra={
          <Space size="small">
            {!todo.done && (
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setEditOpen(true)}
              />
            )}
            <Button
              type="text"
              icon={<CheckSquareOutlined />}
              onClick={onToggle}
            />
            <Popconfirm
              title="确定要删除该待办吗？"
              onConfirm={onDelete}
              okText="删除"
              cancelText="取消"
            >
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Space>
        }
      >
        <Descriptions.Item label="创建时间">{ft.createdAt}</Descriptions.Item>
        <Descriptions.Item label="描述">{ft.description}</Descriptions.Item>
        <Descriptions.Item label="优先级">{ft.priority}</Descriptions.Item>
        <Descriptions.Item label="状态">{ft.done}</Descriptions.Item>
        <Descriptions.Item label="截止日期">{ft.dueDate}</Descriptions.Item>
      </Descriptions>

      <EditTodoModal
        todo={todo}
        open={editOpen}
        onOk={handleEdit}
        onUpdated={onUpdated}
        onCancel={() => setEditOpen(false)}
      />
    </Card>
  );
};

export default TodoCard;
