import React from 'react';
import { getStaticUrl } from '../../../helpers/urls';
import './WalletLink.scss';

type TVariant = 'bold' | 'dark' | 'normal';

interface LinkProps {
    children?: React.ReactNode;
    href?: React.AnchorHTMLAttributes<HTMLAnchorElement>['href'];
    staticUrl?: React.AnchorHTMLAttributes<HTMLAnchorElement>['href'];
    variant?: TVariant;
}

const WalletLink: React.FC<LinkProps> = ({ children, href, staticUrl, variant = 'normal' }) => (
    <a
        className={`wallets-link wallets-link__variant--${variant}`}
        href={href ?? (staticUrl ? getStaticUrl(staticUrl) : '#')}
        rel='noopener noreferrer'
        target='_blank'
    >
        {children}
    </a>
);

export default WalletLink;
