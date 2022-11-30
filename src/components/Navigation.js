import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Navigation extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light menu">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src='https://img.icons8.com/color/480/pokedex.png' height={"50px"} />
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/pokedex"> Pokedex </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/user"> Trainers </Link>
                            </li>
                            <li className="nav-item d-flex justify-content-end">
                                <Link className="nav-link" to="/team"> Teams </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        )
    }
}
