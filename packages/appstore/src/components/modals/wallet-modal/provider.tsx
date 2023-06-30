/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { localize } from '@deriv/translations';
import DemoResetBalance from 'Components/demo-reset-balance';
import FiatTransactionList from 'Components/fiat-transaction-list';
import WalletTransfer from 'Components/wallet-transfer';
import WalletWithdrawal from '../../wallet-withdrawal';

export type TWalletType = 'real' | 'demo' | 'p2p' | 'payment_agent';

export const getCashierOptions = (type: TWalletType) => {
    switch (type) {
        case 'real':
            return [
                {
                    icon: 'IcAdd',
                    label: localize('Deposit'),
                    //Remove Lorem ipsum text after QA testing (testing scroll behavior)
                    content: () => (
                        <div style={{ textAlign: 'justify' }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas euismod lectus odio, sed
                            pulvinar ex eleifend eu. Quisque elementum pellentesque felis. Maecenas elementum vitae
                            purus sed ullamcorper. In quis tempus diam, non posuere ipsum. Quisque viverra in mauris
                            vitae suscipit. Vestibulum sodales elit ac rhoncus laoreet. Praesent vitae orci quis lacus
                            laoreet sodales ut in risus. Praesent molestie, ipsum pulvinar molestie finibus, purus elit
                            aliquam augue, sit amet faucibus odio sem vel est. Maecenas pellentesque aliquet dolor, at
                            efficitur lorem tincidunt quis. Aliquam hendrerit pellentesque euismod. Nunc sem metus,
                            lacinia non magna vitae, mollis volutpat nisl. Donec volutpat fringilla lectus, nec
                            venenatis nulla suscipit accumsan. Aliquam posuere fermentum nunc, eget tempor metus
                            ultrices sit amet. Duis tincidunt ac ipsum ut rutrum. Donec est ante, imperdiet vel eleifend
                            dapibus, pretium sit amet diam. Class aptent taciti sociosqu ad litora torquent per conubia
                            nostra, per inceptos himenaeos. Cras efficitur urna non tempor vehicula. Curabitur ac tortor
                            ut nunc lobortis aliquet molestie id mi. Morbi aliquet porta sapien et auctor. Quisque et
                            sem id arcu consequat molestie vitae eget eros. Duis at imperdiet purus. Nulla facilisi.
                            Fusce eleifend enim quis mauris condimentum, eget tristique ipsum efficitur. Etiam vel
                            posuere odio. Aenean sed ultricies est. Nulla sagittis, elit nec fringilla posuere, erat
                            risus euismod ligula, vitae vestibulum enim ligula sed magna. Vestibulum felis odio, blandit
                            sed gravida non, mattis at mi. Nulla auctor diam quis ornare venenatis. Vivamus vitae
                            vehicula mi, ut aliquam tellus. Vestibulum ante ipsum primis in faucibus orci luctus et
                            ultrices posuere cubilia curae; Sed ut urna ultrices, placerat nisl nec, ullamcorper nunc.
                            Suspendisse elit justo, cursus vel massa vel, ultricies vulputate eros. Fusce et nisi at mi
                            pellentesque viverra non a massa. Maecenas feugiat neque a nulla volutpat ullamcorper. Cras
                            accumsan mauris at mauris faucibus, a faucibus metus pulvinar. Etiam sollicitudin metus vel
                            diam ultricies suscipit. Pellentesque eu eros ullamcorper, dapibus risus vitae, malesuada
                            ante. Morbi tristique sagittis semper. Ut consequat volutpat malesuada. Pellentesque commodo
                            odio feugiat sapien vehicula sagittis. Integer rutrum sapien quis pharetra sollicitudin.
                            Maecenas commodo tincidunt justo. Aenean posuere nulla nec pulvinar placerat. Duis gravida
                            sit amet risus nec vulputate. Donec sit amet erat non ipsum pharetra sodales vel nec velit.
                            Fusce ultricies ultrices dignissim. Fusce at volutpat leo, vel blandit mauris. Etiam nec
                            metus tellus. Pellentesque in ultrices risus. Nam sodales nulla turpis, eu vestibulum sapien
                            ornare aliquet. Praesent porttitor condimentum massa, ut consectetur ligula scelerisque non.
                            Cras sodales purus in iaculis commodo. Suspendisse pulvinar pellentesque justo, et rhoncus
                            eros maximus nec. Maecenas dapibus eleifend dolor, ut interdum lectus congue ac. Vestibulum
                            aliquet suscipit nisi a tempus. Sed sodales ipsum est, in bibendum leo tempor vel. Quisque
                            in ipsum arcu. Sed vel hendrerit sapien. Suspendisse scelerisque elementum viverra. Donec
                            quis magna ornare urna finibus consectetur. Donec ut imperdiet ipsum. Suspendisse non nisi
                            quis arcu fringilla convallis. Nulla sed urna nulla. Pellentesque aliquet posuere ornare.
                            Donec auctor purus ac arcu ornare viverra. Vivamus nec quam laoreet turpis semper dignissim.
                            Cras vel convallis sem. Orci varius natoque penatibus et magnis dis parturient montes,
                            nascetur ridiculus mus. Integer eu leo orci. Aliquam iaculis velit id nulla ornare accumsan
                            in dapibus ligula. Vestibulum id dolor id ligula venenatis semper vel ac augue. Nulla vel
                            pharetra justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
                            inceptos himenaeos. Nulla venenatis interdum ultricies. Curabitur eu gravida ex, at ultrices
                            massa. Vivamus efficitur placerat magna vel posuere. Praesent ut nunc pretium, commodo dui
                            sed, semper sapien. Sed in vulputate arcu, vitae interdum nibh. Cras sodales, ligula eu
                            semper mattis, nunc ante hendrerit dui, a aliquam eros nulla laoreet augue. Nunc convallis
                            efficitur eros sed posuere. Phasellus mollis arcu et urna efficitur, non consectetur risus
                            accumsan. Fusce metus augue, rutrum in eros eget, sodales ultrices mauris. Aliquam nisi mi,
                            malesuada sit amet sem vitae, dictum porta tellus. Proin in semper nisi, vitae blandit eros.
                            Fusce in dignissim orci. Phasellus imperdiet, justo eu efficitur consectetur, nulla elit
                            efficitur justo, posuere cursus ligula metus eu sapien. Nullam posuere mi et ante aliquet, a
                            accumsan nulla iaculis. Interdum et malesuada fames ac ante ipsum primis in faucibus.
                        </div>
                    ),
                },
                { icon: 'IcMinus', label: localize('Withdraw'), content: () => <WalletWithdrawal /> },
                {
                    icon: 'IcAccountTransfer',
                    label: localize('Transfer'),
                    content: () => <p>Transfer Real</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Transactions'),
                    content: () => <FiatTransactionList />,
                },
            ];
        case 'demo':
            return [
                {
                    icon: 'IcAccountTransfer',
                    label: localize('Transfer'),
                    content: (props: React.ComponentProps<typeof WalletTransfer>) => <WalletTransfer {...props} />,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Transactions'),
                    content: () => <FiatTransactionList />,
                },
                {
                    icon: 'IcAdd',
                    label: localize('Reset balance'),
                    content: (props: React.ComponentProps<typeof DemoResetBalance>) => <DemoResetBalance {...props} />,
                },
            ];
        case 'p2p':
            return [
                {
                    icon: 'IcAdd',
                    label: localize('Buy/Sell'),
                    content: () => <p>Transfer Real</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Orders'),
                    content: () => <p>Transfer Real</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('My ads'),
                    content: () => <p>Transfer Real</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('My profile'),
                    content: () => <p>Transfer Real</p>,
                },
                {
                    icon: 'IcAccountTransfer',
                    label: localize('Transfer'),
                    content: () => <p>Transfer Real</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Transactions'),
                    content: () => <p>Transfer Real</p>,
                },
            ];
        case 'payment_agent':
            return [
                { icon: 'IcAdd', label: localize('Deposit'), content: () => <p>Transfer Real</p> },
                { icon: 'IcMinus', label: localize('Withdraw'), content: () => <p>Transfer Real</p> },
                {
                    icon: 'IcAccountTransfer',
                    label: localize('Transfer'),
                    content: () => <p>Transfer Real</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Transactions'),
                    content: () => <p>Transfer Real</p>,
                },
            ];
        default:
            return [];
    }
};
