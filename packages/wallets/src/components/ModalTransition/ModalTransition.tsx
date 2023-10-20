import React, { FC, PropsWithChildren, useEffect, useState } from 'react';

type TModalTransitionProps = {
    className?: string;
};

const ModalTransition: FC<PropsWithChildren<TModalTransitionProps>> = ({ children, className }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return <div className={isMounted ? `${className}--animate` : ''}>{children}</div>;
};

export default ModalTransition;
