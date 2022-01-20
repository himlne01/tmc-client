import { useState, useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import UserContext from "./UserContext";
import '../index.css';

function User() {

    const history = useHistory();
    const userManager = useContext(UserContext);

    const handleError = (message) => {
        console.log(message);
    }

    const { userId } = useParams();

    const getUserAndRecipes = () => {

        fetch(`${process.env.REACT_APP_API_HOST}/api/recipe/user/${userId}`)
        .then(
            (response) => {
                //todo: handle 403
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 403) {
                    userManager.onLogout();
                    history.push("/")
                } else {
                    return Promise.reject("An error occurred");
                }

            }
        ).then(recipeList => {
            setRecipeList(recipeList);
        })
        .catch(handleError);

        fetch(`${process.env.REACT_APP_API_HOST}/api/user/${userId}`)
        .then(
            (response) => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 403) {
                    //todo: handle 403
                } else {
                    return response.json();
                }
            }
        ).then( (returnedUser) => {
            setUsername(returnedUser.username);
        })

    }

    useEffect(getUserAndRecipes, [userId, history, userManager])

    const [username, setUsername] = useState("");
    const [recipeList, setRecipeList] = useState([]);

    return(

        <main>
            <h1>{username}'s Shared Recipes</h1>
            <div className="row">
                {recipeList.map(recipe =>
                
                    <a key={recipe.recipeId} href={"/recipe/" + recipe.recipeId} className="recipe-box col-12 col-md-4">
                        <img src={recipe.imageRef} alt={recipe.recipeName} />
                        <span>{recipe.recipeName}</span>
                    </a>
                
                )}

            </div>
        </main>
    )
}

export default User;