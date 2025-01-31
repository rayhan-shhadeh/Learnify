import { useEffect, useState } from "react";
import loadBackgroudImages from "./loadBackgroudImages";
import parse from 'html-react-parser';
import { Link } from "react-router-dom";
import '../../CSS/home.css';

const HeroBanner1 = ({bgImg,title,content,btnName,btnUrl,image1,image2,shapeImage1,shapeiamge2}) => {

  useEffect(() => {
    loadBackgroudImages();
  }, []);

    return (
      <div className="hero_main_area1">
        <div className="hero1" data-background={bgImg}>
          <div className="container">
            <div className="row">
              <div className="col-lg-5">
                <div className="main-headding">
                  <h1 className="title tg-element-title">{parse(title)}</h1>
                  <div className="space16"></div>
                  <p>{content}</p>

                  <div className="space30"></div>
                  <div className="buttons">
                    <Link className="theme-btn1" to={btnUrl}>{btnName} <span><i className="bi bi-arrow-right"></i>
                    </span></Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="hero1-all-images">
                  <div className="image1 ">
                    <img src={image1} alt="" />
                  </div>
                  <div className="image2">
                    <img src={image2} alt="" />
                  </div>
                  <div className="image3 shape-animaiton3">
                    <img src={shapeImage1} alt="" />
                  </div>
                  <div className="image4 shape-animaiton3">
                    <img src={shapeiamge2} alt="" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
};

export default HeroBanner1;




