import React, { AnchorHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { getStaticUrl } from '../../helpers/urls';

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
 *
 * @returns {ElementType} The `StaticLink` component.
 */
const StaticLink = ({ children, className, href, staticUrl, onClick }: StaticLinkProps) => {
    return (
        <a
            className={clsx('underline text-brand-coral py-0 px-4 underline-offset-2', className)}
            href={href ?? (staticUrl ? getStaticUrl(staticUrl) : '#')}
            onClick={onClick}
            rel='noopener noreferrer'
            target='_blank'
        >
            {children}
        </a>
    );
};

export default StaticLink;
