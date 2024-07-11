import React from 'react';
import { InlineMessage, WalletText } from '../../../../../../components';

const onClickLiveChat = () => window.LC_API.open_chat_window();

const NeedHelpMessage = () => {
    return (
        <div className='wallets-tax-information__message'>
            <InlineMessage type='information' variant='contained'>
                <WalletText size='xs'>
                    Need help with tax info? Let us know via{' '}
                    <button className='wallets-link wallets-link__variant--bold' onClick={onClickLiveChat}>
                        live chat
                    </button>
                    .
                </WalletText>
            </InlineMessage>
        </div>
    );
};

export default NeedHelpMessage;
