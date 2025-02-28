import { Route, Routes } from "react-router-dom";
import Counter from "./Counter";
import LoginForm from "../pages/Login";
import Register from "../pages/Register";

const AppRouter = () => {
    return (
        <Routes>
        <Route path="/" element={<Counter />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <EmployeeList />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    );
  };
  
  export default AppRouter;