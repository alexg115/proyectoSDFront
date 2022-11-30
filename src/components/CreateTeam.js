import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { withRouter } from "react-router"

class CreateTeam extends Component {

    state = {
        users: [],
        userSelected: '',
        name: '',
        team: [],
        editing: false,
        _id: '',
        teams: [],
        pokemon: [],
        next: '',
        previous: ''
    }


    async componentDidMount() {
        const res = await axios.get('http://localhost:4000/api/users')
        this.setState({
            users: res.data,
            userSelected: res.data[0].username
        })

        const res2 = await axios.get('http://localhost:4000/api/teams')
        this.setState({
            teams: res2.data
        })


        if (this.props.match.params.id) {
            console.log("entre al edit")
            const res = await axios.get('http://localhost:4000/api/teams/' + this.props.match.params.id);
            this.setState({
                name: res.data.name,
                team: res.data.team,
                userSelected: res.data.user,
                editing: true,
                _id: this.props.match.params.id
            })
        }

        //Pokedex
        const res3 = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=6')
        this.setState({ pokemon: res3.data.results })
        this.setState({ next: res3.data.next })
        this.setState({ previous: res3.data.previous })

    }

    next = async (e) => {
        const res = await axios.get(this.state.next);
        this.setState({ pokemon: res.data.results })
        this.setState({ next: res.data.next })
        this.setState({ previous: res.data.previous })
        console.log(this.state)
    }

    previous = async (e) => {
        const res = await axios.get(this.state.previous);
        this.setState({ pokemon: res.data.results })
        this.setState({ next: res.data.next })
        this.setState({ previous: res.data.previous })
        console.log(this.state)
    }

    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        console.log(this)
    }

    changePokemon = (e) => {
        let poke = e.target.value.split("&")[0]
        let num = parseInt(e.target.value.split("&")[1])
        let team = this.state.team
        team[num] = poke
        this.setState({ team: team })
    }

    search = async (e) => {
        let pokemon = document.getElementById("pokemon-name").value;
        if (pokemon.length == 0) {
            return
        }
        
        const res = await axios.get("https://pokeapi.co/api/v2/pokemon/" + pokemon.toLowerCase());
        let poke = {
            name: res.data.name
        }
        let list = []
        list.push(poke)
        this.setState({
            pokemon: list
        })
    }

    saveTeam = async (e) => {
        console.log("save team")
        let newTeam = {
            name: this.state.name,
            user: this.state.userSelected,
            team: this.state.team
        }

        if(newTeam.name.length==0 || newTeam.team.length!=6){
            alert("You must fill all inputs")
            return
        }

        if (this.state.editing) {
            await axios.put("http://localhost:4000/api/teams/" + this.state._id, newTeam);
        }
        else {
            await axios.post("http://localhost:4000/api/teams", newTeam);
        }
        window.location.href = '/team';
    }

    edit = (e) => {
        window.location.href = '/team/' + e.target.value;
    }

    async getTeams(){
        const res = await axios.get('http://localhost:4000/api/teams')
        this.setState({teams: res.data})
    }

    deleteTeam = async (id) => {
        await axios.delete('http://localhost:4000/api/teams/' + id);
        this.getTeams();
    }

    render() {
        return (
            <div >
                <div className='alert alert-warning' hidden={!this.state.editing}>
                    <h5 style={{fontFamily:"Ketchum"}}>You are editing team {this.state.name}</h5> 
                    <Link className="btn btn-secondary" to={"/team"}>
                        New Team
                    </Link>
                </div>
                <div className='row'>

                    <div className='col-4'>

                        <input id="name" name="name" className='form-control' type="text" placeholder="Team's name" value={this.state.name} onChange={this.onInputChange} /> <br />
                        <select
                            className="form-control"
                            name="userSelected"
                            onChange={this.onInputChange}
                            value={this.state.userSelected}
                        >
                            {
                                this.state.users.map(user =>
                                    <option key={user._id} value={user.username}>
                                        {user.username}
                                    </option>)
                            }
                        </select> <br />
                        <input id="pokemon1" className='form-control inputPokemon' type="text" readOnly={true} placeholder='Pokemon 1' value={this.state.team[0]} /> <br />
                        <input id="pokemon2" className='form-control inputPokemon' type="text" readOnly={true} placeholder='Pokemon 2' value={this.state.team[1]} /> <br />
                        <input id="pokemon3" className='form-control inputPokemon' type="text" readOnly={true} placeholder='Pokemon 3' value={this.state.team[2]} /> <br />
                        <input id="pokemon4" className='form-control inputPokemon' type="text" readOnly={true} placeholder='Pokemon 4' value={this.state.team[3]} /> <br />
                        <input id="pokemon5" className='form-control inputPokemon' type="text" readOnly={true} placeholder='Pokemon 5' value={this.state.team[4]} /> <br />
                        <input id="pokemon6" className='form-control inputPokemon' type="text" readOnly={true} placeholder='Pokemon 6' value={this.state.team[5]} /> <br />
                        <button className='btn btn-danger' style={{ fontSize: "50px", fontFamily: "Ketchum" }} onClick={this.saveTeam}>SAVE</button>
                    </div>

                    <div className='col'>

                        <div className="row" style={{ margin: 10 }}>
                            <div className="col-3">
                                <input type="search" id="pokemon-name" className="form-control" placeholder="Name or number" />
                            </div>
                            <div className="col">
                                <button type="button" className="btn btn-warning" onClick={this.search}>Search</button>
                            </div>
                        </div>
                        <div className="card" id="lista">
                            <div className="card-body">
                                <div className="row d-flex justify-content-center">

                                    {
                                        this.state.pokemon.map(pokemon => (
                                            <div className="card" style={{ width: "18rem", margin: "5px" }} key={pokemon.name}>
                                                <div className="card-body">
                                                    <h5 className="card-title">{pokemon.name}</h5>
                                                    <p className="card-text">Select as pokemon:</p>
                                                    <button className='btn btn-primary' onClick={this.changePokemon} value={pokemon.name + "&" + 0}>1</button>
                                                    <button className='btn btn-primary' onClick={this.changePokemon} value={pokemon.name + "&" + 1}>2</button>
                                                    <button className='btn btn-primary' onClick={this.changePokemon} value={pokemon.name + "&" + 2}>3</button>
                                                    <button className='btn btn-primary' onClick={this.changePokemon} value={pokemon.name + "&" + 3}>4</button>
                                                    <button className='btn btn-primary' onClick={this.changePokemon} value={pokemon.name + "&" + 4}>5</button>
                                                    <button className='btn btn-primary' onClick={this.changePokemon} value={pokemon.name + "&" + 5}>6</button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="d-flex justify-content-end" >
                                    <nav aria-label="...">
                                        <ul className="pagination">
                                            <li className={`page-item ${this.state.previous ? "" : "disabled"}`}>
                                                <button className="page-link" onClick={this.previous}>Previous</button>
                                            </li>
                                            <li className={`page-item ${this.state.next ? "" : "disabled"}`}>
                                                <button className="page-link" onClick={this.next}>Next</button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <div className='row'>
                    <h1 className="d-flex justify-content-center" style={{ fontFamily: "Ketchum", color: "yellow" }}>Teams</h1>
                    <div className="card" style={{ margin: "5px" }}>
                        <div className="card-body">


                            <table className="table table-danger table-striped">
                                <thead className="">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Trainer</th>
                                        <th scope="col">Team</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        this.state.teams.map(team => (
                                            <tr>
                                                <th scope="row">{team.name}</th>
                                                <td>{team.user}</td>
                                                <td>{team.team.map(poke => (
                                                    <span>{poke}, </span>
                                                ))}</td>
                                                <td>
                                                    <button className="btn btn-warning" value={team._id} onClick={this.edit}>Edit</button>
                                                    <button className="btn btn-danger" onClick={() => this.deleteTeam(team._id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>

            </div>

        )
    }
}

export default withRouter(CreateTeam);