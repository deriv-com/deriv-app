import React, { useState } from 'react';
import ActiveSymbolsList from '../ActiveSymbolsList';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import SymbolIconsMapper from '../SymbolIconsMapper/symbol-icons-mapper';
import { CaptionText, Tag, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { observer } from '@deriv/stores';

const MarketSelector = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const { default_symbol } = useActiveSymbols({});

    return (
        <React.Fragment>
            <div className='market-selector--container' onClick={() => setIsOpen(!isOpen)}>
                <div className='market-selector'>
                    <SymbolIconsMapper symbol={default_symbol} />
                    <div className='market-selector-info'>
                        <div className='market-selector-info__label'>
                            <Text bold>Netherlands 25</Text>
                            <Tag
                                label={<Localize i18n_default_text='CLOSED' />}
                                color='error'
                                variant='fill'
                                showIcon={false}
                                size='sm'
                            />
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
