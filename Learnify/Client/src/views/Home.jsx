import Award1 from "../Components/HomePageComponents/Award1";
import Choose1 from "../Components/HomePageComponents/Choose1";
import Cta1 from "../Components/HomePageComponents/Cta1";
import HeroBanner1 from "../Components/HomePageComponents/HeroBanner1";
import Services1 from "../Components/HomePageComponents/Services1";
import Team3 from "../Components/HomePageComponents/Team3";
import "slick-carousel/slick/slick.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../CSS/home.css';
const Home = () => {
    return (
        <div className="home-page1">
            <HeroBanner1
                bgImg="/assets/img/bg/hero1-bg.png"
                title="Empower your learning journey! Upload your PDFs and let us handle the rest!"
                btnName="Get Started Now"
                btnUrl="/courses"
                image1="/assets/img/hero/girl.png"
            ></HeroBanner1>
            <Award1></Award1>
            <Services1></Services1>
            <Choose1></Choose1>
            <Team3></Team3>
            <Cta1></Cta1>
        </div>
    );
};
export default Home;
