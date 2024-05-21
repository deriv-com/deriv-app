import React from 'react';
import classNames from 'classnames';
import { CaptionText, Text } from '@deriv-com/quill-ui';
import { useSwipeable } from 'react-swipeable';
import { IconTradeTypes, Money } from '@deriv/components';
import { getCardLabels } from '@deriv/shared';
import { TPortfolioPosition } from '@deriv/stores/types';
import { ContractCardDuration, TContractCardDurationProps } from './contract-card-duration';
import { BinaryLink } from 'App/Components/Routes';

type TContractCardProps = Pick<
    TPortfolioPosition['contract_info'],
    'buy_price' | 'contract_type' | 'sell_time' | 'profit'
> &
    TContractCardDurationProps & {
        className?: string;
        currency?: string;
        isValidToCancel?: boolean;
        isValidToSell?: boolean;
        onClick?: (e?: React.MouseEvent<HTMLAnchorElement>) => void;
        onCancel?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
        onClose?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
        redirectTo?: string;
        symbolName?: string;
        totalProfit?: string | number;
        tradeTypeName?: string;
    };

const DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right',
};

const swipeConfig = {
    trackMouse: true,
    preventScrollOnSwipe: true,
};

const ContractCard = ({
    className,
    contract_type,
    currency,
    buy_price,
    isValidToCancel,
    isValidToSell,
    onCancel,
    onClick,
    onClose,
    profit,
    redirectTo,
    sell_time,
    symbolName,
    totalProfit,
    tradeTypeName,
    ...rest
}: TContractCardProps) => {
    const [isDeleted, setIsDeleted] = React.useState(false);
    const [shouldShowButtons, setShouldShowButtons] = React.useState(false);

    const handleSwipe = (direction: string) => {
        const isLeft = direction === DIRECTION.LEFT;
        setShouldShowButtons(isLeft);
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleSwipe(DIRECTION.LEFT),
        onSwipedRight: () => handleSwipe(DIRECTION.RIGHT),
        ...swipeConfig,
    });

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>, shouldCancel?: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleted(true);
        shouldCancel ? onCancel?.(e) : onClose?.(e);
    };

    return (
        <div className={classNames('contract-card-wrapper', { deleted: isDeleted })}>
            <BinaryLink
                {...(sell_time ? {} : swipeHandlers)}
                onClick={onClick}
                className={classNames('contract-card', className, {
                    [`show-buttons${isValidToCancel ? '--has-cancel-button' : ''}`]: shouldShowButtons,
                    lost: Number(totalProfit) < 0,
                    won: Number(totalProfit) > 0,
                })}
                to={redirectTo}
                onDragStart={e => e.preventDefault()}
            >
                <div className='body'>
                    <div className='details'>
                        <IconTradeTypes className='trade-type__icon' type={contract_type ?? ''} size={32} />
                        <div className='title'>
                            <Text className='trade-type' size='sm'>
                                {tradeTypeName}
                            </Text>
                            <CaptionText className='symbol' size='sm'>
                                {symbolName}
                            </CaptionText>
                        </div>
                        <CaptionText className='stake' size='sm'>
                            <Money amount={buy_price} currency={currency} show_currency />
                        </CaptionText>
                    </div>
                    <div className='status-and-profit'>
                        {sell_time ? (
                            <CaptionText aria-label='status' className='status'>
                                {getCardLabels().CLOSED}
                            </CaptionText>
                        ) : (
                            <ContractCardDuration {...rest} />
                        )}
                        <Text className='total-profit' size='sm'>
                            <Money amount={totalProfit} currency={currency} has_sign show_currency />
                        </Text>
                    </div>
                </div>
                {!sell_time && (
                    <div className='buttons'>
                        {isValidToCancel && (
                            <button
                                className={classNames('icon', 'cancel')}
                                aria-label='cancel'
                                disabled={Number(profit) >= 0}
                                onClick={e => handleClose(e, true)}
                            >
                                <CaptionText bold>{getCardLabels().CANCEL}</CaptionText>
                            </button>
                        )}
                        <button
                            className={classNames('icon', 'close')}
                            aria-label='close'
                            disabled={!isValidToSell}
                            onClick={handleClose}
                        >
                            <CaptionText bold>{getCardLabels().CLOSE}</CaptionText>
                        </button>
                    </div>
                )}
            </BinaryLink>
        </div>
    );
};

export default ContractCard;
