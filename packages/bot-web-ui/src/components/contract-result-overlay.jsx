import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import '../assets/sass/contract-result-overlay.scss';

const ContractResultOverlay = props => {
    const has_won_contract = props.profit >= 0;

    return (
        <div
            className={classNames('db-contract-card__result', props.className, {
                'db-contract-card__result--won': has_won_contract,
                'db-contract-card__result--lost': !has_won_contract,
            })}
        >
            <span className='db-contract-card__result-caption'>
                {has_won_contract ? (
                    <React.Fragment>
                        {localize('Won')}
                        <Icon icon='IcCheckmarkCircle' className='db-contract-card__result-icon' color='green' />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {localize('Lost')}
                        <Icon icon='IcCrossCircle' className='db-contract-card__result-icon' color='red' />
                    </React.Fragment>
                )}
            </span>
        </div>
    );
};

ContractResultOverlay.propTypes = {
    profit: PropTypes.number,
};

export default ContractResultOverlay;
