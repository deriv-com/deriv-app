import BinarySocket   from './socket_base';
import {
    cloneObject,
    getPropertyValue,
    isDeepEqual,
    isEmptyObject }   from '../utility';

/**
 * A layer over BinarySocket to handle subscribing to streaming calls
 * in order to keep track of subscriptions, manage forget, prevent multiple subscription at the same time, ...
 *
 * structure of the the subscription object is:
 * {
 *     1: { msg_type: 'proposal', request: { ... }, stream_id: '...', subscribers: [ ... ] },
 *     2: ...
 * }
 * object keys: subscription_id that assigned to each subscription
 * msg_type   : msg_type of the request for faster filtering
 * request    : the request object, used to subscribe to the same stream when there is a new subscribe request with exactly the same values
 * stream_id  : id of the stream which stored from its response and used to forget the stream when needed
 * subscribers: an array of callbacks to dispatch the response to
 */
const SubscriptionManager = (() => {
    const subscriptions    = {};
    const forget_requested = {};

    let subscription_id = 0;

    /**
     * To submit request for a new subscription
     *
     * @param {String}   msg_type             msg_type of the request
     * @param {Object}   request_obj          the whole object of the request to be made
     * @param {Function} fncCallback          callback function to pass the responses to
     * @param {Boolean}  should_forget_first  when it's true: forgets the previous subscription, then subscribes after receiving the forget response (if any)
     */
    const subscribe = (msg_type, request_obj, fncCallback, should_forget_first = false) => {
        if (should_forget_first) {
            forget(msg_type, fncCallback).then(() => {
                subscribe(msg_type, request_obj, fncCallback);
            });
            return;
        }

        let sub_id = Object.keys(subscriptions).find(id => isDeepEqual(request_obj, subscriptions[id].request));

        if (!sub_id) {
            sub_id = ++subscription_id;

            subscriptions[sub_id] = {
                msg_type,
                request    : cloneObject(request_obj),
                stream_id  : '',             // stream_id will be updated after receiving the response
                subscribers: [fncCallback],
            };

            BinarySocket.send(request_obj, {
                callback: (response) => dispatch(response, sub_id),
            });
        } else if (!hasCallbackFunction(sub_id, fncCallback)) {
            // there is already an active subscription for the very same request which fncCallback is not subscribed to it yet
            subscriptions[sub_id].subscribers.push(fncCallback);
        }
    };

    /**
     * Add subscription without subscribers from request
     * E.g. open subscription to proposal_open_contract on buy request
     * @param {String}   msg_type               msg_type of the subscription
     * @param {Object}   send_request           the object of the request to be made
     * @param {Object}   subscribe_request      the object of the subscription request
     * @param {Array}    subscription_props     Array of prop strings to add to subscribe_request from initial request, e.g. contract_id
     */
    const addSubscriptionFromRequest = (msg_type, send_request, subscribe_request, subscription_props) =>
        new Promise((resolve) => {
            let sub_id;
            let is_stream = false;

            BinarySocket.send(send_request, {
                callback: (response) => {
                    if (response.error) {
                        return resolve(response);
                    }
                    if (!is_stream) {
                        is_stream = true;
                        sub_id    = ++subscription_id;

                        if (subscription_props && Array.isArray(subscription_props)) {
                            subscription_props.forEach((prop) => {
                                if (response[response.msg_type][prop]) {
                                    subscribe_request[prop] = response[response.msg_type][prop];
                                }
                            });
                        }

                        subscriptions[sub_id] = {
                            msg_type,
                            request    : cloneObject(subscribe_request),
                            stream_id  : '',             // stream_id will be updated after receiving the response
                            subscribers: [],
                        };
                        return resolve(response);
                    }
                    return dispatch(response, sub_id);
                },
            });
        });

    // dispatches the response to subscribers of the specific subscription id (internal use only)
    const dispatch = (response, sub_id) => {
        const stream_id = getPropertyValue(response, [response.msg_type, 'id']) || getPropertyValue(response.subscription, ['id']);

        if (!subscriptions[sub_id]) {
            if (!forget_requested[stream_id]) {
                forgetStream(stream_id);
            }
            return;
        }

        const sub_info = subscriptions[sub_id];
        // set the stream_id
        if (!sub_info.stream_id && stream_id) {
            sub_info.stream_id = stream_id;
        }

        // callback subscribers
        const subscribers = sub_info.subscribers;
        if (subscribers.length) {
            if (
                // it is the first response
                !sub_info.stream_id &&
                    (
                        // the first response returned error
                        response.error
                        || (
                            // not a subscription (i.e. subscribed proposal_open_contract for an expired contract)
                            // also to filter out streams with no stream id but later it will continue streaming (i.e. proposal_open_contract without contract id)
                            !isEmptyObject(response[response.msg_type]) &&
                            // check msg_type to filter out those calls which don't return stream `id` on first response (tick_history, ...)
                            response.msg_type === sub_info.msg_type
                        )
                    )
                ||
                // remove when response isn't first and response has no stream_id
                !stream_id && sub_info.stream_id
            ) {
                delete subscriptions[sub_id];
            }
            sub_info.subscribers.forEach((fnc) => {
                fnc(response);
            });
        } else {
            delete subscriptions[sub_id];
            forgetStream(sub_info.stream_id);
        }
    };

    /**
     * To forget a subscription which submitted for a specific callback function
     *
     * @param  {String}   msg_type      msg_type to forget
     * @param  {Function} fncCallback   the same function passed to subscribe()
     *     (this is the way to distinguish between different subscribers of the same stream at the same time)
     * @param  {Object}   match_values  optional, to only forget subscriptions having request that "contains" provided values
     * @return {Promise}  the promise object of all possible forget requests
     */
    const forget = (msg_type, fncCallback, match_values) => {
        if (typeof fncCallback !== 'function') {
            throw new Error(`Missing callback function. To forget all subscriptions of msg_type: ${msg_type}, please call forgetAll().`);
        }

        // find corresponding id(s)
        const sub_ids = Object.keys(subscriptions).filter(id => (
            subscriptions[id].msg_type === msg_type &&
            hasCallbackFunction(id, fncCallback)
        ));

        const forgets_list = [];
        sub_ids.forEach((id) => {
            if (match_values && !hasValues(subscriptions[id].request, match_values)) {
                return;
            }
            const stream_id = subscriptions[id].stream_id;
            if (stream_id && subscriptions[id].subscribers.length === 1) {
                delete subscriptions[id];
                forgets_list.push(forgetStream(stream_id));
            } else {
                // there are other subscribers, or for some reason there is no stream_id:
                // (i.e. returned an error, or forget() being called before the first response)
                subscriptions[id].subscribers.splice(subscriptions[id].subscribers.indexOf(fncCallback), 1);
            }
        });
        return Promise.all(forgets_list);
    };

    /**
     * To forget all active subscriptions of a list of msg_types
     *
     * @param  {String}  msg_types  list of msg_types to forget
     * @return {Promise} the promise object of all possible forget_all requests
     */
    const forgetAll = (...msg_types) => {
        const types_to_forget = {};

        msg_types.forEach((msg_type) => {
            const sub_ids = Object.keys(subscriptions).filter(id => subscriptions[id].msg_type === msg_type);
            if (sub_ids.length) {
                sub_ids.forEach((id) => {
                    delete subscriptions[id];
                });
                types_to_forget[msg_type] = true;
            }
        });

        return Promise.resolve(
            !isEmptyObject(types_to_forget) ?
                BinarySocket.send({ forget_all: Object.keys(types_to_forget) }) :
                {}
        );
    };

    const forgetStream = (stream_id) => {
        forget_requested[stream_id] = true; // to prevent forgetting multiple times
        return Promise.resolve(
            stream_id ?
                BinarySocket.send({ forget: stream_id }).then(() => { delete forget_requested[stream_id]; }) :
                {}
        );
    };

    const hasCallbackFunction = (sub_id, fncCallback) =>
        (subscriptions[sub_id] && subscriptions[sub_id].subscribers.indexOf(fncCallback) !== -1);

    const hasValues = (request_obj, values_obj) => (
        typeof request_obj === 'object' &&
        typeof values_obj  === 'object' &&
        Object.keys(values_obj).every(key => request_obj[key] === values_obj[key])
    );

    return {
        addSubscriptionFromRequest,
        subscribe,
        forget,
        forgetAll,
    };
})();

export default SubscriptionManager;
