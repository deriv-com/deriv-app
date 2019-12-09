import React from 'react';
import { Button, Dialog } from 'deriv-components';
import { localize } from 'deriv-translations';
import Popup from './popup.jsx';
import './orders.scss';

const Orders = () => {
    const [show_popup, setShowPopup] = React.useState(false);
    const [popup_options, setPopupOptions] = React.useState({});

    const onCancelClick = () => {
        setShowPopup(false);
    }

    const onConfirmation = () => {
        // eslint-disable-next-line no-console
        console.log('confirmed')
    }

    const popupSellConfirm = () => {
        const options = {
            title: localize('Have you received funds?'),
            message: localize('Make sure that you have logged in your bank account or other e-wallet to check the receipt.'),
            need_confirmation: true,
            offer: {
                currency       : 'IDR',
                asset          : 'USD',
                fix_price      : 12000,
                amount         : 20,
            },
            onClickConfirm: onConfirmation,
        }
        setPopupOptions(options);
        setShowPopup(true);
    }
    const popupBuyCancelUnpaid = () => {
        const options = {
            title: localize('Confirm this payment?'),
            message: localize('Make sure you have successfully sent the funds to the seller’s bank account or e-wallet mentioned above.'),
            has_cancel: true,
            cancel_text: localize('I didn\'t pay yet'),
            confirm_text: localize('I\'ve paid'),
            onClickConfirm: onConfirmation,
        }
        setPopupOptions(options);
        setShowPopup(true);
    }
    const popupBuyCancelOrder = () => {
        const options = {
            title: localize('Cancel this order?'),
            message: localize('There will be no refund after canceling the order. If you have paid, please do not cancel the order.'),
            confirm_text: localize('Cancel this order'),
            onClickConfirm: onConfirmation,
        }
        setPopupOptions(options);
        setShowPopup(true);
    }
    return (
        <div className='orders'>
            <Button className='orders__button' primary onClick={popupSellConfirm}>Show popup sell confirm</Button>
            <Button className='orders__button' primary onClick={popupBuyCancelUnpaid}>Show popup buy cancel unpaid</Button>
            <Button className='orders__button' primary onClick={popupBuyCancelOrder}>Show popup buy cancel order</Button>
            {show_popup && (
                <div className='orders__dialog'>
                    <Dialog
                        is_visible={show_popup}
                        disableApp={() => {
                            /* do nothing // disableApp is a mandatory props in dialog */
                        }}
                        enableApp={() => {
                            /* do nothing // enableApp is a mandatory props in dialog */
                        }}
                    >
                        <Popup {...popup_options} onCancel={onCancelClick} />
                    </Dialog>
                </div>
            )}
        </div>
    );
};
 
export default Orders;
