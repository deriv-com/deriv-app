export const getQueryKeys = (name: string, props?: Record<string, unknown>) => {
    if (!props) return [name];

    delete props.req_id;
    if (name && props[name] === 1) delete props[name];

    if (Object.keys(props).length === 0) return [name];

    const ordered_props = Object.keys(props)
        .sort((a, b) => a.localeCompare(b))
        .reduce((obj, key) => {
            obj[key] = props[key];

            return obj;
        }, {} as { [k: string]: unknown });

    const query_props = JSON.stringify(ordered_props);

    return [name, query_props];
};
