import PropTypes from 'prop-types';
import React from 'react';
import { Button, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import TradeCategories from 'Assets/Trading/Categories/trade-categories.jsx';
import TradeCategoriesGIF from 'Assets/Trading/Categories/trade-categories-gif.jsx';

const Card = ({ contract_type, onClick }) => (
    <ThemedScrollbars
        style={{
            width: '288px',
            maxHeight: 'calc(100vh- 262px)',
            marginRight: '2.4rem',
        }}
        renderTrackHorizontal={() => (
            <div
                // hide horizontal scrollbar
                style={{
                    display: 'none',
                    overflowX: 'hidden',
                }}
            />
        )}
    >
        <div className='contract-type-info__card'>
            <div className='contract-type-info__gif'>
                <TradeCategoriesGIF category={contract_type.value} />
            </div>
            <div className='contract-type-info__content'>
                <TradeCategories category={contract_type.value} />
            </div>
            <Button
                id={`dt_contract_info_${contract_type.value}_btn`}
                onClick={e => onClick(contract_type, e)}
                text={localize('Choose {{contract_type}}', {
                    contract_type: contract_type.text,
                    interpolation: { escapeValue: false },
                })}
                secondary
            />
        </div>
    </ThemedScrollbars>
);

Card.propTypes = {
    contract_type: PropTypes.object,
    onClick: PropTypes.func,
};

export default Card;
