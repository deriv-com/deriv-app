import classNames from 'classnames';
import React      from 'react';
import zxcvbn     from '@contentpass/zxcvbn';
import PropTypes  from 'prop-types';
import FieldError from 'Components/field-error';

const PasswordMeter = ({ children, error, error_className, input }) => {
    // 0 - 4 Score for password strength
    const { score, feedback } = zxcvbn(input);
    const width_scale = error && input.length ? 0.25 : (0.25 * (input.length && (score < 1) ? 1 : score));

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
                {children}
                <div className='dc-password-meter__bg' />
                <div
                    className={classNames('dc-password-meter', {
                        'dc-password-meter--weak'  : (error || input.length && score < 3),
                        'dc-password-meter--strong': (!error && input.length && score >= 3),
                    })}
                    style={{ transform: `scale(${width_scale}, 1)` }}
                />
                {error &&
                    <FieldError
                        className='dc-password-meter__error'
                        message={error}
                    />
                }
                {(feedback.warning && !error) &&
                    <FieldError
                        className={classNames('dc-password-meter__warning', error_className)}
                        message={`${feedback.warning}.`}
                    />
                }
            </div>
        </React.Fragment>
    );
};

PasswordMeter.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    has_error: PropTypes.bool,
    input    : PropTypes.oneOfType([
        PropTypes.string, PropTypes.number]),
};

export default PasswordMeter;
