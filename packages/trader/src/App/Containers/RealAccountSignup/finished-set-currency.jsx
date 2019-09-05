import React         from 'react';
import Localize      from 'App/Components/Elements/localize.jsx';
import IconArrowBold from 'Assets/Common/icon-arrow-bold.jsx';
import Icon          from 'Assets/icon.jsx';

const FinishedSetCurrency = ({ prev, current }) => {
    const IconPrevCurrency = () => <Icon
        icon='IconAccountsCurrency'
        type={prev.toLowerCase()}
    />;
    const IconNextCurrency = () => <Icon
        icon='IconAccountsCurrency'
        type={current.toLowerCase()}
    />;
    const IconArrow        = () => <IconArrowBold />;

    return (
        <div className='success-change'>
            <div className='success-change__icon-area'>
                <IconPrevCurrency />
                <IconArrow />
                <IconNextCurrency />
            </div>
            <div className='success-change__body-area'>
                <h2>
                    <Localize
                        i18n_default_text='Success!'
                    />
                </h2>
                <p>
                    <Localize
                        i18n_default_text='You have successfully changed your currency to EUR.
                        Make a deposit now to start trading.'
                    />
                </p>
            </div>
            <div className='success-change__btn-area' />
        </div>
    );
};

export default FinishedSetCurrency;
