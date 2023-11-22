import { createMockServer } from './utils/mocks/mocks';
import general from './mocks/general';
import auth from './mocks/auth';
import residentsList from './mocks/general/residentsList';
import statesList from './mocks/general/statesList';

async function main() {
    await createMockServer({}, {}, [general, auth, residentsList, statesList], { port: 10443 });
    process.stdout.write('Listening on localhost:10443');
}

main();
