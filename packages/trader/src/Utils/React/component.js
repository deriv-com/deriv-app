/**
 * Returns an object that maps component properties to corresponding values from the store
 * @param  {Object} Component - the react presentational component
 * @param  {Object} stores    - the store objects to look for the property to get its value
 * @return {Object}
 */
export const getComponentProperties = (Component, ...stores) => (
    Object.getOwnPropertyNames(Component.propTypes || {}).reduce(
        (acc, prop) => ({
            ...acc,
            ...getPropFromStores(prop, ...stores),
        }),
        {}
    )
);

/**
 * Find the property among provided stores and return an object {prop: value}
 * @param  {Object} stores - the store objects to look for the property to get its value
 * @param  {String} prop   - the property to find among stores
 * @return {Object}
 */
const getPropFromStores = (prop, ...stores) => {
    const store = stores.find(item => prop in item) || {};
    return (prop in store ? { [prop]: store[prop] } : {});
};
