import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Swal from 'sweetalert2';
import axios from 'axios';
  
function ProductCreate() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState('');
    const [isInvalid, setIsInvalid] = useState('');
    const [dInline, setDInline] = useState('');
    const navigate = useNavigate();

    const handleSave = () => {
        setIsSaving(true);

        axios.post('/api/products', {
                name: name,
                description: description
            }, {
                headers: {
                    'Authorization': `Bearer ${window.token}`,
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
                        title: 'Product saved successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    setTimeout(() => {
                        navigate('/product/list');
                    }, 1500);
                }
            })
            .catch(function(error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occured!',
                    showConfirmButton: false,
                    timer: 1500
                });
                setIsSaving(false);
            });
    }

    return (
        <Layout>
            <div className="container">
                <div className="card shadow">
                <div class="text-center border-bottom">
                    <h2 className="text-center mt-2 mb-3">Create New Product</h2>
                </div>
                    <div className="card-header">
                        <Link 
                            className="btn btn-primary"
                            to="/product/list">View All Products
                        </Link>
                    </div>
                    <div className="card-body">
                        <form className="needs-validation">
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
                                onClick={handleSave} 
                                type="button"
                                className="btn btn-primary mt-3">
                                    Save Product
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
  
export default ProductCreate;