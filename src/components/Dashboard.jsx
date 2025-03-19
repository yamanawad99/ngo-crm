// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Typography, Row, Col, Spin } from 'antd';
import { projectAPI, donorAPI, handleApiError } from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// تسجيل مكونات Chart.js المطلوبة
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const { Title } = Typography;

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await projectAPI.getAllProjects();
        const donorsResponse = await donorAPI.getAllDonors();
        
        // Log the complete responses to debug
        console.log('Projects API response:', projectsResponse);
        console.log('Donors API response:', donorsResponse);
        
        // Check if responses have a data property (nested structure)
        const projectsData = projectsResponse && projectsResponse.data ? projectsResponse.data : projectsResponse;
        const donorsData = donorsResponse && donorsResponse.data ? donorsResponse.data : donorsResponse;
        
        // Make sure we're setting arrays
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setDonors(Array.isArray(donorsData) ? donorsData : []);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        console.error(handleApiError(err));
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  console.log('Type of projects:', typeof projects);
  console.log('Is projects an array:', Array.isArray(projects));
  console.log('Projects data:', projects);

  // بيانات الرسم البياني الدائري
  const pieData = {
    labels: ['مكتمل', 'قيد التنفيذ', 'متأخر'],
    datasets: [{
      data: (() => {
        // Create a safe calculation function
        if (!Array.isArray(projects) || projects.length === 0) {
          return [0, 0, 0];
        }
        
        // Use reduce only if projects is definitely an array
        return projects.reduce((acc, project) => {
          if (project && project.status === 'مكتمل') acc[0] += 1;
          if (project && project.status === 'قيد التنفيذ') acc[1] += 1;
          if (project && project.status === 'متأخر') acc[2] += 1;
          return acc;
        }, [0, 0, 0]);
      })(),
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
    }]
  };

  // بيانات الرسم البياني العمودي
  const barData = {
    labels: Array.isArray(donors) && donors.length > 0 ? donors.map(donor => donor?.name || 'Unknown') : [],
    datasets: [{
      label: 'الميزانية (USD)',
      data: Array.isArray(donors) && donors.length > 0 ? donors.map(donor => donor?.budget || 0) : [],
      backgroundColor: '#2196F3',
    }]
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <Title level={3}>لوحة التحكم</Title>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
              <Pie data={pieData} />
              <p style={{ textAlign: 'center' }}>حالة المشاريع</p>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
              <Bar data={barData} />
              <p style={{ textAlign: 'center' }}>تبرعات الجهات المانحة</p>
            </div>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Dashboard;
