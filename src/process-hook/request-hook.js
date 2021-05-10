const axios = require('axios');
const { fetchStoreDBKey, showAlert } = require('../util/common-util.js');

module.exports = function (context) {
    const sotreDBTrigger = context.request.getHeader("STORE_DB_TRIGGER");
    if ('true' === sotreDBTrigger || 'TRUE' === sotreDBTrigger || '1' === sotreDBTrigger) {
        storeDBHook(context, context.request);
    }
}

/**
 * 存储到DB中的Hook
 * @param {insomnia上下文} context 
 * @param {insomnia请求} request 
 */
function storeDBHook(context, request) {
    const storeDBTimeout = request.getHeader("STORE_DB_TIMEOUT");
    const storeDBServerUrl = request.getHeader("STORE_DB_SERVER_URL");
    const storeDBRouterGroup = request.getHeader("STORE_DB_ROUTER");
    const storeDBTitle = request.getHeader("STORE_DB_TITLE");
    const storeDBBUrlType = request.getHeader("STORE_DB_URL_TYPE");
    const storeDBBusinessIdentity = request.getHeader("STORE_DB_BUSINESS_IDENTITY");
    const storeDBMemo = request.getHeader("STORE_DB_MEMO");
    const storeDBMethod = request.getMethod();
    const storeDBRequestBody = request.getBody();
    const storeDBRequestUrl = fetchTargetPath(request.getUrl());
    const storeDBHeaders = fetchHttpHeaders(context.request);

    axios.post(storeDBServerUrl, {
        routerGroup: storeDBRouterGroup,
        method: storeDBMethod,
        urlType: storeDBBUrlType,
        url: storeDBRequestUrl,
        headers: JSON.stringify(storeDBHeaders),
        body: storeDBRequestBody.text,
        title: storeDBTitle,
        businessIdentity: storeDBBusinessIdentity,
        memo: storeDBMemo
    }, {
        timeout: storeDBTimeout || 10000,
        headers: { 'Content-Type': 'application/json' }
    }).then(function (response) {
        context.store.setItem(fetchStoreDBKey(request), JSON.stringify(response));
    }).catch(function (error) {
        showAlert(context, '调用服务方失败: ' + JSON.stringify(error));
    });
}

/**
 * 获取我们要存储到远程DB中的url
 * @param {当前请求的url} url 
 * @returns 
 */
function fetchTargetPath(url) {
    const hostUrlIndex = url.indexOf("://");
    const tempHostUrl = url.substring(hostUrlIndex + "://".length);
    const targetUrlIndex = tempHostUrl.indexOf("/");
    return tempHostUrl.substring(targetUrlIndex).trim();
}

function fetchHttpHeaders(request) {

    const headers = request.getHeaders();

    let resultHeaders = {};
    let needRemoveHeaderNames = [];
    for (const header of headers) {
        const containStoreDB = (header.name.indexOf("STORE_DB") > -1);
        if (containStoreDB === true) {
            needRemoveHeaderNames.push(header.name);
        } else {
            resultHeaders[header.name] = header.value;
        }
    }

    // 删除STORE_DB开头的数据信息
    for (const name of needRemoveHeaderNames) {
        request.removeHeader(name);
    }
    return resultHeaders;
}