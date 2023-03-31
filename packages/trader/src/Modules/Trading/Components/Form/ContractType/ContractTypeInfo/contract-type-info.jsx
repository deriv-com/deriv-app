import PropTypes from 'prop-types';
import React from 'react';
import { Button, ThemedScrollbars, Carousel } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import TradeCategories from 'Assets/Trading/Categories/trade-categories.jsx';
import TradeCategoriesGIF from 'Assets/Trading/Categories/trade-categories-gif.jsx';
import { getContractTypes } from '../../../../Helpers/contract-type';

const Info = ({ handleNavigationClick, handleSelect, initial_index, item, list }) => {
    const contract_types = getContractTypes(list, item).filter(i => i.value !== 'rise_fall_equal');
    const cards = contract_types.map((type, idx) => {
        return (
            <div key={idx} className='contract-type-info__card'>
                <div className='contract-type-info__gif'>
                    <TradeCategoriesGIF category={type.value} />
                </div>
                <ThemedScrollbars
                    className='contract-type-info__scrollbars'
                    height={isMobile() ? '' : '300px'}
                    autohide={false}
                >
                    <div className='contract-type-info__content'>
                        <TradeCategories category={type.value} />
                    </div>
                </ThemedScrollbars>
                <Button
                    id={`dt_contract_info_${type.value}_btn`}
                    className='contract-type-info__button'
                    onClick={e => handleSelect(type, e)}
                    text={localize('Choose {{contract_type}}', {
                        contract_type: type.text,
                        interpolation: { escapeValue: false },
                    })}
                    secondary
                />
            </div>
        );
    });

    return (
        <Carousel
            className='contract-type-info'
            bullet_color='var(--text-disabled)'
            active_bullet_color='var(--brand-red-coral)'
            initial_index={initial_index}
            onItemSelect={active_index => {
                handleNavigationClick(contract_types[active_index]);
            }}
            list={cards}
            width={isMobile() ? 328 : 290}
        />
    );
};

Info.propTypes = {
    handleSelect: PropTypes.func,
    initial_index: PropTypes.number,
    item: PropTypes.object,
    list: PropTypes.array,
    handleNavigationClick: PropTypes.func,
};

export default Info;
