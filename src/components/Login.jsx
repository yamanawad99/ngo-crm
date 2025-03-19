import React, { useState, useContext } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to login. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card 
          bordered={false}
          style={{ 
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px' 
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Title level={2}>Donor Management</Title>
            <Title level={4} style={{ marginTop: 0 }}>Login to your account</Title>
          </div>
          
          {error && (
            <Alert
              message="Login Error"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: '24px' }}
            />
          )}
          
          <Form
            form={form}
            name="login"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="Email" 
                size="large"
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>
            
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;

