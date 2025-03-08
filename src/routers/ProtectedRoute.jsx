// // src/components/ProtectedRoute.js
// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ children }) => {
//   const auth = useSelector((state) => state.auth.message);
//   if (auth===null) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// export default ProtectedRoute;
