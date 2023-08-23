import React from 'react';
import { Button, ThemedScrollbars, ButtonToggle } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import TradeCategories from 'Assets/Trading/Categories/trade-categories';
import TradeCategoriesGIF from 'Assets/Trading/Categories/trade-categories-gif';
import { getContractTypes } from '../../../../Helpers/contract-type';
import ContractTypeGlossary from './contract-type-glossary';
import classNames from 'classnames';
import { TContractType, TList } from '../types';

type TInfo = {
    handleSelect: (
        type: TContractType,
        e: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLInputElement>
    ) => void;
    item: TContractType;
    list: TList[];
};

const TABS = {
    DESCRIPTION: 'description',
    GLOSSARY: 'glossary',
};

const Info = ({ handleSelect, item, list }: TInfo) => {
    const [selected_tab, setSelectedTab] = React.useState(TABS.DESCRIPTION);
    const contract_types: TContractType[] | undefined = getContractTypes(list, item)?.filter(
        (i: { value: TContractType['value'] }) => i.value !== 'rise_fall_equal' && i.value !== 'turbosshort'
    );
    const has_toggle_buttons = /accumulator|vanilla/i.test(item.value);
    const should_show_video = /accumulator|vanilla/i.test(item.value);
    const is_description_tab_selected = selected_tab === TABS.DESCRIPTION;
    const is_glossary_tab_selected = selected_tab === TABS.GLOSSARY;
    const width = isMobile() ? '328' : '528';
    const scroll_bar_height = has_toggle_buttons ? '464px' : '560px';
    const onClickGlossary = () => setSelectedTab(TABS.GLOSSARY);

    const cards = contract_types?.map((type: TContractType) => {
        if (type.value !== item.value) return null;
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
                    height={isMobile() ? '' : scroll_bar_height}
                    autohide={false}
                >
                    <div
                        className={classNames('contract-type-info__content', {
                            'contract-type-info__gif': is_description_tab_selected,
                            'contract-type-info__gif--has-toggle-buttons': has_toggle_buttons,
                            'contract-type-info__gif--has-video': should_show_video && is_description_tab_selected,
                        })}
                    >
                        {is_description_tab_selected ? (
                            <React.Fragment>
                                <TradeCategoriesGIF category={type.value} selected_contract_type={item?.value} />
                                <TradeCategories category={type.value} onClick={onClickGlossary} />
                            </React.Fragment>
                        ) : (
                            <ContractTypeGlossary category={type.value} />
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
            <div
                className={classNames('contract-type-info', {
                    'contract-type-info--has-toggle-buttons': has_toggle_buttons,
                })}
                style={{
                    width: isMobile() ? '328px' : '528px',
                }}
            >
                {cards}
            </div>
            <div className='contract-type-info__trade-type-btn-wrapper'>
                <Button
                    id={`dt_contract_info_${item?.value}_btn`}
                    className='contract-type-info__button'
                    onClick={e => handleSelect(item, e)}
                    text={localize('Choose {{contract_type}}', {
                        contract_type: item?.text,
                        interpolation: { escapeValue: false },
                    })}
                    secondary
                />
            </div>
        </React.Fragment>
    );
};

export default Info;
