import * as R from 'ramda';

//messages - actions
const MSGS = {
    SHOW_FORM: 'SHOW_FORM',
    MEAL_INPUT: 'MEAL_INPUT',
    CALORIES_INPUT: 'CALORIES_INPUT',
    SAVE_MEAL: 'SAVE_MEAL',
    DELETE_MEAL: 'DELETE_MEAL',
    EDIT_MEAL: 'EDIT_MEAL'
};

export const showFormMsg = (showForm) => {
    return {
        type: MSGS.SHOW_FORM,
        showForm
    }
}

export const mealInputMsg = (description) => {
    return {
        type: MSGS.MEAL_INPUT,
        description
    }
}

export const caloriesInputMsg = (calories) => {
    return {
        type: MSGS.CALORIES_INPUT,
        calories
    }
}

export const saveMealMsg = () => {
    return {
        type: MSGS.SAVE_MEAL
    }
}

export const deleteMealMsg = (id) => {
    return {
        type: MSGS.DELETE_MEAL,
        id
    }
}

export const editMealMsg = (id) => {
    return {
        type: MSGS.EDIT_MEAL,
        id
    }
}

//Update function
const update = (msg, model) => {
    switch (msg.type) {
        case MSGS.SHOW_FORM:
            const {
                showForm
            } = msg
            return { ...model,
                showForm,
                description: '',
                calories: 0
            };
        case MSGS.MEAL_INPUT:
            const {
                description
            } = msg;
            return { ...model,
                description
            }
        case MSGS.CALORIES_INPUT:
            const calories = R.pipe(parseInt, R.defaultTo(0))(msg.calories)
            return { ...model,
                calories
            }
        case MSGS.SAVE_MEAL:
            const {
                editId
            } = model;
            const updatedModel = editId !== null ? edit(msg, model) : add(msg, model);
            return updatedModel;
        case MSGS.DELETE_MEAL:
            return deleteMeal(msg.id, model);
        case MSGS.EDIT_MEAL:
            return editMeal(msg.id, model);
        default:
            return model;
    }
}

const add = (msg, model) => {
    const {
        nextId,
        description,
        calories
    } = model;
    const meal = {
        id: nextId,
        description,
        calories
    };
    const meals = [...model.meals, meal];
    return { ...model,
        meals,
        nextId: parseInt(nextId) + 1,
        description: '',
        calories: 0,
        showForm: false
    }
};

const deleteMeal = (id, model) => {
    const meals = R.filter(e => e.id !== id, model.meals);
    return { ...model,
        meals
    }
}

const editMeal = (editId, model) => {

    const {
        meals
    } = model;

    const meal = R.find(e => e.id === editId, meals);

    const {
        description,
        calories
    } = meal;

    return {
        ...model,
        editId,
        description,
        calories,
        showForm: true
    }

}

const edit = (msg, model) => {
    const {
        editId,
        description,
        calories,
        meals
    } = model;
    const updatedMeal = {
        id: editId,
        description,
        calories
    };
    const updatedMeals = R.map(e => {
        if (e.id === editId) {
            return updatedMeal;
        }
        return e
    }, meals);

    return { ...model,
        meals: updatedMeals,
        editId: null,
        description: '',
        calories: 0,
        showForm: false
    }
}

export default update;