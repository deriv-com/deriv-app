import React from 'react';
import Accounts from './accounts.jsx';
import { LogoIcon } from '../Icons.jsx';
import '../../assets/sass/header/_header.scss';

const Header = () => (
    <header className='header'>
        <div className='header__header-items'>
            <div className='header__items--left'>
                <LogoIcon />
            </div>
            <div className='header__items--right'>
                <Accounts />
            </div>
        </div>
    </header>
);

export default Header;
