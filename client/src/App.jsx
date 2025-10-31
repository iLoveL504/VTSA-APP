import { useEffect, useMemo } from 'react'
import Layout from './Pages/Layout'
import Dashboard from './Pages/Dashboard/Dashboard.jsx'
import Technician from './Pages/Technician/Technician.jsx'
import TechnicianInfo from './Pages/Technician/TechnicianInfo.jsx'
import Projects from './Pages/Projects/Projects'
import ProjectInfo from './Pages/Projects/ProjectInfo.jsx'
import ProjectProgress from './Pages/Projects/ProjectProgress.jsx'
import ProjectReport from './Pages/Projects/ProjectReport.jsx'
import PMSAssignment from './Pages/PMS/PMSAssignment.jsx'
import Login from './Pages/Login'
import Teams from './Pages/Teams/Teams.jsx'
import BabyBook from './Pages/BabyBook'
import CreateProject from './Pages/Projects/CreateProject'
import { Routes, Route, Navigate } from 'react-router-dom';
import useAxiosFetch from './hooks/useAxiosFetch'
import AssignTeam from './Pages/AssignTeam.jsx'
import QAQC_Checklist from './Pages/Documents/PTNCQAQC_Checklist.jsx'
import { useStoreState, useStoreActions } from 'easy-peasy'
import NotificationPage from './Pages/NotificationPage.jsx'
import Chat from './Pages/Chat.jsx'
import Test1 from './Pages/Test.jsx'
import KickOffChecklist from './Pages/Documents/KickOffChecklist.jsx'
import TestJspreadsheet from './Pages/Tests/TestJspreadsheet.jsx'
import TestChart from './Pages/Tests/TestChart.jsx'
import useUpdateProjects from './hooks/useUpdateProjects.js'
import ProjectDocuments from './Pages/Projects/ProjectDocuments.jsx'
import DailyReportDetails from './Pages/Projects/DailyReportDetails.jsx'
import HandOverChecklist from './Pages/Documents/HandOverChecklist.jsx'
import PreInspection_Checklist from './Pages/Documents/PreInspection.jsx'
import SchneiderServiceReport from './Pages/Documents/SchneiderServiceReport.jsx'
import Users from './Pages/Admin/Users.jsx'
import PMSPage from './Pages/PMS/PMSPage.jsx'
import QAQCAssignment from './Pages/QAQC/QAQCAssignment.jsx'
import TNCAssignment from './Pages/TNC/TNCAssignment.jsx'
import '@mantine/core/styles.css';
// ‼️ import dates styles after core package styles
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core';
import PMSNewEntry from './Pages/PMS/PMSNewEntry.jsx'


function App() {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'https://vtsa-app-production.up.railway.app';
  //console.log('https://vtsa-app-production.up.railway.app')

const { data: empData } =
  useAxiosFetch(`${backendURL}/api/employees`);

const { data: pmsData } =
  useAxiosFetch(`${backendURL}/api/pms/clients`);

const { data: projData } =
  useAxiosFetch(`${backendURL}/api/projects`);
const { data: notifData } =
  useAxiosFetch(`${backendURL}/api/notifications`);

  //const isLoggedIn = useStoreState(state => state.isLoggedIn)
  const setEmployees = useStoreActions(actions => actions.setEmployees)
  const setProjects = useStoreActions(actions => actions.setProjects)
  const setUser = useStoreActions(actions => actions.setUser)
  const setNotifications = useStoreActions(actions => actions.setNotifications)
  const projects = useStoreState(state => state.projects)
  const setPMSProjects = useStoreActions(actions => actions.setPMSProjects)

  // array of project ids
  const projectIDs = useMemo(() => {
    if(projects.length != 0) {
   
      let ids = projects.filter(p => {if(p.schedule_created === 1) return p.id})
    
      return ids
    }
  }, [projects])
  // hook for project status batch update
  const [updateIsLoading] = useUpdateProjects(projectIDs)

  // add event listeners to socket hook


  useEffect(() => {
    // Handle login state and user data
    const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    
    if (loggedIn) {
      setUser({ 
        username: sessionStorage.getItem('username'), 
        roles: sessionStorage.getItem('roles') 
      });
    }
    
    //console.log(dateNow);
  }, [setUser]);
  
  //join room useEffect
  // useEffect(() => {
  //   if(socket && isLoggedIn === true) {
  //     socket.emit("join_notifications", sessionStorage.getItem("id"))
      
  //   }
  // }, [socket, isLoggedIn])

useEffect(() => {
  if (empData) {setEmployees(empData);}
}, [empData, setEmployees])

useEffect(() => {
  if (pmsData) setPMSProjects(pmsData)
}, [pmsData, setPMSProjects])

useEffect(() => {
  if (projData) setProjects(projData)
}, [projData, setProjects])

useEffect(() => {
  if (notifData) {
    setNotifications(notifData)
    //console.log('notifications')
    //console.log(notifData)
  }
}, [notifData, setNotifications])

  return (
    <MantineProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="login" element={<Login />} />
        {/* <Route path="/not-logged-in" element={<NotLoggedIn />} /> */}
        <Route element={<Layout />}>

          <Route path="test" element={<Test1 />} />
          <Route path="dashboard" element={<Dashboard />} />
          

          <Route path="technician">
            <Route index element={<Technician />} /> 
            <Route path=":empId" element={<TechnicianInfo />} />
          </Route>

          <Route path="admin">
            <Route path="users" element={<Users />} />
          </Route>

          <Route path="projects">
            <Route index element={<Projects updateIsLoading={updateIsLoading}/>} />
            
            <Route path="create" element={<CreateProject />} />
            <Route path=":projId" element={<ProjectInfo />} />
            <Route path=":projId/team" element={<AssignTeam />} />
            <Route path=":projId/qaqc" element={<QAQC_Checklist />} />
            <Route path=":projId/progress" element={<ProjectProgress />} />
            <Route path=":projId/report" element={<ProjectReport />} />
            <Route path=":projId/custom" element={<Test1 />} />
            <Route path=":projId/kickoff" element={<KickOffChecklist />} />
            <Route path=":projId/handover-checklist" element={<HandOverChecklist />} />
            <Route path=":projId/preinspection-checklist" element={<PreInspection_Checklist />} />
            <Route path=":projId/schneider_service_report" element={<SchneiderServiceReport />} />
            <Route path=":projId/schedule" element={<TestChart id={1} />} />
            <Route path=":projId/documents" element={<ProjectDocuments />} /> 
            {/* <Route path=":projId/" element={<ProjectDocuments />} />  */}
            <Route path=":projId/daily-reports/:reportId" element={<DailyReportDetails />} />
          </Route>
          
          <Route path="testsheet" element={<TestJspreadsheet />} />
          <Route path="PMS">
            <Route index element={<PMSAssignment updateIsLoading={updateIsLoading}/>} />
            <Route path="new-entry" element={<PMSNewEntry updateIsLoading={updateIsLoading}/>} />
            <Route path=":projId" element={<PMSPage />} />
          </Route>

          <Route path="notification">
            <Route path=":notifId" element={<NotificationPage />} />
            
          </Route>
          <Route path="chat">
            <Route index element={<Chat />} />
            
          </Route>
          <Route path="QAQC">
            <Route index element={<QAQCAssignment updateIsLoading={updateIsLoading} />} />
            
          </Route>

          <Route path="TNC">
            <Route index element={<TNCAssignment updateIsLoading={updateIsLoading} />} />
          </Route>

  

          <Route path="teams" element={<Teams />} />
          <Route path="baby-book" element={<BabyBook />} />
        </Route>
        
      </Routes>      
    </MantineProvider>

  )
}

export default App
