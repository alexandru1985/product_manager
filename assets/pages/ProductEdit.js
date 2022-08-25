import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Swal from 'sweetalert2';
import axios from 'axios';
  
function ProductEdit() {
    const [id, setId] = useState(useParams().id);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState('');
    const [isInvalid, setIsInvalid] = useState('');
    const [dInline, setDInline] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${window.token}`
            }
        }).then(function(response) {
            let product = response.data;
            setName(product.name);
            setDescription(product.description);
        }).catch(function(error) {
            Swal.fire({
                icon: 'error',
                title: 'An Error Occured!',
                showConfirmButton: false,
                timer: 1500
            });
        });
    }, []);

    const handleUpdate = () => {
        setIsSaving(true);
        axios.patch(`/api/products/${id}`, {
            name: name,
            description: description
        }, {
            headers: {
                'Authorization': `Bearer ${window.token}`
            }
        }).then(function(response) {
            if (response.data.errors === true) {
                setErrors(response.data);
                setIsInvalid('is-invalid');
                setDInline('d-inline');
                setIsSaving(false);
            }
            
            if (response.data.errors !== true) {
                setIsSaving(false);
                setIsInvalid('');
                setDInline('');

                Swal.fire({
                    icon: 'success',
                    title: 'Product updated successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });

                setTimeout(() => {
                    navigate('/product/list');
                }, 1500);
            }
        }).catch(function(error) {
            Swal.fire({
                icon: 'error',
                title: 'An Error Occured!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false);
        });
    }
  
    return (
        <Layout>
            <div className="container">
                <div className="card shadow">
                    <div class="text-center border-bottom">
                        <h2 className="text-center mt-2 mb-3">Edit Product</h2>
                    </div>
                    <div className="card-header">
                        <Link 
                            className="btn btn-primary"
                            to="/product/list">View All Products
                        </Link>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input 
                                    onChange={(event)=>{setName(event.target.value)}}
                                    value={name}
                                    type="text"
                                    className={`form-control ${errors.name ? isInvalid : ''}`}
                                    id="name"
                                    name="name"/>
                                    <div className={`invalid-feedback ${errors.name ? dInline : ''}`}>
                                        {errors.name}
                                    </div>  
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea 
                                    value={description}
                                    onChange={(event)=>{setDescription(event.target.value)}}
                                    className={`form-control ${errors.description ?  isInvalid : ''}`}
                                    id="description"
                                    rows="3"
                                    name="description">
                                </textarea>
                                <div className={`invalid-feedback ${errors.description ? dInline : ''}`}>
                                    {errors.description}
                                </div> 
                            </div>
                            <button 
                                disabled={isSaving}
                                onClick={handleUpdate} 
                                type="button"
                                className="btn btn-primary mt-3">
                                Update Product
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
  
export default ProductEdit;