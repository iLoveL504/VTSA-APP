import React from 'react';

const PMSEntry = ({ project, setSelectedEntry }) => {
    const handleSelect = (project) => (e) => {
        if (e.target.closest('.assign-btn')) return;
        setSelectedEntry(project);
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
    console.log(project)
    return (
        <div 
            className={`ProjectInfo pms-${statusClass}`} 
            onClick={handleSelect(project)}
        >
            {/* Column 1: Project Name & Client */}
            <div className="project-column">
                <div className="project-name">{project.lift_name}</div>
                <div className="project-client">{project.client}</div>
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
                {project.last_inspection_date !== null ? (
                    <div>{new Date(project.last_inspection_date).toLocaleDateString('en-GB')}</div>
                ) : (
                    <div>-</div>
                )}
            </div>
            {/* Column 6: Next Inspection Date */}
            <div className="inspection-date">
                {project.pms_inspection_date ? (
                    <div>{new Date(project.pms_inspection_date).toLocaleDateString('en-GB')}</div>
                ) : (
                    <div>-</div>
                )}
            </div>
            
            {/* Column 7: Free PMS */}
            <div className="free-pms">
                {isFreePMS ? (
                    <span className="free-badge">Free PMS</span>
                ) : (
                    <span className="paid-badge">Paid</span>
                )}
            </div>
            
            {/* Column 8: Actions */}
            <div className="actions">
                {project.callback_date ? project.callback_date : '-'}
            </div>
        </div>
    );
};

export default PMSEntry;