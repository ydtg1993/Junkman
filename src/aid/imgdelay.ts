export function imgDelay(doms: HTMLElement[], time: number = 200, options = {zoom: false, width: 300, height: 0}) {
    let i = 0;
    for (let dom of doms) {
        let src: string = dom.getAttribute('data-src')!;
        setTimeout(() => {
            dom.setAttribute('src', src);
            dom.onload = function () {
                if (!options.zoom) return;
                let img = document.createElement('img');
                dom.addEventListener('mouseover', function (e) {
                    document.body.append(img);
                    img.style.position = 'absolute';
                    img.style.zIndex = '1000000';
                    img.style.borderRadius = '3px';
                    img.setAttribute('src', src);

                    let width = img.naturalWidth;
                    let height = img.naturalHeight;
                    if (options.width !== 0) {
                        width = options.width;
                        height = img.naturalHeight * (options.width / img.naturalWidth);
                    }
                    if (options.height > 0) {
                        height = options.height;
                    } else if (options.height < 0) {
                        if (img.naturalHeight > window.innerHeight) {
                            height = (window.innerHeight - 10);
                            width = img.naturalWidth * (height / img.naturalHeight);
                        }
                    }
                    img.style.width = `${width}px`;
                    img.style.height = `${height}px`;
                    let offsetY = height / 2;

                    img.style.top = `${e.pageY - offsetY}px`;
                    let distanceToBottom = window.innerHeight - e.clientY;
                    if (window.innerHeight - e.clientY < offsetY + 5) {
                        img.style.top = `${e.pageY - (offsetY + (offsetY - distanceToBottom) + 5)}px`;
                    } else if (e.clientY < offsetY - 5) {
                        img.style.top = `${e.pageY - (offsetY - (offsetY - e.clientY) - 5)}px`;
                    }
                    if (window.innerWidth - e.clientX < width) {
                        img.style.left = `${e.pageX - width - 30}px`;
                    } else {
                        img.style.left = `${e.pageX + 25}px`;
                    }
                });
                dom.addEventListener('mouseout', function (e) {
                    e.stopPropagation();
                    img.remove();
                });
            };
        }, i * time);
        i++;
    }
}