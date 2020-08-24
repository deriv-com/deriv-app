import { observable, action } from 'mobx';

export default class GeneralStore {
    @observable active_index = 0;
    @observable active_notification_count = 0;
    @observable inactive_notification_count = 0;
    @observable is_advertiser = false;
    @observable is_listed = false;
    @observable is_restricted = false;
    @observable nickname_error = null;
    @observable notification_count = 0;
    @observable order_offset = 0;
    @observable poi_status = null;
    @observable show_popup = false;

    @action.bound
    setActiveIndex(active_index) {
        this.active_index = active_index;
    }

    setActiveNotificationCount(active_notification_count) {
        this.active_notification_count = active_notification_count;
    }

    @action.bound
    setInactiveNotificationCount(inactive_notification_count) {
        this.inactive_notification_count = inactive_notification_count;
    }

    @action.bound
    setIsAdvertiser(is_advertiser) {
        this.is_advertiser = is_advertiser;
    }

    @action.bound
    setIsListed(is_listed) {
        this.is_listed = is_listed;
    }

    @action.bound
    setIsRestricted(is_restricted) {
        this.is_restricted = is_restricted;
    }

    @action.bound
    setNicknameError(nickname_error) {
        this.nickname_error = nickname_error;
    }

    @action.bound
    setNotificationCount(notification_count) {
        this.notification_count = notification_count;
    }

    @action.bound
    setOrderOffset(order_offset) {
        this.order_offset = order_offset;
    }

    @action.bound
    setPoiStatus(poi_status) {
        this.poi_status = poi_status;
    }

    @action.bound
    setShowPopup(show_popup) {
        this.show_popup = show_popup;
    }
}
