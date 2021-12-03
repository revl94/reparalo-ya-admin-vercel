import { combineReducers } from 'redux';
import customizationReducer from './customization-reducer';
import snackbarReducer from './snackbar-reducer';
import accountReducer from './account-reducer';

const reducer = combineReducers({
    account: accountReducer,
    customization: customizationReducer,
    snackbar: snackbarReducer,
});

export default reducer;
