(function() {
    Ajax({
        url: 'data.json',
        success: function(res) {
            console.log(res);
        },
        dataType: 'json'
    });


    Ajax.getJSON('data.json', function(data) {
        console.log('getJSON');
        console.log(data);
    });

    Ajax.get('data.json', function(data) {
        console.log('get');
        console.log(data);
    });
    /* POST DATA */
    /*
    Ajax.post('data.json', {a:'a'}, function(res) {
       console.log('post');
        console.log(res);
    });
    */
})();