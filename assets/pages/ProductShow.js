import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import axios from 'axios';
  
function ProductShow() {
    const [id, setId] = useState(useParams().id);
    const [product, setProduct] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        axios.get(`/api/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${window.token}`
            }
        }).then(function(response) {
            setProduct(response.data);
        }).catch(function(error) {
            console.log(error);
        });
    }, []);
  
    return (
        <Layout>
           <div className="container">
                <div className="card shadow">
                    <div class="text-center border-bottom">
                        <h2 className="text-center mt-2 mb-3">Show Product</h2>
                    </div>
                    <div className="card-header">
                        <Link 
                            className="btn btn-primary"
                            to="/product/list"> View All Products
                        </Link>
                    </div>
                    <div className="card-body">
                        <b className="text-muted">Name</b>
                        <p>{product.name}</p>
                        <b className="text-muted">Description</b>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
  
export default ProductShow;