import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { NavLink } from 'react-router-dom';
import Icon from '../../icon';

export const ResultStatusIcon = ({ is_contract_won, card_labels }) => (
    <span
        className={classNames('result__caption', {
            'result__caption--won': is_contract_won,
            'result__caption--lost': !is_contract_won,
        })}
    >
        {is_contract_won ? (
            <React.Fragment>
                {card_labels.WON}
                <Icon icon='IcCheckmarkCircle' className='result__icon' color='green' />
            </React.Fragment>
        ) : (
            <React.Fragment>
                {card_labels.LOST}
                <Icon icon='IcCrossCircle' className='result__icon' color='red' />
            </React.Fragment>
        )}
    </span>
);

class ResultOverlay extends React.PureComponent {
    handleClick = e => {
        if (this.props.is_unsupported) {
            e.preventDefault();
            this.props.onClick();
        }
    };

    render() {
        const {
            contract_id,
            is_multiplier,
            is_visible,
            onClickRemove,
            result,
            card_labels,
            getContractPath,
            is_positions,
        } = this.props;
        const is_contract_won = result === 'won';
        return (
            <React.Fragment>
                <CSSTransition
                    in={is_visible}
                    timeout={250}
                    classNames={{
                        enter: 'contract-card__result--enter',
                        enterDone: 'contract-card__result--enter-done',
                        exit: 'contract-card__result--exit',
                    }}
                    unmountOnExit
                >
                    <div
                        id={`contract_card_${contract_id}_result`}
                        className={classNames('contract-card__result', {
                            'contract-card__result--won': is_contract_won,
                            'contract-card__result--lost': !is_contract_won,
                            'contract-card__result--lg': is_multiplier,
                        })}
                    >
                        {is_positions && (
                            <span
                                id={`contract_card_${contract_id}_result_close_icon`}
                                className='result__close-btn'
                                onClick={() => onClickRemove(contract_id)}
                            />
                        )}
                        <NavLink
                            className='result__caption-wrapper'
                            to={getContractPath(contract_id)}
                            onClick={this.handleClick}
                        >
                            <ResultStatusIcon is_contract_won={is_contract_won} card_labels={card_labels} />
                        </NavLink>
                    </div>
                </CSSTransition>
            </React.Fragment>
        );
    }
}

ResultOverlay.propTypes = {
    contract_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    is_unsupported: PropTypes.bool,
    is_visible: PropTypes.bool,
    onClick: PropTypes.func,
    onClickRemove: PropTypes.func,
    result: PropTypes.string,
};

export default ResultOverlay;
