import { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import UserContext from "./UserContext";

function ListRecipe() {
        
    const history = useHistory();
    const userManager = useContext(UserContext);

    const defaultCuisineList = [
        {
            cuisineId: 1,
            name: "British"
        },
        {
            cuisineId: 2,
            name: "Fusion"
        }
    ]

    const defaultRecipeList = [
        {
            recipeId: 1,
            name: "Chicken Dinner",
            ingredients: ["Chicken", "Dinner"],
            cuisine: "British",
            user: "auren@dev.com"
        },
        {
            recipeId: 2,
            name: "Fettucine Alfredo",
            ingredients: ["Parmesan", "Butter", "Oil", "Cream", "Garlic", "Fettucine"],
            cuisine: "Fusion",
            user: "spencer@dev.com"
        }
    ]

    const [recipeList, setRecipeList] = useState([]); //useState(defaultRecipeList);
    const [cuisineList, setCuisineList] = useState([]); //useState(defaultCuisineList);

    const handleError = (message) => {
        console.log(message);
    }

    const getCuisineAndRecipeList = () => {

        fetch("http://localhost:8080/api/cuisine")
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
        ).then(cuisineList => {
            setCuisineList(cuisineList);
        })
        .catch(handleError);

        fetch("http://localhost:8080/api/recipe")
        .then(
            (response) => {
                //todo: handle 403
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 403) {
                    userManager.onLogout();
                    history.push("/Login")
                } else {
                    return Promise.reject("An error occurred");
                }

            }
        ).then(recipeList => {
            setRecipeList(recipeList);
        })
        .catch(handleError);

    }

    const findByCuisine = () => {
        console.log("hello");
        // fetch("http://localhost:8080/api/recipe/cuisine")
        // .then(
        //     (response) => {
        //         //todo: handle 403
        //         if (response.status === 200) {
        //             return response.json();
        //         } else if (response.status === 403) {
        //             userManager.onLogout();
        //             history.push("/Login")
        //         } else {
        //             return Promise.reject("An error occurred");
        //         }

        //     }
        // ).then(recipeList => {
        //     setRecipeList(recipeList);
        // })
        // .catch(handleError);
    }

    useEffect(getCuisineAndRecipeList, [userManager])

    return (

        <main>
            { userManager ? 
                (userManager.currentUser ?
                    (<a type="button" href="/add">Create a new recipe</a>)           
                    : null)
                : null}
            <h1>Recipes</h1>
            <form onSubmit={findByCuisine}>
                <label>Filter by cuisine:</label>
                <select>
                    {cuisineList.map(cuisine =>   
                    <option value={cuisine.cuisineId} key={cuisine.cuisineId}>{cuisine.cuisineName}
                    </option>
                    )}
                </select>
                <button className="btn btn-sm" type="submit">Submit</button>
            </form>
            <div className="row">
                {recipeList.map(recipe => 
                    <a href={"/recipe/" + recipe.recipeId} className="recipe-box col-12 col-md-4" key={recipe.recipeId}>
                        <img src={recipe.imageRef} alt={recipe.recipeName} />
                        <span>{recipe.recipeName}</span>
                    </a>
                )}
            </div>
        </main>
    )

}

export default ListRecipe;