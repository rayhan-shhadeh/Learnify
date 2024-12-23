import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the context state
interface CoursesContextType {
  courses: any[];  // Adjust 'any' to the appropriate type for your course objects
  setCourses: Dispatch<SetStateAction<any[]>>;  // Adjust 'any' if necessary
}

// Create the context with a default value of undefined
const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

// Define the provider's props
interface CoursesProviderProps {
  children: ReactNode;
}

// Provider component
export const CoursesProvider: React.FC<CoursesProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<any[]>([]);  // Adjust 'any' if you have a defined type for courses

  return (
    <CoursesContext.Provider value={{ courses, setCourses }}>
      {children}
    </CoursesContext.Provider>
  );
};

// Hook to use the context
export const useCourses = (): CoursesContextType => {
  const context = useContext(CoursesContext);
  
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  
  return context;
};
