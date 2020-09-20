import PropTypes from 'prop-types';
import React from 'react';
import { Button, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import TradeCategories from 'Assets/Trading/Categories/trade-categories.jsx';
import TradeCategoriesGIF from 'Assets/Trading/Categories/trade-categories-gif.jsx';

const Card = ({ contract_type, onClick }) => (
    <div className='contract-type-info__card'>
        <div className='contract-type-info__gif'>
            <TradeCategoriesGIF category={contract_type.value} />
        </div>
        <ThemedScrollbars className='contract-type-info__scrollbars' height='340px' autohide={false}>
            <div className='contract-type-info__content'>
                <TradeCategories category={contract_type.value} />
            </div>
        </ThemedScrollbars>
        <Button
            id={`dt_contract_info_${contract_type.value}_btn`}
            className='contract-type-info__button'
            onClick={e => onClick(contract_type, e)}
            text={localize('Choose {{contract_type}}', {
                contract_type: contract_type.text,
                interpolation: { escapeValue: false },
            })}
            secondary
        />
    </div>
);

Card.propTypes = {
    contract_type: PropTypes.object,
    onClick: PropTypes.func,
};

export default Card;
