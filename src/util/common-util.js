function fetchStoreDBKey(request) {
    return request.getId() + "_STORE_DB_" + request.getUrl();
}

function showAlert(context, message) {
    context.app.alert('请求存储到DB中处理结果', message);
}


module.exports = {
    fetchStoreDBKey,
    showAlert
};