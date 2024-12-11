import SectionTitle from "./SectionTitle";
import PricingCard1 from "./PricingCard1";
import '../../CSS/home.css';

const Pricing1 = () => {
    return (

        <div className="pricing sp justify-content-center">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 m-auto text-center">
                <div className="heading1">
                    <SectionTitle
                        SubTitle="Our Pricing Plan"
                        Title="Explore Our Flexible Pricing Plans"
                    ></SectionTitle>
                </div>
              </div>
            </div>

            <div className="row  justify-content-center">
            <PricingCard1
                addClass="single-pricing-box"
                popularTitle=""
                title="Basic Plan"
                price="Free"
                content="limited!"
                featuretitle="Featured Included:"
                featurelist={[ 
                    '10M file size uploads.',
                    'only 3 topices to explore a day.',
                    '3 flashcards for each topic.',
                ]} 
                btnname="Try Now"
                btnUrl="#"
            ></PricingCard1>
            <PricingCard1
                addClass="single-pricing-box"
                popularTitle=""
                title="Premium Plan"
                price="$15"
                monthly="month"
                content="unlimited!"
                featuretitle="Featured Included:"
                featurelist={[ 
                    'up to 20M file uploads',
                    'explore unlimited number of new topics',
                    '10 flash for each topic',
                    'Explore more feature.',
                ]} 
                btnname="Buy Now"
                btnUrl="#"
            ></PricingCard1> 

            </div>
          </div>
        </div>
    );
};

export default Pricing1;