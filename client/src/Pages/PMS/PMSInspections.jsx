import React, { useMemo, useState } from 'react'
import useAxiosFetch from '../../hooks/useAxiosFetch'
import {useNavigate} from 'react-router-dom'
import { Axios } from '../../api/axios'
import '../../css/PMSInspections.css'
import { Grid } from 'ldrs/react'
import { useStoreState } from 'easy-peasy'


const PMSInspections = () => {
    const techId = sessionStorage.getItem('id')
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const { data: inspections, isLoading } = useAxiosFetch(`${backendURL}/api/pms/designated/${techId}`)
    const [actionStatus, setActionStatus] = useState('')
    const dateNow = useStoreState(state => state.date)
    // Categorize inspections by date
const categorizedInspections = useMemo(() => {
    if (!inspections) return {}

    // Get today's date in local timezone (no UTC shift)
    const now = new Date(dateNow)
    const todayLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    const today = todayLocal.toISOString().split('T')[0]

    const getLocalDate = (dateString) => {
        const d = new Date(dateString)
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        return local.toISOString().split('T')[0]
    }

    return inspections.reduce((acc, inspection) => {
        const inspectionDate = getLocalDate(inspection.pms_inspection_date)
        console.log(today)
        console.log(inspectionDate)
        if (inspectionDate < today) {
            acc.overdue = [...(acc.overdue || []), inspection]
        } else if (inspectionDate === today) {
            acc.today = [...(acc.today || []), inspection]
        } else if (inspectionDate === getTomorrowDate()) {
            acc.tomorrow = [...(acc.tomorrow || []), inspection]
        } else {
            acc.upcoming = [...(acc.upcoming || []), inspection]
        }
        return acc
    }, {})
}, [inspections, dateNow])

    console.log(categorizedInspections)
function getTomorrowDate() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const local = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
    return local.toISOString().split('T')[0]
}

    const handleBeginInspection = async (inspection) => {
        try {
            setActionStatus('starting')
            const response = await Axios.post(`/api/pms/begin-inspection/${inspection.id}`)
            
            if (response.data.success) {
                setActionStatus('success')
                // Refresh the page or update local state
                window.location.reload()
            } else {
                setActionStatus('Failed to begin inspection')
            }
        } catch (error) {
            console.error('Error starting inspection:', error)
            setActionStatus('Error starting inspection')
        }
    }

    const canBeginInspection = (inspection) => {
        const today = new Date().toISOString().split('T')[0]
        const inspectionDate = new Date(inspection.pms_inspection_date).toISOString().split('T')[0]
        return inspectionDate <= today && !inspection.inspection_ongoing
    }

    const getStatusBadge = (inspection) => {
        if (inspection.inspection_ongoing) {
            return <span className="status-badge ongoing">In Progress</span>
        }
        
        const today = new Date().toISOString().split('T')[0]
        const inspectionDate = new Date(inspection.pms_inspection_date).toISOString().split('T')[0]
        
        if (inspectionDate < today) {
            return <span className="status-badge overdue">Overdue</span>
        } else if (inspectionDate === today) {
            return <span className="status-badge today">Due Today</span>
        } else {
            return <span className="status-badge upcoming">Scheduled</span>
        }
    }

    if (isLoading) {
        return (
            <div className="Loading">
                <p>Data is Loading...</p>
                <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
            </div>
        )
    }

    return (
        <div className="Content PMSInspections">
            <div className="inspections-header">
                <h1>My PMS Inspections</h1>
                <div className="inspections-summary">
                    <div className="summary-item">
                        <span className="count">{inspections?.length || 0}</span>
                        <span className="label">Total Assigned</span>
                    </div>
                    <div className="summary-item">
                        <span className="count">
                            {categorizedInspections.today?.length || 0}
                        </span>
                        <span className="label">Due Today</span>
                    </div>
                    <div className="summary-item">
                        <span className="count">
                            {categorizedInspections.overdue?.length || 0}
                        </span>
                        <span className="label">Overdue</span>
                    </div>
                </div>
            </div>

            {actionStatus && actionStatus !== 'starting' && actionStatus !== 'success' && (
                <div className="status-message error">
                    {actionStatus}
                </div>
            )}

            <div className="inspections-container">
                {/* Today's Inspections */}
                {categorizedInspections.today && categorizedInspections.today.length > 0 && (
                    <section className="inspection-section">
                        <h2 className="section-title today">Today's Inspections</h2>
                        <div className="inspections-list">
                            {categorizedInspections.today.map(inspection => (
                                <InspectionCard 
                                    key={inspection.id}
                                    inspection={inspection}
                                    onBeginInspection={handleBeginInspection}
                                    getStatusBadge={getStatusBadge}
                                    canBeginInspection={canBeginInspection}
                                    actionStatus={actionStatus}
                                    clientId={inspection.id}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Overdue Inspections */}
                {categorizedInspections.overdue && categorizedInspections.overdue.length > 0 && (
                    <section className="inspection-section">
                        <h2 className="section-title overdue">Overdue Inspections</h2>
                        <div className="inspections-list">
                            {categorizedInspections.overdue.map(inspection => (
                                <InspectionCard 
                                    key={inspection.id}
                                    inspection={inspection}
                                    onBeginInspection={handleBeginInspection}
                                    getStatusBadge={getStatusBadge}
                                    canBeginInspection={canBeginInspection}
                                    actionStatus={actionStatus}
                                    clientId={inspection.id}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Tomorrow's Inspections */}
                {categorizedInspections.tomorrow && categorizedInspections.tomorrow.length > 0 && (
                    <section className="inspection-section">
                        <h2 className="section-title tomorrow">Tomorrow's Inspections</h2>
                        <div className="inspections-list">
                            {categorizedInspections.tomorrow.map(inspection => (
                                <InspectionCard 
                                    key={inspection.id}
                                    inspection={inspection}
                                    onBeginInspection={handleBeginInspection}
                                    getStatusBadge={getStatusBadge}
                                    canBeginInspection={canBeginInspection}
                                    actionStatus={actionStatus}
                                    clientId={inspection.id}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Upcoming Inspections */}
                {categorizedInspections.upcoming && categorizedInspections.upcoming.length > 0 && (
                    <section className="inspection-section">
                        <h2 className="section-title upcoming">Upcoming Inspections</h2>
                        <div className="inspections-list">
                            {categorizedInspections.upcoming.map(inspection => (
                                <InspectionCard 
                                    key={inspection.id}
                                    inspection={inspection}
                                    onBeginInspection={handleBeginInspection}
                                    getStatusBadge={getStatusBadge}
                                    canBeginInspection={canBeginInspection}
                                    actionStatus={actionStatus}
                                    clientId={inspection.id}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {(!inspections || inspections.length === 0) && (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>No PMS Inspections Assigned</h3>
                    <p>You don't have any PMS inspections scheduled at the moment.</p>
                </div>
            )}
        </div>
    )
}

// Inspection Card Component
const InspectionCard = ({ inspection, onBeginInspection, getStatusBadge, canBeginInspection, actionStatus, clientId }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }
    const navigate = useNavigate()
    return (
        <div className="inspection-card">
            <div className="card-header">
                <div className="card-title-section">
                    <h3 className="lift-name">{inspection.lift_name}</h3>
                    <div className="client-info">
                        <strong>{inspection.client}</strong>
                    </div>
                </div>
                {getStatusBadge(inspection)}
            </div>
            
            <div className="card-content">
                <div className="inspection-details">
                    <div className="detail-row">
                        <div className="detail-item">
                            <span className="label">Product Type:</span>
                            <span className="value">{inspection.product_type}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Location:</span>
                            <span className="value">{inspection.location}, {inspection.island_group}</span>
                        </div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-item">
                            <span className="label">Scheduled Date:</span>
                            <span className="value">{formatDate(inspection.pms_inspection_date)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">PMS Contract:</span>
                            <span className="value">{inspection.pms_contract}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-actions">
                {canBeginInspection(inspection) ? (
                    <button 
                        className="begin-btn"
                        onClick={() => onBeginInspection(inspection)}
                        disabled={actionStatus === 'starting'}
                    >
                        {actionStatus === 'starting' ? 'Starting...' : 'Begin Inspection'}
                    </button>
                ) : (
                    <button className="begin-btn disabled" disabled>
                        {inspection.inspection_ongoing ? 'Inspection Started' : 'Not Yet Available'}
                    </button>
                )}
                <button onClick={() => navigate(`${clientId}`)}>
                    Details
                </button>
            </div>
        </div>
    )
}

export default PMSInspections