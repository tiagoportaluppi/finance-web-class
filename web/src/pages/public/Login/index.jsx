import React from 'react';
import { Row, Col, Form, Input, Typography, Button, Card } from 'antd';

import { useAuth } from 'hooks/auth';

import Wrapper from '../wrapper';

import './styles.less';

const { Title, Text } = Typography;

const Login = () => {
  const { signIn, loadingSignIn, errorSignIn } = useAuth();

  const handleSubmit = ({ email, password }) => {
    signIn({ email, password });
  };

  return (
    <Wrapper>
      <div id="login-component">
        <Card>
          <Row>
            <Col span={24}>
              <Title className="title">Entre em sua conta</Title>
            </Col>
            <Col span={24}>
              <Text className="subtitle">
                Olá seja bem vindo(a), utilize os seus dados de acesso para continuar:
              </Text>
            </Col>
          </Row>

          <Form onFinish={handleSubmit} layout="vertical" validateTrigger="finish">
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Por favor, informe um email válido',
                },
              ]}
            >
              <Input
                allowClear
                size="large"
                placeholder="Digite seu e-mail"
                prefix={<i className="icon-ic_mail" />}
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true }]}>
              <Input.Password
                size="large"
                placeholder="Digite sua senha"
                prefix={<i className="icon-lock" />}
              />
            </Form.Item>

            {errorSignIn && errorSignIn.message && (
              <div className="gx-text-danger">{errorSignIn.message}</div>
            )}

            <Form.Item>
              <Button
                block
                size="large"
                type="primary"
                htmlType="submit"
                loading={loadingSignIn}
                className="mrg-top-15"
              >
                Acessar
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Wrapper>
  );
};

export default Login;
