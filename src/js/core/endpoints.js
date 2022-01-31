export default class Endpoints {
    endpoints = {};

    getEndpoints(fetchUrl) {
        return new Promise((resolve, reject) => {

            if (this.endpoints.length) {
                resolve(this.endpoints);
            } else {
                fetch(fetchUrl, {method: 'POST'})
                    .catch((error) => {
                        reject(error);
                    })
                    .then(response => response.json())
                    .then((data) => {
                        this.endpoints = data;
                        resolve(this.endpoints);
                    });
            }
        });
    }
}
