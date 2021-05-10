
rest
module.exports.requestHooks = [
    require('./src/process-hook/request-hook.js')
];

module.exports.responseHooks = [
    require('./src/process-hook/response-hook.js')
];
