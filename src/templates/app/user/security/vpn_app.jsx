import React from 'react';

const Step = ({
    circle_number,
    text,
    img_src,
}) => (
    <div className='step'>
        <div className='circle'>{circle_number}</div>
        <div className='content gr-row gr-padding-10 gr-row-align-between'>
            <p>{text}</p>
            <img className='vpn-app-icon' src={it.url_for(`images/pages/vpn/${img_src}`)} />
        </div>
    </div>
);
const VPNApp = () => (
    <div className='vpn-app'>
        <h1>{it.L('VPN App')}</h1>
        <p>{it.L('Establish a secure, encrypted connection to a virtual private network (VPN) server using our VPN app to protect your data and privacy.')}</p>
        <div className='center-text'>
            <h2>{it.L('How it works')}</h2>
            <p>{it.L('Secure your internet connection in three easy steps:')}</p>
            <div className='steps steps-vertical'>
                <Step
                    circle_number='1'
                    text={it.L('Download our VPN app for your preferred device')}
                    img_src='ic-devices.svg'
                />
                <Step
                    circle_number='2'
                    text={it.L('Activate the VPN service on the app')}
                    img_src='ic-activate.svg'
                />
                <Step
                    circle_number='3'
                    text={it.L('Browse and trade securely on your preferred device')}
                    img_src='ic-browse.svg'
                />
            </div>
        </div>
        <div className='border-bottom'>&nbsp;</div>
        <div className='cta-download-heading center-text'>
            <h2>{it.L('Download our VPN app now')}</h2>
        </div>
        <div className='mobile-app gr-row gr-row-align-around'>
            <div className='full-width gr-row gr-row-align-around gr-padding-20'>
                <div className='column gr-gutter-right'>
                    <div className='gr-padding-10'>
                        <a
                            className='button'
                            href='https://binary.la/vpn/BinaryVPN.exe'
                            rel='nofollow noopener'
                            title={it.L('Download Binary VPN app for Windows Desktop')}
                            download
                        >
                            <img src={it.url_for('images/pages/vpn/btn-windows.svg')} />
                        </a>
                    </div>
                </div>
                <div className='vertical-divider' />
                <div className='column gr-gutter-left'>
                    <div className='gr-padding-10'>
                        <a
                            className='button'
                            href='https://play.google.com/store/apps/details?id=com.binary.outline.android.client'
                            rel='noopener noreferrer nofollow'
                            target='_blank'
                            title={it.L('Download Binary VPN app For Android')}
                        >
                            <img src={it.url_for('images/pages/vpn/btn-android.svg')} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default VPNApp;
