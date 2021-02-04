//import { Action } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
// import { ADD_INGREDIENT } from "./shopping-list.actions";
import * as ShoppingListActions from "./shopping-list.actions";


export interface State {
    ingredients: Ingredient[],
    editedIngredient: Ingredient,
    editedIngredientIndex: number
};

// export interface AppState{
//     shoppingList: State
// };

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
      ],
      editedIngredient: null,
      editedIngredientIndex: -1
};

  
export function shoppingListReducer(
    state: State = initialState,
    action: ShoppingListActions.ShoppingListActions
){ // Action type

    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            
            return {
                ...state, // copy old state
                ingredients: [...state.ingredients, action.payload] // overrride what I want change
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[state.editedIngredientIndex]; // action.payload.index
            const updateIngredient = {
                ...ingredient, // for id in case there is any
                ...action.payload //.ingredient
            };
            const updatedIngredients = [...state.ingredients]; // new array
            updatedIngredients[state.editedIngredientIndex] = updateIngredient;
            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            
            return {
                ...state,
                ingredients: state.ingredients.filter((ig,igIndex) => igIndex !== state.editedIngredientIndex ), //action.payload) // new array copy
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: {...state.ingredients[action.payload]}
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1  
            };
        default:
            return state;
    }
}

