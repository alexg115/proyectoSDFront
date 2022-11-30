import React, { Component } from 'react'
import axios from 'axios'

export default class CreateUser extends Component {

    state = {
        users: [],
        username: ''
    }

    async componentDidMount(){
        const res = await axios.get('http://localhost:4000/api/users');
        this.setState({users: res.data});
        this.getUsers();
        console.log(this.state.users);
    }

    getUsers = async () => {
        const res = await axios.get('http://localhost:4000/api/users');
        this.setState({users: res.data});
    }

    onSubmit = async () =>{
        let trainer = document.getElementById("trainer").value;
        
        if(trainer.length==0){
            return
        }

        for(let i=0; i<this.state.users.length; i++){
            if(this.state.users[i].username==trainer){
                alert("This trainer already registered")
                return
            }
        }

        await axios.post('http://localhost:4000/api/users', {
            username: trainer
        })
        this.setState({username: ''});
        this.getUsers();
        alert("Success!")
        document.getElementById("trainer").value="";
    }

    deleteUser = async (id) => {
        await axios.delete('http://localhost:4000/api/users/' + id);
        this.getUsers();
    }

    render() {
        return (
            <div>

                 <div class="card" id="lista" style={{margin:"100px"}}>
                    <div class="card-body ">

                    <div class="card" id="login" style={{margin:"10px"}}>
                        <div class="card-body ">
                            <h1 id="tituloLogin" className="d-flex justify-content-center">Create new trainer</h1>
                            <br />
                            <input type="text" id="trainer" class="form-control" placeholder="Trainer's name" style={{fontSize:"35px"}}/>
                            <br />
                            <button className='btn btn-danger' style={{fontSize:"25px"}} onClick={this.onSubmit}> Save</button>
                        </div>
                    </div>

                    </div>
                </div>

                <div class="card" style={{margin:"5px"}}>
                    <div class="card-body " id='lista'>
                        <ul className="list-group">
                        {
                            this.state.users.map(user => (
                                <li 
                                    className="list-group-item list-group-item-action" 
                                    key={user._id}
                                    onDoubleClick={() => this.deleteUser(user._id)}
                                    >
                                    {user.username}
                                </li>)

                            )
                        }
                    </ul>
                    </div>
                </div>

            </div>
        )
    }
}
