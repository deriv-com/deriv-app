import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@deriv/components';
import NewTradeTypeMenu from './new-trade-type-menu';

const NewTradeTypeWidget = () => {
    const [show_trade_type_menu, setShowTradeTypeMenu] = React.useState(true);
    if (show_trade_type_menu)
        return ReactDOM.createPortal(
            <NewTradeTypeMenu onGoBackClick={() => setShowTradeTypeMenu(!show_trade_type_menu)} />,
            document.getElementById('modal_root') as HTMLElement
        );
    return (
        <div className='trade-type_section' onClick={() => setShowTradeTypeMenu(!show_trade_type_menu)}>
            <div className='trade-type_container'>
                <div className='trade-type_container_left'>
                    <Icon icon='IcTradetypeMultup' size={17} color='brand' />
                    <Icon icon='IcUnderlying1HZ75V' size={20} />
                    <div className='trade-type_name'>
                        Multipliers
                        <span className='trade-type_dot' />
                        <span style={{ color: 'var(--core-color-opacity-black-400, rgba(0, 0, 0, 0.48))' }}>
                            Volatility 75 (1s) Index
                        </span>
                    </div>
                </div>
                <div className='trade-type_container_right'>
                    <Icon icon='IcChevronRight' height={24} width={20} />
                </div>
            </div>
        </div>
    );
};

export default NewTradeTypeWidget;
