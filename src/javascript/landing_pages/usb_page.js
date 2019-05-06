// jQuery to collapse the navbar on scroll
function collapseNavbar() {
    if ($('.navbar').offset().top > 50) {
        $('.navbar-fixed-top').addClass('top-nav-collapse');
    } else {
        $('.navbar-fixed-top').removeClass('top-nav-collapse');
    }
}

$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);

window.onload = function () {
    commonOnload();
};
