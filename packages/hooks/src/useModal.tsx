import React, { useMemo, useState } from 'react';

type TModal = {
    is_open: boolean;
    setIsOpen: (value: boolean) => void;
};

const useModal = (Modal: React.JSXElementConstructor<TModal>, is_show_by_default = false) => {
    const [is_open, setIsOpen] = useState(is_show_by_default);

    const modal = useMemo(() => <Modal is_open={is_open} setIsOpen={setIsOpen} />, [Modal, is_open]);

    return {
        is_open,
        setIsOpen,
        modal,
    };
};

export default useModal;
