class Utils {
    
    static radToDeg(r) {
        return r * 180 / Math.PI;
    }

    static degToRad(d) {
        return d * Math.PI / 180;
    }

    static get(url) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);

            req.onload = function () {
                if (req.status == 200) {
                    resolve(JSON.parse(req.response));
                }
                else {
                    reject(Error(req.statusText));
                }
            };

            req.onerror = function () {
                reject(Error("Network Error"));
            };
            req.send();
        });
    }
}