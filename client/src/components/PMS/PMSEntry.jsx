import React from 'react';

const PMSEntry = ({ project, setSelectedEntry, onAssignClick }) => {
    const handleSelect = (project) => (e) => {
        if (e.target.closest('.assign-btn')) return;
        setSelectedEntry(project);
    };

    const handleAssignClick = (e) => {
        e.stopPropagation();
        onAssignClick(project);
    };

    const getStatusClass = () => {
        switch (project.pms_status) {
            case 'PMS Inspection Ongoing':
                return 'ongoing';
            case 'PMS Inspection Assigned':
                return 'assigned';
            case 'PMS Inspection Pending':
            case 'Free PMS Available':
                return 'pending';
            default:
                return 'none';
        }
    };

    const statusClass = getStatusClass();
    const isFreePMS = project.pms_contract === 'Free PMS';
    const canAssign = project.pms_status === 'PMS Inspection Pending' || project.pms_status === 'Free PMS Available';

    return (
        <div 
            className={`ProjectInfo pms-${statusClass}`} 
            onClick={handleSelect(project)}
        >
            {/* Column 1: Project Name & Client */}
            <div className="project-column">
                <div className="project-name">{project.lift_name}</div>
                <div className="project-client">{project.client}</div>
                {canAssign && (
                    <button className="assign-btn" onClick={handleAssignClick}>
                        Assign PMS Techs
                    </button>
                )}
            </div>
            
            {/* Column 2: Product Type */}
            <div className="product-type">
                {project.product_type}
            </div>
            
            {/* Column 3: Location */}
            <div className="location">
                <div>{project.location}</div>
                <div className="island-group">{project.island_group}</div>
            </div>

            {/* Column 4: PMS Status */}
            <div className="pms-status">
                <span className={`status-badge ${statusClass}`}>
                    {project.pms_status}
                </span>
            </div>
            
            {/* Column 5: Next Inspection Date */}
            <div className="inspection-date">
                {project.pms_inspection_date ? (
                    <div>{new Date(project.pms_inspection_date).toLocaleDateString('en-GB')}</div>
                ) : (
                    <div>-</div>
                )}
            </div>
            
            {/* Column 6: Free PMS */}
            <div className="free-pms">
                {isFreePMS ? (
                    <span className="free-badge">Free PMS</span>
                ) : (
                    <span className="paid-badge">Paid</span>
                )}
            </div>
            
            {/* Column 7: Actions */}
            <div className="actions">
                {canAssign && (
                    <button className="assign-action-btn" onClick={handleAssignClick}>
                        Assign
                    </button>
                )}
                {project.pms_status === 'PMS Inspection Assigned' && (
                    <span className="assigned-text">Assigned</span>
                )}
                {project.pms_status === 'PMS Inspection Ongoing' && (
                    <span className="ongoing-text">In Progress</span>
                )}
                {project.pms_status === 'No PMS Scheduled' && (
                    <span className="no-pms-text">Not Scheduled</span>
                )}
            </div>
        </div>
    );
};

export default PMSEntry;