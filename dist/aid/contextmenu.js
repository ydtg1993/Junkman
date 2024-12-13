export function contextmenu(doms, options, width = "70px") {
    doms.forEach((dom) => {
        dom.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            if (e.target instanceof HTMLElement)
                e.target.click();
            let ul = document.createElement('ul');
            ul.className = "jk-contextmenu";
            options.forEach((option) => {
                let li = document.createElement('li');
                li.insertAdjacentHTML('afterbegin', option.title);
                li.style.width = width;
                if (typeof option.func === 'function') {
                    li.addEventListener('click', () => {
                        ul.remove();
                        option.func();
                    });
                    ul.append(li);
                }
            });
            ul.style.top = `${e.pageY - 3}px`;
            ul.style.left = `${e.pageX - 3}px`;
            ul.addEventListener("contextmenu", (e) => {
                e.preventDefault();
            });
            ul.addEventListener('mouseleave', () => {
                ul.remove();
            });
            document.getElementsByTagName("BODY")[0].appendChild(ul);
        });
    });
}
