import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductCreate from "./pages/ProductCreate";
import ProductEdit from "./pages/ProductEdit";
import ProductShow from "./pages/ProductShow";
import Login from "./pages/Login";

function Main() {
    setToken();
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route 
                    path="/product/list"
                    element={window.token == null ? <Navigate replace to="/" />: <ProductList />}
                />
                <Route 
                    path="/product/create" 
                    element={window.token == null ? <Navigate replace to="/" />: <ProductCreate />}
                />    
                <Route 
                    path="/product/edit/:id" 
                    element={window.token == null ? <Navigate replace to="/" />: <ProductEdit />}
                />
                <Route 
                    path="/product/show/:id" 
                    element={window.token == null ? <Navigate replace to="/" />: <ProductShow />}
                />
            </Routes>
        </Router>
    );
}
   
export default Main;

function setToken() {
    window.token = window.localStorage.getItem('token');
}

function setReact() {
    ReactDOM.render(<Main />, document.getElementById('app'));
}

async function setApp() {
    await setToken();
    await setReact();
}

if (document.getElementById('app')) {
    setApp();
}