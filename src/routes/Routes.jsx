import React from 'react';
import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';
import Main from '@components/Main';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Endpoint from '@components/Endpoint';
import NotFound from '@components/NotFound';

const generateBaseName = () => {
    const branch = process.env.BRANCH;
    if (branch) {
        const project_name = process.env.PROJECT_NAME || 'binary-bot';
        return [project_name, branch].join('/');
    }
    return '/';
};

const Routes = () => (
    <BrowserRouter basename={generateBaseName()}>
        <Header />
        <Switch>
            <Route exact path='/' element={<Main />} />
            <Route exact path='/endpoint' element={<Endpoint />} />
            <Route path='*' element={<NotFound />} />
        </Switch>
        <Footer />
    </BrowserRouter>
);

export default Routes;
