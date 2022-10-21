import React from 'react';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import SecurityAndPrivacy from './security-and-privacy';

type TPopulateFooterExtensionsProps = {
    position: string;
    Component: React.FC;
    has_right_separator: boolean;
};

type TBotFooterExtentionsProps = {
    populateFooterExtensions: (footer_extensions: TPopulateFooterExtensionsProps[]) => void;
};

const BotFooterExtensions = ({ populateFooterExtensions }: TBotFooterExtentionsProps) => {
    React.useEffect(() => populateFooter(), []);
    React.useEffect(() => () => populateFooterExtensions([]), [populateFooterExtensions]);

    const populateFooter = () => {
        populateFooterExtensions([
            // TODO: need to import an icon on the left side of this footer extension
            {
                position: 'right',
                Component: SecurityAndPrivacy,
                has_right_separator: true,
            },
        ]);
    };

    return null;
};

export default connect(({ ui }: RootStore) => ({
    populateFooterExtensions: ui.populateFooterExtensions,
}))(BotFooterExtensions);
