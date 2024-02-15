import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@deriv/components';
import NewTradeTypeMenu from './new-trade-type-menu';

const NewTradeTypeWidget = () => {
    const [show_trade_type_menu, setShowTradeTypeMenu] = React.useState(false);
    if (show_trade_type_menu)
        return ReactDOM.createPortal(
            <NewTradeTypeMenu onGoBackClick={() => setShowTradeTypeMenu(!show_trade_type_menu)} />,
            document.getElementById('modal_root') as HTMLElement
        );
    return (
        <div className='trade-type_section' onClick={() => setShowTradeTypeMenu(!show_trade_type_menu)}>
            <div className='trade-type_container'>
                <div className='trade-type_container_left'>
                    <div className='trade-type_name'>
                        <Icon icon='IcTradetypeTurboslong' size={18} color='brand' />
                        <p>Turbos</p>
                    </div>
                    <div className='trade-type_name'>
                        <Icon icon='IcUnderlying1HZ75V' size={20} />
                        <p>Volatility 75 (1s) Index</p>
                    </div>
                </div>
                <div className='trade-type_container_right'>
                    <Icon icon='IcChevronRight' height={26} width={24} />
                </div>
            </div>
        </div>
    );
};

export default NewTradeTypeWidget;
