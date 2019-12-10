import React        from 'react';
import PropTypes    from 'prop-types';
<<<<<<< HEAD
import { localize } from 'deriv-translations';
import StringUtils  from '../../utils/string';
=======
import { localize } from 'Components/i18next';
import StringUtils  from 'Utils/string';
>>>>>>> 73642eba4ac792de1cfc00b645fc13a8fcbdbc38
import                   './my-profile.scss';

// TODO: This is just mockup data. it will be removed after Adding BE API.
const user_data = {
    first_name                : 'johny',
    last_name                 : 'bravo',
    security_deposit          : 0,
    buy_trades                : 23,
    sell_trades               : 25,
    past_month_trades         : 42,
    past_month_completion_rate: 99,
    average_release_time      : 5,
    average_release_unit      : 'min',
};

const Cell = ({
    title,
    value,
    upper_sub_value,
    lower_sub_value,
    dimension,
}) => {
    return (
        <div className='my-profile__cell'>
            <div className='my-profile__cell-data'>
                <div className='my-profile__cell-data-main'>
                    {value}
                    <sub className='my-profile__cell-data-dimension' >
                        {dimension}
                    </sub>
                </div>
                <div className='my-profile__cell-data-sub'>
                    <div className='my-profile__cell-data-sub-upper'>
                        {upper_sub_value}
                    </div>
                    <div className='my-profile__cell-data-sub-lower'>
                        {lower_sub_value}
                    </div>
                </div>
            </div>
            <h2 className='my-profile__cell-title'>
                {title}
            </h2>
        </div>
    );
};

Cell.propTypes = {
    dimension      : PropTypes.string,
    lower_sub_value: PropTypes.string,
    title          : PropTypes.string,
    upper_sub_value: PropTypes.string,
    value          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
};

const MyProfile = () => {
    return (
        <div className='my-profile'>
            <h1 className='my-profile__name'>
                {`${StringUtils.toSentenceCase(user_data.first_name)} ${StringUtils.toSentenceCase(user_data.last_name)}`}
            </h1>
            <div className='my-profile__data'>
                <Cell
                    title={localize('Security Deposit')}
                    value={user_data.security_deposit}
                />
                <Cell
                    title={localize('Trades')}
                    value={user_data.buy_trades + user_data.sell_trades}
                    upper_sub_value={localize('{{buy_trades}} buy', { buy_trades: user_data.buy_trades })}
                    lower_sub_value={localize('{{sell_trades}} sell', { sell_trades: user_data.sell_trades })}
                />
                <Cell
                    title={localize('Trades in the last 30 days')}
                    value={user_data.past_month_trades}
                />
                <Cell
                    title={localize('30 day completion rate')}
                    value={`${user_data.past_month_completion_rate}%`}
                />
                <Cell
                    title={localize('Average release time')}
                    value={user_data.average_release_time}
                    dimension={user_data.average_release_unit}
                />
            </div>
        </div>
    );
};

export default MyProfile;
