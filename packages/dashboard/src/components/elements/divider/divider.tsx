import * as React from 'react';
import classNames from 'classnames';

const Divider: React.FC<IDividerProps> = ({ className, horizontal, vertical, ...props }) => {
    return (
        <hr
            className={classNames(
                'dw-divider',
                {
                    'dw-divider--horizontal': horizontal,
                    'dw-divider--vertical': vertical,
                },
                className
            )}
            {...props}
        />
    );
};

interface IDividerProps {
    className?: string;
    horizontal?: boolean;
    vertical?: boolean;
}

export default Divider;
