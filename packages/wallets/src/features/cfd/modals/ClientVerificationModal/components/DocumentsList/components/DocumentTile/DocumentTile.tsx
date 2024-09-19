import React from 'react';
import { LabelPairedChevronRightMdRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import './DocumentTile.scss';

type TDocumentTileProps = {
    badge?: JSX.Element;
    onClick: VoidFunction;
    title: string;
};

const DocumentTile: React.FC<TDocumentTileProps> = ({ badge, onClick, title }) => {
    return (
        <button className='wallets-document-tile' onClick={onClick}>
            <Text align='start'>{title}</Text>
            <div className='wallets-document-tile__status'>
                {badge}
                <LabelPairedChevronRightMdRegularIcon />
            </div>
        </button>
    );
};

export default DocumentTile;
