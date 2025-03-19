// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  HeartOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider theme="light" collapsible>
      <Menu mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/">لوحة التحكم</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<TeamOutlined />}>
          <Link to="/donors">الجهات المانحة</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<ProjectOutlined />}>
          <Link to="/projects">المشاريع</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<HeartOutlined />}>
          <Link to="/sponsorships">الكفالات</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<UserSwitchOutlined />}>
          <Link to="/volunteers">المتطوعين</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
