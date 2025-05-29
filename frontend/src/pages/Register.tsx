import { Card, Input, Button, Typography } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

// ------- 表单校验模式 -------
const schema = z.object({
    email: z
        .string()
        .nonempty('邮箱不能为空')
        .email('邮箱格式不正确'),
    password: z
        .string()
        .nonempty('密码不能为空')
        .min(6, '至少 6 位'),
});
type FormData = z.infer<typeof schema>;

const Register: React.FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: { email: '', password: '' },
    });

    const { register: signup } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data: FormData) => {
        await signup(data.email, data.password);
        navigate('/');
    };

    return (
        <Card style={{ maxWidth: 360, margin: '60px auto' }} title="用户注册">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* 邮箱 */}
                <label>邮箱</label>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="请输入邮箱"
                            status={errors.email ? 'error' : undefined}
                            autoComplete="email"
                        />
                    )}
                />
                {errors.email && (
                    <Typography.Text type="danger">{errors.email.message}</Typography.Text>
                )}

                {/* 密码 */}
                <label style={{ marginTop: 16 }}>密码</label>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input.Password
                            {...field}
                            placeholder="请输入密码"
                            status={errors.password ? 'error' : undefined}
                            autoComplete="new-password"
                        />
                    )}
                />
                {errors.password && (
                    <Typography.Text type="danger">
                        {errors.password.message}
                    </Typography.Text>
                )}

                <Button
                    block
                    type="primary"
                    htmlType="submit"
                    style={{ marginTop: 24 }}
                    loading={isSubmitting}
                >
                    注册
                </Button>

                <Typography.Paragraph style={{ marginTop: 12 }}>
                    已有帐号？ <Link to="/login">去登录</Link>
                </Typography.Paragraph>
            </form>
        </Card>
    );
};

export default Register;
