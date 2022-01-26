import * as React from 'react';

const AppSettingsFooter = ({ children }) => <div className='dc-app-settings__footer'>{children}</div>;
const AppSettingsFooterLeft = ({ children }) => <div className='dc-app-settings__footer-left'>{children}</div>;
const AppSettingsFooterRight = ({ children }) => <div className='dc-app-settings__footer-right'>{children}</div>;

AppSettingsFooter.Left = AppSettingsFooterLeft;
AppSettingsFooter.Right = AppSettingsFooterRight;

export default AppSettingsFooter;
