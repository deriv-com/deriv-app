import PropTypes from 'prop-types';
import React from 'react';
import { Button, ThemedScrollbars, Carousel, ButtonToggle } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import TradeCategories from 'Assets/Trading/Categories/trade-categories.jsx';
import TradeCategoriesGIF from 'Assets/Trading/Categories/trade-categories-gif.jsx';
import { getContractTypes } from '../../../../Helpers/contract-type';
import ContractTypeGlossary from './contract-type-glossary';
import classNames from 'classnames';

const TABS = {
    DESCRIPTION: 'description',
    GLOSSARY: 'glossary',
};

const Info = ({ handleNavigationClick, handleSelect, initial_index, item, list }) => {
    const [carousel_index, setCarouselIndex] = React.useState('');
    const [selected_tab, setSelectedTab] = React.useState(TABS.DESCRIPTION);
    const contract_types = getContractTypes(list, item).filter(i => i.value !== 'rise_fall_equal');
    const has_toggle_buttons = carousel_index !== 'accumulator' && carousel_index !== 'vanilla';
    const is_description_tab_selected = selected_tab === TABS.DESCRIPTION;
    const is_glossary_tab_selected = selected_tab === TABS.GLOSSARY;
    const width = isMobile() ? '328' : '528';
    const scroll_bar_height = has_toggle_buttons ? '560px' : '464px';
    const selected_contract_type = contract_types.find(type => type.value === carousel_index);

    const onClickGlossary = () => setSelectedTab(TABS.GLOSSARY);
    const handleItemSelect = active_index => {
        setCarouselIndex(contract_types[active_index].value);
        handleNavigationClick(contract_types[active_index]);
        if (has_toggle_buttons && is_glossary_tab_selected) {
            setSelectedTab(TABS.DESCRIPTION);
        }
    };

    const cards = contract_types.map((type, idx) => {
        return (
            <div
                key={idx}
                className={classNames('contract-type-info__card', {
                    'contract-type-info__card--has-toggle-buttons': !has_toggle_buttons,
                })}
            >
                <ThemedScrollbars
                    className={classNames('contract-type-info__scrollbars', {
                        'contract-type-info__scrollbars-description--active': is_description_tab_selected,
                        'contract-type-info__scrollbars-glossary contract-type-info__scrollbars-glossary--active ':
                            is_glossary_tab_selected,
                    })}
                    style={{
                        left: `${is_description_tab_selected ? `-${width}` : width}px`,
                        transform: `translate3d(${is_description_tab_selected ? width : `-${width}`}px, 0, 0)`,
                    }}
                    height={isMobile() ? '' : scroll_bar_height}
                    autohide={false}
                >
                    <div
                        className={classNames({
                            'contract-type-info__gif--has-toggle-buttons': has_toggle_buttons,
                            'contract-type-info__content': is_glossary_tab_selected,
                            'contract-type-info__gif': is_description_tab_selected,
                        })}
                    >
                        {is_description_tab_selected ? (
                            <TradeCategoriesGIF category={type.value} />
                        ) : (
                            <ContractTypeGlossary category={type.value} />
                        )}
                    </div>
                    <div className='contract-type-info__content'>
                        {is_description_tab_selected && (
                            <TradeCategories category={type.value} onClick={onClickGlossary} />
                        )}
                    </div>
                </ThemedScrollbars>
            </div>
        );
    });

    return (
        <React.Fragment>
            {!has_toggle_buttons && (
                <div className='contract-type-info__button-wrapper'>
                    <ButtonToggle
                        buttons_arr={[
                            { text: localize('Description'), value: TABS.DESCRIPTION },
                            { text: localize('Glossary'), value: TABS.GLOSSARY },
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
                className={classNames('contract-type-info', {
                    'contract-type-info--has-toggle-buttons': has_toggle_buttons,
                })}
                disable_swipe={isMobile()}
                onItemSelect={handleItemSelect}
                initial_index={initial_index}
                list={cards}
                width={isMobile() ? 328 : 528}
                show_bullet={false}
                show_nav={false}
            />
            <div className='contract-type-info__trade-type-btn-wrapper'>
                <Button
                    id={`dt_contract_info_${selected_contract_type?.value}_btn`}
                    className='contract-type-info__button'
                    onClick={e => handleSelect(selected_contract_type, e)}
                    text={localize('Choose {{contract_type}}', {
                        contract_type: selected_contract_type?.text,
                        interpolation: { escapeValue: false },
                    })}
                    secondary
                />
            </div>
        </React.Fragment>
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
