/**
 * Deep compare component's props and state for re-render check.
 *
 * @return {Boolean} Whether we should re-render the component or not
 */
export const deeperCompare = (next_props, next_state, this_props, this_state) => {
    let has_prop_changed = false;
    let has_state_changed = false;

    if (isComparable(next_props)) {
        has_prop_changed = Object.keys(next_props)
            .some(prop => typeof next_props[prop] !== 'function' &&
            typeof next_props[prop] === 'object' ?
                JSON.stringify(next_props[prop]) !== JSON.stringify(this_props[prop]) :
                next_props[prop] !== this_props[prop]);
    }

    if (isComparable(next_state)) {
        has_state_changed = Object.keys(next_state).some(state => next_state[state] !== this_state[state]);
    }

    return has_prop_changed || has_state_changed;
};

const isComparable = (value) => !!value &&  typeof value === 'object';
