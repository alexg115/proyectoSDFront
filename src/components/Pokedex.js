import React, { Component } from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

export default class Pokedex extends Component {

    state = {
        pokemon: [],
        next : '',
        previous : '',
        pokeSearch: ''
    }

    async componentDidMount(){
        const res = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=12')
        this.setState({pokemon: res.data.results})
        this.setState({next: res.data.next})
        this.setState({previous: res.data.previous})
    }

    componentDidMount(){
        this.getPokemon()
    }

    async getPokemon(){
        const res = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=12')
        this.setState({pokemon: res.data.results})
        this.setState({next: res.data.next})
        this.setState({previous: res.data.previous})
        console.log(this.state) 
    }

    next = async (e) =>{
        const res = await axios.get(this.state.next);
        this.setState({pokemon: res.data.results})
        this.setState({next: res.data.next})
        this.setState({previous: res.data.previous})
        console.log(this.state) 
    }

    previous = async (e) =>{
        const res = await axios.get(this.state.previous);
        this.setState({pokemon: res.data.results})
        this.setState({next: res.data.next})
        this.setState({previous: res.data.previous})
        console.log(this.state) 
    }

    search = (e) => {
        let pokemon = document.getElementById("pokemon-name").value.toLowerCase();
        this.setState({pokeSearch:e.target.value.toLowerCase()})
        console.log(this.state)
    }

    render() {
        return (
            <div>
                <div class="row" style={{margin:10}}>
                    <div class="col-3">
                        <input type="search" id="pokemon-name" class="form-control" placeholder="Name or number" onChange={this.search}/>
                    </div>
                    <div class="col">
                    <Link className="btn btn-warning" to={"/pokedex/" + this.state.pokeSearch}>
                        Search
                    </Link>
                    
                    </div>
                </div>
                <div class="card" id="lista">
                    <div class="card-body">
                        <div className="row d-flex justify-content-center">

                            {
                                this.state.pokemon.map(pokemon =>(
                                <div class="card" style={{width:"18rem", margin:"5px"}} key={pokemon.name}>    
                                    <div class="card-body">
                                        <h5 class="card-title"></h5>
                                        <p class="card-text d-flex justify-content-center" style={{fontSize:"40px"}}>{pokemon.name}</p>
                                        <Link class="btn btn-danger d-flex justify-content-center" to={"/pokedex/" + pokemon.url.split("pokemon")[1].split("/")[1]}>
                                            Go
                                        </Link>
                                    </div>
                                </div>
                                ))
                            }
                        </div>
                        <div class="d-flex justify-content-end" >
                            <nav aria-label="...">
                            <ul class="pagination">
                                <li class={`page-item ${this.state.previous ? "" : "disabled"}`}>
                                <button class="page-link" onClick={this.previous}>Previous</button>
                                </li>
                                <li class={`page-item ${this.state.next ? "" : "disabled"}`}>
                                <button class="page-link" onClick={this.next}>Next</button>
                                </li>
                            </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
