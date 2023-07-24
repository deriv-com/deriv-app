import SendBird from 'sendbird';
import { epochToMoment, toMoment } from '@deriv/shared';
import { action, computed, observable, reaction, makeObservable } from 'mobx';
import BaseStore from 'Stores/base_store';
import ChatMessage, { convertFromChannelMessage } from 'Utils/chat-message';
import { requestWS } from 'Utils/websocket';

export default class SendbirdStore extends BaseStore {
    active_chat_channel = null;
    chat_channel_url = null;
    chat_info = { app_id: null, user_id: null, token: null };
    chat_messages = [];
    has_chat_error = null;
    is_chat_loading = true;
    should_show_chat_modal = false;
    should_show_chat_on_orders = false;

    file_upload_properties = null;
    is_upload_complete = false;
    messages_ref = null;
    scroll_debounce = null;
    sendbird_api = null;
    service_token_timeout = null;

    constructor(root_store) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super(root_store);

        makeObservable(this, {
            active_chat_channel: observable,
            chat_channel_url: observable.ref,
            chat_info: observable.ref,
            chat_messages: observable.shallow,
            has_chat_error: observable,
            is_chat_loading: observable,
            should_show_chat_modal: observable,
            should_show_chat_on_orders: observable,
            has_chat_info: computed,
            is_chat_frozen: computed,
            last_other_user_activity: computed,
            addChannelMessage: action.bound,
            createChatForNewOrder: action.bound,
            replaceChannelMessage: action.bound,
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

    get last_other_user_activity() {
        const message = this.chat_messages
            .slice()
            .reverse()
            .find(chat_message => chat_message.sender_user_id !== this.chat_info.user_id);

        return message ? epochToMoment(Math.floor(message.created_at / 1000)).fromNow() : null;
    }

    addChannelMessage(chat_message) {
        this.chat_messages.push(chat_message);
    }

    // TODO: remove when access chat_channel_url from p2p_order_create is activated in BO
    createChatForNewOrder(id) {
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

    replaceChannelMessage(idx_to_replace, num_items_to_delete, chat_message) {
        this.chat_messages.splice(idx_to_replace, num_items_to_delete, chat_message);
    }

    setActiveChatChannel(active_chat_channel) {
        this.active_chat_channel = active_chat_channel;
    }

    setChatChannelUrl(chat_channel_url) {
        this.chat_channel_url = chat_channel_url;
    }

    setChatInfo(chat_info) {
        this.chat_info = chat_info;
    }

    setHasChatError(has_chat_error) {
        this.has_chat_error = has_chat_error;
    }

    setIsChatLoading(is_chat_loading) {
        this.is_chat_loading = is_chat_loading;
    }

    setChannelMessages(chat_messages) {
        this.chat_messages = chat_messages;
    }

    setShouldShowChatModal(should_show_chat_modal) {
        this.should_show_chat_modal = should_show_chat_modal;
    }

    setShouldShowChatOnOrders(should_show_chat_on_orders) {
        this.should_show_chat_on_orders = should_show_chat_on_orders;
    }

    setChatError() {
        this.setHasChatError(true);
        this.setIsChatLoading(false);
    }

    initialiseChatWsConnection() {
        this.setFileUploadProperties(null);
        this.setIsUploadComplete(false);
        this.setHasChatError(false);
        this.setIsChatLoading(true);

        const { user_id: sendbird_user_id, token: service_token, app_id } = this.chat_info;
        this.sendbird_api = new SendBird({ appId: app_id });
        this.sendbird_api
            .connect(sendbird_user_id, service_token, (user, error) => {
                if (error) {
                    // TODO: remove console statement and better presentation of warnings to user.
                    // eslint-disable-next-line no-console
                    console.warn(error);
                    this.setChatError();
                } else {
                    const channel_event_handler = new this.sendbird_api.ChannelHandler();

                    channel_event_handler.onMessageReceived = this.onMessageReceived.bind(this);
                    channel_event_handler.onReadReceiptUpdated = this.onReadReceiptUpdated.bind(this);
                    this.progressHandler = this.progressHandler.bind(this);
                    this.sendbird_api.addChannelHandler('channel_event_handler', channel_event_handler);
                    this.initialiseOrderChannel();
                }
            })
            .catch(() => this.setChatError());
    }

    initialiseOrderChannel() {
        this.setHasChatError(false);
        this.setIsChatLoading(true);

        this.sendbird_api.GroupChannel.getChannel(this.chat_channel_url, (group_channel, error) => {
            if (error) {
                // eslint-disable-next-line no-console
                console.warn(error);
                this.setHasChatError(true);
            } else {
                this.setActiveChatChannel(group_channel);
            }
            this.setIsChatLoading(false);
        }).catch(() => this.setChatError());
    }

    initialiseOrderMessages() {
        this.setHasChatError(false);

        this.getPreviousMessages((chat_messages, error) => {
            if (error) {
                // eslint-disable-next-line no-console
                console.warn(error);
                this.setHasChatError(true);
            } else {
                this.setChannelMessages(chat_messages.map(msg => convertFromChannelMessage(msg)));
            }

            this.setIsChatLoading(false);
        });
    }

    getPreviousMessages(callback, timestamp = null) {
        const is_inclusive_of_timestamp = false;
        const result_size = 50;
        const reverse_results = false;
        const message_type = '';
        const custom_type = '';

        this.active_chat_channel
            .getPreviousMessagesByTimestamp(
                timestamp || toMoment(this.root_store.general_store.server_time.get()).utc().valueOf(),
                is_inclusive_of_timestamp,
                result_size,
                reverse_results,
                message_type,
                custom_type,
                callback
            )
            .catch(() => this.setChatError());
    }

    handleP2pAdvertiserInfo(response) {
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
                    user_id: p2p_advertiser_info.chat_user_id,
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

    markMessagesAsRead(should_check_scroll) {
        if (!this.active_chat_channel) return;

        if (document.hasFocus()) {
            if (should_check_scroll && this.messages_ref?.current) {
                const { scrollHeight, scrollTop, clientHeight } = this.messages_ref.current;
                const is_at_bottom = scrollHeight - scrollTop === clientHeight;

                if (is_at_bottom) {
                    this.active_chat_channel.markAsRead();
                }
            } else {
                this.active_chat_channel.markAsRead();
            }
        }
    }

    onMessageReceived(channel, channel_message) {
        if (channel_message.channelUrl === this.chat_channel_url) {
            this.addChannelMessage(convertFromChannelMessage(channel_message));
        }
    }

    onMessagesScroll() {
        if (this.scroll_debounce) {
            clearInterval(this.scroll_debounce);
        }

        this.scroll_debounce = setTimeout(() => {
            if (!this.messages_ref.current) return;

            if (this.messages_ref.current.scrollTop === 0) {
                const oldest_message_timestamp = this.chat_messages.reduce(
                    (prev_created_at, chat_message) =>
                        chat_message.created_at < prev_created_at ? chat_message.created_at : prev_created_at,
                    Infinity
                );

                this.getPreviousMessages((chat_messages, error) => {
                    if (error) {
                        // eslint-disable-next-line no-console
                        console.warn(error);
                    } else if (chat_messages.length) {
                        const previous_messages = chat_messages.map(chat_message =>
                            convertFromChannelMessage(chat_message)
                        );

                        this.replaceChannelMessage(0, 0, ...previous_messages);
                    }
                }, oldest_message_timestamp);
            } else {
                this.markMessagesAsRead(true);
            }
        }, 1000);
    }

    onReadReceiptUpdated(channel) {
        if (channel.url === this.chat_channel_url) {
            // Force a re-render to reflect correct read receipts.
            this.setChannelMessages(this.chat_messages.slice());
        }
    }

    registerEventListeners() {
        const markMessagesAsReadCheckScroll = () => this.markMessagesAsRead(true);
        window.addEventListener('focus', markMessagesAsReadCheckScroll);
        return () => window.removeEventListener('focus', markMessagesAsReadCheckScroll);
    }

    registerMobXReactions() {
        this.disposeOrderIdReaction = reaction(
            () => this.root_store.order_store.order_id,
            order_id => {
                if (!order_id) {
                    this.setChatChannelUrl(null);
                    this.setChannelMessages([]);
                    this.setIsChatLoading(true);
                    this.setShouldShowChatModal(false);
                }
            }
        );

        this.disposeChannelUrlReaction = reaction(
            () => this.chat_channel_url && this.has_chat_info,
            is_ready_to_intialise => {
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

    setIsUploadComplete(is_upload_complete) {
        this.is_upload_complete = is_upload_complete;
    }

    setFileUploadProperties(file_upload_properties) {
        this.file_upload_properties = file_upload_properties;
    }

    progressHandler(progress) {
        const { order_id } = this.root_store.order_store;
        this.setIsUploadComplete(progress.loaded === progress.total);
        if (progress.loaded === progress.total) {
            setTimeout(() => {
                if (!this.should_show_chat_on_orders && !order_id) {
                    this.terminateChatWsConnection();
                }
            }, 1000);
        }
    }

    sendFile(file) {
        if (!file) return;

        const params = new this.sendbird_api.FileMessageParams();

        params.file = file;
        params.fileName = file.name;
        params.fileSize = file.size;
        params.mimeType = file.type;

        this.file_upload_properties = this.active_chat_channel.sendFileMessage(
            params,
            this.progressHandler,
            (channel_message, error) => {
                if (error) {
                    // eslint-disable-next-line no-console
                    console.warn(error);
                } else if (channel_message.channelUrl === this.chat_channel_url) {
                    this.addChannelMessage(convertFromChannelMessage(channel_message));
                }
            }
        );
    }

    sendMessage(message) {
        const modified_message = message.replace(/^[\r\n]+|[\r\n]+$/g, '');

        if (modified_message.length === 0 || modified_message.trim().length === 0) {
            return;
        }

        const params = new this.sendbird_api.UserMessageParams();
        const msg_identifier = `${Date.now()}${message.substring(0, 9)}${this.chat_messages.length}`;

        params.message = modified_message;
        params.data = msg_identifier;

        // Add a placeholder message with a pending indicator
        const placeholder_msg_options = {
            created_at: toMoment(this.root_store.general_store.server_time.get()).utc(),
            chat_channel_url: this.active_chat_channel.url,
            message,
            id: msg_identifier,
            message_type: ChatMessage.TYPE_USER,
            sender_user_id: this.chat_info.user_id,
            status: ChatMessage.STATUS_PENDING,
        };

        this.addChannelMessage(new ChatMessage(placeholder_msg_options));

        this.active_chat_channel.sendUserMessage(params, (channel_message, error) => {
            const msg_idx = this.chat_messages.findIndex(msg => msg.messageId === msg_identifier);

            if (error) {
                const errored_message = new ChatMessage({
                    ...placeholder_msg_options,
                    status: ChatMessage.STATUS_ERRORED,
                });

                this.replaceChannelMessage(msg_idx, 1, errored_message);
            } else {
                this.replaceChannelMessage(msg_idx, 1, convertFromChannelMessage(channel_message));
            }
        });
    }

    setMessagesRef(ref) {
        this.messages_ref = ref;
    }

    terminateChatWsConnection() {
        if (
            this.sendbird_api &&
            typeof this.sendbird_api.disconnect === 'function' &&
            ((this.file_upload_properties && this.is_upload_complete) || !this.file_upload_properties)
        ) {
            // eslint-disable-next-line no-console
            this.sendbird_api.disconnect().catch(error => console.warn(error));
        }
    }
}
