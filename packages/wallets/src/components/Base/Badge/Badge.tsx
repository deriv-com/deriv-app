import React, { FC, cloneElement, ReactElement, PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';
import { WalletText } from '../WalletText';
import { WalletTextProps } from '../WalletText/WalletText';
import './Badge.scss';

interface BadgeComponent extends FC<BadgeProps> {
    Icon: React.FC<BadgeIconProps>;
    Text: React.FC<BadgeTextProps>;
}
interface BadgeProps {
    children: ReactElement | ReactElement[];
    className?: string;
    size: 'lg' | 'md' | 'sm' | 'xs'; // TODO: add css classes to handle the size of the badges and map it to the text sizes.
}

interface BadgeTextProps extends WalletTextProps {
    isBold?: boolean;
}

interface BadgeIconProps {
    children: ReactNode;
    className?: string;
}

const BadgeText: FC<BadgeTextProps> = ({ children, isBold = false, size = 'md', ...props }) => (
    <WalletText size={size} weight={isBold ? 'bold' : 'initial'} {...props}>
        {children}
    </WalletText>
);

const BadgeIcon: FC<BadgeIconProps> = ({ children, className }) => <div className={className}>{children}</div>;

const Badge: BadgeComponent = ({ children, className, size = 'md' }) => {
    return (
        <div className={classNames('wallets-badge', className)}>
            {Children.map(children, child => cloneElement(child, { size }))}
        </div>
    );
};

Badge.Text = BadgeText;
Badge.Icon = BadgeIcon;

export default Badge;
