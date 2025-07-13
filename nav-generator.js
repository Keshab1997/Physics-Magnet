document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.getElementById('page-navigation');
    if (!navContainer) return;

    const path = window.location.pathname;
    const pathParts = path.split('/');
    const currentPageFile = pathParts.pop();
    const pageType = pathParts.pop();

    let baseName = '';
    let totalPages = 12;

    if (pageType === 'quiz') {
        baseName = 'Qset';
    } else if (pageType === 'revision') {
        baseName = 'revision';
    } else {
        return;
    }

    const currentPageNumber = parseInt(currentPageFile.replace(baseName, '').replace('.html', ''));

    if (isNaN(currentPageNumber)) return;

    let navHTML = '<div class="nav-controls">';

    // Previous Button
    if (currentPageNumber > 1) {
        navHTML += `<a href="${baseName}${currentPageNumber - 1}.html" class="nav-arrow prev">‹ পূর্ববর্তী</a>`;
    } else {
        navHTML += `<span class="nav-arrow prev disabled">‹ পূর্ববর্তী</span>`;
    }

    // Page Numbers
    navHTML += `<div class="page-numbers">`;
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPageNumber) {
            navHTML += `<span class="page-num active">${i}</span>`;
        } else {
            navHTML += `<a href="${baseName}${i}.html" class="page-num">${i}</a>`;
        }
    }
    navHTML += `</div>`;

    // Next Button
    if (currentPageNumber < totalPages) {
        navHTML += `<a href="${baseName}${currentPageNumber + 1}.html" class="nav-arrow next">পরবর্তী ›</a>`;
    } else {
        navHTML += `<span class="nav-arrow next disabled">পরবর্তী ›</span>`;
    }

    navHTML += '</div>';

    navContainer.innerHTML = navHTML;
});