import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Pokedex from './components/Pokedex';
import PokedexPage from './components/PokedexPage';
import CreateUser from './components/CreateUser';
import CreateTeam from './components/CreateTeam';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Navigation/>
      <div id="contenedor" className="container p-4">
      <Switch>
        <Route exact path={["/","/pokedex"]}  component={Pokedex} />
        
        <Route path="/pokedex/:page" component={PokedexPage}/>

        <Route path="/user" component={CreateUser}/>
        
        <Route exact path="/team" component={CreateTeam}/>

        <Route path="/team/:id" key="2" component={CreateTeam}/>

      </Switch>
      </div>
    </Router>
  );
}

export default App;
