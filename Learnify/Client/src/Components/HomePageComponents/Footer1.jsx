import { Link } from "react-router-dom";
import '../../CSS/home.css';

const Footer1 = () => {
    return (
        <div className="footer1 _relative">
        <div className="container">
             <div className="row  justify-content-center">
                  <div className="col-lg-4 col-md-6 col-12">
                       <div className="single-footer-items footer-logo-area">
                            <div className="footer-logo">
                              <a href=""><img src="/assets/img/logo/a+logoF.png" alt="" /></a>
                            </div>
                       </div>
                  </div>

                  <div className="col-lg-3 col-md-6 col-12">
                       <div className="single-footer-items">


                            <div className="contact-box">
                              <div className="icon">
                              <li><a href="#"><i className="bi bi-linkedin"></i></a></li>
                              </div>
                              <div className="pera">
                                <a href="mailto:admin@techxen.org">aplus</a>
                              </div>
                            </div>
                            <div className="contact-box">
                              <div className="icon">
                              <li><a href="#"><i className="bi bi-twitter"></i></a></li>
                              </div>
                              <div className="pera">
                                <a href="mailto:admin@techxen.org">a+studyhelper</a>
                              </div>
                            </div>
                            <div className="contact-box">
                              <div className="icon">
                              <li><a href="#"><i className="bi bi-instagram"></i></a></li>
                              </div>
                              <div className="pera">
                                <a href="mailto:admin@techxen.org">aplus_study_hepler_</a>
                              </div>
                            </div>
                       </div>
                  </div>

             </div>

             <div className="space100"></div>
        </div>

        <div className="copyright-area">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-5">
                   <div className="coppyright">
                     <p>Copyright @2024 A+StudyHelper Rights Reserved</p>
                   </div>
              </div>
              <div className="col-md-7">
                   <div className="coppyright right-area">
                        <a href="#">Terms & Conditions</a>
                        <a href="#">Privacy Policy</a>
                   </div>
              </div>
         </div>
          </div>
     </div>

      </div>
    );
};

export default Footer1;