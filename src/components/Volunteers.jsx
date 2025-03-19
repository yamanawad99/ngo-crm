import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  message,
  Popconfirm,
  Typography,
  Spin,
  Row,
  Col,
  Card
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { volunteerAPI, projectAPI, handleApiError } from '../services/api';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Volunteers = () => {
  // State management
  const [volunteers, setVolunteers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Fetch volunteers on component mount
  useEffect(() => {
    fetchVolunteers();
    fetchProjects();
  }, []);

  // API calls
  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const data = await volunteerAPI.getAllVolunteers();
      setVolunteers(data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      const errorMsg = handleApiError(error);
      message.error(errorMsg.message || 'Failed to load volunteers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await projectAPI.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      const errorMsg = handleApiError(error);
      message.error(errorMsg.message || 'Failed to load projects. Please try again.');
    }
  };

  const createVolunteer = async (values) => {
    setConfirmLoading(true);
    try {
      await volunteerAPI.createVolunteer(values);
      message.success('Volunteer added successfully!');
      resetFormAndFetch();
    } catch (error) {
      console.error('Error creating volunteer:', error);
      const errorMsg = handleApiError(error);
      message.error(errorMsg.message || 'Failed to add volunteer. Please try again.');
      setConfirmLoading(false);
    }
  };

  const updateVolunteer = async (id, values) => {
    setConfirmLoading(true);
    try {
      await volunteerAPI.updateVolunteer(id, values);
      message.success('Volunteer updated successfully!');
      resetFormAndFetch();
    } catch (error) {
      console.error('Error updating volunteer:', error);
      const errorMsg = handleApiError(error);
      message.error(errorMsg.message || 'Failed to update volunteer. Please try again.');
      setConfirmLoading(false);
    }
  };

  const deleteVolunteer = async (id) => {
    try {
      await volunteerAPI.deleteVolunteer(id);
      message.success('Volunteer deleted successfully!');
      fetchVolunteers();
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      const errorMsg = handleApiError(error);
      message.error(errorMsg.message || 'Failed to delete volunteer. Please try again.');
    }
  };

  // UI handlers
  const resetFormAndFetch = () => {
    form.resetFields();
    setFormVisible(false);
    setEditingVolunteer(null);
    setConfirmLoading(false);
    fetchVolunteers();
  };

  const handleAddClick = () => {
    setEditingVolunteer(null);
    form.resetFields();
    setFormVisible(true);
  };

  const handleEditClick = (record) => {
    setEditingVolunteer(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      phone: record.phone,
      skills: record.skills,
      availability: record.availability,
      projects: record.projects?.map(p => p._id || p),
      status: record.status
    });
    setFormVisible(true);
  };

  const handleFormSubmit = (values) => {
    if (editingVolunteer) {
      updateVolunteer(editingVolunteer._id, values);
    } else {
      createVolunteer(values);
    }
  };

  const handleFormCancel = () => {
    setFormVisible(false);
    form.resetFields();
    setEditingVolunteer(null);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredVolunteers = volunteers.filter(volunteer => 
    volunteer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchText.toLowerCase()) ||
    volunteer.skills.some(skill => skill.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Table columns configuration
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills) => (
        <>
          {skills && skills.map(skill => (
            <Tag color="blue" key={skill}>
              {skill}
            </Tag>
          ))}
        </>
      ),
      filters: volunteers
        .flatMap(v => v.skills || [])
        .filter((skill, index, self) => self.indexOf(skill) === index)
        .map(skill => ({ text: skill, value: skill })),
      onFilter: (value, record) => record.skills && record.skills.includes(value),
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      key: 'availability',
      render: (availability) => {
        let color = 'default';
        if (availability === 'weekdays') color = 'green';
        if (availability === 'weekends') color = 'blue';
        if (availability === 'evenings') color = 'purple';
        if (availability === 'flexible') color = 'cyan';
        
        return <Tag color={color}>{availability}</Tag>;
      },
      filters: [
        { text: 'Weekdays', value: 'weekdays' },
        { text: 'Weekends', value: 'weekends' },
        { text: 'Evenings', value: 'evenings' },
        { text: 'Flexible', value: 'flexible' },
      ],
      onFilter: (value, record) => record.availability === value,
    },
    {
      title: 'Projects',
      dataIndex: 'projects',
      key: 'projects',
      render: (projects) => (
        <>
          {projects && projects.map(project => (
            <Tag color="green" key={project._id || project}>
              {project.name || 'Loading...'}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'active') color = 'green';
        if (status === 'inactive') color = 'red';
        if (status === 'pending') color = 'orange';
        
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Pending', value: 'pending' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEditClick(record)}
            type="primary" 
            size="small"
          />
          <Popconfirm
            title="Are you sure you want to delete this volunteer?"
            onConfirm={() => deleteVolunteer(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              type="primary" 
              danger 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Render component
  return (
    <div className="volunteers-container" style={{ padding: '20px' }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={2}>Volunteer Management</Title>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="Search volunteers"
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />
              <Button 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={fetchVolunteers}
              >
                Refresh
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddClick}
              >
                Add Volunteer
              </Button>
            </Space>
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredVolunteers}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        </Spin>
      </Card>

      {/* Add/Edit Volunteer Modal */}
      <Modal
        title={editingVolunteer ? 'Edit Volunteer' : 'Add New Volunteer'}
        visible={formVisible}
        onCancel={handleFormCancel}
        footer={null}
        destroyOnClose
        maskClosable={false}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter volunteer name' }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="pending">Pending</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="skills"
            label="Skills"
            rules={[{ required: true, message: 'Please add at least one skill' }]}
          >
            <Select
              mode="tags"
              placeholder="Enter skills"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="availability"
            label="Availability"
            rules={[{ required: true, message: 'Please select availability' }]}
          >
            <Select placeholder="Select availability">
              <Option value="weekdays">Weekdays</Option>
              <Option value="weekends">Weekends</Option>
              <Option value="evenings">Evenings</Option>
              <Option value="flexible">Flexible</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="projects"
            label="Projects"
          >
            <Select
              mode="multiple"
              placeholder="Select projects"
              style={{ width: '100%' }}
              loading={projects.length === 0}
            >
              {projects.map(project => (
                <Option key={project._id} value={project._id}>
                  {project.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleFormCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={confirmLoading}>
                {editingVolunteer ? 'Update' : 'Add'} Volunteer
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Volunteers;

