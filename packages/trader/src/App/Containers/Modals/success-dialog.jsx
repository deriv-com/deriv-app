import PropTypes  from 'prop-types';
import classNames from 'classnames';
import { Button } from 'deriv-components';
import React      from 'react';
import Localize   from 'App/Components/Elements/localize.jsx';
import Icon       from 'Assets/icon.jsx';

const SuccessDialog = ({
    icon,
    message,
    onCancel,
    onSubmit,
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
                <h2>
                    <Localize
                        i18n_default_text='Success!'
                    />
                </h2>
                <p>{message}</p>
            </div>
            <div className='success-change__btn-area'>
                <Button
                    onClick={onCancel}
                    className='btn--outline'
                >
                    <Localize
                        i18n_default_text='Maybe later'
                    />
                </Button>
                <Button onClick={onSubmit}>{text_submit}</Button>
            </div>
        </div>
    );
};

SuccessDialog.defaultProps = {
    icon_size: 'large',
};

SuccessDialog.propTypes = {
    icon       : PropTypes.object,
    icon_size  : PropTypes.string,
    icon_type  : PropTypes.string,
    message    : PropTypes.string,
    onCancel   : PropTypes.func,
    onSubmit   : PropTypes.func,
    text_submit: PropTypes.string,
};

export default SuccessDialog;
