import React, { ReactElement } from 'react';
import IcDropdown from '../../public/images/ic-dropdown.svg';
import './WalletsAccordion.scss';

type TProps = {
    header: ReactElement;
    content: ReactElement;
};

const WalletsAccordion: React.FC<TProps> = ({ header, content }) => {
    const [is_open, setIsOpen] = React.useState(false);

    return (
        <div className='wallets-accordion'>
            <button className='wallets-accordion__header' onClick={() => setIsOpen(!is_open)}>
                {header}
                <div className={`wallets-accordion__dropdown${is_open ? '--open' : ''}`}>
                    <IcDropdown />
                </div>
            </button>
            {is_open && content}
        </div>
    );
};

export default WalletsAccordion;
