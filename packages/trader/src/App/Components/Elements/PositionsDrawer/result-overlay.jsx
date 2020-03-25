import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { NavLink } from 'react-router-dom';
import { Icon } from '@deriv/components';
import { getContractPath } from 'App/Components/Routes/helpers';
import { localize } from '@deriv/translations';

export const ResultStatusIcon = ({ is_contract_won }) => (
    <span
        className={classNames('result__caption', {
            'result__caption--won': is_contract_won,
            'result__caption--lost': !is_contract_won,
        })}
    >
        {is_contract_won ? (
            <React.Fragment>
                {localize('won')}
                <Icon icon='IcCheckmarkCircle' className='result__icon' color='green' />
            </React.Fragment>
        ) : (
            <React.Fragment>
                {localize('lost')}
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
        const { contract_id, is_visible, onClickRemove, result } = this.props;
        const is_contract_won = result === 'won';
        return (
            <React.Fragment>
                <CSSTransition
                    in={is_visible}
                    timeout={250}
                    classNames={{
                        enter: 'positions-drawer-card__result--enter',
                        enterDone: 'positions-drawer-card__result--enter-done',
                        exit: 'positions-drawer-card__result--exit',
                    }}
                    unmountOnExit
                >
                    <div
                        id={`dt_drawer_${contract_id}_result`}
                        className={classNames('positions-drawer-card__result', {
                            'positions-drawer-card__result--won': is_contract_won,
                            'positions-drawer-card__result--lost': !is_contract_won,
                        })}
                    >
                        <span
                            id={`dt_drawer_${contract_id}_result_close_icon`}
                            className='result__close-btn'
                            onClick={() => onClickRemove(contract_id)}
                        />
                        <NavLink
                            className='result__caption-wrapper'
                            to={getContractPath(contract_id)}
                            onClick={this.handleClick}
                        >
                            <ResultStatusIcon is_contract_won={is_contract_won} />
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
