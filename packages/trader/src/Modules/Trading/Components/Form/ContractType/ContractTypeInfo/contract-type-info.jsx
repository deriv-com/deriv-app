import PropTypes from 'prop-types';
import React from 'react';
import { Button, ThemedScrollbars, Carousel, ButtonToggle } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import TradeCategories from 'Assets/Trading/Categories/trade-categories.jsx';
import TradeCategoriesGIF from 'Assets/Trading/Categories/trade-categories-gif.jsx';
import { getContractTypes } from '../../../../Helpers/contract-type';
import ContractTypeGlossary from './contract-type-glossary.jsx';
import classNames from 'classnames';

const Info = ({ handleNavigationClick, handleSelect, initial_index, item, list }) => {
    const [carousel_index, setCarouselIndex] = React.useState(initial_index);
    const [selected_tab, setSelectedTab] = React.useState('description');
    const contract_types = getContractTypes(list, item).filter(i => i.value !== 'rise_fall_equal');
    const onClickGlossary = () => setSelectedTab('glossary');
    const cards = contract_types.map((type, idx) => {
        return (
            <div
                key={idx}
                className={classNames('contract-type-info__card', {
                    'contract-type-info__card--has-toggle-buttons': carousel_index !== 8 && carousel_index !== 1,
                })}
            >
                {selected_tab === 'description' ? (
                    <React.Fragment>
                        <div
                            className={classNames('contract-type-info__gif', {
                                'contract-type-info__gif--has-toggle-buttons':
                                    carousel_index !== 8 && carousel_index !== 1,
                            })}
                        >
                            <TradeCategoriesGIF category={type.value} />
                        </div>
                        <ThemedScrollbars
                            className='contract-type-info__scrollbars'
                            height={isMobile() ? '' : '312px'}
                            autohide={false}
                        >
                            <div className='contract-type-info__content'>
                                <TradeCategories category={type.value} onClick={onClickGlossary} />
                            </div>
                        </ThemedScrollbars>
                    </React.Fragment>
                ) : (
                    <ThemedScrollbars
                        className='contract-type-info__scrollbars contract-type-info__scrollbars--glossary'
                        height={isMobile() ? '' : '500px'}
                        autohide={false}
                    >
                        <div className='contract-type-info__content contract-type-info__content--glossary'>
                            <ContractTypeGlossary category={type.value} />
                        </div>
                    </ThemedScrollbars>
                )}
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
        <React.Fragment>
            {(carousel_index === 8 || carousel_index === 1) && (
                <div className='contract-type-info__button-wrapper'>
                    <ButtonToggle
                        buttons_arr={[
                            { text: localize('Description'), value: 'description' },
                            { text: localize('Glossary'), value: 'glossary' },
                        ]}
                        name='description_glossary_filter'
                        is_animated
                        has_rounded_button
                        onChange={e => {
                            setSelectedTab(e.target.value);
                        }}
                        value={selected_tab}
                    />
                </div>
            )}
            <Carousel
                className='contract-type-info'
                bullet_color='var(--text-disabled)'
                active_bullet_color='var(--brand-red-coral)'
                initial_index={carousel_index}
                onItemSelect={active_index => {
                    setCarouselIndex(active_index);
                    handleNavigationClick(contract_types[active_index]);
                    if (active_index !== 8 && active_index !== 1 && selected_tab === 'glossary') {
                        setSelectedTab('description');
                    }
                }}
                list={cards}
                width={isMobile() ? 328 : 528}
            />
        </React.Fragment>
    );
};

Info.propTypes = {
    handleSelect: PropTypes.func,
    initial_index: PropTypes.number,
    is_accumulator: PropTypes.bool,
    item: PropTypes.object,
    list: PropTypes.array,
    handleNavigationClick: PropTypes.func,
};

export default Info;
