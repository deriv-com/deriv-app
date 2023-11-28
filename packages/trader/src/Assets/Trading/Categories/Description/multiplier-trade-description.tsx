import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const MultiplierTradeDescription = ({
    is_multiplier_fx,
    onClick,
}: {
    is_multiplier_fx?: boolean;
    onClick: (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
}) => {
    const content = [
        <Localize
            i18n_default_text='Use multipliers to leverage your potential returns. Predict if the asset price will move upward (bullish) or downward (bearish). We’ll charge a commission when you open a multipliers trade.'
            key='1'
        />,
        <Localize
            i18n_default_text='If you select "<0>Up</0>", your total profit/loss will be the percentage increase in the underlying asset price, times the multiplier and stake, minus commissions.'
            components={[<strong key={0} />]}
            key='2'
        />,
        <Localize
            i18n_default_text='If you select "<0>Down</0>", your total profit/loss will be the percentage decrease in the underlying asset price, times the multiplier and stake, minus commissions.'
            components={[<strong key={0} />]}
            key='3'
        />,
        <Localize
            i18n_default_text='Your contract will be closed when the <0>stop out</0> level is reached.'
            components={[
                <span
                    className='contract-type-info__content-definition'
                    onClick={onClick}
                    onKeyDown={onClick}
                    key={0}
                />,
            ]}
            key='4'
        />,
        {
            content: is_multiplier_fx ? (
                <Localize
                    i18n_default_text='Additional features are available to manage your positions: “<0>Take profit</0>” and “<0>Stop loss</0>” allow you to adjust your level of risk aversion.'
                    components={[
                        <span
                            className='contract-type-info__content-definition'
                            onClick={onClick}
                            onKeyDown={onClick}
                            key={0}
                        />,
                    ]}
                    key='5'
                />
            ) : (
                <Localize
                    i18n_default_text='Additional features are available to manage your positions: “<0>Take profit</0>”, “<0>Stop loss</0>” and “<0>Deal cancellation</0>” allow you to adjust your level of risk aversion.'
                    components={[
                        <span
                            className='contract-type-info__content-definition'
                            onClick={onClick}
                            onKeyDown={onClick}
                            key={0}
                        />,
                    ]}
                    key='5'
                />
            ),
        },
        <Localize
            i18n_default_text='You can close your trade anytime. However, be aware of <0>slippage risk</0>.'
            components={[
                <span
                    className='contract-type-info__content-definition'
                    onClick={onClick}
                    onKeyDown={onClick}
                    key={0}
                />,
            ]}
            key='6'
        />,
    ] as Array<JSX.Element & { content: JSX.Element }>;
    return (
        <React.Fragment>
            {content.map(paragraph => {
                const key = paragraph.props
                    ? paragraph.props.i18n_default_text
                    : paragraph.content?.props.i18n_default_text;
                const text = paragraph.content ?? paragraph;
                return (
                    <Text as='p' key={key}>
                        {text}
                    </Text>
                );
            })}
        </React.Fragment>
    );
};

export default MultiplierTradeDescription;
