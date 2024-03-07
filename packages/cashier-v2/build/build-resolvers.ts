import { ResolveOptions } from 'webpack';
import path from 'path';

export const buildResolvers = (): ResolveOptions => ({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
        '@deriv-lib/account-v2-lib': path.resolve(__dirname, '../../account-v2/src/modules'),
    },
});
