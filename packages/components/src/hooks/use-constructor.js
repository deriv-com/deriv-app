import React from 'react';

export const useConstructor = (callBack = () => {}) => {
    const [hasBeenCalled, setHasBeenCalled] = React.useState(false);
    if (hasBeenCalled) return;
    callBack();
    setHasBeenCalled(true);
};
