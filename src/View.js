import hh from 'hyperscript-helpers';
import {
    h
} from 'virtual-dom';
import * as R from 'ramda';

import {
    showFormMsg,
    mealInputMsg,
    caloriesInputMsg,
    saveMealMsg,
    deleteMealMsg,
    editMealMsg
} from './Update'

const {
    pre,
    div,
    form,
    button,
    fieldset,
    input,
    h1,
    label,
    i
} = hh(h);

const config = {
    node: document.querySelector('#app')
}

const view = (dispatch, model) => {
    return div({
        className: 'mw6 center'
    }, [
        titleView(),
        formView(dispatch, model),
        tableView(dispatch, 'table mw5 center w-100 collapse', model.meals)
    ]);
}

const titleView = () => {
    return h1({
        className: 'f2 pv2 bb'
    }, 'Calorie Counter');
}

const formView = (dispatch, model) => {

    const {
        description,
        calories,
        showForm
    } = model;

    if (showForm) {
        return form({
            onsubmit: e => {
                e.preventDefault();
                dispatch(saveMealMsg());
            },
            className: 'w-100 mv2',
        }, [
            fieldSet('Meal', description, e => dispatch(mealInputMsg(e.target.value))),
            fieldSet('Calories', calories || '', e => dispatch(caloriesInputMsg(e.target.value))),
            buttonSet(dispatch)
        ]);
    }

    return button({
        className: 'f3 pv2 ph3 bg-blue white bn',
        onclick: () => dispatch(showFormMsg(true))
    }, 'Add Meal')
}

const fieldSet = (labelText, inputValue, oninput) => {
    return fieldset({
        className: 'bn w-100 pa1 mv1',
    }, [
        label({
            className: 'db mb1',
        }, labelText),
        input({
            oninput,
            type: 'text',
            className: 'pa2 input-reset ba w-100 mb2',
            value: inputValue
        }),
    ]);
}

const buttonSet = (dispatch) => {
    return fieldset({
        className: 'bn w-100 pa1'
    }, [
        button({
            className: 'f3 pv2 ph3 bg-blue white bn mr2 dim',
            type: 'submit'
        }, 'Save'),
        button({
            className: 'f3 pv2 ph3 bg-light-gray dim',
            type: 'button',
            onclick: () => dispatch(showFormMsg(false))
        }, 'Cancel')
    ]);
}

const tableHeader = () => {
    return cell('thead', '',
        cell('tr', '', [
            cell('th', 'pa2 tl', 'Meal'),
            cell('th', 'pa2 tr', 'Calories'),
            cell('th', 'pa2', '')
        ])
    );
};

const tableBody = (data) => {
    return cell('tbody', '', data);
};

const tableRow = (dispatch, classNames, data) => {
    const {
        id,
        description,
        calories
    } = data;
    return cell('tr', classNames, [
        cell('td', 'pa2', description),
        cell('td', 'pa2 tr', calories),
        cell('td', 'pa2 tr', [
            i({
                className: 'di ph1 fa fa-trash-alt pointer',
                onclick: () => dispatch(deleteMealMsg(id))
            }),
            i({
                className: 'di ph1 fa fa-pen pointer',
                onclick: () => dispatch(editMealMsg(id))
            })
        ])
    ]);
}

const tableRows = (dispatch, data) => {
    return R.map(R.partial(tableRow, [dispatch, 'stripe-dark']), data);
}

const cell = (tag, className, value) => {
    return h(tag, {
        className
    }, value);
}

const tableFooter = (total) => {
    return cell('tfooter', '', cell('tr', '', [cell('td', 'pa2', 'Total: '), cell('td', 'pa2 tr', total)]));
}

const totalData = (data) => {
    return R.reduce((acc, e) => {
        return acc += e.calories
    }, 0, data);
}

const tableView = (dispatch, classNames, data) => {
    return cell('table', classNames, [tableHeader(config.headers), R.pipe(R.partial(tableRows, [dispatch]), tableBody)(data), R.pipe(totalData, tableFooter)(data)]);
}

export default view;