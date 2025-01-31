import "../../CSS/course.css";
import React, { useMemo } from "react";
import {Delete,Edit} from '@mui/icons-material'
import MenuBook from "@mui/icons-material/MenuBook";

const CourseCard = ({title, description, tag, courseId,onUpdateParent,onOpenCourse }) => {
  // Generate a random gradient and memoize it
  const randomGradient = useMemo(() => {
    const gradients = [
      "linear-gradient(to right, #A2DDF4, #D7EEFA)", // Soft blue gradient
      "linear-gradient(to right, #FBC8D9, #FFD8E6)", // Soft pink gradient
      "linear-gradient(to right, #A2DDF4, #FBC8D9)", // Light blue to soft pink
      "linear-gradient(to right, #D7EEFA, #FFD8E6)", // Very light blue to very light pink
      "linear-gradient(to right, #CDE9F7, #F9D9E8)", // Gentle blue to pink
      "linear-gradient(to right, #B4E0F9, #FADCEB)", // Vibrant light blue to pink
      "linear-gradient(to right, #CDEBFF, #FFE4F2)", // Sky blue to pale pink
      "linear-gradient(to right, #AEDFF5, #FBD8E9)", // Baby blue to baby pink
      "linear-gradient(to right, #C0E4FA, #FBE6F3)", // Light aqua to pale pink
      "linear-gradient(to right, #AEE4FA, #FFEDF7)", // Bright blue to pale pink
      "linear-gradient(to bottom, #A2DDF4, #FBC8D9)", // Vertical light blue to pink
      "linear-gradient(to bottom, #D7EEFA, #FFD8E6)", // Vertical soft blue to pink
      "linear-gradient(to bottom, #CDEBFF, #FFE4F2)", // Vertical sky blue to pale pink
      "linear-gradient(to bottom, #B4E0F9, #FADCEB)", // Vertical vibrant light blue to pink
      "linear-gradient(to bottom, #AEDFF5, #FBD8E9)", // Vertical baby blue to pink
      "linear-gradient(135deg, #A2DDF4, #FBC8D9)", // Diagonal light blue to pink
      "linear-gradient(135deg, #D7EEFA, #FFD8E6)", // Diagonal soft blue to pink
      "linear-gradient(135deg, #CDEBFF, #FFE4F2)", // Diagonal sky blue to pale pink
      "linear-gradient(135deg, #B4E0F9, #FADCEB)", // Diagonal vibrant light blue to pink
      "linear-gradient(135deg, #AEDFF5, #FBD8E9)", // Diagonal baby blue to pink
      ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  }, []);

  const handleChange = (course, isEdit) => {
    onUpdateParent(course, isEdit);
  };

  const handleOpenCourseClick = (courseId,title)=>{
    onOpenCourse(courseId,title)
  }

  return (
    <div
      className="course-card-new"
      style={{
        background: "#73d0ff",
        position: "relative", // Needed for positioning the icons
      }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
        <div className="card-icons">
        <button className="icon-button" onClick={()=>handleOpenCourseClick(courseId,title)}>
        <MenuBook style={{ color: "black" }} />
        </button>
        <button className="icon-button" onClick={() => handleChange({ id: courseId, title: title, description: description, tag: tag, }, true)}>
          <Edit style={{ color: "black" }}/>
        </button>
        <button onClick={() => handleChange({ id: courseId, title: title, description: description}, false)} className="icon-button"><Delete style={{ color: "black" }}/></button>
      
      </div>
    </div>
  );
  };

export default CourseCard;
