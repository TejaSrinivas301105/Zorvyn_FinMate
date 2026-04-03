import { useRoutes, Navigate } from 'react-router'
import './App.css'
import DashBoard from './Pages/DashBoard';
import Transactions from './Pages/Transactions';
import Insights from './Pages/Insights';
import NavBar from './Components/NavBar';
import { AppProvider } from './context/AppContext';

function CustomRoutes() {
    const elements = useRoutes([
        { path: '/',             element: <Navigate to="/DashBoard" replace /> },
        { path: '/DashBoard',    element: <DashBoard /> },
        { path: '/Transactions', element: <Transactions /> },
        { path: '/Insights',     element: <Insights /> },
    ]);
    return elements;
}

function App() {
    return (
        <AppProvider>
            <NavBar />
            <CustomRoutes />
        </AppProvider>
    );
}

export default App
