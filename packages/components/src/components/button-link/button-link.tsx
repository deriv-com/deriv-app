import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

interface IButtonLinkProps extends React.HTMLProps<HTMLAnchorElement> {
    to: string;
}
type TButtonLinkProps = Omit<IButtonLinkProps, 'size'> & {
    size: string;
};

const ButtonLink = ({ children, className, to, onClick, size = 'medium' }: TButtonLinkProps) => (
    <Link
        className={classNames('dc-btn dc-btn--primary', className, 'effect', `dc-btn__${size}`)}
        to={to}
        onClick={onClick}
    >
        {children}
    </Link>
);

export default ButtonLink;
