import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

type TButtonLinkProps = Omit<React.HTMLProps<HTMLAnchorElement>, 'size'> & {
    to: string;
    size: 'small' | 'medium' | 'large';
};

const ButtonLink = ({
    children,
    className,
    to,
    onClick,
    size = 'medium',
}: React.PropsWithChildren<Partial<TButtonLinkProps>>) => (
    <Link
        className={classNames('dc-btn dc-btn--primary', className, 'effect', `dc-btn__${size}`)}
        to={to}
        onClick={onClick}
    >
        {children}
    </Link>
);

export default ButtonLink;
