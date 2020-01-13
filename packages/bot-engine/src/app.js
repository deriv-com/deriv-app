import DBot        from './scratch/dbot';
import help_string from './scratch/help-content/help-strings';
import constants   from './constants';
import api         from './services/api';
import utils       from './utils';
import scratch     from './scratch';

export default {
    DBot,
    ...help_string,
    ...constants,
    ...api,
    ...utils,
    ...scratch,
};
