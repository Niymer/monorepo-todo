import {Card, Input, Button, Typography} from 'antd';
import {useNavigate, Link} from 'react-router-dom';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useAuth} from '@/hooks/useAuth';
import React from "react";

const schema = z.object({
    email: z
        .string()
        .nonempty('邮箱不能为空')
        .email('邮箱格式不正确'),
    password: z
        .string()
        .nonempty('密码不能为空')
        .min(6, '至少 6 位')
});

type FormData = z.infer<typeof schema>;

const Login: React.FC = () => {
    const {control, handleSubmit, formState: {errors, isSubmitting}} =
        useForm<FormData>({
            resolver: zodResolver(schema),
            mode: 'onChange',
            reValidateMode: 'onChange',
            defaultValues: {email: '', password: ''}
        });

    const {login} = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data: FormData) => {
        await login(data.email, data.password);
        navigate('/');
    };

    return (
        <div className={'auth-page'}>
            <Card style={{maxWidth: 360, margin: '60px auto'}} title="用户登录">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* 邮箱 */}
                    <label>邮箱</label>
                    <Controller
                        name="email"
                        control={control}
                        render={({field}) => (
                            <Input
                                {...field}
                                placeholder="请输入邮箱"
                                status={errors.email ? 'error' : undefined}
                                autoComplete="email"
                            />
                        )}
                    />
                    {errors.email && (
                        <Typography.Text type="danger">
                            {errors.email.message}
                        </Typography.Text>
                    )}

                    {/* 密码 */}
                    <label style={{marginTop: 16}}>密码</label>
                    <Controller
                        name="password"
                        control={control}
                        render={({field}) => (
                            <Input.Password
                                {...field}
                                placeholder="请输入密码"
                                status={errors.password ? 'error' : undefined}
                                autoComplete="current-password"
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
                        style={{marginTop: 24}}
                        loading={isSubmitting}
                    >
                        登录
                    </Button>

                    <Typography.Paragraph style={{marginTop: 12}}>
                        还没有帐号？ <Link to="/register">去注册</Link>
                    </Typography.Paragraph>
                </form>
            </Card>
        </div>
    );
};

export default Login;
