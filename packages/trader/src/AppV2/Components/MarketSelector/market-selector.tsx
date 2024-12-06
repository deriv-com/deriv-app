import React, { useState } from 'react';
import ActiveSymbolsList from '../ActiveSymbolsList';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import SymbolIconsMapper from '../SymbolIconsMapper/symbol-icons-mapper';
import { CaptionText, Skeleton, Tag, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { useLocalStorageData } from '@deriv/hooks';
import GuideContainer from '../OnboardingGuide/GuideForPages/guide-container';
import { Step } from 'react-joyride';

const MarketSelector = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const { activeSymbols } = useActiveSymbols();
    const { symbol: storeSymbol, tick_data, is_market_closed } = useTraderStore();
    const [guide_dtrader_v2, setGuideDtraderV2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2', {
        trade_types_selection: false,
        trade_page: false,
        positions_page: false,
        market_selector: false,
    });
    const [should_run, setShouldRun] = React.useState(false);

    const STEPS = [
        {
            content: <Localize i18n_default_text='Explore available markets here.' />,
            offset: 4,
            placement: 'top' as Step['placement'],
            spotlightPadding: 8,
            target: '.joyride-element',
            title: <Localize i18n_default_text='Select a market' />,
            disableBeacon: true,
        },
    ];

    const currentSymbol = activeSymbols.find(({ symbol }) => symbol === storeSymbol);
    const { pip_size, quote } = tick_data ?? {};
    const current_spot = quote?.toFixed(pip_size);
    const current_spot_replacement = is_market_closed ? (
        <Text>-</Text>
    ) : (
        <Skeleton.Square height={18} width={64} rounded />
    );

    // For closed markets exchange_is_open === 0
    if (typeof currentSymbol?.exchange_is_open === 'undefined')
        return <Skeleton.Square height={42} width={240} rounded />;

    const onClick = () => {
        if (guide_dtrader_v2?.market_selector) {
            setShouldRun(false);
        } else {
            setGuideDtraderV2({ ...guide_dtrader_v2, market_selector: true });
            setShouldRun(true);
        }
        setIsOpen(true);
    };

    return (
        <React.Fragment>
            <div className='market-selector__container' onClick={onClick}>
                <div className='market-selector'>
                    <SymbolIconsMapper symbol={storeSymbol} />
                    <div className='market-selector-info'>
                        <div className='market-selector-info__label'>
                            <Text bold>{currentSymbol?.display_name}</Text>
                            {!currentSymbol?.exchange_is_open && (
                                <Tag
                                    label={<Localize key='closed' i18n_default_text='CLOSED' />}
                                    color='error'
                                    variant='fill'
                                    showIcon={false}
                                    size='sm'
                                />
                            )}
                            <LabelPairedChevronDownMdRegularIcon fill='var(--component-textIcon-normal-default' />
                        </div>
                        {current_spot ? (
                            <CaptionText className='market-selector-info__price'>{current_spot}</CaptionText>
                        ) : (
                            current_spot_replacement
                        )}
                    </div>
                </div>
            </div>
            <ActiveSymbolsList isOpen={isOpen} setIsOpen={setIsOpen} />
            <GuideContainer should_run={should_run} steps={STEPS} />
        </React.Fragment>
    );
});

export default MarketSelector;
