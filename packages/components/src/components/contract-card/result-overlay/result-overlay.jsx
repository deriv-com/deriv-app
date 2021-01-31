import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { NavLink } from 'react-router-dom';
import Icon from '../../icon';

export const ResultStatusIcon = ({ getCardLabels, is_contract_won }) => (
    <span
        className={classNames('dc-result__caption', {
            'dc-result__caption--won': is_contract_won,
            'dc-result__caption--lost': !is_contract_won,
        })}
    >
        {is_contract_won ? (
            <React.Fragment>
                {getCardLabels().WON}
                <Icon icon='IcCheckmarkCircle' className='dc-result__icon' color='green' />
            </React.Fragment>
        ) : (
            <React.Fragment>
                {getCardLabels().LOST}
                <Icon icon='IcCrossCircle' className='dc-result__icon' color='red' />
            </React.Fragment>
        )}
    </span>
);

const ResultOverlay = ({
    contract_id,
    getCardLabels,
    getContractPath,
    is_positions,
    is_unsupported,
    is_visible,
    onClick,
    onClickRemove,
    result,
}) => {
    const handleClick = e => {
        if (is_unsupported) {
            e.preventDefault();
            onClick();
        }
    };

    const is_contract_won = result === 'won';

    return (
        <React.Fragment>
            <CSSTransition
                in={is_visible}
                timeout={250}
                classNames={{
                    enter: 'dc-contract-card__result--enter',
                    enterDone: 'dc-contract-card__result--enter-done',
                    exit: 'dc-contract-card__result--exit',
                }}
                unmountOnExit
            >
                <div
                    id={`dc_contract_card_${contract_id}_result`}
                    className={classNames('dc-contract-card__result', {
                        'dc-result__positions-overlay': is_positions,
                        'dc-contract-card__result--won': is_contract_won,
                        'dc-contract-card__result--lost': !is_contract_won,
                    })}
                >
                    {is_positions && (
                        <span
                            id={`dc_contract_card_${contract_id}_result_close_icon`}
                            className='dc-result__close-btn'
                            onClick={() => onClickRemove(contract_id)}
                        />
                    )}
                    {getContractPath && (
                        <NavLink
                            className='dc-result__caption-wrapper'
                            to={getContractPath(contract_id)}
                            onClick={handleClick}
                        />
                    )}
                    <ResultStatusIcon getCardLabels={getCardLabels} is_contract_won={is_contract_won} />
                </div>
            </CSSTransition>
        </React.Fragment>
    );
};

ResultOverlay.propTypes = {
    contract_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    getCardLabels: PropTypes.func,
    getContractPath: PropTypes.func,
    is_positions: PropTypes.bool,
    is_unsupported: PropTypes.bool,
    is_visible: PropTypes.bool,
    onClick: PropTypes.func,
    onClickRemove: PropTypes.func,
    result: PropTypes.string,
};

export default ResultOverlay;
