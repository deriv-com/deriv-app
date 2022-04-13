import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const CardRoot = ({ children, className, ...props }) => (
    <div className={classNames('dc-card__wrapper', className)} {...props}>
        {children}
    </div>
);

const CardHeader = ({ children }) => <div className='dc-card__header-wrapper'>{children}</div>;

const CardContent = ({ children }) => <div className='dc-card__content-wrapper'>{children}</div>;

const CardFooter = ({ children }) => <div className='dc-card__footer-wrapper'>{children}</div>;

const Card = ({ className, header, content, footer, renderHeader, renderContent, renderFooter, ...props }) => {
    return (
        <CardRoot className={classNames('dc-card', className)} {...props}>
            {renderHeader ? renderHeader() : header !== null && <CardHeader>{header}</CardHeader>}
            {renderContent ? renderContent() : content !== null && <CardContent>{content}</CardContent>}
            {renderFooter ? renderFooter() : footer !== null && <CardFooter>{footer}</CardFooter>}
        </CardRoot>
    );
};

Card.propTypes = {
    className: PropTypes.string,
    header: PropTypes.node,
    renderHeader: PropTypes.func,
    content: PropTypes.node,
    renderContent: PropTypes.func,
    footer: PropTypes.node,
    renderFooter: PropTypes.func,
};

export default Card;
