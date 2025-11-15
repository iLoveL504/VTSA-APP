import React from 'react';

const PMSEntry = ({ project, setSelectedEntry }) => {
    const handleSelect = () => {
        setSelectedEntry(project);
    };

    // const handleAssign = (e) => {
    //     e.stopPropagation();
    //     onAssignClick(project, 'regular');
    // };

    // const handleCallback = (e) => {
    //     e.stopPropagation();
    //     onCallbackClick(project);
    // };

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

    return (
        <div 
            className={`pms-entry pms-entry-${statusClass}`} 
            onClick={handleSelect}
        >
            {/* Project & Client */}
            <div className="pms-entry-col pms-col-project">
                <div className="pms-project-name">{project.lift_name}</div>
                <div className="pms-project-client">{project.client}</div>
            </div>
            
            {/* Product Type */}
            <div className="pms-entry-col pms-col-product">
                {project.product_type}
            </div>
            
            {/* Location */}
            <div className="pms-entry-col pms-col-location">
                <div className="pms-location-main">{project.location}</div>
                <div className="pms-location-region">{project.island_group}</div>
            </div>

            {/* PMS Status */}
            <div className="pms-entry-col pms-col-status">
                <span className={`pms-status-indicator pms-status-${statusClass}`}>
                    {project.pms_status}
                </span>
            </div>
            
            {/* Last Inspection */}
            <div className="pms-entry-col pms-col-last">
                {project.last_inspection_date ? (
                    <div className="pms-date">{new Date(project.last_inspection_date).toLocaleDateString('en-GB')}</div>
                ) : (
                    <div className="pms-date-empty">-</div>
                )}
            </div>

            {/* Next Inspection */}
            <div className="pms-entry-col pms-col-next">
                {project.pms_inspection_date ? (
                    <div className="pms-date">{new Date(project.pms_inspection_date).toLocaleDateString('en-GB')}</div>
                ) : (
                    <div className="pms-date-empty">-</div>
                )}
            </div>
            
            {/* Contract */}
            <div className="pms-entry-col pms-col-contract">
                {isFreePMS ? (
                    <span className="pms-contract-badge pms-contract-free">Free PMS</span>
                ) : (
                    <span className="pms-contract-badge pms-contract-paid">Paid</span>
                )}
            </div>

            {/* Callback Date */}
            <div className="pms-entry-col pms-col-callback">
                {project.callback_date ? (
                    <div className="pms-callback-date">
                        {new Date(project.callback_date).toLocaleDateString('en-GB')}
                    </div>
                ) : (
                    <div className="pms-callback-empty">-</div>
                )}
            </div>
        </div>
    );
};

export default PMSEntry;