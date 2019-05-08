import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import ErrorComponent    from 'App/Components/Elements/Errors';
import { connect }       from 'Stores/connect';
import ContractDetails   from './contract-details.jsx';
import Digits            from './digits.jsx';
import InfoBox           from './info-box.jsx';

const SmartChart = React.lazy(() => import('Modules/SmartChart'));

const Contract = ({
    is_mobile,
    error_message,
    has_error,
    match,
    symbol,
}) => {
    const form_wrapper_class = is_mobile ? 'mobile-wrapper' : 'sidebar__container desktop-only';
    return (
        <React.Fragment>
            {
                has_error ?
                    <ErrorComponent message={error_message} />
                    :
                    <div className='trade-container'>
                        <div className='chart-container'>
                            {symbol &&
                                <React.Suspense fallback={<div>Loading... </div>}>
                                    <SmartChart
                                        InfoBox={<InfoBox />}
                                        Digits={<Digits />}
                                        symbol={symbol}
                                    />
                                </React.Suspense>
                            }
                        </div>
                        <div className={form_wrapper_class}>
                            <CSSTransition
                                in={!has_error}
                                timeout={400}
                                classNames={{
                                    enter    : 'contract--enter',
                                    enterDone: 'contract--enter-done',
                                    exit     : 'contract--exit',
                                }}
                                unmountOnExit
                            >
                                <div className='contract__wrapper'>
                                    <ContractDetails
                                        contract_id={match.params.contract_id}
                                        key={match.params.contract_id}
                                    />
                                </div>
                            </CSSTransition>
                        </div>
                    </div>
            }
        </React.Fragment>
    );
};

Contract.propTypes = {
    error_message: PropTypes.string,
    has_error    : PropTypes.bool,
    is_mobile    : PropTypes.bool,
    match        : PropTypes.object,
    symbol       : PropTypes.string,
};

export default connect(
    ({ modules, ui }) => ({
        error_message: modules.contract.error_message,
        has_error    : modules.contract.has_error,
        is_mobile    : ui.is_mobile,
        symbol       : modules.contract.contract_info.underlying,
    }),
)(Contract);
