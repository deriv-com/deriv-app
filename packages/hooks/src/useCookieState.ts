import { useState, useEffect } from 'react';
import { CookieStorage } from '@deriv/shared';

const isNullUndefined = (value: unknown) => value === null || typeof value === 'undefined';

const isJSONString = (value: string) => {
    try {
        return JSON.parse(value) && !!value;
    } catch (e) {
        return false;
    }
};

const parseJSONString = (value: string) => (isJSONString(value) ? JSON.parse(value) : value);

const useCookieState = (key: string, options: { expires: Date }) => {
    const cookie_state = new (CookieStorage as any)(key);
    const [value, setValue] = useState(() => {
        const sticky_value = cookie_state.get(key);
        return sticky_value ? parseJSONString(sticky_value) : null;
    });

    useEffect(() => {
        if (isNullUndefined(value)) {
            cookie_state.remove();
        } else {
            cookie_state.set(key, JSON.stringify(value), options);
        }
    }, [key, value]);

    return [value, setValue];
};

export default useCookieState;
