/**
 * Deep compare component's props and state for re-render check.
 *
 * @return {Boolean} Whether we should re-render the component or not
 */
export const deeperCompare = (next_props, next_state, this_props, this_state) => {
    const has_prop_changed = Object.keys(next_props)
        .some(prop => typeof next_props[prop] !== 'function' &&
        typeof next_props[prop] === 'object' ?
            JSON.stringify(next_props[prop]) !== JSON.stringify(this_props[prop]) :
            next_props[prop] !== this_props[prop]);
    const has_state_changed = Object.keys(next_state).some(state => next_state[state] !== this_state[state]);

    return has_prop_changed || has_state_changed;
};
