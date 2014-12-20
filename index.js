(function() {
    var Tools = function(){};

    Tools.prototype.extend = function(target) {
        var slice = Array.prototype.slice;
        slice.call(arguments, 1).forEach(function (source) {
            for (key in source)
                if (source[key] !== undefined) {
                    target[key] = source[key];
                }
        });
        return target;
    };

    Tools.prototype.serializeData = function(options) {
        if (typeof(options.data) === 'object') {
            options.data = this.param(options.data);
        }
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
            options.url = (options.url + '&' + options.data).replace(/[&?]{1,2}/, '?');
        return options;
    };

    Tools.prototype.mimeToDataType = function(mime) {
       var  scriptTypeRE = /^(?:text|application)\/javascript/i,
            xmlTypeRE = /^(?:text|application)\/xml/i,
            jsonType = 'application/json',
            htmlType = 'text/html';

        return mime && ( mime == htmlType ? 'html' :
                mime == jsonType ? 'json' :
                    scriptTypeRE.test(mime) ? 'script' :
                    xmlTypeRE.test(mime) && 'xml' ) || 'text'
    };

    Tools.prototype.param = function(obj, traditional){
        var params = [];
        params.add = function(k, v){
            this.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
        };
        this.serialize(params, obj, traditional);
        return params.join('&').replace('%20', '+')
    };

    Tools.prototype.serialize = function(params, obj, traditional, scope){
        var array = typeof(obj) === 'array';
        for (var key in obj) {
            var value = obj[key];

            if (scope) {
                key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
            }
            if (!scope && array) {
                params.add(value.name, value.value);
            }
            else if (traditional ? (typeof(value) === 'array') : (typeof(value) === 'object'))
                this.serialize(params, value, traditional, key);
            else params.add(key, value)
        }
    }


    var Ajax = function(options) {

        var document = window.document,
            key,
            name,
            scriptTypeRE = /^(?:text|application)\/javascript/i,
            xmlTypeRE = /^(?:text|application)\/xml/i,
            jsonType = 'application/json',
            htmlType = 'text/html';
            rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            blankRE = /^\s*$/;


        this.settings = {
            type: 'GET',
            success: function(){},
            fail: function(){},
            context: null,
            global: true,
            xhr: function () {
                return new window.XMLHttpRequest()
            },
            accepts: {
                script: 'text/javascript, application/javascript',
                json:   jsonType,
                xml:    'application/xml, text/xml',
                html:   htmlType,
                text:   'text/plain'
            },
            crossDomain: false,
            timeout: 0
        };

        var t = new Tools();

        var settings = t.extend({}, options || {});

        for (key in this.settings) {
            if (settings[key] === undefined) {
                settings[key] = this.settings[key];
            }
        }

        if (!settings.crossDomain) {
            settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
            RegExp.$2 != window.location.host;
        }

        var dataType = settings.dataType,
            hasPlaceholder = /=\?/.test(settings.url);

        if (!settings.url) {
            settings.url = window.location.toString();
        }
        settings = t.serializeData(settings);
        if(settings.accepts!== undefined) {
            var mime = settings.accepts[dataType];
        }

        var baseHeaders = { },
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = this.settings.xhr(), abortTimeout;

        if (!settings.crossDomain) {
            baseHeaders['X-Requested-With'] = 'XMLHttpRequest';
        }

        if (mime) {
            baseHeaders['Accept'] = mime;
            if (mime.indexOf(',') > -1) {
                mime = mime.split(',', 2)[0];
            }
            xhr.overrideMimeType && xhr.overrideMimeType(mime);
        }

        if (settings.contentType || (settings.data && settings.type.toUpperCase() != 'GET')) {
            baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded');
        }

        settings.headers = t.extend(baseHeaders, settings.headers || {});

        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                clearTimeout(abortTimeout);
                var result,
                    error = false;
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                    dataType = dataType || t.mimeToDataType(xhr.getResponseHeader('content-type'));
                    result = xhr.responseText;

                    try {
                        if (dataType == 'script') {
                            (1, eval)(result)
                        }else if (dataType == 'xml') {
                            result = xhr.responseXML;
                        }else if (dataType == 'json') {
                            result = blankRE.test(result) ? null : JSON.parse(result);
                        }
                    } catch (e) { error = e }

                    if (error) {
                        settings.fail(error, 'parsererror', xhr, settings)
                    } else {
                        settings.success(result, xhr, settings)
                    }
                } else {
                    settings.fail(null, 'error', xhr, settings)
                }
            }
        }

        var async = 'async' in settings ? settings.async : true
        xhr.open(settings.type, settings.url, async)

        for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])


        if (settings.timeout > 0) abortTimeout = setTimeout(function(){
            xhr.onreadystatechange = empty
            xhr.abort()
            settings.fail(null, 'timeout', xhr, settings)
        }, settings.timeout)

        xhr.send(settings.data ? settings.data : null)
        return xhr
    };

    Ajax.getJSON = function(url, success) {
        return Ajax({
            url : url,
            success : success,
            dataType: 'json'
        });
    };

    Ajax.get = function(url, success){
        return Ajax({
            url: url,
            success: success
        });
    };

    Ajax.post = function(url, data, success, dataType) {
        return Ajax({
            url:url,
            success:success,
            data:data,
            dataType: dataType,
            type:'POST'
        });
    };


    window.Ajax = Ajax;

})();