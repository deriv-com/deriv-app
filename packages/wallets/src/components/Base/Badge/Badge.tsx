import React, { Children, cloneElement, FC, ReactElement, ReactNode } from 'react';
import classNames from 'classnames';
import { TGenericSizes } from '../../../types';
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
    size: Extract<TGenericSizes, 'lg' | 'md' | 'sm' | 'xs'>; // TODO: add css classes to handle the size of the badges and map it to the text sizes.
}

interface BadgeTextProps {
    children: WalletTextProps['children'];
    color?: WalletTextProps['color'];
    isBold?: boolean;
    size?: WalletTextProps['size'];
}

interface BadgeIconProps {
    children: ReactNode;
    className?: string;
}

const BadgeText: FC<BadgeTextProps> = ({ children, color, isBold = false, size = 'md' }) => (
    <WalletText color={color} size={size} weight={isBold ? 'bold' : 'initial'}>
        {children}
    </WalletText>
);

const BadgeIcon: FC<BadgeIconProps> = ({ children, className }) => <div className={className}>{children}</div>;

const Badge: BadgeComponent = ({ children, className, size = 'md' }) => (
    <div className={classNames('wallets-badge', className)}>
        {Children.map(children, child => cloneElement(child, { size }))}
    </div>
);

Badge.Text = BadgeText;
Badge.Icon = BadgeIcon;

export default Badge;
