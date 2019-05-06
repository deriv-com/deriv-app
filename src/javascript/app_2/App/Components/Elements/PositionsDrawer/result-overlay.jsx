import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import IconCheck         from 'Images/app_2/portfolio/ic-check.svg';
import IconCross         from 'Images/app_2/portfolio/ic-cross.svg';
import { localize }      from '_common/localize';

const ResultOverlay = ({
    contract_id,
    onClick,
    onClickRemove,
    result,
    is_shade_visible,
}) => (
    <React.Fragment>
        <CSSTransition
            in={!!(result)}
            timeout={250}
            classNames={{
                enter    : 'positions-drawer-card__result--enter',
                enterDone: 'positions-drawer-card__result--enter-done',
                exit     : 'positions-drawer-card__result--exit',
            }}
            unmountOnExit
        >
            <div className={classNames('positions-drawer-card__result', {
                'positions-drawer-card__result--won'         : (result === 'won'),
                'positions-drawer-card__result--lost'        : (result === 'lost'),
                'positions-drawer-card__result--shade-hidden': (is_shade_visible === true),
            })}
            >
                <span
                    className='result__close-btn'
                    onClick={() => onClickRemove(contract_id)}
                />
                <span
                    className={classNames('result__caption', {
                        'result__caption--won' : (result === 'won'),
                        'result__caption--lost': (result === 'lost'),
                    }
                    )}
                    onClick={() => onClick(contract_id)}
                >
                    {
                        (result === 'won') ?
                            <React.Fragment>
                                {localize('won')}
                                <IconCheck className='result__icon' />
                            </React.Fragment>
                            :
                            <React.Fragment>
                                {localize('lost')}
                                <IconCross className='result__icon' />
                            </React.Fragment>
                    }
                </span>
            </div>
        </CSSTransition>
    </React.Fragment>
);

ResultOverlay.propTypes = {
    contract_id     : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    is_shade_visible: PropTypes.bool,
    onClick         : PropTypes.func,
    onClickRemove   : PropTypes.func,
    result          : PropTypes.string,
};

export default ResultOverlay;
