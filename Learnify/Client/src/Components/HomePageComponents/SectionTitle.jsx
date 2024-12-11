import parse from 'html-react-parser';
import '../../CSS/home.css';

const SectionTitle = ({Title}) => {
    return (
        <div>
            <h2 className="title tg-element-title">{parse(Title)}</h2>   
        </div>
    );
};

export default SectionTitle;