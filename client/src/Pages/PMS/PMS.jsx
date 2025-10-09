import React from 'react';
import { useNavigate } from 'react-router-dom';
import PMSList from '../../components/PMS/PMSList';
import '../../css/PMSMenu.css'; // reuse the same table style

const PMS = ({ updateIsLoading }) => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate('/projects'); // optional: redirect to project creation if needed
  };

  return (
    <div className="Content PMSMenu">
      <div>
        <button
          onClick={handleCreateClick}
          style={{
            display:
              sessionStorage.getItem('roles') === 'Project Manager' ? 'block' : 'none',
          }}
        >
          Add New Project
        </button>
      </div>

      <div className="project-table-header">
        <div className="table-row header-row">
          <div className="table-cell">Project Name</div>
          <div className="table-cell">Client</div>
          <div className="table-cell">Contract Type</div>
          <div className="table-cell">Actions</div>
        </div>
      </div>

      <div>
        <PMSList updateIsLoading={updateIsLoading} />
      </div>
    </div>
  );
};

export default PMS;
