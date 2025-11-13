import React from 'react'
import { useSharedSocket } from '../../Context/SocketContext'
import { Axios } from '../../api/axios'
import { useParams } from 'react-router-dom'
import { useStoreState } from 'easy-peasy'

const RequestHold = ({proj}) => {
    const { projId } = useParams()
    const projectManagerId = useStoreState(state => state.projectManagerId)
    const dateNow = useStoreState(state => state.date)
    console.log(projectManagerId)
    const { utilitiesSocket } = useSharedSocket()
    const handleRequestHold = async () => {
        const response = await Axios.put(`/api/projects/request-hold/${projId}`)
        if (!response.data?.success) {
            window.alert("Something went wrong during assignment.");
            return;
        }
        const Ids = [projectManagerId]
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("Socket emit timeout"));
                }, 5000); 

                utilitiesSocket.emit("new_notification", {
                    subject: 'Request for Hold',
                    body: `Request Hold for ${proj.lift_name} (Client: ${proj.client})
                     at ${dateNow}`,
                    Ids
                }, (ack) => {
                    clearTimeout(timeout);
                    if (ack?.success) {
                        utilitiesSocket.emit("refresh_project_data");
                        resolve();
                    } else {
                    reject(new Error("Server failed to process notification."));
                    }
                });
            });        
            utilitiesSocket.emit('refresh_all_projects')
    }
    console.log(proj)
    const handleApproveHold = async () => {
        const response = await Axios.put(`/api/projects/approve-hold/${projId}`)
        if (!response.data?.success) {
            window.alert("Something went wrong during approval.");
            return;
        }
        const peId = proj.project_engineer_id
        const Ids = [peId]
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("Socket emit timeout"));
                }, 5000); 

                utilitiesSocket.emit("new_notification", {
                    subject: 'Approve for Hold',
                    body: `Approved Hold for ${proj.lift_name} (Client: ${proj.client})
                     at ${dateNow}`,
                    Ids
                }, (ack) => {
                    clearTimeout(timeout);
                    if (ack?.success) {
                        utilitiesSocket.emit("refresh_project_data");
                        resolve();
                    } else {
                    reject(new Error("Server failed to process notification."));
                    }
                });
            });  
        window.location.reload()       
    }

    return (
        <div className='Content RequestHold'>
            {sessionStorage.getItem('roles') === 'Project Engineer' ? (
                <div className='request-hold-section'>
                    {proj.will_resume ? (
                        <div>Project will proceed to TnC on {new Date(proj.resume_date).toLocaleDateString()}</div>
                    ) : proj.request_resume ? (
                        <div>Request for Project to proceed to TnC has been sent</div>
                    ) : proj.on_hold ? (
                        <div>Project is pending to proceed to TnC</div>
                    ) : proj.request_hold ? (
                        <div>Hold for TNC Requested</div>
                    ) : (
                        <>
                            <h3>Request Demobilization for project: {proj.client} ({proj.lift_name})</h3>
                            <div>Project will not proceed to TNC</div>
                            <button
                                onClick={handleRequestHold}
                            >Request Hold</button>
                        </>                        
                    )}
                </div>
            ) : sessionStorage.getItem('roles') === 'Project Manager' ? (
                <div classNmae='approve-hold-section'>
                    {proj.will_resume ? (
                        <div>Project will proceed to TnC on {new Date(proj.resume_date).toLocaleDateString()}</div>
                    ) : proj.request_resume ? (
                        <div>
                            Request for Project to proceed to TnC has been sent
                        </div>
                    ) : proj.on_hold ? (
                        <div>Project is pending to proceed to TnC</div>
                    ) : proj.request_hold ? (
                        <button onClick={handleApproveHold}>Approve Hold {proj.client} ({proj.lift_name})</button>
                    ) : (
                        <div>
                            Hold and demobilization for TnC not yet requested
                        </div>                        
                    )}
                    
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}

export default RequestHold