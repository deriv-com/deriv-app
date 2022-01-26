import classNames from 'classnames';
import React from 'react';

type CardProps = {
    className: string;
    header: unknown;
    renderHeader: () => void;
    content: unknown;
    renderContent: () => void;
    footer: unknown;
    renderFooter: () => void;
};

const CardRoot = ({ children, className, ...props }) => (
    <div className={classNames('dc-card__wrapper', className)} {...props}>
        {children}
    </div>
);

const CardHeader = ({ children }) => <div className='dc-card__header-wrapper'>{children}</div>;

const CardContent = ({ children }) => <div className='dc-card__content-wrapper'>{children}</div>;

const CardFooter = ({ children }) => <div className='dc-card__footer-wrapper'>{children}</div>;

const Card = ({
    className,
    header,
    content,
    footer,
    renderHeader,
    renderContent,
    renderFooter,
    ...props
}: CardProps) => {
    return (
        <CardRoot className={classNames('dc-card', className)} {...props}>
            {renderHeader ? renderHeader() : header !== null && <CardHeader>{header}</CardHeader>}
            {renderContent ? renderContent() : content !== null && <CardContent>{content}</CardContent>}
            {renderFooter ? renderFooter() : footer !== null && <CardFooter>{footer}</CardFooter>}
        </CardRoot>
    );
};

export default Card;
