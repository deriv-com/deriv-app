import React             from 'react';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

const Heading = ({ system, children }) => (
    <h1
        className='invisible download-heading gr-centered'
        id={`${system}-heading`}
    > {children || it.L(`MT5 for ${system.replace(/^\w/, c => c.toUpperCase())}`)}
    </h1>
);
const AlternativeDescription = ({ system, alt1, alt2 }) => (
    <p
        className='alternative-download-description invisible'
        id={`${system}-alternative-description`}
    >
        {it.L(
            'Looking for [_1] or [_2] Desktop apps?',
            alt1,
            alt2
        )}
    </p>
);

const DownloadBlock = ({
    badge,
    desc,
    download,
    href,
    image,
    os,
    target,
    title,
    children,
}) => {
    const ios_link = `<a id='mobile-alt' data-target='android'>${it.L('Android')}</a>`;
    const android_link = `<a id='mobile-alt' data-target='ios'>${it.L('iOS')}</a>`;
    return (
        <div className='gr-4 gr-12-m gr-padding-10' id={`${os}-app`}>
            <img
                className='gr-12 gr-centered mt-mobile-phone'
                src={it.url_for(`images/pages/metatrader/icons/${/[.]/.test(image) ? image : `${image.svg}`}`)}
            />
            <h3>{title}</h3>
            <p>{desc}</p>
            <DownloadButton
                badge={badge}
                href={href}
                download={download}
                target={target}
                os={os}
            >
                {children}
            </DownloadButton>
            <p className='mobile-alternative-download-description invisible' id={`${os}-alternative-description`}>{it.L('Looking for [_1] app?', os === 'ios' ? ios_link : android_link)}</p>
        </div>
    );
};

const DownloadButton = ({
    badge,
    href,
    download,
    target,
    children,
    os,
}) => (
    <a
        className={!badge ? 'button' : undefined}
        href={os ? `https://download.mql5.com/cdn/mobile/mt5/${os}?server=Binary.com-Server` : href}
        download={download || undefined}
        target={target || undefined}
    >
        <span className={badge || undefined}>{children}</span>
    </a>
);

const DesktopDownloadBlock = ({
    badge,
    download,
    href,
    os,
    target,
    id,
}) => (
    <div
        className='gr-12 gr-12-m gr-padding-10 invisible download-block'
        id={id}
    >
        <img
            className='gr-12 gr-centered gr-padding-20 mt-desktop-screen-app'
            src={it.url_for(`images/pages/metatrader/icons/${id}.png`)}
        />
        <div className='gr-padding-20'>
            <DownloadButton
                badge={badge}
                href={href}
                download={download}
                os={os}
                target={target}
            >
                {it.L(`Download MT5 for ${id.replace(/^\w/, c => c.toUpperCase())}`)}
            </DownloadButton>
        </div>
    </div>
);

const Download = () => {
    const windows_link = `<a data-type='alt-link' data-target='windows' id='enable-windows-alt-link'>${it.L('Windows')}</a>`;
    const linux_link   = `<a data-type='alt-link' data-target='linux' id='enable-linux-alt-link'>${it.L('Linux')}</a>`;
    const mac_link     = `<a data-type='alt-link' data-target='mac' id='enable-mac-alt-link'>${it.L('Mac')}</a>`;
    return (
        <div id='mt_download' className='static_full center-text'>
            <div className='gr-padding-20 desktop-apps'>
                <h1>{it.L('Start Trading with MetaTrader 5')}</h1>
                <h3>{it.L('Trade with a powerful interface known as the global industry standard.')}</h3>
                <Heading system='windows' />
                <Heading system='mac'>{it.L('MT5 for Mac')}</Heading>
                <Heading system='linux'>{it.L('MT5 for Linux')}</Heading>
                <p>
                    {it.L(
                        'Download MT5 for your desktop or laptop to access the powerful tools and features enjoyed by millions of traders.'
                    )}
                </p>
                <div className='gr-row'>
                    <DesktopDownloadBlock
                        id='windows'
                        href='https://s3.amazonaws.com/binary-mt5/binarycom_mt5.exe'
                    />
                    <DesktopDownloadBlock
                        id='mac'
                        href='https://s3.amazonaws.com/binary-mt5/binary-mt5.dmg'
                        download='true'
                    />
                    <DesktopDownloadBlock
                        id='linux'
                        href='https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux'
                        target='_blank'
                    />
                </div>
                <AlternativeDescription system='mac' alt1={windows_link} alt2={linux_link} />
                <AlternativeDescription system='windows' alt1={linux_link} alt2={mac_link} />
                <AlternativeDescription system='linux' alt1={mac_link} alt2={windows_link} />
                <p className='foot-note'>
                    {it.L(
                        'The MetaTrader platform will no longer support Windows XP, Windows 2003, and Windows Vista after 01 October, 2017.'
                    )}
                </p>
                <SeparatorLine no_wrapper />
            </div>

            <div className='gr-padding-30'>
                <h1 className='desktop-apps'>{it.L('MT5 for Mobile')}</h1>
                <p className='desktop-apps'>{it.L('Access the markets anytime, anywhere using native apps for your iOS or Android devices.')}</p>
                <div className='gr-row' id='mobile-apps'>
                    <Heading system='android'>{it.L('MT5 for Android')}</Heading>
                    <Heading system='ios'>{it.L('MT5 for iOS')}</Heading>
                    <p id='ios-description' className='ios-description invisible gr-gutter-m'>{it.L('Access the markets anytime, anywhere from your iOS device.')}</p>
                    <p id='android-description' className='android-description invisible gr-gutter-m'>{it.L('Access the markets anytime, anywhere from your Android device.')}</p>
                    <div className='gr-2 gr-hide-m' />
                    <DownloadBlock
                        image='ios-device.png'
                        os='ios'
                        desc={it.L('All versions for iOS')}
                        target='_blank'
                        badge='app-store-badge'
                    />
                    <DownloadBlock
                        image='android-device.png'
                        os='android'
                        desc={it.L('All versions for Android')}
                        target='_blank'
                        badge='google-play-badge'
                    />
                </div>
            </div>

            <SeparatorLine no_wrapper />

            <div className='gr-padding-20'>
                <h1>{it.L('MT5 for web platform')}</h1>
                <p className='no-margin'>
                    {it.L(
                        'Use the web platform from any Windows, MacOS, or Linux operating system – no download or installation required.'
                    )}
                </p>
                <p className='no-margin'>{it.L('We support the following web browsers:')}</p>
                <div className='gr-row'>
                    <div className='gr-10 gr-push-1 gr-10-p gr-push-1-p gr-12-m gr-push-0-m gr-padding-30'>
                        <div className='gr-row browsers'>
                            {['chrome', 'safari', 'firefox', 'edge', 'opera'].map((browser, idx) => (
                                <img
                                    key={idx}
                                    className='gr-centered mt-browser-icon'
                                    src={it.url_for(`images/pages/metatrader/icons/${browser}.svg`)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className='center-text'>
                    <a
                        className='button'
                        href='https://trade.mql5.com/trade?servers=Binary.com-Server&amp;trade_server=Binary.com-Server'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <span>{it.L('Start trading MT5 on web platform')}</span>
                    </a>
                </div>
            </div>
            <div className='gr-padding-30' />
        </div>
    );
};

export default Download;
