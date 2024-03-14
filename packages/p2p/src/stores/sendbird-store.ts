import { action, computed, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';

import { P2PAdvertiserCreate, P2PAdvertiserInfo } from '@deriv/api-types';
import { epochToMoment, toMoment } from '@deriv/shared';
import { TCoreStores } from '@deriv/stores/types';
import SendbirdChat, { BaseChannel } from '@sendbird/chat';
import { GroupChannel, GroupChannelHandler, GroupChannelModule } from '@sendbird/chat/groupChannel';
import { BaseMessage, FileMessage, MessageType, MessageTypeFilter, UserMessage } from '@sendbird/chat/message';

import BaseStore from 'Stores/base_store';
import ChatMessage, { convertFromChannelMessage } from 'Utils/chat-message';
import { renameFile } from 'Utils/file-uploader';
import { requestWS } from 'Utils/websocket';

type TChatInfo = { app_id: string; user_id: string; token?: string };

export default class SendbirdStore extends BaseStore {
    active_chat_channel: GroupChannel | null = null;
    chat_channel_url: string | null = null;
    chat_info: TChatInfo = { app_id: '', user_id: '' };
    chat_messages: Array<ChatMessage> = [];
    has_chat_error = false;
    is_chat_loading = true;
    should_show_chat_modal = false;
    should_show_chat_on_orders = false;
    file_upload_properties: FileMessage | null = null;
    is_upload_complete = false;
    messages_ref: React.RefObject<HTMLDivElement> | null = null;
    scroll_debounce?: ReturnType<typeof setTimeout>;
    sendbird_api: ReturnType<typeof SendbirdChat.init<GroupChannelModule[]>> | null = null;
    service_token_timeout?: ReturnType<typeof setTimeout>;
    disposeOrderIdReaction?: IReactionDisposer;
    disposeChannelUrlReaction?: IReactionDisposer;
    disposeActiveChatChannelReaction?: IReactionDisposer;

    constructor(root_store: TCoreStores) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super(root_store);

        makeObservable(this, {
            active_chat_channel: observable,
            chat_channel_url: observable.ref,
            chat_info: observable.ref,
            chat_messages: observable.shallow,
            has_chat_error: observable,
            is_chat_loading: observable,
            scroll_debounce: observable.ref,
            should_show_chat_modal: observable,
            should_show_chat_on_orders: observable,
            has_chat_info: computed,
            is_chat_frozen: computed,
            addChannelMessage: action.bound,
            createChatForNewOrder: action.bound,
            onMessagesScroll: action.bound,
            replaceChannelMessage: action.bound,
            sendFile: action.bound,
            setActiveChatChannel: action.bound,
            setChatChannelUrl: action.bound,
            setChatInfo: action.bound,
            setHasChatError: action.bound,
            setIsChatLoading: action.bound,
            setChannelMessages: action.bound,
            setShouldShowChatModal: action.bound,
            setShouldShowChatOnOrders: action.bound,
        });
    }

    get has_chat_info() {
        return this.chat_info.app_id && this.chat_info.user_id && this.chat_info.token;
    }

    get is_chat_frozen() {
        return this.active_chat_channel?.isFrozen;
    }

    addChannelMessage(chat_message: ChatMessage) {
        this.chat_messages.push(chat_message);
    }

    // TODO: remove when access chat_channel_url from p2p_order_create is activated in BO
    createChatForNewOrder(id: string) {
        if (!this.chat_channel_url) {
            // If order_information doesn't have chat_channel_url this is a new order
            // and we need to instruct BE to create a chat on Sendbird's side.
            requestWS({ p2p_chat_create: 1, order_id: id }).then(response => {
                if (response.error) {
                    // TODO: Handle error.
                    return;
                }

                this.setChatChannelUrl(response.p2p_chat_create.channel_url);
            });
        }
    }

    replaceChannelMessage(idx_to_replace: number, num_items_to_delete: number, chat_message: ChatMessage) {
        this.chat_messages.splice(idx_to_replace, num_items_to_delete, chat_message);
    }

    setActiveChatChannel(active_chat_channel: GroupChannel | null) {
        this.active_chat_channel = active_chat_channel;
    }

    setChatChannelUrl(chat_channel_url: string | null) {
        this.chat_channel_url = chat_channel_url;
    }

    setChatInfo(chat_info: TChatInfo) {
        this.chat_info = chat_info;
    }

    setHasChatError(has_chat_error: boolean) {
        this.has_chat_error = has_chat_error;
    }

    setIsChatLoading(is_chat_loading: boolean) {
        this.is_chat_loading = is_chat_loading;
    }

    setChannelMessages(chat_messages: Array<ChatMessage>) {
        this.chat_messages = chat_messages;
    }

    setShouldShowChatModal(should_show_chat_modal: boolean) {
        this.should_show_chat_modal = should_show_chat_modal;
    }

    setShouldShowChatOnOrders(should_show_chat_on_orders: boolean) {
        this.should_show_chat_on_orders = should_show_chat_on_orders;
    }

    setChatError() {
        this.setHasChatError(true);
        this.setIsChatLoading(false);
    }

    async initialiseChatWsConnection() {
        try {
            this.setFileUploadProperties(null);
            this.setIsUploadComplete(false);
            this.setHasChatError(false);
            this.setIsChatLoading(true);

            this.sendbird_api = SendbirdChat.init({
                appId: this.chat_info.app_id,
                modules: [new GroupChannelModule()],
            });

            if (this.sendbird_api.connectionState === 'OPEN') {
                await this.sendbird_api.disconnect();
            }
            const send_bird_user = await this.sendbird_api.connect(this.chat_info.user_id, this.chat_info.token);
            if (!send_bird_user) {
                this.setChatError();
            } else {
                this.sendbird_api.groupChannel.addGroupChannelHandler(
                    'P2P_SENDBIRD_GROUP_CHANNEL_HANDLER',
                    new GroupChannelHandler({
                        onMessageReceived: this.onMessageReceived.bind(this),
                        onUnreadMemberStatusUpdated: this.onReadReceiptUpdated.bind(this),
                    })
                );
                await this.initialiseOrderChannel();
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(error);
        }
    }

    async initialiseOrderChannel() {
        this.setHasChatError(false);
        this.setIsChatLoading(true);
        try {
            const group_channel = await this.sendbird_api?.groupChannel.getChannel(this.chat_channel_url ?? '');
            if (!group_channel) {
                this.setHasChatError(true);
            } else {
                this.setActiveChatChannel(group_channel);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(error);
        } finally {
            this.setIsChatLoading(false);
        }
    }

    async initialiseOrderMessages() {
        this.setHasChatError(false);
        this.setIsChatLoading(true);
        try {
            const chat_messages = await this.getPreviousMessages();
            if (chat_messages && chat_messages.length > 0) {
                this.setChannelMessages(chat_messages.map(msg => convertFromChannelMessage(msg)));
                this.messages_ref?.current?.scrollTo(0, this.messages_ref.current.scrollHeight);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(error);
        } finally {
            this.setIsChatLoading(false);
        }
    }

    async getPreviousMessages(timestamp: number | null = null) {
        if (!this.active_chat_channel) return null;
        const chat_messages: Array<UserMessage | FileMessage> = [];

        const is_inclusive_of_timestamp = false;
        const reverse_results = this.chat_messages.length > 0;
        const custom_type = ['', `{"order_id":"${this.root_store.order_store.order_id}"}`];
        const result_size = 50;

        const messages_timestamp =
            timestamp ?? toMoment(this.root_store.general_store.server_time.get()).utc().valueOf();

        const retrieved_messages = await this.active_chat_channel?.getMessagesByTimestamp(messages_timestamp, {
            isInclusive: is_inclusive_of_timestamp,
            prevResultSize: result_size,
            nextResultSize: 0,
            reverse: reverse_results,
            messageTypeFilter: MessageTypeFilter.ALL,
            customTypesFilter: custom_type,
        });

        retrieved_messages?.forEach(message => {
            if (message.isUserMessage() || message.isFileMessage()) {
                chat_messages.push(message);
            }
        });

        return chat_messages;
    }

    handleP2pAdvertiserInfo(response: Record<string, P2PAdvertiserCreate | P2PAdvertiserInfo>) {
        if (response.error) return;
        if (this.service_token_timeout) {
            // Function keeps being called by subscription in GeneralStore (onMount). If we
            // already have a running timeout void this call.
            return;
        }

        // Function can be called by both "p2p_advertiser_create" and "p2p_advertiser_info"
        const p2p_advertiser_info = response.p2p_advertiser_create || response.p2p_advertiser_info;

        const getSendbirdServiceToken = () => {
            requestWS({ service: 'sendbird', service_token: 1 }).then(service_token_response => {
                if (service_token_response.error) return;

                const { server_time } = this.root_store.general_store;
                const { service_token } = service_token_response;
                this.setChatInfo({
                    app_id: service_token.sendbird.app_id,
                    token: service_token.sendbird.token,
                    user_id: p2p_advertiser_info?.chat_user_id ?? '',
                });

                // Refresh chat token ±1 hour before it expires (BE will refresh the token
                // when we request within 2 hours of the token expiring)
                const expiry_moment = epochToMoment(service_token.sendbird.expiry_time);
                const delay_ms = expiry_moment.diff(toMoment(server_time.get()).clone().subtract(1, 'hour'));

                this.service_token_timeout = setTimeout(() => getSendbirdServiceToken(), delay_ms);
            });
        };

        getSendbirdServiceToken();
    }

    async markMessagesAsRead(should_check_scroll: boolean) {
        if (!this.active_chat_channel) return;
        try {
            if (document.hasFocus()) {
                if (should_check_scroll && this.messages_ref?.current) {
                    const { scrollHeight, scrollTop, clientHeight } = this.messages_ref.current;
                    const is_at_bottom = scrollHeight - scrollTop === clientHeight;

                    if (is_at_bottom) {
                        await this.active_chat_channel.markAsRead();
                    }
                } else {
                    await this.active_chat_channel.markAsRead();
                }
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(error);
        }
    }

    onMessageReceived(channel: BaseChannel, channel_message: BaseMessage) {
        if (
            channel_message.channelUrl === this.chat_channel_url &&
            (channel_message.isUserMessage() || channel_message.isFileMessage())
        ) {
            this.addChannelMessage(convertFromChannelMessage(channel_message));
            this.messages_ref?.current?.scrollTo(0, this.messages_ref.current.scrollHeight);
        }
    }

    onMessagesScroll() {
        if (this.scroll_debounce) {
            clearTimeout(this.scroll_debounce);
        }

        this.scroll_debounce = setTimeout(() => {
            if (!this.messages_ref?.current) return;

            if (this.messages_ref.current.scrollTop === 0) {
                const oldest_message_timestamp = this.chat_messages.reduce(
                    (prev_created_at, chat_message) =>
                        chat_message.created_at < prev_created_at ? chat_message.created_at : prev_created_at,
                    Infinity
                );

                this.getPreviousMessages(oldest_message_timestamp)
                    .then(chat_messages => {
                        if (chat_messages && chat_messages.length > 0) {
                            chat_messages.forEach(chat_message =>
                                this.replaceChannelMessage(0, 0, convertFromChannelMessage(chat_message))
                            );
                        }
                    })
                    .catch(error => {
                        // eslint-disable-next-line no-console
                        console.warn(error);
                    });
            }
        }, 1000);
    }

    onReadReceiptUpdated(channel: GroupChannel) {
        if (channel.url === this.chat_channel_url) {
            // Force a re-render to reflect correct read receipts.
            this.setChannelMessages(this.chat_messages.slice());
        }
    }

    registerEventListeners() {
        const markMessagesAsReadCheckScroll = () => {
            if (this.scroll_debounce) {
                return null;
            }

            (async () => {
                await this.markMessagesAsRead(true);
            })();
        };
        window.addEventListener('focus', markMessagesAsReadCheckScroll);
        return () => window.removeEventListener('focus', markMessagesAsReadCheckScroll);
    }

    registerMobXReactions() {
        this.disposeOrderIdReaction = reaction(
            () => this.root_store.order_store.order_id,
            (order_id: string) => {
                if (!order_id) {
                    this.setChatChannelUrl(null);
                    this.setChannelMessages([]);
                    this.setIsChatLoading(true);
                    this.setShouldShowChatModal(false);
                    this.setActiveChatChannel(null);
                }
            }
        );

        this.disposeChannelUrlReaction = reaction(
            () => !!this.chat_channel_url && !!this.has_chat_info,
            (is_ready_to_intialise: boolean) => {
                if (is_ready_to_intialise) {
                    this.initialiseChatWsConnection();
                } else {
                    this.terminateChatWsConnection();
                }
            },
            { fireImmediately: true }
        );

        this.disposeActiveChatChannelReaction = reaction(
            () => this.active_chat_channel,
            active_chat_channel => {
                if (active_chat_channel) {
                    this.initialiseOrderMessages();
                } else {
                    this.setChannelMessages([]);
                }
            }
        );

        return () => {
            if (typeof this.disposeOrderIdReaction === 'function') {
                this.disposeOrderIdReaction();
            }
            if (typeof this.disposeChannelUrlReaction === 'function') {
                this.disposeChannelUrlReaction();
            }
            if (typeof this.disposeActiveChatChannelReaction === 'function') {
                this.disposeActiveChatChannelReaction();
            }
        };
    }

    setIsUploadComplete(is_upload_complete: boolean) {
        this.is_upload_complete = is_upload_complete;
    }

    setFileUploadProperties(file_upload_properties: FileMessage | null) {
        this.file_upload_properties = file_upload_properties;
    }

    sendFile(file: File) {
        if (!file) return;

        const updated_file = renameFile(file);
        this.active_chat_channel
            ?.sendFileMessage({
                file: updated_file,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
            })
            .onPending(() => {
                this.setIsUploadComplete(false);
            })
            .onSucceeded(channel_message => {
                if (channel_message.channelUrl === this.chat_channel_url && channel_message.isFileMessage()) {
                    this.addChannelMessage(convertFromChannelMessage(channel_message));
                    this.setFileUploadProperties(channel_message);
                }
                this.setIsUploadComplete(true);
            })
            .onFailed(() => {
                this.setIsUploadComplete(false);
            });
    }

    sendMessage(message: string, custom_type = '') {
        const modified_message = message.trim();

        if (modified_message.length === 0) {
            return;
        }

        const msg_identifier = `${Date.now()}${message.substring(0, 9)}${this.chat_messages.length}`;

        // Add a placeholder message with a pending indicator
        const placeholder_msg_options = {
            created_at: toMoment(this.root_store.general_store.server_time.get()).utc().valueOf(),
            channel_url: this.active_chat_channel?.url ?? '',
            message,
            id: msg_identifier,
            message_type: MessageType.USER,
            sender_user_id: this.chat_info.user_id,
            status: ChatMessage.STATUS_PENDING,
            custom_type,
        };

        this.addChannelMessage(new ChatMessage(placeholder_msg_options));

        this.active_chat_channel
            ?.sendUserMessage({
                message: modified_message,
                data: msg_identifier,
                customType: custom_type,
            })
            .onSucceeded(channel_message => {
                const msg_idx = this.chat_messages.findIndex(msg => msg.id === msg_identifier);
                if (channel_message.isUserMessage()) {
                    this.replaceChannelMessage(msg_idx, 1, convertFromChannelMessage(channel_message));
                    this.messages_ref?.current?.scrollTo(0, this.messages_ref.current.scrollHeight);
                }
            })
            .onFailed(() => {
                const msg_idx = this.chat_messages.findIndex(msg => msg.id === msg_identifier);
                const errored_message = new ChatMessage({
                    ...placeholder_msg_options,
                    status: ChatMessage.STATUS_ERRORED,
                });

                this.replaceChannelMessage(msg_idx, 1, errored_message);
            });
    }

    setMessagesRef(ref: React.RefObject<HTMLDivElement> | null) {
        this.messages_ref = ref;
    }

    terminateChatWsConnection() {
        if (
            this.sendbird_api &&
            this.sendbird_api.connectionState === 'OPEN' &&
            ((this.file_upload_properties && this.is_upload_complete) || !this.file_upload_properties)
        ) {
            // eslint-disable-next-line no-console
            this.sendbird_api.disconnect().catch(error => console.warn(error));
        }
    }
}
