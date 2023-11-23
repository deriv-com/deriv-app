import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon } from '@deriv/components';
import { getCardLabels } from '@deriv/shared';

type TPositionsResultMobile = {
    is_visible: boolean;
    result: 'won' | 'lost';
};

const PositionsResultMobile = ({ is_visible, result }: TPositionsResultMobile) => {
    const is_contract_won = result === 'won';
    return (
        <React.Fragment>
            <CSSTransition
                in={is_visible}
                timeout={250}
                classNames={{
                    enter: 'positions-modal-card__result--enter',
                    enterDone: 'positions-modal-card__result--enter-done',
                    exit: 'positions-modal-card__result--exit',
                }}
                unmountOnExit
            >
                <div className='positions-modal-card__caption-wrapper' data-testid='result_mobile'>
                    <span
                        className={classNames('positions-modal-card__caption', {
                            'positions-modal-card__caption--won': is_contract_won,
                            'positions-modal-card__caption--lost': !is_contract_won,
                        })}
                    >
                        <Icon
                            icon='IcPositionClosed'
                            className='positions-modal-card__icon'
                            color={is_contract_won ? 'green' : 'red'}
                        />
                        <span>{getCardLabels().CLOSED}</span>
                    </span>
                </div>
            </CSSTransition>
        </React.Fragment>
    );
};

export default PositionsResultMobile;
