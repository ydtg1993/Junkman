export class Paginator {
    constructor(selector, totalPages, currentPage) {
        if (selector instanceof HTMLElement) {
            this.DOM = selector;
        }
        else {
            this.DOM = document.querySelector(selector);
        }
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }
    visiblePageCount(page) {
        this.visiblePagesCount = page - 2;
        return this;
    }
    bindEvent(func) {
        if (typeof func !== 'function')
            return this;
        this.callback = func;
        return this;
    }
    format(url) {
        this.url = url;
        return this;
    }
    make() {
        if (this.totalPages <= 1)
            return;
        if (this.currentPage > this.totalPages || this.currentPage < 1)
            this.currentPage = 1;
        let paginationContainer = document.createElement("ul");
        paginationContainer.className = "dlp-pagination";
        this.DOM.append(paginationContainer);
        // Render Previous button
        this.renderButton(paginationContainer, '‹', this.currentPage > 1 ? this.currentPage - 1 : 1);
        // Render first page
        this.renderButton(paginationContainer, '1', 1);
        // Render ellipsis if needed before the middle pages
        if (this.currentPage > 4) {
            let tmp = this.url;
            this.url = undefined;
            this.renderButton(paginationContainer, "...", -1);
            this.url = tmp;
        }
        // Calculate a larger range of pages around the current page
        let visiblePagesCount = 7; // Adjust this value based on your preference
        if (this.visiblePagesCount)
            visiblePagesCount = this.visiblePagesCount;
        let start = Math.max(2, this.currentPage - Math.floor(visiblePagesCount / 2));
        let end = Math.min(this.totalPages - 1, start + visiblePagesCount - 1);
        // Render pages around current page
        for (let i = start; i <= end; i++) {
            this.renderButton(paginationContainer, i.toString(), i);
        }
        // Render ellipsis if needed after the middle pages
        if (this.currentPage < this.totalPages - 3 && end < this.totalPages - 1) {
            let tmp = this.url;
            this.url = undefined;
            this.renderButton(paginationContainer, "...", -1);
            this.url = tmp;
        }
        // Render last page
        this.renderButton(paginationContainer, this.totalPages.toString(), this.totalPages);
        // Render Next button
        this.renderButton(paginationContainer, '›', this.currentPage < this.totalPages ? this.currentPage + 1 : this.totalPages);
    }
    renderButton(container, text, page) {
        const p = document.createElement('li');
        if (page === -1) {
            p.className = "dlp-pagination-page skip";
        }
        else if (this.currentPage === page && text !== '‹' && text !== '›') {
            p.className = "dlp-pagination-page current";
        }
        else {
            p.className = "dlp-pagination-page";
        }
        const a = document.createElement("a");
        if (this.url && page !== -1) {
            a.setAttribute('href', this.url.replace(":page", page));
        }
        else {
            a.setAttribute('href', "javascript:void(0);");
        }
        a.innerText = text;
        if (typeof this.callback === 'function') {
            a.addEventListener('click', () => this.callback(page));
        }
        p.append(a);
        container.appendChild(p);
    }
}
