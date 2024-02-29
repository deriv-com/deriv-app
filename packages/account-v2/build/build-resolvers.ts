import { ResolveOptions } from 'webpack';
import path from 'path';

export const buildResolvers = (): ResolveOptions => ({
    alias: {
        '@deriv/api': path.resolve(__dirname, '../node_modules/@deriv/api'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
});
