import React, { FC, PropsWithChildren, useEffect, useState } from 'react';

type TTransitionProps = {
    className?: string;
};

const Transition: FC<PropsWithChildren<TTransitionProps>> = ({ children, className }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return <div className={isMounted ? `${className}--animate` : ''}>{children}</div>;
};

export default Transition;
