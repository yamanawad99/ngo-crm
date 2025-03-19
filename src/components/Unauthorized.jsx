import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="unauthorized-container" style={{ padding: '50px 20px' }}>
      <Result
        status="403"
        title="Unauthorized Access"
        subTitle="Sorry, you don't have permission to access this page."
        icon={<LockOutlined style={{ color: '#ff4d4f' }} />}
        extra={
          <Button type="primary" onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
        }
      />
    </div>
  );
};

export default Unauthorized;

