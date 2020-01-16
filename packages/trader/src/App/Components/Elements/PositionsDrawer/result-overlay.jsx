import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { CSSTransition }   from 'react-transition-group';
import { NavLink }         from 'react-router-dom';
import { Icon }            from '@deriv/components';
import { getContractPath } from 'App/Components/Routes/helpers';
import { localize }        from '@deriv/translations';

class ResultOverlay extends React.PureComponent {

    handleClick = (e) => {
        if (this.props.is_unsupported) {
            e.preventDefault();
            this.props.onClick();
        }
    }

    render() {
        const {
            contract_id,
            is_visible,
            is_waiting,
            onClickRemove,
        } = this.props;
        const result = is_waiting ? 'waiting' : this.props.result;

        let contract_caption_text_and_icon;
        switch (result) {
            case 'won':
                contract_caption_text_and_icon = (
                    <React.Fragment>
                        {localize('won')}
                        <Icon icon='IcCheckmarkCircle' className='result__icon' color='green' />
                    </React.Fragment>
                );
                break;
            case 'lost':
                contract_caption_text_and_icon = (
                    <React.Fragment>
                        {localize('lost')}
                        <Icon icon='IcCrossCircle' className='result__icon' color='red' />
                    </React.Fragment>
                );
                break;
            case 'waiting':
                contract_caption_text_and_icon = (
                    <React.Fragment>
                        {localize('waiting for exit spot')}
                        <Icon icon='IcMoreCircle' className='result__icon' color='yellow' />
                    </React.Fragment>
                );
                break;
            default:
                break;
        }
        return (
            <React.Fragment>
                <CSSTransition
                    in={is_visible}
                    timeout={250}
                    classNames={{
                        enter    : 'positions-drawer-card__result--enter',
                        enterDone: 'positions-drawer-card__result--enter-done',
                        exit     : 'positions-drawer-card__result--exit',
                    }}
                    unmountOnExit
                >
                    <div
                        id={`dt_drawer_${contract_id}_result`}
                        className={classNames('positions-drawer-card__result', {
                            'positions-drawer-card__result--won'    : result === 'won',
                            'positions-drawer-card__result--lost'   : result === 'lost',
                            'positions-drawer-card__result--waiting': result === 'waiting',
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
                            <span
                                className={classNames('result__caption', {
                                    'result__caption--won'    : result === 'won',
                                    'result__caption--lost'   : result === 'lost',
                                    'result__caption--waiting': result === 'waiting',
                                }
                                )}
                            >
                                { contract_caption_text_and_icon }
                            </span>
                        </NavLink>
                    </div>
                </CSSTransition>
            </React.Fragment>
        );
    }
}

ResultOverlay.propTypes = {
    contract_id   : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    is_unsupported: PropTypes.bool,
    is_visible    : PropTypes.bool,
    is_waiting    : PropTypes.bool,
    onClick       : PropTypes.func,
    onClickRemove : PropTypes.func,
    result        : PropTypes.string,
};

export default ResultOverlay;
