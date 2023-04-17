import classNames from 'classnames';
import React, { HTMLProps } from 'react';

type TGeneralCardComponentsProps = HTMLProps<HTMLDivElement>;

type TCardProps = HTMLProps<HTMLDivElement> & {
    header?: React.ReactNode;
    renderHeader?: () => React.ReactNode;
    content?: React.ReactNode;
    renderContent?: () => React.ReactNode;
    footer?: React.ReactNode;
    renderFooter?: () => React.ReactNode;
};

const CardRoot = ({ children, className, ...props }: TGeneralCardComponentsProps) => (
    <div className={classNames('dc-card__wrapper', className)} {...props}>
        {children}
    </div>
);

const CardHeader = ({ children }: TGeneralCardComponentsProps) => (
    <div className='dc-card__header-wrapper'>{children}</div>
);

const CardContent = ({ children }: TGeneralCardComponentsProps) => (
    <div className='dc-card__content-wrapper'>{children}</div>
);

const CardFooter = ({ children }: TGeneralCardComponentsProps) => (
    <div className='dc-card__footer-wrapper'>{children}</div>
);

const Card = ({
    className,
    header,
    content,
    footer,
    renderHeader,
    renderContent,
    renderFooter,
    ...props
}: TCardProps) => {
    return (
        <CardRoot className={classNames('dc-card', className)} {...props}>
            {renderHeader ? renderHeader() : !!header && <CardHeader>{header}</CardHeader>}
            {renderContent ? renderContent() : !!content && <CardContent>{content}</CardContent>}
            {renderFooter ? renderFooter() : !!footer && <CardFooter>{footer}</CardFooter>}
        </CardRoot>
    );
};

export default Card;
