import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import { sponsorshipAPI, handleApiError } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title } = Typography;
const { Option } = Select;

const Sponsorships = () => {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // جلب بيانات الكفالات من API
  useEffect(() => {
    fetchSponsorships();
  }, []);

  const fetchSponsorships = async () => {
    setLoading(true);
    try {
      const data = await sponsorshipAPI.getAllSponsorships();
      setSponsorships(data);
    } catch (err) {
      const errorDetails = handleApiError(err);
      toast.error(errorDetails.message || 'فشل في جلب البيانات');
    }
    setLoading(false);
  };

  // إضافة كفالة جديدة
  const handleAddSponsorship = async (values) => {
    try {
      await sponsorshipAPI.createSponsorship(values);
      toast.success('تمت إضافة الكفالة بنجاح');
      fetchSponsorships();
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      const errorDetails = handleApiError(err);
      toast.error(errorDetails.message || 'فشل في الإضافة');
    }
  };

  // أعمدة الجدول
  const columns = [
    {
      title: 'اسم المستفيد',
      dataIndex: 'beneficiary',
      key: 'beneficiary',
    },
    {
      title: 'نوع الكفالة',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'المبلغ (USD)',
      dataIndex: 'amount',
      key: 'amount',
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
      <Title level={3}>إدارة الكفالات</Title>
      
      <Button 
        type="primary" 
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: '16px' }}
      >
        إضافة كفالة جديدة
      </Button>

      <Table 
        dataSource={sponsorships} 
        columns={columns} 
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />

      {/* نموذج إضافة كفالة */}
      <Modal
        title="إضافة كفالة جديدة"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddSponsorship}>
          <Form.Item
            name="beneficiary"
            label="اسم المستفيد"
            rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="نوع الكفالة"
            rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
          >
            <Select>
              <Option value="التعليم">التعليم</Option>
              <Option value="الصحة">الصحة</Option>
              <Option value="المعيشة">المعيشة</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="المبلغ (USD)"
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

export default Sponsorships;
