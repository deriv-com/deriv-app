import * as React from 'react';
import { Text, Icon, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import Divider from 'Components/elements/divider';
import { TStringTranslation } from 'Types';

const GetSection: React.FC<TGetSection> = ({
    icon,
    title,
    subtitle,
    trades = [],
    markets = [],
    onClickDemo,
    onClickGet,
    link,
}) => {
    const shareLink = () => {
        // TODO: [dashboard] add share functionality
        // eslint-disable-next-line no-console
        console.log(link);
    };

    return (
        <section className='dw-get dw-get__wrapper'>
            <Icon className='dw-get__icon' icon={icon} width='136' height='136' />
            <div className='dw-get__wrapper dw-get__full-width'>
                <div className='dw-get__wrapper dw-get__header'>
                    <div className='dw-get__wrapper dw-get__header--left'>
                        <Text size='l' weight='bold'>
                            {title}
                        </Text>
                        <Text size='xs'>{subtitle}</Text>
                    </div>
                    <div className='dw-get__wrapper dw-get__header--right'>
                        <Button large tertiary blue onClick={onClickDemo}>
                            {localize('Try demo')}
                        </Button>
                        <Button large blue className='dw-get__header-center' primary onClick={onClickGet}>
                            {localize('Get')}
                        </Button>
                        <Icon
                            onClick={shareLink}
                            className='dw-get__share'
                            icon='IcGetPlatform'
                            width='40'
                            height='40'
                        />
                    </div>
                </div>
                <Divider horizontal />
                <div className='dw-get__wrapper dw-get__trade'>
                    <div className='dw-get__wrapper dw-get__item-wrapper'>
                        <Text className='dw-get__item-title' color='less-prominent' size='xxs'>
                            {localize('Trade')}
                        </Text>
                        <div className='dw-get__item-grid'>
                            {trades.map((trade, idx) => (
                                <div key={idx} className='dw-get__wrapper dw-get__item'>
                                    <Icon className='dw-get__item-icon' icon={trade.icon} width='16' height='16' />
                                    <Text size='xxxs'>{trade.title}</Text>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='dw-get__wrapper dw-get__item-wrapper'>
                        <Text className='dw-get__item-title' color='less-prominent' size='xxs'>
                            {localize('Markets')}
                        </Text>
                        <div className='dw-get__item-grid'>
                            {markets.map((market, idx) => (
                                <div key={idx} className='dw-get__wrapper dw-get__item'>
                                    <Icon className='dw-get__item-icon' icon={market.icon} width='16' height='16' />
                                    <Text size='xxxs'>{market.title}</Text>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Divider horizontal />
            </div>
        </section>
    );
};

type TradeMarketType = {
    icon: string;
    title: TStringTranslation;
};

type TGetSection = {
    icon: string;
    title: TStringTranslation;
    subtitle: TStringTranslation;
    trades: TradeMarketType[];
    markets: TradeMarketType[];
    onClickDemo: React.MouseEventHandler<HTMLButtonElement>;
    onClickGet: React.MouseEventHandler<HTMLButtonElement>;
    link: string;
};

export default GetSection;
