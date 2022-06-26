const baseResponse = (status, message, data) => {
    
    let response = {
        status,
        message,
        data
    }
    return response;
}

const unauthorizedResponse = (error) => {
    let response = {
        status : 401,
        message : "Unauthorized Access!",
        details : error

    }
    return response;
}

const errorResponse = (status, message, details) => {
    let response = {
        status,
        message,
        details
    }
    return response
}

module.exports = {
    baseResponse,
    errorResponse,
    unauthorizedResponse
};
