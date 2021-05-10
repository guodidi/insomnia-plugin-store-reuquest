const { fetchStoreDBKey, showAlert } = require('../util/common-util.js');

module.exports = async function (context) {
        const containStoreDbKey = await context.store.hasItem(fetchStoreDBKey(context.request));
        if (containStoreDbKey === true) {
            await processStoreDBResult(context);
        }
    }

/**
 * 处理StoreDB的响应值
 * @param {insomnia上下文}} context 
 */
async function processStoreDBResult(context) {
    const storeDBResponseText = await context.store.getItem(fetchStoreDBKey(context.request));
    const storeDBResponse = JSON.parse(storeDBResponseText);
    if (storeDBResponse === null || storeDBResponse.data === null) {
        showAlert(context, '服务端异常，请查看服务端日志');
    } else if (storeDBResponse.data.success === false) {
        showAlert(context, '服务端异常:' + storeDBResponse.data.errorMsg);
    } else {
        showAlert(context, '处理成功');
    }
    await context.store.removeItem(fetchStoreDBKey(context.request));
}
