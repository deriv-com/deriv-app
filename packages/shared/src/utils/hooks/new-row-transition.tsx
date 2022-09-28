import React from 'react';

export const useNewRowTransition = (is_new_row: boolean) => {
    const [in_prop, setInProp] = React.useState(!is_new_row);

    React.useEffect(() => {
        if (is_new_row) setInProp(true);
    }, [is_new_row]);

    return { in_prop };
};
