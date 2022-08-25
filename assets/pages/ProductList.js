import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import GetProducts from '../components/GetProducts'
 
function ProductList() {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    }
    return (
        <Layout>
           <div className="container">
                <div className="card shadow">
                <div className="d-flex justify-content-between border-bottom">
                    <div><a className="btn btn-primary invisible">Logout</a></div>
                    <div className=""><h2 className="text-center mt-2 mb-3">Product Manager</h2></div>
                    <div className="me-3 mt-2 pt-1"><button className="btn btn-primary" onClick={logout} href="/logout">Logout</button></div>
                </div>
                <div className="card-header">
                    <Link 
                        className="btn btn-primary"
                        to="/product/create">Create New Product
                    </Link>
                </div>
                <div className="card-body">
                    <GetProducts/>  
                </div>
                </div>
            </div>
        </Layout>
    );
}
  
export default ProductList;