GoogleBooksAPI = "https://www.googleapis.com/books/v1";

getGoogleBook = function(result) {
    if (result && result.data) {
        if (result.data.items && result.data.items.length > 0) {
            return result.data.items[0];
        }
    }
    return null;
}

googleFetchBookByISBN = function (isbn, callback) {
    var result;
    try {
        result = HTTP.get(GoogleBooksAPI + "/volumes", {params: {q: "isbn:" + isbn}}, callback);
    } catch (e) {
        return null;
    }
    return getGoogleBook(result);
};
