import { isProduction } from '../config/config';

/**
 * Returns List of unsupported languages based on the environment.
 */
export const UNSUPPORTED_LANGUAGES = isProduction() ? ['ID', 'MN'] : ['MN'];
