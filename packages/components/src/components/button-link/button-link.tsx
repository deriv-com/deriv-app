import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

type ButtonLinkProps = {
    children: React.ReactNode;
    className: string;
    onClick: () => void;
    size: string;
    to: string;
};

const ButtonLink = ({ children, className, to, onClick, size = 'medium' }: ButtonLinkProps) => (
    <Link
        className={classNames('dc-btn dc-btn--primary', className, 'effect', `dc-btn__${size}`)}
        to={to}
        onClick={onClick}
    >
        {children}
    </Link>
);

export default ButtonLink;
