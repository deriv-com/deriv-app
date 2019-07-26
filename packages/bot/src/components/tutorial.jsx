import React from 'react';
import Modal from 'react-modal';
import { connect } from '../stores/connect';
import { translate } from '../utils/lang/i18n';
import '../assets/sass/_tutorial.scss';

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
    const {
        duration,
        stake,
        size,
        loss,
        profit,
    } = trade_options;

    const loopAllDropdown = () => {
        const selects = [];
        Object.keys(trade_options).forEach((key, index) => {
            if (typeof trade_options[key] === 'string'){
                selects.push(
                    <SelectDropDown
                        key={index}
                        name={key}
                        tradeOptionValues={trade_options[key]}
                        setTradeOption={setTradeOption}
                    />
                );
            }
        });

        return selects;
    };

    return (
        <Modal
            isOpen={modal_is_open}
            contentLabel='Example Modal'
            shouldCloseOnOverlayClick={true}
            onRequestClose={closeModal}
            style={customStyles}
        >

            <h2><b>Getting Started</b>
                <button onClick={closeModal} style={{ float: 'right', cursor: 'pointer' }}>✖</button>
            </h2>
            <br />
            <form onSubmit={handleSubmit}>
                <select name='strategy' value={strategy} onChange={e => setStrategy(e.target.value)}>
                    <option value='martingale'>Martingale</option>
                    <option value='dalembert'>D&apos;alembert</option>
                    <option value='oscars_grind'>Oscars Grind</option>
                </select>
                {loopAllDropdown()}
                <br /><br />
                <NumberInput label={translate('Trade Amount')} name='stake' min='0' value={tradeOptionValues[stake]} setTradeOption={setTradeOption} placeholder={translate('USD')} />
                <NumberInput label={translate('Duration')} name='duration' min='0' value={tradeOptionValues[duration]} setTradeOption={setTradeOption} placeholder={translate('Duration')} />
                <NumberInput label={translate('Size')} name='size' min='0' value={tradeOptionValues[size]} setTradeOption={setTradeOption} placeholder={translate('Trade Size')} />
                <NumberInput label={translate('Maximum Possible Loss')} name='loss' min='0' value={tradeOptionValues[loss]} setTradeOption={setTradeOption} placeholder={translate('Loss')} />
                <NumberInput label={translate('Expected Profit')} name='profit' min='0' value={tradeOptionValues[profit]} setTradeOption={setTradeOption} placeholder={translate('Profit')} />
                <br />
                <input type='submit' value='OK' />
            </form>
            <input type='checkbox' onChange={e => setShowAgain(e.target.checked)} />Do not show again
        </Modal>
    );
};

const NumberInput = ({ label, name, value, placeholder, min, setTradeOption }) => {
    return (
        <React.Fragment>
            <div>
                <span>{label}</span>
                <br />
                <input
                    type='number'
                    name={name}
                    min={min}
                    value={value}
                    onChange={e => setTradeOption(e.target.name, e.target.value)}
                    placeholder={placeholder}
                />
            </div>
            <br />
        </React.Fragment>
    );
};

const SelectDropDown = ({ name, value, setTradeOption }) => {

    // temp options without api
    const loopOptions = (optionName) => {
        const options = [];
        
        for (let i = 1; i <= 5; i++) {
            const optionValue = `${optionName  } ${  i}`;
            options.push(<option key={i} value={optionValue}>{optionValue}</option>);
        }

        return options;
    };
    
    return (
        <div style={{ display: 'flow-root' }}>
            <span style={{ float: 'left' }}>{name}</span>
            <select style={{ float: 'right' }} name={name} value={value} onChange={e => setTradeOption(e.target.name, e.target.value)}>
                {loopOptions(name)}
            </select>
        </div>
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
