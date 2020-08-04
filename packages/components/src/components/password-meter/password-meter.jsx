import classNames from 'classnames';
import React from 'react';
import zxcvbn from '@contentpass/zxcvbn';
import PropTypes from 'prop-types';
import Field from '../field';

const PasswordMeter = ({ children, has_error, input }) => {
    // 0 - 4 Score for password strength
    const { score, feedback } = zxcvbn(input);
    const width_scale = has_error && input.length ? 0.25 : 0.25 * (input.length && score < 1 ? 1 : score);

    // const strength_map =  {
    //     1: 'Weak',
    //     2: 'Average',
    //     3: 'Good',
    //     4: 'Strong',
    // };
    // const strength = strength_map[score] || strength_map[1];
    // TODO: Add localization support for suggestion strings

    return (
        <React.Fragment>
            <div className='dc-password-meter__container'>
                {/* if child input field has hint, they should not show the hint while warning is shown */}
                {typeof children === 'function' ? children({ has_warning: !!feedback.warning }) : children}
                <div className='dc-password-meter__bg' />
                <div
                    className={classNames('dc-password-meter', {
                        'dc-password-meter--weak': has_error || (input.length && score < 3),
                        'dc-password-meter--strong': !has_error && input.length && score >= 3,
                    })}
                    style={{ transform: `scale(${width_scale}, 1)` }}
                />
                {feedback.warning && !has_error && (
                    <Field className='dc-password-meter__warning' message={`${feedback.warning}.`} type='error' />
                )}
            </div>
        </React.Fragment>
    );
};

PasswordMeter.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node, PropTypes.func]),
    has_error: PropTypes.bool,
    input: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PasswordMeter;
