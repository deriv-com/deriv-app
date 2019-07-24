import React        from 'react';
import Modal        from 'react-modal';
import { connect }  from '../stores/connect';
import                   '../assets/sass/_tutorial.scss';
import { translate } from '../utils/lang/i18n';

const customStyles = {
    content: {
        top        : '50%',
        left       : '50%',
        right      : 'auto',
        bottom     : 'auto',
        marginRight: '-50%',
        transform  : 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

const Tutorial = ({
    setShowAgain,
    modal_is_open,
    strategy,
    setStrategy,
    trade_options,
    tradeOptionValues,
    closeModal,
    setTradeOption,
    handleSubmit,
}) => {
    const { market, contract, stake, size, loss, profit } = trade_options;

    return (
        <Modal
            isOpen={modal_is_open}
            contentLabel='Example Modal'
            shouldCloseOnOverlayClick={true}
            onRequestClose={closeModal}
            style={customStyles}
        >

            <span><b>Getting Started</b></span>
            <button onClick={closeModal} style={{ float: 'right' }}>close</button>
            <br />
            <form onSubmit={handleSubmit}>
                <select name='strategy' value={strategy} onChange={e => setStrategy(e.target.value)}>
                    <option value='martingale'>Martingale</option>
                    <option value='dalembert'>D&apos;alembert</option>
                    <option value='oscars_grind'>Oscars Grind</option>
                </select>
                <select name='market' value={tradeOptionValues[market]} onChange={e => setTradeOption(e.target.name, e.target.value)}>
                    <option value='m1'>market 01</option>
                    <option value='m2'>market 02</option>
                    <option value='m3'>market 03</option>
                    <option value='m4'>market 04</option>
                </select>
                <select name='contract' value={tradeOptionValues[contract]} onChange={e => setTradeOption(e.target.name, e.target.value)}>
                    <option value='c1'>contract 01</option>
                    <option value='c2'>contract 02</option>
                    <option value='c3'>contract 03</option>
                    <option value='c4'>contract 04</option>
                </select>
                <br />
                <input type='number' name='stake' min='0' value={tradeOptionValues[stake]} onChange={e => setTradeOption(e.target.name, e.target.value)} placeholder={translate('Initial Stake (USD)')} />
                <input type='number' name='size' min='0' value={tradeOptionValues[size]} onChange={e => setTradeOption(e.target.name, e.target.value)} placeholder={translate('Size')} />
                <input type='number' name='loss' min='0' value={tradeOptionValues[loss]} onChange={e => setTradeOption(e.target.name, e.target.value)} placeholder={translate('Maximum Loss')} />
                <input type='number' name='profit' min='0' value={tradeOptionValues[profit]} onChange={e => setTradeOption(e.target.name, e.target.value)} placeholder={translate('Maximum Profit')} />
                <br />
                <input type='submit' value='OK' />
            </form>
            <input type='checkbox' onChange={e => setShowAgain(e.target.checked)} />Do not show again
        </Modal>
    );
};

const tutorial_component = connect(({ tutorial }) => ({
    setShowAgain     : tutorial.setShowAgain,
    strategy         : tutorial.strategy,
    setStrategy      : tutorial.setStrategy,
    trade_options    : tutorial.trade_options,
    tradeOptionValues: tutorial.tradeOptionValues,
    closeModal       : tutorial.closeModal,
    modal_is_open    : tutorial.modal_is_open,
    setTradeOption   : tutorial.setTradeOption,
    handleSubmit     : tutorial.handleSubmit,
}))(Tutorial);

export { tutorial_component as Tutorial };
