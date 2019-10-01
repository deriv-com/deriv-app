import classNames from 'classnames';
import { Button } from 'deriv-components';
import React      from 'react';
import Localize   from 'App/Components/Elements/localize.jsx';
import Icon       from 'Assets/icon.jsx';

const SuccessCurrencyDialog = ({
    current,
    onCancel,
    onSubmit,
    success_message,
}) => {
    const IconNextCurrency = () => <Icon
        icon='IconAccountsCurrency'
        type={current.toLowerCase()}
    />;

    const IconWon = ({ className }) => <Icon
        className={className}
        icon='IconWon'
    />;

    return (
        <div className='success-change'>
            <div className={
                classNames('success-change__icon-area', 'success-change__icon-area--big')
            }
            >
                <IconNextCurrency />
                <IconWon className='bottom-right-overlay' />
            </div>
            <div className='success-change__body-area'>
                <h2>
                    <Localize
                        i18n_default_text='Success!'
                    />
                </h2>
                <p>{success_message}</p>
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
                <Button
                    onClick={onSubmit}
                >
                    <Localize
                        i18n_default_text='Deposit now'
                    />
                </Button>
            </div>
        </div>
    );
};

export default SuccessCurrencyDialog;
