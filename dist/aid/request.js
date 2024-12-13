export function request({ url = '', method = "GET", header = {}, data = {}, callback = null, error_callback = null, timeout = 30000 }) {
    let xhr = new XMLHttpRequest();
    if (method === 'GET') {
        url = ((uri, params) => {
            let paramsArray = [];
            if (Object.keys(params).length === 0)
                return uri;
            Object.keys(params).forEach(key => params[key] && paramsArray.push(`${key}=${params[key]}`));
            if (uri.search(/\?/) === -1) {
                uri += `?${paramsArray.join('&')}`;
            }
            else {
                uri += `&${paramsArray.join('&')}`;
            }
            return uri;
        })(url, data);
    }
    xhr.open(method, url, true);
    xhr.timeout = timeout;
    if (header) {
        for (let h in header) {
            if (header.hasOwnProperty(h))
                xhr.setRequestHeader(h, header[h]);
        }
    }
    if (method === 'GET') {
        xhr.setRequestHeader("Content-type", "application/text;charset=UTF-8");
        xhr.responseType = "text";
        xhr.send(null);
    }
    else {
        if (data instanceof FormData) {
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.responseType = "json";
            xhr.send(data);
        }
        else {
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.responseType = "json";
            xhr.send(JSON.stringify(data));
        }
    }
    xhr.onload = function () {
        if (this.status >= 200 && this.status < 300)
            return;
    };
    xhr.onreadystatechange = function () {
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            let response = xhr.response;
            if (typeof callback === 'function')
                callback(response);
        }
    };
    xhr.onerror = function (e) {
        console.error(e);
        if (typeof error_callback === 'function')
            error_callback(e);
    };
}
