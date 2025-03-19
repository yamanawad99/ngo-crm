import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Tag, 
  Typography, 
  Spin, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Popconfirm,
  message 
} from 'antd';
import { donorAPI, handleApiError } from '../services/api';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);
  const [form] = Form.useForm();

  // جلب البيانات
  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const data = await donorAPI.getAllDonors();
      setDonors(data);
    } catch (err) {
      const errorInfo = handleApiError(err);
      message.error('فشل في جلب البيانات: ' + errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  // فتح نموذج الإضافة/التعديل
  const showModal = (donor = null) => {
    setEditingDonor(donor);
    form.setFieldsValue(donor || {});
    setIsModalVisible(true);
  };

  // إرسال البيانات
  const handleSubmit = async (values) => {
    try {
      if (editingDonor) {
        await donorAPI.updateDonor(editingDonor.id, values);
        message.success('تم التحديث بنجاح');
      } else {
        await donorAPI.createDonor(values);
        message.success('تم الإضافة بنجاح');
      }
      fetchDonors();
      setIsModalVisible(false);
    } catch (err) {
      const errorInfo = handleApiError(err);
      message.error('حدث خطأ أثناء الحفظ: ' + errorInfo.message);
    }
  };

  // حذف المانح
  const handleDelete = async (id) => {
    try {
      await donorAPI.deleteDonor(id);
      message.success('تم الحذف بنجاح');
      fetchDonors();
    } catch (err) {
      const errorInfo = handleApiError(err);
      message.error('فشل في الحذف: ' + errorInfo.message);
    }
  };

  // أعمدة الجدول
  const columns = [
    { 
      title: 'اسم المانح', 
      dataIndex: 'name', 
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    { 
      title: 'نوع المنظمة', 
      dataIndex: 'type', 
      key: 'type',
      filters: [
        { text: 'جمعية دولية', value: 'جمعية دولية' },
        { text: 'شركة خاصة', value: 'شركة خاصة' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    { 
      title: 'القطاعات', 
      dataIndex: 'sector',
      key: 'sector',
      render: sectors => sectors?.map((s, i) => <Tag key={i} color="blue">{s}</Tag>)
    },
    { 
      title: 'البلد', 
      dataIndex: 'country', 
      key: 'country',
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    { 
      title: 'الميزانية (USD)', 
      dataIndex: 'budget', 
      key: 'budget',
      sorter: (a, b) => a.budget - b.budget,
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="هل أنت متأكد من الحذف؟"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ direction: 'rtl', padding: '24px' }}>
      <Title level={3} style={{ marginBottom: '24px' }}>إدارة الجهات المانحة</Title>
      
      <Button 
        type="primary" 
        onClick={() => showModal()}
        style={{ marginBottom: '16px' }}
      >
        إضافة مانح جديد
      </Button>

      <Table
        dataSource={donors}
        columns={columns}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
      />

      {/* نموذج الإضافة/التعديل */}
      <Modal
        title={editingDonor ? "تعديل المانح" : "إضافة مانح جديد"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="اسم المانح"
            rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="نوع المنظمة"
            rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
          >
            <Select>
              <Option value="جمعية دولية">جمعية دولية</Option>
              <Option value="شركة خاصة">شركة خاصة</Option>
              <Option value="مانح فردي">مانح فردي</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="sector"
            label="القطاعات"
            rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
          >
            <Select mode="multiple">
              <Option value="الإغاثة">الإغاثة</Option>
              <Option value="التعليم">التعليم</Option>
              <Option value="الصحة">الصحة</Option>
              <Option value="الكفالات">الكفالات</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="country"
            label="البلد"
            rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="budget"
            label="الميزانية (USD)"
            rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingDonor ? 'حفظ التعديلات' : 'إضافة'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Donors;
