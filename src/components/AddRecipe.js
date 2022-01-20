import {useState, useContext, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from './UserContext.js';
import '../index.css';
import UploadImage from './UploadImage.js';

function AddRecipe() {

    const userManager = useContext(UserContext);
    const [messages, setMessages] = useState([]);

    const [ingredientList, setIngredientList] = useState([]);
    const [recipeName, setRecipeName] = useState('');
    const [recipeDescription, setRecipeDescription] = useState('');
    const [datePosted, setDatePosted] = useState('');
    const [imageRef, setImageRef] = useState('');
    const [ingredientToAdd, setIngredientToAdd] = useState('');
    const [quantityToAdd, setQuantityToAdd] = useState('');
    const [cuisineList, setCuisineList] = useState([]);
    const [cuisineId, setCuisineId] = useState(27);

    const history = useHistory();

    const assignName = (e) => {
        setRecipeName(e.target.value);
    }

    const assignDescription = (e) => {    
        console.log(e.target.value);
        setRecipeDescription(e.target.value);
    }

    const assignDatePosted = (e) => {
        setDatePosted(e.target.value);
    }

    const assignImageRef = (e) => {

        setImageRef(e.target.value);
    }

    const assignIngredientToAdd = (e) => {
        setIngredientToAdd(e.target.value);
    }

    const assignQuantityToAdd = (e) => {
        setQuantityToAdd(e.target.value);
    
    }

    const assignCuisineId = (e) => {
        setCuisineId(e.target.value);
    }

    const handleError = (message) => {
        console.log("this is the error handler");
        console.log(message);
    }

    const getNextId = (ingredientList) => { 
        let max = 0;
        for (let i = 0; i < ingredientList.length; i++) {
            if (ingredientList[i].ingredientId > max) {
                max = ingredientList[i].ingredientId;
            }
        }
        return max + 1;
    }

    const addIngredient = () => {

        let toSet = ingredientList;

        let toAdd = {
            ingredientId: getNextId(ingredientList),
            ingredientName: ingredientToAdd, 
            quantity: quantityToAdd
        }

        console.log(ingredientList);

        toSet.push(toAdd);
        setIngredientList([...toSet]);

    }

    const deleteIngredient = (ingredientId) => {
        let toReturn = ingredientList;
        for (let i = 0; i < toReturn.length; i++) {
            if (toReturn[i].ingredientId === ingredientId) {
                toReturn.splice(i,i+1);
            }
        }
        setIngredientList([...toReturn]);

        console.log(ingredientList);
    }

    const doSubmit = (e) => {
        e.preventDefault(); 

        const jwt = localStorage.getItem("jwt_token");
        const current = new Date();
        setDatePosted(current.getFullYear() + "-" + (current.getMonth() < 9 ? "0" : "") + (current.getMonth() + 1) + "-" + current.getDate());

        const newRecipe = {
            recipeName: recipeName,
            recipeDescription: recipeDescription,
            datePosted: datePosted,
            imageRef: imageRef,
            cuisineId: cuisineId,
            ingredientsList: ingredientList
        }

        const init = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify(newRecipe)
        };
        
        //console.log(init.body);

        fetch(`${process.env.REACT_APP_API_HOST}/api/recipe`, init)
            .then(response => {
                console.log("in the promise!");
                if (response.status === 201) {
                    history.push("/listRecipe");
                    Promise.resolve("Success!")
                } else if (response.status === 403) {
                    //userManager.onLogout();
                    //history.push("/Login")
                } else if (response.status === 400) {
                    return response.json();
                } else {
                    Promise.reject("An error occurred");
                }
            })
            .then(
                (json) => {
                    if (json) {
                        setMessages([...json]);
                    }
                }
            )
            .catch(handleError)
            

    }
    
    useEffect(() => {
        
        fetch(`${process.env.REACT_APP_API_HOST}/api/cuisine`, {headers: {Authorization: "Bearer " + localStorage.getItem("jwt_token")}})
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
        ).then(cuisineList => {
            setCuisineList(cuisineList);
        })
        .catch(handleError)
        setCuisineId(25);
    }, []);

    return(
    <main>
        <div className="text-center">
            <h3 className='mb-3'>Create a Recipe</h3>
        </div>
        <div className='inline mb-2'>
            <div className='upload-div'>
                <h4 className='inline'>Upload an image:</h4>
                <UploadImage consolelog={setImageRef}/>
            </div>
        </div>
        <form>
            <label htmlFor='imageRef' ><h4>Link to image:</h4></label>
            <input className="form-control mb-3" type='url' id='imageRef' value={imageRef} onChange={assignImageRef}/>
            <div className='row'>
                <div className='col'>
                    <label htmlFor='name'><h4>Recipe name:</h4></label>
                    <input className="form-control" id='name' value={recipeName} onChange={assignName} />
                </div>
                <div className='col'>
                    <label htmlFor='cuisine'><h4>Cuisine: </h4></label>
                    <select id="cuisine-select" onChange={assignCuisineId} value={cuisineId}>
                        {cuisineList.map(cuisine =>   
                        <option key={cuisine.cuisineId} value={cuisine.cuisineId}>{cuisine.cuisineName}
                        </option>
                        )}
                    </select>
                </div>
            </div>
            <br />
            <h4>Ingredients:</h4>
            <div>
                <ul>
                {ingredientList.map(ingredient => 
                    <li className="list-group-item" key={ingredient.ingredientId}>
                        <div className="col-sm-11 col-9 inline clearfix">
                            <span>{ingredient.quantity} {ingredient.ingredientName}</span>
                        </div>
                        <div className="col-sm-1 col-3 inline clearfix">
                            <button type="button" className="btn btn-danger" onClick={() => {deleteIngredient(ingredient.ingredientId)}}>⨯</button>
                        </div>
                    </li>
                        
                )}
                </ul>
            </div>
            <div className="">
                <label htmlFor="ingredientToAdd">Quantity: </label>
                <input className="form-group mx-sm-3 mb-2" id='quantityToAdd' value={quantityToAdd} onChange={assignQuantityToAdd} />
                <label htmlFor="ingredientToAdd">Ingredient: </label>
                <input className="form-group mx-sm-3 mb-2" id='ingredientToAdd' value={ingredientToAdd} onChange={assignIngredientToAdd} />
                <button className="btn btn-primary ml-2" type="button" onClick={addIngredient}>+</button>
            </div>
            <div className='row'>
                <span className='col-md-6'></span>
                <p className='small col-md-6 col-12'>(i.e. 1 Cup, 1 Can (8 oz.)</p>
            </div>
            <label htmlFor='description' ><h4>Description:</h4></label>
            <br/>
            <textarea className="form-control" cols="30" rows="5" id='description' value={recipeDescription} onChange={assignDescription} />
            <br />
            <div className='text-center'>
                <button className="btn btn-primary mr-1" onClick={doSubmit}>Submit Recipe</button>
                <a href='/listRecipe' className='btn btn-danger ml-1'>Cancel</a>
            </div>

        </form>
        
        <div>
            <ul>
                {messages.map((message) => <li style={{ color: 'red' }} key={message}>{message} </li>)}
            </ul>
        </div>
    </main>
    )

}

export default AddRecipe;
