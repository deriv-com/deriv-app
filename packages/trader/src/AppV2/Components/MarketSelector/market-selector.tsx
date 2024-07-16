import React, { useState } from 'react';
import ActiveSymbolsList from '../ActiveSymbolsList';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import SymbolIconsMapper from '../SymbolIconsMapper/symbol-icons-mapper';
import { CaptionText, Tag, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const MarketSelector = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const { default_symbol, activeSymbols } = useActiveSymbols({});
    const { symbol: storeSymbol } = useTraderStore();
    const currentSymbol = activeSymbols.find(
        symbol => symbol.symbol === storeSymbol || symbol.symbol === default_symbol
    );

    return (
        <React.Fragment>
            <div className='market-selector__container' onClick={() => setIsOpen(!isOpen)}>
                <div className='market-selector'>
                    <SymbolIconsMapper symbol={storeSymbol ?? default_symbol} />
                    <div className='market-selector-info'>
                        <div className='market-selector-info__label'>
                            <Text bold>{currentSymbol?.display_name}</Text>
                            {!currentSymbol?.exchange_is_open && (
                                <Tag
                                    label={<Localize i18n_default_text='CLOSED' />}
                                    color='error'
                                    variant='fill'
                                    showIcon={false}
                                    size='sm'
                                />
                            )}
                            <LabelPairedChevronDownMdRegularIcon />
                        </div>
                        <CaptionText className='market-selector-info__price'>1234</CaptionText>
                    </div>
                </div>
            </div>
            <ActiveSymbolsList isOpen={isOpen} setIsOpen={setIsOpen} />
        </React.Fragment>
    );
});

export default MarketSelector;
