import React, { useState } from 'react';

export const usePrecision = () => {
    const [precise, setFloating] = useState(false);
    const setDecimal             = () => setFloating(false);
    return [precise, setFloating, setDecimal];
};
