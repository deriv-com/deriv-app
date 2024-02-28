import React, { AnchorHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { URLUtils } from '@deriv-com/utils';

type StaticLinkProps = {
    children: ReactNode;
    className?: string;
    href?: AnchorHTMLAttributes<HTMLAnchorElement>['href'];
    onClick?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick'];
    staticUrl?: AnchorHTMLAttributes<HTMLAnchorElement>['href'];
};

/**
 * `StaticLink` is a component that renders a link with static URL support.
 * @param {object} props - The properties that define the `StaticLink` component.
 * @param {ReactNode} props.children - The content to be wrapped by the link.
 * @param {string} [props.className] - Optional additional CSS classes to apply.
 * @param {AnchorHTMLAttributes<HTMLAnchorElement>['href']} [props.href] - The URL that the link points to.
 * @param {AnchorHTMLAttributes<HTMLAnchorElement>['href']} [props.staticUrl] - A static URL that the link points to.
 * @returns {ElementType} The `StaticLink` component.
 */
const StaticLink = ({ children, className, href, staticUrl, onClick }: StaticLinkProps) => {
    const { getDerivStaticURL } = URLUtils;
    const link = href ?? (staticUrl && getDerivStaticURL(staticUrl));
    const isNewTab = href || staticUrl;
    return (
        <a
            className={twMerge('underline text-brand-coral py-0 px-4 underline-offset-2', className)}
            href={link}
            onClick={onClick}
            rel={isNewTab && 'noopener noreferrer'}
            target={isNewTab && '_blank'}
        >
            {children}
        </a>
    );
};

export default StaticLink;
