import PropTypes  from 'prop-types';
import classNames from 'classnames';
import { Button } from 'deriv-components';
import React      from 'react';
import Localize   from 'App/Components/Elements/localize.jsx';
import Icon       from 'Assets/icon.jsx';

const SuccessDialog = ({
    has_cancel,
    has_submit,
    icon,
    message,
    onCancel,
    onSubmit,
    heading,
    icon_size,
    text_submit,
}) => {
    const MainIcon = () => icon || null;

    const Checkmark = ({ className }) => <Icon
        className={className}
        icon='IconWon'
    />;

    return (
        <div className='success-change'>
            <div className={
                classNames('success-change__icon-area', {
                    'success-change__icon-area--large' : icon_size === 'large',
                    'success-change__icon-area--xlarge': icon_size === 'xlarge',
                })
            }
            >
                <MainIcon />
                <Checkmark className='bottom-right-overlay' />
            </div>
            <div className='success-change__body-area'>
                {!heading &&
                <h2>
                    <Localize
                        i18n_default_text='Success!'
                    />
                </h2>
                }
                {heading && heading}
                {React.isValidElement(message) && message }
                {!React.isValidElement(message) &&
                <p>{message}</p>
                }
            </div>
            <div className='success-change__btn-area'>
                {has_cancel &&
                <Button
                    onClick={onCancel}
                    className='btn--outline'
                >
                    <Localize
                        i18n_default_text='Maybe later'
                    />
                </Button>
                }
                {has_submit &&
                <Button onClick={onSubmit}>{text_submit}</Button>
                }
            </div>
        </div>
    );
};

SuccessDialog.defaultProps = {
    icon_size : 'large',
    has_cancel: false,
    has_submit: true,
};

SuccessDialog.propTypes = {
    has_cancel: PropTypes.bool,
    has_submit: PropTypes.bool,
    heading   : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    icon     : PropTypes.object,
    icon_size: PropTypes.string,
    icon_type: PropTypes.string,
    message  : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    onCancel   : PropTypes.func,
    onSubmit   : PropTypes.func,
    text_submit: PropTypes.string,
};

export default SuccessDialog;
