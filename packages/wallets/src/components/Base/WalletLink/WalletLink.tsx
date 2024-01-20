import React from 'react';
import { getStaticUrl } from '../../../helpers/urls';
import './WalletLink.scss';

interface LinkProps {
    children?: React.ReactNode;
    href?: React.AnchorHTMLAttributes<HTMLAnchorElement>['href'];
    staticUrl?: React.AnchorHTMLAttributes<HTMLAnchorElement>['href'];
}

const WalletLink: React.FC<LinkProps> = ({ children, href, staticUrl }) => (
    <a
        className='wallets-link'
        href={href ?? (staticUrl ? getStaticUrl(staticUrl) : '#')}
        rel='noopener noreferrer'
        target='_blank'
    >
        {children}
    </a>
);

export default WalletLink;
