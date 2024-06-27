import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';
import { GLOSSARY } from 'AppV2/Utils/trade-types-utils';

const AccumulatorsTradeDescription = ({ onDefinitionClick }: { onDefinitionClick: (definition: string) => void }) => {
    const content = [
        <Localize
            i18n_default_text='Accumulators allow you to express a view on the range of movement of an index and grow your stake exponentially at a fixed <0>growth rate</0>.'
            components={[
                <span
                    className='description__content-definition'
                    key={0}
                    onClick={() => onDefinitionClick(GLOSSARY.GROWTH_RATE)}
                    onKeyDown={() => onDefinitionClick(GLOSSARY.GROWTH_RATE)}
                />,
            ]}
            key='1'
        />,
        <Localize
            i18n_default_text='Your stake will continue to grow as long as the current spot price remains within a specified <0>range</0> from the <1>previous spot price</1>. Otherwise, you lose your stake and the trade is terminated.'
            components={[
                <span
                    className='description__content-definition'
                    key={0}
                    onClick={() => onDefinitionClick(GLOSSARY.RANGE)}
                    onKeyDown={() => onDefinitionClick(GLOSSARY.RANGE)}
                />,
                <span
                    className='description__content-definition'
                    key={1}
                    onClick={() => onDefinitionClick(GLOSSARY.PREVIOUS_SPOT_PRICE)}
                    onKeyDown={() => onDefinitionClick(GLOSSARY.PREVIOUS_SPOT_PRICE)}
                />,
            ]}
            key='2'
        />,
        <Localize
            i18n_default_text='Your <0>payout</0> is the sum of your initial stake and profit.'
            components={[
                <span
                    className='description__content-definition'
                    key={0}
                    onClick={() => onDefinitionClick(GLOSSARY.PAYOUT)}
                    onKeyDown={() => onDefinitionClick(GLOSSARY.PAYOUT)}
                />,
            ]}
            key='3'
        />,
        <Localize
            i18n_default_text='<0>Take profit</0> is an additional feature that lets you manage your risk by automatically closing the trade when your profit reaches the target amount. This feature is unavailable for ongoing accumulator contracts.'
            components={[
                <span
                    className='description__content-definition'
                    key={0}
                    onClick={() => onDefinitionClick(GLOSSARY.TAKE_PROFIT)}
                    onKeyDown={() => onDefinitionClick(GLOSSARY.TAKE_PROFIT)}
                />,
            ]}
            key='4'
        />,
        <Localize
            i18n_default_text='You can close your trade anytime. However, be aware of <0>slippage risk</0>.'
            components={[
                <span
                    className='description__content-definition'
                    key={0}
                    onClick={() => onDefinitionClick(GLOSSARY.SLIPPAGE_RISK)}
                    onKeyDown={() => onDefinitionClick(GLOSSARY.SLIPPAGE_RISK)}
                />,
            ]}
            key='5'
        />,
    ];
    return (
        <React.Fragment>
            {content.map(paragraph => (
                <Text as='p' key={paragraph.props.i18n_default_text} size='sm' className='description__paragraph'>
                    {paragraph}
                </Text>
            ))}
        </React.Fragment>
    );
};

export default AccumulatorsTradeDescription;
