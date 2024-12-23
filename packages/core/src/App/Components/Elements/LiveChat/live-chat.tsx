import { Icon, Popover, Text } from '@deriv/components';
import { useIsFreshchatAvailable, useIsIntercomAvailable, useIsLiveChatWidgetAvailable } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { Chat } from '@deriv/utils';
import { useDevice } from '@deriv-com/ui';

const LiveChat = observer(({ showPopover }: { showPopover?: boolean }) => {
    const { isDesktop } = useDevice();

    const { is_livechat_available } = useIsLiveChatWidgetAvailable();

    const fcAvailable = useIsFreshchatAvailable();
    const icAvailable = useIsIntercomAvailable();

    const isNeitherChatNorLiveChatAvailable = !is_livechat_available && !fcAvailable && !icAvailable;

    if (isNeitherChatNorLiveChatAvailable) {
        return null;
    }

    // Quick fix for making sure livechat won't popup if feature flag is late to enable.
    // We will add a refactor after this
    setInterval(() => {
        if (fcAvailable || icAvailable) {
            if (
                window.LiveChatWidget &&
                typeof window.LiveChatWidget.call === 'function' &&
                typeof window.LiveChatWidget.call('destroy') === 'function'
            ) {
                window.LiveChatWidget.call('destroy');
            }
        }
    }, 10);

    const liveChatClickHandler = () => {
        Chat.open();
    };

    if (isDesktop)
        return (
            <div onKeyDown={liveChatClickHandler} onClick={liveChatClickHandler}>
                {showPopover ? (
                    <Popover
                        className='footer__link'
                        classNameBubble='help-centre__tooltip'
                        alignment='top'
                        message={<Localize i18n_default_text='Live chat' />}
                        zIndex='9999'
                    >
                        <Icon icon='IcLiveChat' className='footer__icon gtm-deriv-livechat' />
                    </Popover>
                ) : (
                    <div className='footer__link'>
                        <Icon icon='IcLiveChat' className='footer__icon gtm-deriv-livechat' />
                    </div>
                )}
            </div>
        );

    return (
        <div className='livechat gtm-deriv-livechat' onKeyDown={liveChatClickHandler} onClick={liveChatClickHandler}>
            <div className='livechat__icon-wrapper'>
                <Icon icon='IcLiveChat' className='livechat__icon' />
            </div>
            <Text size='xs'>
                <Localize i18n_default_text='Live chat' />
            </Text>
        </div>
    );
});

export default LiveChat;
