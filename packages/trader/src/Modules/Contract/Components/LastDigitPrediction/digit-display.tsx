import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DesktopWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Bounce } from 'App/Components/Animations';
import Digit from './digit';
import DigitSpot from './digit-spot';
import LastDigitStat from './last-digit-stat';
import { ProposalOpenContract } from '@deriv/api-types';

type TDigitDisplay = Pick<React.ComponentProps<typeof DigitSpot>, 'is_lost' | 'is_won'> &
    Pick<React.ComponentProps<typeof Digit>, 'is_lost' | 'is_won'> &
    Pick<React.ComponentProps<typeof LastDigitStat>, 'is_max' | 'is_min'> & {
        barrier: number | null;
        is_digit_contract?: boolean;
        has_entry_spot: boolean;
        onSelect: ((digit_value: number) => void) | null;
        latest_digit: {
            digit: number | null;
            spot: string | null;
        };
        selected_digit?: number;
        status: ProposalOpenContract['status'];
        stats?: number | null;
        value: number;
        onLastDigitSpot?: (value: {
            spot: TDigitDisplay['latest_digit']['spot'];
            is_lost: TDigitDisplay['is_lost'];
            is_selected_winning: boolean;
            is_latest: boolean;
            is_won: TDigitDisplay['is_won'];
        }) => void;
    };
const DigitDisplay = ({
    barrier,
    is_digit_contract,
    has_entry_spot,
    is_lost,
    is_max,
    is_min,
    is_won,
    onSelect,
    latest_digit,
    selected_digit,
    status,
    stats,
    value,
    onLastDigitSpot,
}: TDigitDisplay) => {
    const { digit, spot } = latest_digit;
    const is_latest = value === digit;
    const is_selected = value === barrier;
    const is_selected_winning = digit === barrier;
    const percentage = stats ? (stats * 100) / 1000 : null;

    React.useEffect(() => {
        if (onLastDigitSpot) {
            onLastDigitSpot({ spot, is_lost, is_selected_winning, is_latest, is_won });
        }
    }, [latest_digit, spot, barrier, value, is_lost, is_selected_winning, is_latest, is_won, onLastDigitSpot]);

    const is_digit_selectable = isMobile() && typeof onSelect === 'function' && !status;
    const is_digit_selected = isMobile() && value === selected_digit && !status;
    return (
        <div
            className={classNames('digits__digit', {
                'digits__digit--latest': is_latest,
                'digits__digit--win': is_won && is_latest,
                'digits__digit--loss': is_lost && is_latest,
                'digits__digit--is-selectable': is_digit_selectable,
                'digits__digit--is-selected': is_digit_selected,
            })}
            onClick={() => {
                if (!is_digit_selectable) return;
                onSelect(value);
            }}
        >
            <LastDigitStat is_min={is_min} is_max={is_max} is_selected={is_selected} percentage={percentage} />
            <DesktopWrapper>
                <Bounce
                    is_visible={!!(is_digit_contract && is_latest && spot && status && has_entry_spot)}
                    className='digits__digit-spot'
                    keyname='digits__digit-spot'
                >
                    <DigitSpot
                        current_spot={spot}
                        is_lost={is_lost}
                        is_selected_winning={is_selected_winning}
                        is_won={is_won}
                    />
                </Bounce>
            </DesktopWrapper>
            <Digit
                is_latest={is_latest}
                is_lost={is_lost}
                is_selected={is_selected}
                is_won={is_won}
                percentage={percentage}
                value={value}
            />
        </div>
    );
};

export default observer(DigitDisplay);
