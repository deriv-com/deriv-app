import { createMockServer } from './utils/mocks/mocks';
import general from './mocks/general';
import auth from './mocks/auth';
import residents_list from './mocks/location/residents_list';
import states_list from './mocks/location/states_list';

async function main() {
    await createMockServer([general, auth, residents_list, states_list], { port: 10443 });
    process.stdout.write('Listening on localhost:10443');
}

main();
