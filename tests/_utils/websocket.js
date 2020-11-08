const replaceWebsocket = () => {
// proxy the window.WebSocket object
    const WebSocketProxy = new Proxy(window.WebSocket, {
        construct(target, args) {
            const BUFFER_LENGTH = 100;
            // create WebSocket instance
            // eslint-disable-next-line new-cap
            const instance = new target(...args);

            // WebSocket "onopen" handler
            const openHandler = (event) => {
                console.log('Open', event);
            };

            // WebSocket "onmessage" handler
            const messageHandler = (event) => {
                window.messages.push(event.data);
                if (window.messages.length > this.BUFFER_LENGTH) {
                    // eslint-disable-next-line no-unused-vars
                    const [_, ...rest] = this.messages;
                    window.messages = rest;
                }
            };

            // WebSocket "onclose" handler
            const closeHandler = (event) => {
                console.log('Close', event);
                // remove event listeners
                instance.removeEventListener('open', openHandler);
                instance.removeEventListener('message', messageHandler);
                instance.removeEventListener('close', closeHandler);
            };

            // add event listeners
            instance.addEventListener('open', openHandler);
            instance.addEventListener('message', messageHandler);
            instance.addEventListener('close', closeHandler);

            // proxy the WebSocket.send() function
            const sendProxy = new Proxy(instance.send, {
                apply(target, thisArg, args) {
                    console.log('Send', args);
                    target.apply(thisArg, args);
                },
            });

            // replace the native send function with the proxy
            instance.send = sendProxy;

            instance.BUFFER_LENGTH = BUFFER_LENGTH;
            // return the WebSocket instance
            return instance;
        },
    });

// replace the native WebSocket with the proxy
    window.WebSocket = WebSocketProxy;
    window.messages = [];
}

const waitForWSMessage = async (page, message_type, {timeout = 5000}) => {
    try {
        return await promiseTimeout(timeout, checkForMessage(page, message_type));
    } catch (err) {
        throw new Error(`Could not read message ${message_type} in ${timeout}ms.`)
    }
}

const promiseTimeout = (ms, promise) => {
    // Create a promise that rejects in <ms> milliseconds
    const timeout = new Promise((resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error(`Timed out in ${ms}ms.`));
        }, ms)
    })

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
        promise,
        timeout,
    ])
};

const checkForMessage =  (page, message_type) => new Promise((resolve) => {
    const id = setInterval(() => {
        page.evaluate(() => window.messages).then(messages => {
            const message = messages.find((msg) => {
                return !!msg.match(message_type);
            });
            if (message) {
                clearInterval(id);
                resolve(message);
            }
        })
    }, 50);
});

module.exports = {
    replaceWebsocket,
    waitForWSMessage,
}
