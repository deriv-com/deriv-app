import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const LineSeparatedComponents = ({ children, className, is_invisible_line }) => {
    const num_children = React.Children.count(children);
    const line_children = [];

    React.Children.map(children, (child, idx) => {
        line_children.push(child);

        if (idx < num_children - 1 || num_children === 1) {
            line_children.push(
                <div
                    className={classNames('dc-line-separated-components__line', {
                        'dc-line-separated-components__line--invisible': is_invisible_line,
                    })}
                />
            );
        }
    });

    return (
        <div className={classNames('dc-line-separated-components', className)}>
            {line_children.map((child, idx) => React.cloneElement(child, { key: idx }))}
        </div>
    );
};

LineSeparatedComponents.propTypes = {
    children: PropTypes.any,
};

export default LineSeparatedComponents;
