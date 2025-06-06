import React, { useEffect } from 'react';
import { DatePicker, Form, Input, message, Modal, Select } from 'antd';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { priorities } from '@/components/NewTodoModal';
import { Todo, TodoPayload } from '@/types';

export interface editTodoPayload {
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string | null;
}

// 表单内部使用的类型
interface FormValues {
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: Dayjs | null;
}

interface Props {
  todo: Todo;
  open: boolean;
  onOk: (todo: TodoPayload) => Promise<void>;
  onCancel: () => void;
  onUpdated: () => void;
}

const EditTodoModal: React.FC<Props> = ({
  todo,
  open,
  onOk,
  onCancel,
  onUpdated,
}) => {
  // 1) 用内部用的类型 Dayjs|null
  const [form] = Form.useForm<FormValues>();

  // 2) 打开时把后端的 string 转成 Dayjs
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        dueDate: todo.dueDate ? dayjs(todo.dueDate) : null,
      });
    }
  }, [open, todo]);

  const handleOk = async () => {
    try {
      // 3) 拿到 Dayjs|null
      const values = await form.validateFields();

      // 4) 再转回后端要的 string|null
      const payload: editTodoPayload = {
        title: values.title,
        description: values.description,
        priority: values.priority,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      };

      await onOk(payload as TodoPayload);
      onUpdated();
    } catch {
      message.error('编辑失败');
    }
  };

  return (
    <Modal
      open={open}
      title="编辑待办"
      onOk={handleOk}
      onCancel={onCancel}
      okText="保存"
      cancelText="取消"
      destroyOnHidden
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        initialValues={{
          priority: 'LOW',
          dueDate: null,
        }}
      >
        <Form.Item label="标题" name="title">
          <Input placeholder="请输入待办标题" disabled />
        </Form.Item>

        <Form.Item label="描述" name="description">
          <Input.TextArea
            placeholder="可填写更详细的描述"
            autoSize={{ minRows: 3, maxRows: 6 }}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item label="优先级" name="priority">
          <Select options={priorities} />
        </Form.Item>

        <Form.Item label="截止日期" name="dueDate">
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={(d) => d && d < dayjs().startOf('day')}
            showTime
            placeholder="不选则视为无截止时间"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTodoModal;
