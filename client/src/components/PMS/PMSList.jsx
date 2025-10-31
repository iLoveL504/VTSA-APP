import React from 'react';
import PMSEntry from './PMSEntry';

const PMSList = ({ projects, setSelectedEntry, onAssignClick }) => {
    if (!projects || projects.length === 0) {
        return (
            <div className="no-projects">
                <p>No PMS projects found</p>
            </div>
        );
    }
    console.log(projects)
    return (
        <div className="PMSList">
            {projects.map(project => (
                <PMSEntry
                    key={project.id}
                    project={project}
                    setSelectedEntry={setSelectedEntry}
                    onAssignClick={onAssignClick}
                />
            ))}
        </div>
    );
};

export default PMSList;