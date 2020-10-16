import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon/icon.jsx';
import Text from '../text/text.jsx';

const ContentExpander = ({
    children,
    className,
    header,
    header_className,
    is_arrow_inverted,
    is_title_spaced,
    is_expanded,
    onToggle,
}) => {
    const [is_visible, toggleVisibility] = React.useState(is_expanded);

    const onClick = React.useCallback(() => {
        toggleVisibility(!is_visible);
        if (typeof onToggle === 'function') {
            onToggle(!is_visible);
        }
    }, [is_visible, onToggle, toggleVisibility]);

    return (
        <React.Fragment>
            <div
                className={classNames(
                    'dc-content-expander',
                    { 'dc-content-expander--expanded': is_visible },
                    className
                )}
                onClick={onClick}
            >
                <div
                    className={classNames(
                        'dc-content-expander__header',
                        {
                            'dc-content-expander__header--spaced': is_title_spaced,
                        },
                        header_className
                    )}
                >
                    {typeof header === 'string' ? (
                        <Text size='s' color='prominent' weight='b'>
                            {header}
                        </Text>
                    ) : (
                        header
                    )}
                </div>
                <Icon
                    icon='IcChevronDown'
                    className={classNames('dc-content-expander__select-arrow', {
                        'dc-content-expander__select-arrow--invert': is_arrow_inverted,
                    })}
                />
            </div>
            {is_visible && <React.Fragment>{children}</React.Fragment>}
        </React.Fragment>
    );
};

ContentExpander.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    header_className: PropTypes.string,
    is_visible: PropTypes.bool,
    is_title_spaced: PropTypes.bool,
    onToggle: PropTypes.func,
    toggleVisibility: PropTypes.func,
};

export default ContentExpander;
