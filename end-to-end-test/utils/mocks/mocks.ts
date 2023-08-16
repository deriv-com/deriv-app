import * as https from 'https';
import { EventEmitter } from 'events';
import { Server as WsServer } from 'ws';
import { generate } from 'selfsigned';
import { Page } from '@playwright/test';

interface Context {
    request: any;
    req_id: number;
    response?: any;
    socket: any;
}

export interface MockServer extends EventEmitter {
    close: () => void;
    url: string;
    add: (mock: (context: Context) => void) => void;
    remove: (mock: (context: Context) => void) => void;
}

type Options = {
    port?: number;
};

const pems = generate();

export async function createMockServer(
    mocks: Array<(context: Context) => void>,
    options?: Options
): Promise<MockServer> {
    const eventEmitter = new EventEmitter() as MockServer;

    const server = https.createServer({ key: pems.private, cert: pems.cert });
    await new Promise<void>(resolve => server.listen(options?.port || 0, resolve));
    const wss = new WsServer({ server });

    wss.on('connection', ws => {
        ws.on('message', async message => {
            const parsedMessage = JSON.parse(message);
            const context: Context = {
                request: parsedMessage,
                req_id: parsedMessage.req_id,
                socket: ws,
            };

            mocks.flat().forEach(mock => mock(context));

            if (context.response) {
                ws.send(JSON.stringify(context.response));
            }
        });
    });

    eventEmitter.close = () => {
        wss.close();
        server.close();
    };

    const address = server.address() as { port: number };
    eventEmitter.url = `localhost:${address.port}`;

    eventEmitter.add = mock => {
        mocks.push(mock);
    };

    eventEmitter.remove = mockToRemove => {
        const index = mocks.findIndex(mock => mock === mockToRemove);
        if (index !== -1) {
            mocks.splice(index, 1);
        }
    };

    return eventEmitter;
}

type SetupMocksOptions = {
    baseURL: string;
    page: Page;
    mocks: Array<(context: Context) => void>;
};

async function setupMocks({ baseURL, page, mocks }: SetupMocksOptions) {
    const mockServer = await createMockServer(mocks);
    page.addListener('close', () => {
        mockServer.close();
    });
    await page.goto(baseURL, { waitUntil: 'commit' });
    await page.evaluate(server_url => {
        window.localStorage.setItem('config.server_url', server_url);
    }, mockServer.url);
    await page.goto(
        `${baseURL}/?acct1=CR5712715&token1=a1-x0000000000000000000000000001&cur1=USD&acct2=CR5712710&token2=a1-x0000000000000000000000000002&cur2=BTC&acct3=VRTC8420051&token3=a1-x0000000000000000000000000003&cur3=USD&state=`
    );
}

export default setupMocks;
