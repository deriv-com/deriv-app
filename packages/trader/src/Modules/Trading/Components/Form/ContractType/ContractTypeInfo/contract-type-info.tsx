import React from 'react';
import { Button, ThemedScrollbars, Carousel, ButtonToggle } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import TradeCategories from 'Assets/Trading/Categories/trade-categories.jsx';
import TradeCategoriesGIF from 'Assets/Trading/Categories/trade-categories-gif.jsx';
import { getContractTypes } from '../../../../Helpers/contract-type';
import ContractTypeGlossary from './contract-type-glossary';
import classNames from 'classnames';

export type TContractType = {
    text?: string;
    value: string;
};

export type TContractCategory = {
    component?: typeof React.Component;
    contract_types: TContractType[];
    icon?: string;
    key: string;
    label?: string;
};

export type TList = {
    component?: typeof React.Component;
    contract_categories: TContractCategory[];
    contract_types?: TContractType[];
    icon: string;
    label?: string;
    key: string;
};

type TInfo = {
    handleNavigationClick: (contract_type: TContractType) => void;
    handleSelect: (type: TContractType | undefined, e: React.MouseEvent) => void;
    initial_index?: number;
    item: TContractType;
    list: TList[];
};

const TABS = {
    DESCRIPTION: 'description',
    GLOSSARY: 'glossary',
};

const Info = ({ handleNavigationClick, handleSelect, initial_index, item, list }: TInfo) => {
    const [carousel_index, setCarouselIndex] = React.useState('');
    const [selected_tab, setSelectedTab] = React.useState(TABS.DESCRIPTION);
    const contract_types: TContractType[] = getContractTypes(list, item).filter(
        (i: { value: TContractType['value'] }) => i.value !== 'rise_fall_equal'
    );
    const has_toggle_buttons = /accumulator|vanilla/i.test(carousel_index);
    const is_description_tab_selected = selected_tab === TABS.DESCRIPTION;
    const is_glossary_tab_selected = selected_tab === TABS.GLOSSARY;
    const width = isMobile() ? '328' : '528';
    const scroll_bar_height = has_toggle_buttons ? '464px' : '560px';
    const selected_contract_type = contract_types.find(type => type.value === carousel_index);

    const onClickGlossary = () => setSelectedTab(TABS.GLOSSARY);
    const handleItemSelect = (active_index: number) => {
        setCarouselIndex(contract_types[active_index].value);
        handleNavigationClick(contract_types[active_index]);
    };

    const cards = contract_types.map((type: TContractType, idx) => {
        return (
            <div key={idx} className='contract-type-info__card'>
                <ThemedScrollbars
                    className={classNames('contract-type-info__scrollbars', {
                        'contract-type-info__scrollbars-description--active': is_description_tab_selected,
                        'contract-type-info__scrollbars-glossary contract-type-info__scrollbars-glossary--active ':
                            is_glossary_tab_selected,
                    })}
                    style={{
                        left: `${is_description_tab_selected ? `-` : ''}${width}px`,
                        transform: `translate3d(${is_description_tab_selected ? '' : `-`}${width}px, 0, 0)`,
                    }}
                    height={isMobile() ? '' : scroll_bar_height}
                    autohide={false}
                >
                    <div
                        className={classNames({
                            'contract-type-info__gif--has-toggle-buttons': has_toggle_buttons,
                            'contract-type-info__content': is_glossary_tab_selected,
                            'contract-type-info__gif': is_description_tab_selected,
                            'contract-type-info__gif--has-video':
                                carousel_index === 'accumulator' && is_description_tab_selected,
                        })}
                    >
                        {is_description_tab_selected ? (
                            <TradeCategoriesGIF
                                category={type.value}
                                selected_contract_type={selected_contract_type?.value}
                            />
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
            {has_toggle_buttons && (
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

export default Info;
