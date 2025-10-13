import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Axios } from '../../api/axios';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { Grid } from 'ldrs/react';
import '../../css/PMSPage.css';

const PMSPage = () => {
  const backendURL = import.meta.env.VITE_BACKENDURL || 'http://localhost:4000';
  const { projId } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    contract_type: '',
    handover_date: '',
  });

  // 🔹 Mock maintenance records (replace later with backend data)
  const [maintenanceHistory] = useState([
    {
      id: 1,
      service_date: '2025-09-20',
      type: 'Monthly',
      technician: 'Engr. Marco De Leon',
      remarks: 'Performed lubrication and door sensor calibration.',
    },
    {
      id: 2,
      service_date: '2025-08-20',
      type: 'Monthly',
      technician: 'Engr. Liza Santos',
      remarks: 'Checked motor parameters and verified safety switches.',
    },
    {
      id: 3,
      service_date: '2025-07-18',
      type: 'Monthly',
      technician: 'Engr. Marco De Leon',
      remarks: 'Adjusted car leveling and verified emergency alarm system.',
    },
  ]);

  // fetch project info
  const { data: project, isLoading } = useAxiosFetch(`${backendURL}/projects/${projId}`);

  useEffect(() => {
    if (project) {
      setFormData({
        contract_type: project.contract_type || '',
        handover_date: project.handover_date ? project.handover_date.split('T')[0] : '',
      });
    }
  }, [project]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Axios.put(`${backendURL}/projects/${projId}`, formData);
      alert('PMS information updated successfully!');
      navigate('/pms');
    } catch (err) {
      console.error('Error updating PMS info:', err);
      alert('Failed to save PMS data.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="Loading">
        <p>Loading project data...</p>
        <Grid size="60" speed="1.5" color="rgba(84,176,210,1)" />
      </div>
    );
  }

  return (
    <div className="Content PMSPage">
      <div className="project-header">
        <h2>{project?.lift_name || 'Project PMS Entry'}</h2>
        <p><strong>Client:</strong> {project?.client || 'N/A'}</p>
      </div>

      {/* PMS Registration Form */}
      <form onSubmit={handleSubmit} className="pms-form">
        <div className="form-section">
          <h3>Preventive Maintenance Service Registration</h3>

          <div className="form-row">
            <label>Contract Type:</label>
            <select
              name="contract_type"
              value={formData.contract_type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>

          <div className="form-row">
            <label>Date of Handover:</label>
            <input
              type="date"
              name="handover_date"
              value={formData.handover_date}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save PMS Entry'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/pms')}>
            Back to List
          </button>
        </div>
      </form>

      {/* Maintenance History Section */}
      <div className="form-section maintenance-history">
        <h3>Maintenance Record History</h3>

        {maintenanceHistory.length === 0 ? (
          <p>No maintenance records found.</p>
        ) : (
          <div className="history-table">
            <div className="table-row header">
              <div className="table-cell">Service Date</div>
              <div className="table-cell">Type</div>
              <div className="table-cell">Technician</div>
              <div className="table-cell">Remarks</div>
              <div className="table-cell">Action</div>
            </div>

            {maintenanceHistory.map((record) => (
              <div className="table-row" key={record.id}>
                <div className="table-cell">{new Date(record.service_date).toLocaleDateString('en-GB')}</div>
                <div className="table-cell">{record.type}</div>
                <div className="table-cell">{record.technician}</div>
                <div className="table-cell">{record.remarks}</div>
                <div className="table-cell">
                  <button
                    onClick={() => alert(`Viewing report ID ${record.id}`)}
                    className="btn-small"
                  >
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PMSPage;
