import { TOrders, TServerTime } from 'types';
import { BUY_SELL, ORDERS_STATUS } from '@/constants'; // Update your import path
import { convertToMillis, getFormattedDateString, toMoment } from '@/utils';

type TOrder = TOrders[number];

type TUserDetails = TOrder['advertiser_details'] | TOrder['client_details'];

type TObject = Record<string, string>;
interface ExtendedOrderDetails extends TOrder {
    counterpartyAdStatusString: TObject;
    hasReviewDetails: boolean;
    hasTimerExpired: boolean;
    isActiveOrder: boolean;
    isBuyOrder: boolean;
    isBuyOrderForUser: boolean;
    isBuyerCancelledOrder: boolean;
    isBuyerConfirmedOrder: boolean;
    isCompletedOrder: boolean;
    isDisputeCompletedOrder: boolean;
    isDisputeRefundedOrder: boolean;
    isDisputedOrder: boolean;
    isExpiredOrOngoingTimerExpired: boolean;
    isExpiredOrder: boolean;
    isFinalisedOrder: boolean;
    isInactiveOrder: boolean;
    isIncomingOrder: boolean;
    isMyAd: boolean;
    isOngoingOrder: boolean;
    isOrderReviewable: boolean;
    isPendingOrder: boolean;
    isRefundedOrder: boolean;
    isSellOrder: boolean;
    labels: TObject;
    myAdStatusString: TObject;
    orderExpiryMilliseconds: number;
    otherUserDetails: TUserDetails;
    purchaseTime: string;
    remainingSeconds: number;
    shouldHighlightAlert: boolean;
    shouldHighlightDanger: boolean;
    shouldHighlightDisabled: boolean;
    shouldHighlightSuccess: boolean;
    shouldShowCancelAndPaidButton: boolean;
    shouldShowComplainAndReceivedButton: boolean;
    shouldShowLostFundsBanner: boolean;
    shouldShowOnlyComplainButton: boolean;
    shouldShowOnlyReceivedButton: boolean;
    shouldShowOrderFooter: boolean;
    shouldShowOrderTimer: boolean;
    statusForBuyerConfirmedOrder: string;
    statusForPendingOrder: string;
    statusString: string;
}

const useExtendedOrderDetails = ({
    loginId,
    orderDetails,
    serverTime,
}: {
    loginId?: string;
    orderDetails: TOrder;
    serverTime: TServerTime;
}): { data: ExtendedOrderDetails } => {
    const extendedOrderDetails: ExtendedOrderDetails = {
        ...orderDetails,
        // Derived properties
        get counterpartyAdStatusString() {
            return {
                contactDetails: this.isBuyOrder ? "Seller's contact details" : 'Your contact details',
                counterpartyNicknameLabel: this.isBuyOrder ? "Seller's nickname" : "Buyer's nickname",
                counterpartyRealNameLabel: this.isBuyOrder ? "Seller's real name" : "Buyer's real name",
                instructions: this.isBuyOrder ? "Seller's instructions" : "Buyer's instructions",
                leftSendOrReceive: this.isBuyOrder ? 'Send' : 'Receive',
                paymentDetails: this.isBuyOrder ? "Seller's payment details" : 'Your payment details',
                resultString: this.isBuyOrder
                    ? `You've received ${this.amount_display} ${this.account_currency}`
                    : `You sold ${this.amount_display}${this.account_currency}`,
                rightSendOrReceive: this.isBuyOrder ? 'Receive' : 'Send',
            };
        },
        get hasReviewDetails() {
            return !!this.review_details;
        },
        get hasTimerExpired() {
            const serverTimeAmount = serverTime?.server_time_moment;
            const expiryTimeMoment = toMoment(this.expiry_time);
            return serverTimeAmount?.isAfter(expiryTimeMoment) ?? false;
        },
        get isActiveOrder() {
            return !this.isInactiveOrder;
        },
        get isBuyerCancelledOrder() {
            return this.status === ORDERS_STATUS.CANCELLED;
        },
        get isBuyerConfirmedOrder() {
            return this.status === ORDERS_STATUS.BUYER_CONFIRMED;
        },
        get isBuyOrder() {
            return this.type === BUY_SELL.BUY;
        },
        get isBuyOrderForUser() {
            return (this.isBuyOrder && !this.isMyAd) || (this.isSellOrder && this.isMyAd);
        },
        get isCompletedOrder() {
            return this.status === ORDERS_STATUS.COMPLETED;
        },
        get isDisputeCompletedOrder() {
            return this.status === ORDERS_STATUS.DISPUTE_COMPLETED;
        },
        get isDisputedOrder() {
            return this.status === ORDERS_STATUS.DISPUTED;
        },
        get isDisputeRefundedOrder() {
            return this.status === ORDERS_STATUS.DISPUTE_REFUNDED;
        },
        get isExpiredOrder() {
            return this.status === ORDERS_STATUS.TIMED_OUT;
        },
        get isExpiredOrOngoingTimerExpired() {
            return this.isExpiredOrder || (this.isOngoingOrder && this.hasTimerExpired);
        },
        get isFinalisedOrder() {
            return this.isCompletedOrder || this.isBuyerCancelledOrder || this.isRefundedOrder;
        },
        get isInactiveOrder() {
            return this.isFinalisedOrder || this.isDisputeCompletedOrder || this.isDisputeRefundedOrder;
        },
        get isIncomingOrder() {
            return !!this.is_incoming;
        },
        get isMyAd() {
            return this.advertiser_details?.loginid === loginId;
        },
        get isOngoingOrder() {
            return this.isBuyerConfirmedOrder || this.isBuyerCancelledOrder;
        },
        get isOrderReviewable() {
            return this.is_reviewable;
        },
        get isPendingOrder() {
            return this.status === ORDERS_STATUS.PENDING;
        },
        get isRefundedOrder() {
            return this.status === ORDERS_STATUS.REFUNDED;
        },

        get isSellOrder() {
            return this.type === BUY_SELL.SELL;
        },
        get labels() {
            if (this.isMyAd) {
                return this.myAdStatusString;
            }
            return this.counterpartyAdStatusString;
        },
        get myAdStatusString() {
            return {
                contactDetails: this.isBuyOrder ? 'Your contact details' : "Seller's contact details",
                counterpartyNicknameLabel: this.isBuyOrder ? "Buyer's nickname" : "Seller's nickname",
                counterpartyRealNameLabel: this.isBuyOrder ? "Buyer's real name" : "Seller's real name",
                instructions: 'Your instructions',
                leftSendOrReceive: this.isBuyOrder ? 'Receive' : 'Send',
                paymentDetails: this.isBuyOrder ? 'Your payment details' : "Seller's payment details",
                resultString: this.isBuyOrder
                    ? `You sold ${this.amount_display}${this.account_currency}`
                    : `You've received ${this.amount_display} ${this.account_currency}`,
                rightSendOrReceive: this.isBuyOrder ? 'Send' : 'Receive',
            };
        },
        get orderExpiryMilliseconds() {
            return convertToMillis(this.expiry_time ?? 0);
        },
        get otherUserDetails() {
            return this.isMyAd ? this.client_details : this.advertiser_details;
        },
        get purchaseTime() {
            return getFormattedDateString(
                new Date(convertToMillis(this.created_time ?? 0)),
                true,
                false,
                this.isInactiveOrder
            );
        },
        get remainingSeconds() {
            const serverTimeAmount = serverTime?.server_time_moment;
            const expiryTimeMoment = toMoment(this.expiry_time);
            return expiryTimeMoment.diff(serverTimeAmount, 'seconds');
        },
        get shouldHighlightAlert() {
            if (this.hasTimerExpired) return false;
            if (this.isMyAd) {
                return this.isBuyOrder ? this.isPendingOrder : this.isBuyerConfirmedOrder;
            }
            return this.isBuyOrder ? this.isBuyerConfirmedOrder : this.isPendingOrder;
        },
        get shouldHighlightDanger() {
            if (this.hasTimerExpired) return false;
            if (this.isMyAd) {
                return this.isBuyOrder ? this.isBuyerConfirmedOrder : this.isPendingOrder;
            }
            return this.isBuyOrder ? this.isPendingOrder : this.isBuyerConfirmedOrder;
        },
        get shouldHighlightDisabled() {
            return (
                this.isBuyerCancelledOrder ||
                this.isExpiredOrder ||
                this.isRefundedOrder ||
                this.isDisputedOrder ||
                this.isDisputeRefundedOrder ||
                (this.hasTimerExpired && !this.isCompletedOrder && !this.isDisputeCompletedOrder)
            );
        },
        get shouldHighlightSuccess() {
            return this.isCompletedOrder || this.isDisputeCompletedOrder;
        },
        get shouldShowCancelAndPaidButton() {
            if (this.hasTimerExpired) return false;
            return this.isPendingOrder && (this.isBuyOrder ? !this.isMyAd : this.isMyAd);
        },
        get shouldShowComplainAndReceivedButton() {
            if (this.isFinalisedOrder) return false;
            return this.isExpiredOrOngoingTimerExpired && (this.isSellOrder ? !this.isMyAd : this.isMyAd);
        },
        get shouldShowLostFundsBanner() {
            return this.isPendingOrder || this.isBuyerConfirmedOrder;
        },
        get shouldShowOnlyComplainButton() {
            if (this.isFinalisedOrder) return false;
            if (this.isSellOrder) {
                return this.isExpiredOrOngoingTimerExpired;
            }
            return this.isExpiredOrOngoingTimerExpired && !this.isMyAd;
        },
        get shouldShowOnlyReceivedButton() {
            if (this.isDisputedOrder) {
                return (!this.isIncomingOrder && this.isSellOrder) || (this.isIncomingOrder && this.isBuyOrder);
            }
            return this.isBuyerConfirmedOrder && (this.isBuyOrder ? this.isMyAd : !this.isMyAd);
        },
        get shouldShowOrderFooter() {
            return (
                this.shouldShowCancelAndPaidButton ||
                this.shouldShowComplainAndReceivedButton ||
                this.shouldShowOnlyComplainButton ||
                this.shouldShowOnlyReceivedButton
            );
        },
        get shouldShowOrderTimer() {
            if (this.isFinalisedOrder) return false;
            return this.isPendingOrder || this.isOngoingOrder;
        },
        get statusForBuyerConfirmedOrder() {
            const confirmMessage = 'Confirm payment';
            const waitMessage = 'Waiting for the seller to confirm';
            if (this.isMyAd) {
                return this.isBuyOrder ? confirmMessage : waitMessage;
            }
            return this.isBuyOrder ? waitMessage : confirmMessage;
        },
        get statusForPendingOrder() {
            const waitMessage = 'Wait for payment';
            const payMessage = 'Pay now';
            if (this.isMyAd) {
                return this.isBuyOrder ? waitMessage : payMessage;
            }
            return this.isBuyOrder ? payMessage : waitMessage;
        },
        get statusString() {
            if (this.isCompletedOrder || this.isDisputeCompletedOrder) {
                return 'Completed';
            }
            if (this.isBuyerCancelledOrder) {
                return 'Cancelled';
            }
            if (this.isRefundedOrder || this.isDisputeRefundedOrder) {
                return 'Expired';
            }
            if (this.isDisputedOrder) {
                return 'Under dispute';
            }
            if (this.isExpiredOrder || this.hasTimerExpired) {
                return 'Expired';
            }
            if (this.isPendingOrder) {
                return this.statusForPendingOrder;
            }
            if (this.isBuyerConfirmedOrder) {
                return this.statusForBuyerConfirmedOrder;
            }
            return 'Unknown';
        },
    };

    return { data: extendedOrderDetails };
};

export default useExtendedOrderDetails;
