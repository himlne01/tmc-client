import './App.css';
import React, { useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import UserContext from "./components/UserContext"
import Login from './components/Login';
import ListRecipe from './components/ListRecipe';
import Register from './components/Register';
import AddRecipe from './components/AddRecipe';
import NotFound from './components/NotFound';
import User from './components/User';
import Recipe from './components/Recipe';
import EditRecipe from './components/EditRecipe';

function App() {

  const [currentUser, setCurrentUser] = useState(null);


  const onLogout = () => {
    localStorage.removeItem("jwt_token");
    setCurrentUser(null);
  }

  const userManager = {
    currentUser,
    setCurrentUser,
    onLogout
  }

  useEffect( () => {
    const currentJwt = localStorage.getItem("jwt_token");
    if (currentJwt){
      const userManager = jwtDecode(currentJwt);

      if (currentUser == null || userManager.sub !== currentUser.sub ) {
        setCurrentUser(userManager);
      }

    }
  }, [currentUser]

  )

  return (
    <BrowserRouter>
      <UserContext.Provider value={userManager}>
      <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item bold">
                <a className="nav-link" href="/">Too Many Cooks</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/listRecipe">View Recipes</a>
              </li>
            </ul>
          </div>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                {currentUser ? (
                    <>
                      <button type="button" className="btn btn-secondary mr-1" onClick={onLogout}>{"Log Out " + currentUser.sub}</button>
                    </>
                  ) : (
                    <a className="nav-link mr-2" href="/login" role="button">
                      Login
                    </a>
                )}
              </li>
            </ul>
          </div>
        </nav> 
      </>
      <Switch>
        <Route path="/login">
          <Login/>
        </Route>
        <Route path="/register">
          <Register/>
        </Route>
        <Route path="/listRecipe">
          <ListRecipe/>
        </Route>
        <Route path="/add">
          <AddRecipe/>
        </Route>
        <Route path="/edit/:recipeId">
          <EditRecipe/>
        </Route>
        <Route path="/user/:userId"> 
            <User/>
        </Route>
        <Route path="/recipe/:recipeId">
            <Recipe/>
        </Route>
        <Route exact path="/">
          <main>
            <h1 className="text-center mt-2">Too Many Cooks</h1>
            <h4 className="text-center text-muted">Welcome to an online cookbook!</h4>
            <div className="text-center">
              <img
                src="https://images-platform.99static.com//yvnDP1silckAz-nLhdsfaRc6yZc=/0x0:1000x1000/fit-in/500x500/99designs-contests-attachments/90/90696/attachment_90696588"
                className="img-thumbnail"
                alt="Cookbook Logo"
              />
            </div>
          </main>
          
        </Route>
        <Route>
          <NotFound/>
        </Route>
        
      </Switch>
      </UserContext.Provider>
    </BrowserRouter>
  );
  
}

export default App;
