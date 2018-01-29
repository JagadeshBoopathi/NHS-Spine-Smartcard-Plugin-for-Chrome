function api(global) {
    var pluginId = '{pluginID}'
    var pluginVersion = '0.0.1'

    global.nhsAuth = { //define the global nhsAuth object
        getToken: currySend('getToken', [ 'tokenId' ]),
        getTokenNoAuth: currySend('getTokenNoAuth', [ 'tokenId' ]),
        getAdaptorVersion: pluginVersion,
        getBridgeVersion: currySend('getVersion', [ 'version' ])
    }

    function send(method, requestData, callback) {
        chrome.runtime.sendMessage(
            pluginId,
            {
                method: method,
                data: requestData || null
            },
            callback
        )
    }

    function currySend(name, dataKeys) {
        return function(data, callback) {
            if (typeof data === 'function') {
                callback = data
                data = undefined
            }
            if (typeof callback !== 'function') {
                throw new TypeError('No callback provided')
            }

            send(name, data, function(response) {
                if (!response) {
                    var error = new Error(
                        'Empty response from backend, check plugin IDs.'
                    )
                    error.code = 100
                    return callback(error)
                }

                if (response.success !== true) {
                    var backendError = response.data
                    // Re-apply stripped off message
                    backendError.message = backendError.description
                    delete backendError.description
                    return callback(backendError)
                }

                returnData = dataKeys.map(function(key) {
                    return response.data[key]
                })
                returnData.unshift(null)
                return callback.apply(callback, returnData)
            })
        }
    }

}

// synchronously inject script into the page
var authScript = '';
authScript = document.createElement('script');
authScript.textContent = '(' + api.toString() + ')(window)'
authScript.onload = function() {
	this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(authScript);
