import React, { useState } from 'react';
import classNames from 'classnames';
import WalletHeader from 'Components/wallet-header';
import WalletContent from 'Components/wallet-content';
import { CSSTransition } from 'react-transition-group';
import { TWalletAccount } from 'Types';
import { useTestModal } from 'Components/wallets/modals/test-modal';
import { useModal } from '@deriv/hooks';
import { TestModalForHook, TestModalWithUsualProps } from 'Components/wallets/modals/test-modal/test-modal';
import './wallet.scss';

type TWallet = {
    wallet_account: TWalletAccount;
};

const Wallet = ({ wallet_account }: TWallet) => {
    const headerRef = React.useRef<HTMLDivElement>(null);
    const { is_selected, is_demo, is_malta_wallet } = wallet_account;
    const { setIsOpen, modal } = useTestModal(wallet_account?.loginid); // 1st place
    const [is_open_with_usual_props, setIsOpenWithUsualProps] = useState(false); // 2nd place
    // const { state, toggle } = useToggle(); // 3rd place
    const { setIsOpen: setIsOpenFromHook, modal: modalFromHook } = useModal(TestModalForHook); // 4th place

    return (
        <div ref={headerRef} className={classNames('wallet', { wallet__demo: is_demo })}>
            <button onClick={() => setIsOpen(prev => !prev)}>toggle modal</button>
            {modal}
            <button onClick={() => setIsOpenFromHook(prev => !prev)}>toggle hook modal</button>
            {modalFromHook}
            <button onClick={() => setIsOpenWithUsualProps(prev => !prev)}>toggle usual modal with props</button>
            {/* <button onClick={toggle}>toggle by useToggle</button> */}
            <TestModalWithUsualProps is_open={is_open_with_usual_props} setIsOpen={setIsOpenWithUsualProps} />
            {/* <TestModalWithUsualProps is_open={state} setIsOpen={toggle} /> */}
            <WalletHeader wallet_account={wallet_account} />
            <CSSTransition
                appear
                in={is_selected}
                timeout={240}
                onEntered={() => {
                    if (headerRef?.current) {
                        headerRef.current.style.scrollMargin = '20px';
                        headerRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                }}
                classNames='wallet__content-transition'
                unmountOnExit
            >
                <WalletContent is_demo={is_demo} is_malta_wallet={is_malta_wallet} />
            </CSSTransition>
        </div>
    );
};

export default Wallet;
