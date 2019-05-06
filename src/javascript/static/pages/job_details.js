const BinaryPjax = require('../../app/base/binary_pjax');
const urlParam   = require('../../_common/url').param;
const urlFor     = require('../../_common/url').urlFor;

const JobDetails = (() => {
    let dept,
        dept_class,
        $sections_div,
        $senior_perl_message,
        $sidebar,
        $sidebar_dept;

    const showSelectedDiv = () => {
        const section = window.location.hash;
        $sections_div.setVisibility(0).filter(section).setVisibility(1);
        if (dept === 'Information_Technology' && /senior_perl_developer/.test(section)) {
            $senior_perl_message.setVisibility(1);
        } else {
            $senior_perl_message.setVisibility(0);
        }
    };

    const onLoad = () => {
        dept                 = urlParam('dept');
        dept_class           = `.${dept}`;
        $sidebar             = $('.sidebar');
        $sidebar_dept        = $sidebar.filter(dept_class);
        $sections_div        = $('.sections > div > div');
        $senior_perl_message = $('.senior_perl_message');
        // hide all first (to handle pjaxload)
        $sidebar.setVisibility(0);
        $('#title').find('h1').setVisibility(0);
        $('#image').find('img').setVisibility(0);

        if ($sidebar_dept.length && window.location.hash === '') {
            BinaryPjax.load(`${urlFor('open-positions/job-details')}?dept=${dept}${$sidebar_dept.find('a')[0].hash}`);
        } else if ($sidebar_dept.length === 0 || $sidebar_dept.find(`a[href="${window.location.hash}"]`).length === 0) {
            BinaryPjax.load(urlFor('404'));
        }

        // show sections
        $(dept_class).setVisibility(1);
        $sidebar_dept.setVisibility(1).find(`a[href="${window.location.hash}"]`).parent('li').addClass('selected');
        showSelectedDiv();
        $('#back-button').attr('href', `${urlFor('open-positions')}#${dept}`);
        addEventListeners();
    };

    const addEventListeners = () => {
        const $sidebar_list_item = $sidebar_dept.find('#sidebar-nav li');
        $sidebar_list_item.click(function () {
            $sidebar_list_item.removeClass('selected');
            $(this).addClass('selected');
        });

        $(window).on('hashchange', () => {
            showSelectedDiv();
        });
    };

    const onUnload = () => {
        $(window).off('hashchange');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = JobDetails;
