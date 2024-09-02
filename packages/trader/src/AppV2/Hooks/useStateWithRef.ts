import { useState, useRef, useCallback } from 'react';

const useStateWithRef = <T>(initial_value: T): [React.MutableRefObject<T>, (new_value: T) => void] => {
    const [value, setValue] = useState<T>(initial_value);

    const value_ref = useRef<T>(value);

    const setValueWithRef = useCallback((new_value: T) => {
        value_ref.current = new_value;
        setValue(new_value);
    }, []);

    return [value_ref, setValueWithRef];
};

export default useStateWithRef;
