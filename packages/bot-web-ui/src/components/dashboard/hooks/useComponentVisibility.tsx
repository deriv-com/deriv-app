import React from 'react';

type TComponentVisibility = {
    ref?: React.RefObject<HTMLInputElement>;
};

export const useComponentVisibility = (ref: TComponentVisibility) => {
    const [is_dropdown_visible, setDropdownVisibility] = React.useState(false);

    const handleHideDropdown = (event: KeyboardEvent) => {
        if (event.key.toUpperCase() === 'ESCAPE') {
            setDropdownVisibility(false);
        }
    };

    const handleClickOutside = (event: Event) => {
        if (!ref?.current?.contains(event.target as Node)) {
            setDropdownVisibility(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('keydown', handleHideDropdown, true);
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('keydown', handleHideDropdown, true);
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return {
        is_dropdown_visible,
        setDropdownVisibility,
    };
};
