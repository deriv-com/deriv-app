import React from 'react';
import { Button, ThemedScrollbars, ButtonToggle, Dropdown } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { clickAndKeyEventHandler, TRADE_TYPES } from '@deriv/shared';
import { localize } from '@deriv/translations';
import TradeCategories from 'Assets/Trading/Categories/trade-categories';
import TradeCategoriesGIF from 'Assets/Trading/Categories/trade-categories-gif';
import { getContractTypes, isMajorPairsSymbol } from '../../../../Helpers/contract-type';
import ContractTypeGlossary from './contract-type-glossary';
import classNames from 'classnames';
import { useTraderStore } from 'Stores/useTraderStores';
import { TContractType, TList } from '../types';

type TInfo = {
    item: TContractType;
    list: TList[];
};

const TABS = {
    DESCRIPTION: 'description' as const,
    GLOSSARY: 'glossary' as const,
};

type TSelectedTab = 'description' | 'glossary';

const Info = observer(({ item, list }: TInfo) => {
    const { cached_multiplier_cancellation_list, symbol } = useTraderStore();
    const {
        active_symbols: { active_symbols },
        ui: { is_mobile },
        modules: {
            trade: { is_vanilla_fx },
        },
    } = useStore();
    const [selected_tab, setSelectedTab] = React.useState<TSelectedTab>(TABS.DESCRIPTION);
    const [selected_contract_type, setSelectedContractType] = React.useState(item.value);
    const { RISE_FALL_EQUAL, TURBOS, VANILLA } = TRADE_TYPES;
    const contract_types: TContractType[] | undefined = getContractTypes(list, item)?.filter(
        (i: { value: TContractType['value'] }) =>
            i.value !== RISE_FALL_EQUAL && i.value !== TURBOS.SHORT && i.value !== VANILLA.PUT
    );
    const has_toggle_buttons = /accumulator|turboslong|vanilla|multiplier/i.test(selected_contract_type);
    const should_show_video = /accumulator|turboslong|vanilla/i.test(selected_contract_type);
    const is_description_tab_selected = selected_tab === TABS.DESCRIPTION;
    const is_glossary_tab_selected = selected_tab === TABS.GLOSSARY;
    const width = is_mobile ? '328' : '528';
    const scroll_bar_height = has_toggle_buttons ? '464px' : '560px';
    const button_name = contract_types?.find(item => item.value === selected_contract_type)?.text;

    const onClickGlossary = (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        clickAndKeyEventHandler(() => setSelectedTab(TABS.GLOSSARY), e);
    };

    const cards = contract_types?.map((type: TContractType) => {
        if (type.value !== selected_contract_type) return null;
        return (
            <div key={type.value} className='contract-type-info__card'>
                <ThemedScrollbars
                    className={classNames('contract-type-info__scrollbars', {
                        'contract-type-info__scrollbars-description--active': is_description_tab_selected,
                        'contract-type-info__scrollbars-glossary contract-type-info__scrollbars-glossary--active ':
                            is_glossary_tab_selected,
                    })}
                    style={{
                        left: `${is_description_tab_selected ? '-' : ''}${width}px`,
                        transform: `translate3d(${is_description_tab_selected ? '' : '-'}${width}px, 0, 0)`,
                    }}
                    height={is_mobile ? '' : scroll_bar_height}
                    autohide={false}
                >
                    <div className={classNames('contract-type-info__content')}>
                        {is_description_tab_selected ? (
                            <TradeCategories
                                category={type.value}
                                onClick={onClickGlossary}
                                is_vanilla_fx={is_vanilla_fx}
                                is_multiplier_fx={!cached_multiplier_cancellation_list?.length}
                            />
                        ) : (
                            <ContractTypeGlossary
                                category={type.value}
                                is_vanilla_fx={is_vanilla_fx}
                                is_multiplier_fx={!cached_multiplier_cancellation_list?.length}
                                is_major_pairs={isMajorPairsSymbol(symbol, active_symbols)}
                            />
                        )}
                    </div>
                </ThemedScrollbars>
            </div>
        );
    });

    return (
        <React.Fragment>
            <Dropdown
                id='dt_contract_type_dropdown'
                className='contract-type-info__dropdown'
                list={contract_types as React.ComponentProps<typeof Dropdown>['list']}
                name='contract_type_dropdown'
                value={selected_contract_type}
                // should_autohide={false}
                // should_scroll_to_selected
                onChange={e => setSelectedContractType(e.target.value)}
            />
            <div style={{ minHeight: `${should_show_video ? '18rem' : '16.6rem'}` }}>
                <TradeCategoriesGIF category={selected_contract_type} selected_contract_type={selected_contract_type} />
            </div>
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
                        setSelectedTab(e.target.value as TSelectedTab);
                    }}
                    value={selected_tab}
                />
            </div>
            <div
                className={classNames('contract-type-info', {
                    'contract-type-info--has-toggle-buttons': has_toggle_buttons,
                })}
                style={{
                    width: is_mobile ? '328px' : '528px',
                }}
            >
                {cards}
            </div>
        </React.Fragment>
    );
});

export default Info;
