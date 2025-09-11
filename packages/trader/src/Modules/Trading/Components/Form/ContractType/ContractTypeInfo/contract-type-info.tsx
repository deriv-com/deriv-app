import React from 'react';
import { Button, ThemedScrollbars } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { clickAndKeyEventHandler, TRADE_TYPES } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import TradeCategories from 'Assets/Trading/Categories/trade-categories';
import TradeCategoriesGIF from 'Assets/Trading/Categories/trade-categories-gif';
import { getContractTypes } from '../../../../Helpers/contract-type';
import classNames from 'classnames';
import { useTraderStore } from 'Stores/useTraderStores';
import { TContractType, TList } from '../types';
import { Chip, Text } from '@deriv-com/quill-ui';
import { StandaloneChevronLeftRegularIcon, StandaloneChevronRightRegularIcon } from '@deriv/quill-icons';
import { useMenuNavigation } from './use-menu-navigation';

type TInfo = {
    handleSelect: (
        type: TContractType,
        e: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLInputElement>
    ) => void;
    item: TContractType;
    list: TList[];
    info_banner?: React.ReactNode;
    selected_value: string;
};

const TABS = {
    DESCRIPTION: 'description' as const,
    GLOSSARY: 'glossary' as const,
};

type TSelectedTab = 'description' | 'glossary';

const Info = observer(({ handleSelect, item, selected_value, list, info_banner }: TInfo) => {
    const { cached_multiplier_cancellation_list } = useTraderStore();

    const {
        ui: { is_mobile, is_dark_mode_on: is_dark_theme },

        modules: {
            trade: { is_vanilla_fx },
        },
    } = useStore();
    const { RISE_FALL, RISE_FALL_EQUAL, TURBOS, VANILLA } = TRADE_TYPES;
    const CONTRACT_TYPE_SUBSTITUTE = {
        [RISE_FALL_EQUAL]: RISE_FALL,
        [TURBOS.SHORT]: TURBOS.LONG,
        [VANILLA.PUT]: VANILLA.CALL,
    };
    const [selected_tab, setSelectedTab] = React.useState<TSelectedTab>(TABS.DESCRIPTION);
    const [selected_contract_type, setSelectedContractType] = React.useState(
        CONTRACT_TYPE_SUBSTITUTE[selected_value] ?? selected_value
    );

    const { menuRef, showLeftNav, showRightNav, updateNavVisibility, scrollChips, scrollToSelected } =
        useMenuNavigation({
            selected_value,
        });
    const contract_types: TContractType[] | undefined = getContractTypes(list, item)?.filter(
        (i: { value: TContractType['value'] }) =>
            i.value !== RISE_FALL_EQUAL && i.value !== TURBOS.SHORT && i.value !== VANILLA.PUT
    );
    const should_show_video =
        /accumulator|vanilla|multiplier|high_low|turbos|match_diff|even_odd|over_under|rise_fall|touch/i.test(
            selected_contract_type
        );
    const width = is_mobile ? '328' : '528';
    const scroll_bar_height = '560px';
    const button_name = contract_types?.find(item => item.value === selected_contract_type)?.text;

    const onClickGlossary = (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        clickAndKeyEventHandler(() => setSelectedTab(TABS.GLOSSARY), e);
    };
    const is_unavailable = !!list[0].contract_categories?.find(
        item => item.is_unavailable && item.contract_types.find(type => type.value === selected_contract_type)
    );

    const should_show_dropdown = Number(contract_types?.length) > 1;

    // Auto-scroll to the selected contract type
    React.useEffect(() => {
        scrollToSelected(selected_contract_type);
    }, [selected_contract_type, scrollToSelected]);

    const cards = contract_types?.map((type: TContractType) => {
        if (type.value !== selected_contract_type) return null;
        return (
            <div key={type.value} className='contract-type-info__card'>
                <ThemedScrollbars
                    className={classNames('contract-type-info__scrollbars', {
                        'contract-type-info__scrollbars--active': true,
                    })}
                    style={{
                        left: `${'-'}${width}px`,
                        transform: `translate3d(${width}px, 0, 0)`,
                    }}
                    height={is_mobile ? '' : scroll_bar_height}
                    autohide={false}
                >
                    <div
                        className={classNames('contract-type-info__content', {
                            'contract-type-info__gif--has-video': should_show_video,
                        })}
                    >
                        <React.Fragment>
                            <TradeCategories
                                category={type.value}
                                onClick={onClickGlossary}
                                is_vanilla_fx={is_vanilla_fx}
                                is_multiplier_fx={!cached_multiplier_cancellation_list?.length}
                            />
                            <div className='contract-type-info__video-wrapper-border'>
                                <TradeCategoriesGIF
                                    category={type.value}
                                    selected_contract_type={selected_contract_type}
                                />
                            </div>
                        </React.Fragment>
                    </div>
                </ThemedScrollbars>
            </div>
        );
    });

    return (
        <React.Fragment>
            {should_show_dropdown && (
                <div className='guide__menu-container'>
                    {showLeftNav && (
                        <div className='guide__menu-nav guide__menu-nav--prev' onClick={() => scrollChips('left')}>
                            <StandaloneChevronLeftRegularIcon
                                fill={is_dark_theme ? '#FFFFFF' : '#000000'}
                                iconSize='md'
                            />
                        </div>
                    )}
                    <div className='guide__menu' ref={menuRef} onScroll={updateNavVisibility}>
                        {contract_types?.map(({ text, value }) => (
                            <Chip.Selectable
                                key={value}
                                data-value={value}
                                onChipSelect={() => {
                                    setSelectedContractType(value);
                                    Analytics.trackEvent('ce_trade_types_form', {
                                        action: 'info_switcher',
                                        trade_type_name: contract_types?.find(item => item.value === value)?.text,
                                    });
                                }}
                                selected={selected_contract_type === value}
                            >
                                <Text size='sm'>{text}</Text>
                            </Chip.Selectable>
                        ))}
                    </div>
                    {showRightNav && (
                        <div className='guide__menu-nav guide__menu-nav--next' onClick={() => scrollChips('right')}>
                            <StandaloneChevronRightRegularIcon
                                fill={is_dark_theme ? '#FFFFFF' : '#000000'}
                                iconSize='md'
                            />
                        </div>
                    )}
                </div>
            )}
            {is_unavailable && <div className='contract-type-info__banner-wrapper'>{info_banner}</div>}

            <div
                className={classNames('contract-type-info', {
                    'contract-type-info--has-only-toggle-buttons': !is_unavailable && !should_show_dropdown,
                    'contract-type-info--has-only-dropdown': !is_unavailable && should_show_dropdown,

                    'contract-type-info--has-dropdown-and-info': is_unavailable && should_show_dropdown,
                })}
                style={{
                    width: is_mobile ? '328px' : '528px',
                }}
            >
                {cards}
            </div>
            <div className='contract-type-info__trade-type-btn-wrapper'>
                <Button
                    id={`dt_contract_info_${selected_contract_type}_btn`}
                    className='contract-type-info__button'
                    onClick={e =>
                        handleSelect(
                            {
                                value:
                                    selected_contract_type === CONTRACT_TYPE_SUBSTITUTE[selected_value]
                                        ? selected_value
                                        : selected_contract_type,
                            },
                            e
                        )
                    }
                    text={localize('Choose {{contract_type}}', {
                        contract_type: button_name ?? '',
                        interpolation: { escapeValue: false },
                    })}
                    black
                    is_disabled={is_unavailable}
                />
            </div>
        </React.Fragment>
    );
});

export default Info;
