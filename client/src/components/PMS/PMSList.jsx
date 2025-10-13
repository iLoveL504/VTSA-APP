import React from 'react';
import { Grid } from 'ldrs/react';
import { useNavigate } from 'react-router-dom';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import '../../css/PMSMenu.css'; // same table layout

const PMSList = ({ updateIsLoading }) => {
  const backendURL = import.meta.env.VITE_BACKENDURL || 'http://localhost:4000';
  const navigate = useNavigate();

  const { data: pmsProjects, isLoading } = useAxiosFetch(
    `${backendURL}/api/projects` // ← backend route should return projects where contract_type IS NOT NULL
  );

  if (isLoading || updateIsLoading) {
    return (
      <div className="Loading">
        <p>Loading PMS Projects...</p>
        <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
      </div>
    );
  }

  if (!pmsProjects || pmsProjects.length === 0) {
    return <p>No PMS projects found.</p>;
  }

  return (
    <div className="PMSList">
      {pmsProjects.filter(p => p.status === 'Completed').map((p) => (
        <div className="table-row" key={p.id} onClick={() => navigate(`/PMS/${p.id}`)}>
          <div className="table-cell">{p.lift_name}</div>
          <div className="table-cell">{p.client || 'N/A'}</div>
          <div className="table-cell">{p.contract_type}</div>
          <div className="table-cell">
            <button onClick={() => navigate(`/projects/${p.id}/pms`)}>
              View PMS Record
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PMSList;
