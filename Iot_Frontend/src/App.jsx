import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Layout from "./layout/index.jsx";
import { APP_ROUTES } from './router/index.jsx';
import {ConfigProvider} from "antd";
import {NotFoundPage} from "./pages/NotFound/index.jsx";

export default function App() {
  return (

        <Router>
          <Routes>
            {APP_ROUTES.map((route) => (
                <Route
                    key={route.key}
                    path={route.path}
                    element={
                      route.path === '/login' ? (
                          route.element // Directly render Login without Layout
                      ) : (
                          <Layout>{route.element}</Layout> // Wrap other routes with Layout
                      )
                    }
                />
            ))}
              <Route path='*' element={<NotFoundPage />} /> {/* You can replace with a NotFound component */}
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
  );
}



