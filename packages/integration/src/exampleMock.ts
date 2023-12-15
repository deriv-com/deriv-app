import { createMockServer } from './utils/mocks/mocks';
import general from './mocks/general';
import auth from './mocks/auth';
import residentsList from './mocks/general/residentsList';
import statesList from './mocks/general/statesList';
import { DEFAULT_ACCOUNTS } from './mocks/auth/authorize';
import generateOauthLoginFromAccounts from './utils/mocks/generateOauthLoginFromAccounts';

async function main() {
    const state = {
        accounts: DEFAULT_ACCOUNTS,
    };

    const oauthLoginUrl = generateOauthLoginFromAccounts('https://localhost:8443', state.accounts);
    const query = Object.fromEntries(oauthLoginUrl.searchParams);

    // eslint-disable-next-line no-console
    console.log(`You can login at:\n${oauthLoginUrl}`);

    await createMockServer(state, query, [general, auth, residentsList, statesList], { port: 10443 });
    process.stdout.write('Listening on localhost:10443');
}

main();
