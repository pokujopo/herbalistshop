import { Outlet } from "react-router-dom";
import NavBar from '../componets/NavBar.jsx';
import Footer from '../componets/Footer.jsx';

function Layout(){
    return(
        <>
        <NavBar />
        <Outlet />
        <Footer />
        </>
    )
}

export default Layout;