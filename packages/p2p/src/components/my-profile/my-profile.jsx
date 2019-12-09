import React        from 'react';
import PropTypes    from 'prop-types';
import { localize } from 'deriv-translations';
import                   './my-profile.scss';

// TODO: This is just mockup data. it will be removed after Adding BE API.
const user_data = {
    firstName              : 'johny',
    lastName               : 'bravo',
    securityDeposit        : 0,
    buyTrades              : 23,
    sellTrades             : 25,
    pastMonthTrades        : 42,
    pastMonthCompletionRate: 99,
    averageReleaseTime     : 5,
    averageReleaseUnit     : 'min',
};

function capitalize (string) {
    if (!string) {
        return '';
    }
    return string[0].toUpperCase() + string.slice(1);
}

const Cell = (props) => {
    return (
        <div className='my-profile__cell'>
            <div className='my-profile__cell__data'>
                <div className='my-profile__cell__data__main'>
                    {props.value}
                    <sub className="my-profile__cell__data__main__dimension" >
                        {props.dimension}
                    </sub>
                </div>
                <div className='my-profile__cell__data__sub'>
                    <div className='my-profile__cell__data__sub__upper'>
                        {props.upperSubValue}
                    </div>
                    <div className='my-profile__cell__data__sub__lower'>
                        {props.lowerSubValue}
                    </div>
                </div>
            </div>
            <div className='my-profile__cell__title'>
                {props.title}
            </div>
        </div>
    );
};

Cell.propTypes = {
    title        : PropTypes.string,
    value        : PropTypes.string,
    dimension    : PropTypes.string,
    upperSubValue: PropTypes.string,
    lowerSubValue: PropTypes.string,
};

const MyProfile = () => {
    return (
        <div className='my-profile'>
            <div className='my-profile__name'>
                {`${capitalize(user_data.firstName)} ${capitalize(user_data.lastName)}`}
            </div>
            <div className='my-profile__data'>
                <Cell
                    title={localize('Security Deposit')}
                    value={user_data.securityDeposit}
                />
                <Cell
                    title={localize('Trades')}
                    value={user_data.buyTrades + user_data.sellTrades}
                    upperSubValue={localize('{{ buyTrades }} buy', { buyTrades: user_data.buyTrades })}
                    lowerSubValue={localize('{{ sellTrades }} sell', { sellTrades: user_data.sellTrades })}
                />
                <Cell
                    title={localize('Trades in the last 30 days')}
                    value={user_data.pastMonthTrades}
                />
                <Cell
                    title={localize('30 day completion rate')}
                    value={`${user_data.pastMonthCompletionRate}%`}
                />
                <Cell
                    title={localize('Average release time')}
                    value={user_data.averageReleaseTime}
                    dimension={user_data.averageReleaseUnit}
                />
            </div>
        </div>
    );
};

export default MyProfile;
