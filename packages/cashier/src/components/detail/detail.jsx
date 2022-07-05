import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import './detail.scss';

const Detail = ({ action, children, className, has_red_color, icon, title }) => {
    const detail = Array.isArray(children) ? children : [children];
    return (
        <div
            className={classNames('detail', {
                [className]: !!className,
            })}
        >
            {icon && (
                <div className='detail__icon-wrapper'>
                    <Icon icon={`IcCashier${icon}`} />
                </div>
            )}
            <div>
                {detail.map((child, id) => (
                    <React.Fragment key={id}>
                        {title && (
                            <Text as='p' line_height='s' size='xs'>
                                {title}
                            </Text>
                        )}
                        {action || !title ? (
                            <Text
                                as='a'
                                color={has_red_color ? 'red' : 'prominent'}
                                href={`${action ? `${action}:` : ''}${child}`}
                                line_height='s'
                                size={!title ? 'xxs' : 'xs'}
                                weight='bold'
                                className='detail__link'
                            >
                                {child}
                                {id === detail.length - 1 ? '' : ', '}
                            </Text>
                        ) : (
                            <Text as='p' line_height='s' size='xs' weight='bold'>
                                {child}
                            </Text>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

Detail.propTypes = {
    action: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element, PropTypes.string]),
    className: PropTypes.string,
    has_red_color: PropTypes.bool,
    icon: PropTypes.string,
    title: PropTypes.string,
};

export default Detail;
