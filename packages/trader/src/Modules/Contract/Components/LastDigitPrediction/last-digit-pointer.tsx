import classNames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';

type TLastDigitPointer = {
    is_lost?: boolean;
    is_trade_page?: boolean;
    is_won?: boolean;
    position: {
        left: number;
        top: number;
    };
};

const LastDigitPointer = ({ is_lost, is_trade_page, is_won, position }: TLastDigitPointer) => (
    <React.Fragment>
        {!!position && (
            <span
                className='digits__pointer'
                style={{ transform: `translate3d(calc(${position.left}px), ${position.top}px, 0px)` }}
            >
                <Icon
                    icon='IcProfit'
                    className={classNames('digits__icon', {
                        'digits__icon--win': is_won && !is_trade_page,
                        'digits__icon--loss': is_lost && !is_trade_page,
                    })}
                    color={is_won ? 'green' : 'red'}
                    custom_color={!(is_won || is_lost) ? 'var(--brand-orange)' : undefined}
                />
            </span>
        )}
    </React.Fragment>
);

export default LastDigitPointer;
