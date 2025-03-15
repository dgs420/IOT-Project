// App.js
import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from './router/index.jsx';
import Layout from "./layout/index.jsx";

function App() {
    const [count, setCount] = useState(0);

    return (
        <Router>
            <Layout>
                <Routes>
                    {APP_ROUTES.map((route) => (
                        <Route
                            key={route.key}
                            path={route.path}
                            element={route.element}
                        />
                    ))}
                    <Route path='*' element={<p>Not Found</p>} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;