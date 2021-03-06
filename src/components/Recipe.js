import { useState, useContext, useEffect, React } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import UserContext from "./UserContext";
import Popup from 'reactjs-popup';
import '../index.css';
// import jwtDecode from "jwt-decode";

function Recipe() {

    const history = useHistory();
    const userManager = useContext(UserContext);
    
    const { recipeId } = useParams();

    const getRecipe = () => {
        
        fetch(`${process.env.REACT_APP_API_HOST}/api/recipe/` + recipeId)
        .then(
            (response) => {
                if (response.status === 200) {
                    console.log("in the promise!");
                    return response.json();
                } else if (response.status === 403) {
                    //todo: handle 403
                } else if (response.status === 404) {
                    history.push("/notFound")
                } else {
                    return response.json();
                }
            }
        ).then(returnedRecipe => {
            
            // console.log(returnedRecipe);
            setRecipe(returnedRecipe);
        })
    }

    const shouldDelete = (e) => {
        console.log("in should delete");

        e.preventDefault();
    
        const jwt = localStorage.getItem("jwt_token");

        fetch(`${process.env.REACT_APP_API_HOST}/api/recipe/${recipe.recipeId}`,
        {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + jwt }
        }
        ).then((response) => {
            if (response.status !== 204) {
                console.log(response);
            } else {
                history.push("/listRecipe");
            }
        }
        );

    }
    
    const defaultRecipe = {
        recipeName: "",
        description: "",
        imageRef: "",
        ingredientsList: [{},{}]
    }

    const [recipe, setRecipe] = useState(defaultRecipe);

    useEffect(getRecipe, [history, recipeId])

    return(
        <main>
            <div>
                
                <a href="/listRecipe">Back to Recipes</a>
                
                <h1 className="text-center">{recipe.recipeName}</h1>
                <img className="recipe-img" src={recipe.imageRef} alt={recipe.imageRef} referrerPolicy="no-referrer"></img>
                {<ul id="ingredientsList">
                    {recipe.ingredientsList.map(ingredient =>
                        <li key={ingredient.ingredientId}>
                            {ingredient.quantity} {ingredient.ingredientName}
                        </li>
                    )}
                </ul>}
                <p>{recipe.recipeDescription}</p>
                <div className="row mt-4">
                    <p className="col-lg-10 col-sm-9 col-8">Posted on {recipe.datePosted} by <a href={"../user/" + recipe.userId}>{recipe.username}</a></p>
                    { userManager ? 
                        (userManager.currentUser ? 
                            (userManager.currentUser.sub ? 
                                (userManager.currentUser.sub === recipe.username ? 
                                    ( <>
                                    <div className="col-lg-2 col-sm-3 col-4">
                                        <a className="btn-sm btn-primary mr-1" href={"/edit/" + recipe.recipeId}>Edit</a>
                                        
                                        <Popup trigger={
                                            <button className="btn-sm btn-danger ml-1" type="button" id="deleteButton">Delete</button>
                                            } position="bottom right">
                                            <p className="inline mr-2">Are you sure you want to delete this recipe?</p>
                                            <button className="btn-sm btn-danger inline" id="confirmButton" onClick={shouldDelete}>Confirm</button>
                                        </Popup>
                                    </div>
                                    </> )
                                     : null)
                                : null)
                            : null)
                        : null}
                </div>
            </div>
        </main>
    )

}

export default Recipe;