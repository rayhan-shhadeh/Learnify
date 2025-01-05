import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface CoursesContextType {
  mycourses: any[];  
  setmyCourses: Dispatch<SetStateAction<any[]>>;
  selectedCourseId: string | null;  // Add a selectedCourseId to store the selected course's ID
  setSelectedCourseId: Dispatch<SetStateAction<string | null>>;  // Add setter for selectedCourseId
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

interface CoursesProviderProps {
  children: ReactNode;
}

export const CoursesProvider: React.FC<CoursesProviderProps> = ({ children }) => {
  const [mycourses, setmyCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);  // State to store selected course ID

  return (
    <CoursesContext.Provider value={{ mycourses, setmyCourses, selectedCourseId, setSelectedCourseId }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = (): CoursesContextType => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};
// Export the provider as default
export default CoursesProvider;

// Optionally export the context if needed elsewhere
export { CoursesContext };