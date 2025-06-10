import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Layout from "./layout/index.jsx";
import { APP_ROUTES } from "./router/index.jsx";
import { NotFoundPage } from "./pages/NotFound/index.jsx";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ProtectedRoute from "./common/components/ProtectedRoute.jsx";

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Router>
        <Routes>
          {APP_ROUTES.map((route) => {
            const isPublic =
              route.path === "/login" || route.path === "/register" || route.path === "/forbidden";

            return (
              <Route
                key={route.key}
                path={route.path}
                element={
                  isPublic ? (
                    route.element
                  ) : (
                    <ProtectedRoute>
                      <Layout>{route.element}</Layout>
                    </ProtectedRoute>
                  )
                }
              />
            );
          })}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </LocalizationProvider>
  );
}
