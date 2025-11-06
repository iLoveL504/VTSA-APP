import React from 'react'
import { useSharedSocket } from '../../Context/SocketContext'
import { Axios } from '../../api/axios'
import { useParams } from 'react-router-dom'
import { useStoreState } from 'easy-peasy'

const RequestHold = ({proj}) => {
    const { projId } = useParams()
    const projectManagerId = useStoreState(state => state.projectManagerId)
    const dateNow = useStoreState(state => state.dateNow)
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
            {proj.on_hold ? (
                <div>Project is on hold</div>
            ) : sessionStorage.getItem('roles') === 'Project Engineer' ? (
                <div className='request-hold-section'>
                    {!proj.request_hold ? (
                        <>
                            <h3>Request Hold for project: {proj.client} ({proj.lift_name})</h3>
                            <button
                                onClick={handleRequestHold}
                            >Request Hold</button>
                        </>
                    ) : (
                        <div>
                            Hold Requested
                        </div>
                    )}

                </div>
            ) : sessionStorage.getItem('roles') === 'Project Manager' ? (
                <div classNmae='approve-hold-section'>
                    <button onClick={handleApproveHold}>Approve Hold {proj.client} ({proj.lift_name})</button>
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}

export default RequestHold