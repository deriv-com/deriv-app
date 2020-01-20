import DBot         from './scratch/dbot';
import help_strings from './scratch/help-content/help-strings';
import constants    from './constants';
import api          from './services/api';
import utils        from './utils';
import scratch      from './scratch';

export default {
    DBot,
    ...help_strings,
    ...constants,
    ...api,
    ...utils,
    ...scratch,
};
