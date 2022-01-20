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
    const [cuisineId, setCuisineId] = useState(25);
    const [keyword, setKeyword] = useState("");

    const assignCuisineId = (e) => {
        setCuisineId(e.target.value);
    }

    const assignKeyword = (e) => {
        setKeyword(e.target.value);
    }

    const handleError = (message) => {
        console.log(message);
    }

    const clearFilters = () => {
        getCuisineAndRecipeList();
        setCuisineId(25);
        setKeyword("");
    }

    const getCuisineAndRecipeList = () => {

        fetch(`${process.env.REACT_APP_API_HOST}/api/cuisine`)
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

        fetch(`${process.env.REACT_APP_API_HOST}/api/recipe`)
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
        fetch(`${process.env.REACT_APP_API_HOST}/api/recipe/cuisine/` + cuisineId)
        .then(
            (response) => {
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

    const findByKeyword = () => {
        fetch(`${process.env.REACT_APP_API_HOST}/api/recipe/name/` + keyword)
        .then(
            (response) => {
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

    useEffect(getCuisineAndRecipeList, [userManager])

    return (

        <main>
            { userManager ? 
                (userManager.currentUser ?
                    (<a type="button" href="/add">Create a new recipe</a>)           
                    : null)
                : null}
            <h1>Recipes</h1>
            <div className="row">
                <form onSubmit={findByCuisine} className="col">
                    <label>Filter by cuisine:</label>
                    <select id="cuisine-select" onChange={assignCuisineId} value={cuisineId}>
                            {cuisineList.map(cuisine =>   
                            <option key={cuisine.cuisineId} value={cuisine.cuisineId}>{cuisine.cuisineName}
                            </option>
                            )}
                        </select>
                    <button className="btn btn-sm p-0" onClick={findByCuisine} type="button">Submit</button>
                </form>
                <form onSubmit={findByKeyword} className="col">        
                    <label className="">Search:</label>
                    <input className="form-control" id='keyword' value={keyword} onChange={assignKeyword}/>
                    <button className="btn btn-sm p-0" onClick={findByKeyword} type="button">Go</button>
                </form>
            </div>
            <button className="btn btn-sm btn-warning mb-4 mt-3" onClick={clearFilters} type="button">Clear Filters</button>
            <div className="row">
                {recipeList.map(recipe => 
                    <a href={"/recipe/" + recipe.recipeId} className="recipe-box col-12 col-md-4" key={recipe.recipeId}>
                        <img src={recipe.imageRef} alt={recipe.recipeName} referrerPolicy="no-referrer"/>
                        <span>{recipe.recipeName}</span>
                    </a>
                )}
            </div>
        </main>
    )

}

export default ListRecipe;