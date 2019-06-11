import PropTypes          from 'prop-types';
import React              from 'react';
import  DropdownHeader    from '../dropdown/dropdown-header.jsx';
import  DropdownItems     from '../dropdown/dropdown-items.jsx';
import { connect }        from '../../stores/connect';
import { ArrowIcon }      from '../Icons.jsx';
import { translate }      from '../../utils/lang/i18n';
import '../../assets/sass/header/_accounts.scss';

const Accounts = ({
    balance,
    currency,
    isLoggedIn,
    loginid,
    onLoginClick,
}) => (
    isLoggedIn ?
        <div className='acc-info'  >
            <DropdownHeader>
                <React.Fragment>
                    <span className='acc-info-id'>{loginid}</span>
                    {
                        balance &&
                        <span className='acc-info--balance'>
                            <span
                                // className={classNames('symbols', { [`symbols--${(currency || '').toLowerCase()}`]: currency })}
                                className={currency}
                            />
                            {balance}
                        </span>
                    }
                    <ArrowIcon className='acc-info--select-arrow' />
                </React.Fragment>
            </DropdownHeader>
            <DropdownItems />
        </div>
        :
        <div className='account-buttons'>
            <button className='btn btn__secondary btn__secondary--orange' onClick={onLoginClick}>
                <span> {translate('Log in')} </span>
            </button>
            <button className='btn btn__primary--orange'>
                <span> {translate('Sign up')} </span>
            </button>
        </div>
);

Accounts.propTypes = {
    isLoggedIn  : PropTypes.bool,
    onLoginClick: PropTypes.func,

};
export default connect(({ accounts , bot }) => ({
    onLoginClick: accounts.onLoginClick,
    isLoggedIn  : accounts.isLoggedin,
    title       : bot.title,
}))(Accounts);
