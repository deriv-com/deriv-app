import React from 'react';

export const useConstructor = (callBack: () => void = () => undefined) => {
    const is_called_ref = React.useRef(false);
    if (!is_called_ref.current) {
        callBack();
        is_called_ref.current = true;
    }
};
