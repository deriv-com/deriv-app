const path = require('path');
const { ALIASES, IS_RELEASE, MINIMIZERS, plugins, rules } = require('./constants');

module.exports = function (env, argv) {
    const base = env && env.base && env.base != true ? '/' + env.base + '/' : '/';

    return {
        context: path.resolve(__dirname, '../src'),
        devtool: IS_RELEASE ? 'source-map' : 'cheap-module-eval-source-map',
        entry: {
            account: path.resolve(__dirname, '../src', 'index.js'),
            'demo-message': 'Components/demo-message',
            'error-component': 'Components/error-component',
            'file-uploader-container': 'Components/file-uploader-container',
            'financial-assessment': 'Sections/Profile/FinancialAssessment',
            'form-body': 'Components/form-body',
            'form-footer': 'Components/form-footer',
            'form-sub-header': 'Components/form-sub-header',
            'icon-message-content': 'Components/icon-message-content',
            'leave-confirm': 'Components/leave-confirm',
            'load-error-message': 'Components/load-error-message',
            'poa-expired': 'Components/poa-expired',
            'poa-needs-review': 'Components/poa-needs-review',
            'poa-status-codes': 'Components/poa-status-codes',
            'poa-submitted': 'Components/poa-submitted',
            'poa-unverified': 'Components/poa-unverified',
            'poa-verified': 'Components/poa-verified',
            'poi-expired': 'Components/poi-expired',
            'poi-missing-personal-details': 'Components/poi-missing-personal-details',
            'poi-onfido-failed': 'Components/poi-onfido-failed',
            'poi-unsupported': 'Components/poi-unsupported',
            'poi-unverified': 'Components/poi-unverified',
            'poi-upload-complete': 'Components/poi-upload-complete',
            'poi-verified': 'Components/poi-verified',
            'proof-of-identity-container': 'Sections/Verification/ProofOfIdentity/proof-of-identity-container.jsx',
            'proof-of-address-container': 'Sections/Verification/ProofOfAddress/proof-of-address-container.jsx',
            'scrollbars-container': 'Components/scrollbars-container',
            text: 'Components/text',
            'text-container': 'Components/text-container',
        },
        mode: IS_RELEASE ? 'production' : 'development',
        module: {
            rules: rules(),
        },
        resolve: {
            alias: ALIASES,
            extensions: ['.js', '.jsx'],
        },
        optimization: {
            namedChunks: true,
            namedModules: true,
            minimize: IS_RELEASE,
            minimizer: MINIMIZERS,
        },
        output: {
            filename: 'js/[name].js',
            publicPath: base,
            path: path.resolve(__dirname, '../dist'),
            chunkFilename: 'js/account.[name].[contenthash].js',
            libraryExport: 'default',
            library: '@deriv/account',
            libraryTarget: 'umd',
        },
        externals: [
            {
                react: 'react',
                'react-dom': 'react-dom',
                'react-router-dom': 'react-router-dom',
                'react-router': 'react-router',
                mobx: 'mobx',
                'mobx-react': 'mobx-react',
                '@deriv/shared': '@deriv/shared',
                '@deriv/components': '@deriv/components',
                '@deriv/translations': '@deriv/translations',
            },
            /^@deriv\/shared\/.+$/,
            /^@deriv\/components\/.+$/,
            /^@deriv\/translations\/.+$/,
        ],
        target: 'web',
        plugins: plugins(base, false),
    };
};
