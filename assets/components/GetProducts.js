import React, { Component } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";
import $ from "jquery";
import 'datatables.net-bs5'

class GetProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    async componentDidMount() {
        await this.fetchProductsList();
        await this.initializeDatatable();
        await this.selectProductRow();
    }

    async fetchProductsList() {
        await axios.get('/api/products', {
            headers: {
                'Authorization': `Bearer ${window.token}`
            }
        }).then((response) => {
            this.setState({
                data: response.data
            });
        });
    }

    initializeDatatable() {
        $("#products").DataTable({
            stateSave: true,
            order: [
                [0, 'asc']
            ],
        });
        $("#thead-products").removeClass("d-none");
    }

    async deleteProduct(id) {
        await Swal.fire({
            title: 'Do you want to delete product?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#192841',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/products/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${window.token}`
                        }
                    })
                    .then(function(response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Product deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        })

                    })
                    .catch(function(error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'An Error Occured!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    });
            }
        });
        await this.deleteProductRow();
    }

    selectProductRow() {
        var table = $('#products').DataTable();

        $('#products tbody').on('click', 'tr', function() {
            if ($(this).hasClass('selected-product-row')) {} else {
                table.$('tr.selected-product-row').removeClass('selected-product-row');
                $(this).addClass('selected-product-row');
            }
        });
    }

    deleteProductRow() {
        var table = $('#products').DataTable();
        table.rows('.selected-product-row').remove().draw(false);
    }
    
    render() {
        return (
            <table id="products" className="table table-striped">
                <thead id="thead-products" className="d-none">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.map((product, key) => {
                        return (
                            <tr key={key}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>
                                <Link to={`/product/show/${product.id}`}>
                                    <i className="bi bi-file-earmark-text-fill custom-icon me-1"></i>
                                </Link>
                                <Link to={`/product/edit/${product.id}`}>
                                    <i className="bi bi-pencil-fill custom-icon me-1"></i>
                                </Link>
                                    <i
                                      className="bi bi-trash-fill custom-icon"
                                      onClick={() => this.deleteProduct(product.id)}
                                    ></i>
                                </td>
                            </tr>
                          );
                      })}
                  </tbody>
              </table>
            );
        }
    }
    
    export default GetProducts;
    