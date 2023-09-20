import { useState } from 'react';

const useToggle = (default_state = false) => {
    const [state, setState] = useState(default_state);

    const toggle = () => setState(prev => !prev);

    return {
        state,
        toggle,
    };
};

export default useToggle;
