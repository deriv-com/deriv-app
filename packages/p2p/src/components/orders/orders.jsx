import React        from 'react';
import { Dialog } from 'deriv-components';
import { localize } from 'deriv-translations';
import PageReturn   from 'Components/page-return/page-return.jsx';
import OrderDetails from './order-details/order-details.jsx';
import OrderInfo    from './order-info';
import Popup        from './popup.jsx';
import './orders.scss';

const Orders = () => {
    const order_info = new OrderInfo();
    const [order_details, setDetails] = React.useState(order_info);
    const [show_popup, setShowPopup] = React.useState(false);
    const [popup_options, setPopupOptions] = React.useState({});
    // TODO: [p2p-replace-with-api] - remove these dev toggle once data fetch works
    const toggleDetails = () => order_details && order_details.order_id ? setDetails(null) : setDetails(order_info);
    const onCancelClick = () => setShowPopup(false);

    const handleShowPopup = (options) => {
        setPopupOptions(options);
        setShowPopup(true);
    }

    return (
        <div className='orders'>
            { order_details && order_details.order_id &&
                <React.Fragment>
                    <PageReturn
                        onClick={ toggleDetails }
                        page_title={
                            order_details.is_buyer ?
                                localize('Buy {{offered_currency}} order', { offered_currency: order_details.offer_currency })
                                :
                                localize('Sell {{offered_currency}} order', { offered_currency: order_details.offer_currency })
                        }
                    />
                    <OrderDetails
                        order_details={ order_details }
                        showPopup={handleShowPopup}
                    />
                </React.Fragment>
            }
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
