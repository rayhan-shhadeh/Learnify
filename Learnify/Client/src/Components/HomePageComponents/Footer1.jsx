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
                              <a href=""><img src="/assets/img/logo/a+.jpg" alt="" /></a>
                            </div>
                            <ul className="social-icon">
                                 <li><a href="#"><i className="bi bi-linkedin"></i></a></li>
                                 <li><a href="#"><i className="bi bi-twitter"></i></a></li>
                                 <li><a href="#"><i className="bi bi-youtube"></i></a></li>
                                 <li><a href="#"><i className="bi bi-instagram"></i></a></li>
                            </ul>
                       </div>
                  </div>

                  <div className="col-lg-3 col-md-6 col-12">
                       <div className="single-footer-items">
                            <h3>Contact Us</h3>

                            <div className="contact-box">
                              <div className="icon">
                                <img src="/assets/img/icons/footer1-icon1.png" alt="" />
                              </div>
                              <div className="pera">
                                <a href="tel:0500222333">0500 222 333</a>
                              </div>
                            </div>

                            <div className="contact-box">
                              <div className="icon">
                                <img src="/assets/img/icons/footer1-icon2.png" alt="" />
                              </div>
                              <div className="pera">
                                <a href="tel:0356588547">03 5658 8547</a>
                              </div>
                            </div>

                            <div className="contact-box">
                              <div className="icon">
                                <img src="/assets/img/icons/footer1-icon3.png" alt="" />
                              </div>
                              <div className="pera">
                                <a href="mailto:admin@techxen.org">admin@A+.org</a>
                              </div>
                            </div>

                            <div className="contact-box">
                              <div className="icon">
                                <img src="/assets/img/icons/footer1-icon4.png" alt="" />
                              </div>
                              <div className="pera">
                                <a href="mailto:admin@techxen.org">www.A+.org</a>
                              </div>
                            </div>

                       </div>
                  </div>

             </div>

             <div className="space40"></div>
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