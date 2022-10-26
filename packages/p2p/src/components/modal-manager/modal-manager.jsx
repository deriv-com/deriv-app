import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { getUrlBase, moduleLoader } from '@deriv/shared';
import BuySellModal from './modals/buy-sell-modal.jsx';

// const Module = moduleLoader(() =>
//     import(/* webpackChunkName: "p2p_modal_manager", webpackPreload: true */ '@deriv/p2p')
// );

// export function setP2PPublicPath(path) {
//     __webpack_public_path__ = path; // eslint-disable-line no-global-assign
//     console.log('pub path', __webpack_public_path__);
// }

// setP2PPublicPath(getUrlBase('lib'));

// const LazyModal = React.lazy(() =>
//     moduleLoader(() =>
//         import(/* webpackChunkName: "buy-sell-modal" webpackPreload: true */ './modals/buy-sell-modal.jsx')
//     )
// );

const ModalManager = () => {
    const { modal_store } = useStores();

    React.useEffect(() => {
        const onUnmount = modal_store.onMount();

        return onUnmount;
    }, []);

    if (modal_store.modal_id !== '') {
        return <BuySellModal />;
    }
    return <></>;
};

export default observer(ModalManager);
