import CustomerDashboard from "./Components/CustomerDashboard.jsx";


const Home = () => {
    const role = localStorage.getItem('role');

    return (
        <>
            <CustomerDashboard />
        </>
    );
};

export default Home;


