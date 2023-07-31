import React from 'react';
import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';
import Main from '../layout/Main';
import Endpoint from '../layout/Endpoint';
import NotFound from '../layout/NotFound';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

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
