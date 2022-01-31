export function isArray(ar) {
    return Array.isArray(ar);
}

export function isNode(el) {
    return !!(el && el.nodeType && el.nodeType === 1);
}

export function isFunction(f) {
    return typeof f === 'function';
}

export function isString(s) {
    return typeof s === 'string';
}

export function isObject(o) {
    let type = typeof o;
    return type === 'object' && (o != null && !isFunction(o) && !isArray(o));
}

export function getScript(url) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = url;
        s.async = true;
        s.onerror = reject;
        s.onload = s.onreadystatechange = function () {
            const loadState = this.readyState;
            if (loadState && loadState !== 'loaded' && loadState !== 'complete') {
                return;
            }
            s.onload = s.onreadystatechange = null;
            resolve();
        };
        document.head.appendChild(s);
    });
}
