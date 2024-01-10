export default {

    request: function (req, token) {
        this.drivers.http.setHeaders.call(this, req, {
            Authorization: 'Bearer ' + token
        });
    },

    response: function (res) {
        var headers = this.drivers.http.getHeaders.call(this, res),
            token = headers.Authorization || headers.authorization;

        if (token) {
            token = token.split(/Bearer:?\s?/i);

            return token[token.length > 1 ? 1 : 0].trim();

        } else {
            if (res.data && res.data.data && res.data.data.token) {
                return res.data.data.token
            } else if (res && res.body && res.body.data && res.body.data.token) {
                return res.body.data.token
            }
        }
    }
};
