import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Button, Modal, Form, Input, Select, DatePicker, Spin } from 'antd';
import { projectAPI, handleApiError } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title } = Typography;
const { Option } = Select;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // جلب بيانات المشاريع من API
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectAPI.getAllProjects();
      setProjects(data);
    } catch (err) {
      const errorMsg = handleApiError(err);
      toast.error('فشل في جلب البيانات: ' + errorMsg.message);
    }
    setLoading(false);
  };

  // إضافة مشروع جديد
  const handleAddProject = async (values) => {
    try {
      await projectAPI.createProject(values);
      toast.success('تمت إضافة المشروع بنجاح');
      fetchProjects();
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      const errorMsg = handleApiError(err);
      toast.error('فشل في الإضافة: ' + errorMsg.message);
    }
  };

  // أعمدة الجدول
  const columns = [
    {
      title: 'اسم المشروع',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'مكتمل' ? 'green' : status === 'قيد التنفيذ' ? 'blue' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'الميزانية (USD)',
      dataIndex: 'budget',
      key: 'budget',
    },
    {
      title: 'تاريخ البدء',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'تاريخ الانتهاء',
      dataIndex: 'endDate',
      key: 'endDate',
    },
  ];

  return (
    <div style={{ direction: 'rtl', padding: '24px' }}>
      <Title level={3}>إدارة المشاريع</Title>
      
      <Button 
        type="primary" 
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: '16px' }}
      >
        إضافة مشروع جديد
      </Button>

      <Table 
        dataSource={projects} 
        columns={columns} 
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />

      {/* نموذج إضافة مشروع */}
      <Modal
        title="إضافة مشروع جديد"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddProject}>
          <Form.Item
            name="name"
            label="اسم المشروع"
            rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="description"
            rules={[{ required: false, message: 'هذا الحقل مطلوب' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="الحالة"
            rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
          >
            <Select>
              <Option value="قيد التنفيذ">قيد التنفيذ</Option>
              <Option value="مكتمل">مكتمل</Option>
              <Option value="متأخر">متأخر</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="budget"
            label="الميزانية (USD)"
            rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="تاريخ البدء"
            rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="تاريخ الانتهاء"
            rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              حفظ
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
