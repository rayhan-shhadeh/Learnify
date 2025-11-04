import { Outlet } from 'react-router-dom';
import Header1 from '../Components/HomePageComponents/Header1';
import Footer1 from '../Components/HomePageComponents/Footer1';
// import { Analytics } from "@vercel/analytics/next"


const Main = () => {
    return (
        <div className='main-page-area'>
            <Header1></Header1>
            <Outlet></Outlet>
            <Footer1></Footer1>
        </div>
    );
};

export default Main;