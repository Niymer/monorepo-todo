import React, {useEffect} from 'react';
import dayjs from 'dayjs';
import {Modal, Form, Input, Select, DatePicker, message} from 'antd';

export interface NewTodoPayload {
    title: string;
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
}

interface Props {
    open: boolean;
    onOk: (todo: NewTodoPayload) => Promise<void>;
    onCancel: () => void;
}

export const priorities = [
    {label: '高', value: 'HIGH'},
    {label: '中', value: 'MEDIUM'},
    {label: '低', value: 'LOW'}
];

const NewTodoModal: React.FC<Props> = ({open, onOk, onCancel}) => {
    const [form] = Form.useForm<NewTodoPayload>();

    /** 点击“保存” */
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            // 日期组件返回 Dayjs，需要转 ISO 字符串或 null
            const payload: NewTodoPayload = {
                ...values,
                dueDate: values.dueDate ? values.dueDate.toString() : undefined
            };
            await onOk(payload);
            message.success('新增成功');
            form.resetFields();
        } catch {
            message.error('新增失败');
        }
    };

    /** 打开弹窗时先重置，避免残留上一次输入 */
    useEffect(() => {
        if (open) form.resetFields();
    }, [open, form]);

    return (
        <Modal
            open={open}
            title="新增待办"
            onOk={handleOk}
            onCancel={onCancel}
            okText="保存"
            cancelText="取消"
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    priority: 'LOW',
                    dueDate: null
                }}
            >
                <Form.Item
                    label="标题"
                    name="title"
                    rules={[{required: true, message: '请填写标题'}]}
                >
                    <Input placeholder="请输入待办标题" autoFocus/>
                </Form.Item>

                <Form.Item label="描述" name="description">
                    <Input.TextArea
                        placeholder="可填写更详细的描述"
                        autoSize={{minRows: 3, maxRows: 6}}
                        showCount
                        maxLength={200}
                    />
                </Form.Item>

                <Form.Item label="优先级" name="priority">
                    <Select options={priorities}/>
                </Form.Item>

                <Form.Item label="截止日期" name="dueDate">
                    <DatePicker
                        style={{width: '100%'}}
                        disabledDate={d => d && d < dayjs().startOf('day')}
                        showTime
                        placeholder="不选则视为无截止时间"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewTodoModal;
