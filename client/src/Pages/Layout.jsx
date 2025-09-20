import useToggle from '../hooks/useToggle'
import MenuBar from '../components/UI/MenuBar'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/UI/NavBar'
import { useNavigate } from 'react-router-dom'

const Layout = () => {
    const navigate = useNavigate()
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true" ? true : false 
    console.log(isLoggedIn)
    const [menuToggle, invertMenuToggle] = useToggle()
    if(!isLoggedIn) return (
      <>
        you are not logged in
        <div>Kindly log in <a href="" onClick={() => {navigate('/login')}}>here</a></div>
      </>
    )
    return (
     <div>
        <NavBar invertMenuToggle={invertMenuToggle}/>
        <main className='Main-Content'>
            <MenuBar className={menuToggle ? '' : 'menuOn'} menuToggle={menuToggle}/>          
            <section style={{ flex: 1 }}>
              <Outlet />
            </section>
          
        </main>
    </div>
  )
}

export default Layout