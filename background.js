chrome.runtime.onMessageExternal.addListener(onContentMessage)

function onContentMessage(message, sender, sendResponse) {
    sendNativeMessage(
        message.method,
        message.data,
        function(response) {
            //received native response
            if (!validateResponse(response)) {
                return sendResponse({
                    success: false,
                    data: getError(response)
                })
            }
            return sendResponse({
                success: true,
                data: response.data
            })
        }
    )
    return true
}

function sendNativeMessage(method, data, callback) {
    var hostname = 'uk.nhs.ncrs.auth'
    var message = {
        method: method,
        data: data || {}
    }
    //sent native message to the native bridge
    chrome.runtime.sendNativeMessage(
        hostname,
        message,
        callback
    )
}

function isObject(obj) {
    var type = typeof obj
    return type === 'function' || type === 'object' && !!obj
}

function validateResponse(response) {
    return response &&
        response.success === true &&
        isObject(response.data)
}

function getError(response) {
    if (!response) {
        return createError(
            200,
            'No response from Bridge'
        )
    }
    if (!response.errorCode) {
        return createError(
            201,
            'Invalid response from Bridge: ' + response.toString()
        )
    }
    return createError(
        response.errorCode,
        response.errorDescription
    )
}

function createError(code, description) {
    var error = new Error(description)
    error.code = code
    error.description = error.message
    return error
}