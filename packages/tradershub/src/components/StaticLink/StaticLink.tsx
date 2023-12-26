import React, { AnchorHTMLAttributes, ComponentProps, ReactNode } from 'react';
import { Link, qtMerge } from '@deriv/quill-design';
import { getStaticUrl } from '../../helpers/urls';

type StaticLinkProps = {
    children: ReactNode;
    className?: string;
    href?: AnchorHTMLAttributes<HTMLAnchorElement>['href'];
    size: ComponentProps<typeof Link>['size'];
    staticUrl?: AnchorHTMLAttributes<HTMLAnchorElement>['href'];
};

/**
 * `StaticLink` is a component that renders a link with static URL support.
 * It uses the `Link` component from `@deriv/quill-design` and adds some additional props.
 * @param {object} props - The properties that define the `StaticLink` component.
 * @param {ReactNode} props.children - The content to be wrapped by the link.
 * @param {string} [props.className] - Optional additional CSS classes to apply.
 * @param {AnchorHTMLAttributes<HTMLAnchorElement>['href']} [props.href] - The URL that the link points to.
 * @param {ComponentProps<typeof Link>['size']} props.size - The size of the link.
 * @param {AnchorHTMLAttributes<HTMLAnchorElement>['href']} [props.staticUrl] - A static URL that the link points to.
 *
 * @returns {ElementType} The `StaticLink` component.
 */
const StaticLink = ({ children, className, href, size, staticUrl }: StaticLinkProps) => {
    return (
        <Link
            className={qtMerge(['underline text-brand-coral py-50 px-200 underline-offset-2', className])}
            href={href ?? (staticUrl ? getStaticUrl(staticUrl) : '#')}
            rel='noopener noreferrer'
            size={size}
            target='_blank'
        >
            {children}
        </Link>
    );
};

export default StaticLink;
