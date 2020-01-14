import PropTypes            from 'prop-types';
import React                from 'react';
import { Button }           from '@deriv/components';
import { localize }         from '@deriv/translations';
import TradeCategories      from 'Assets/Trading/Categories/trade-categories.jsx';
import TradeCategoriesGIF   from 'Assets/Trading/Categories/trade-categories-gif.jsx';
import ContractTypeInfoNav  from './contract-type-info-nav.jsx';
import { getContractTypes } from '../../../Helpers/contract-type';

const ContractTypeInfo = ({
    handleNavigationClick,
    is_dark_theme,
    item,
    list,
    handleSelect,
}) => {
    const contract_types = getContractTypes(list, item).filter(i => i.value !== 'rise_fall_equal');
    const selected_item_index = contract_types.findIndex(i => i.value === item.value);

    return (
        <div id={`dt_contract_info_${item.value}`} className='contract-type-info'>
            <div
                className='contract-type-info__card-wrapper'
                // total calculated below is from 258px and 16px horizontal margin set in trade-info-dialog css
                style={{ 'transform': `translate3d(-${(296 * selected_item_index)}px, 0, 0)`  }}
            >
                { contract_types && contract_types.map((type, idx) => (
                    <div className='contract-type-info__card' key={idx}>
                        <div className='contract-type-info__gif'>
                            <TradeCategoriesGIF
                                category={type.value}
                                className='contract-type-info__gif-image'
                                is_dark_theme={is_dark_theme}
                            />
                        </div>
                        <div className='contract-type-info__content'>
                            <TradeCategories category={type.value} />
                        </div>
                        <Button
                            id={`dt_contract_info_${type.value}_button`}
                            className='contract-type-info__choose-button'
                            onClick={(e) => handleSelect(type, e)}
                            text={localize('Choose this')}
                            secondary
                        />
                    </div>
                ))
                }
            </div>
            { contract_types.length > 1 &&
                <ContractTypeInfoNav
                    handleNavigationClick={handleNavigationClick}
                    list={contract_types}
                    selected_item_index={selected_item_index}
                />
            }
        </div>
    );
};

ContractTypeInfo.propTypes = {
    handleNavigationClick: PropTypes.func,
    handleNextClick      : PropTypes.func,
    handlePrevClick      : PropTypes.func,
    is_dark_theme        : PropTypes.bool,
    is_mobile            : PropTypes.bool,
    item                 : PropTypes.object,
    item_index           : PropTypes.number,
    itemList             : PropTypes.array,
    onBackButtonClick    : PropTypes.func,
    onSubmitButtonClick  : PropTypes.func,
};

export default ContractTypeInfo;
