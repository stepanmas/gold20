var LingualeoServer = function (g, p)
{
    function e(a, c) {l("POST", lingualeo.addArgumentsToUrl(a, {port: m}), c)}
    
    function l(a, c, b)
    {
        if ("undefined" === typeof b.params || null === b.params)b.params = {};
        b.params.port = m;
        kango.xhr.send(
            {
                method: a,
                url: c,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "LinguaLeo-Version": q,
                    "X-Accept-Language": n
                },
                params: b.params
            }, function (a)
            {
                var d;
                if (200 !== a.status)
                {
                    d = {error: !0, error_msg: "Response status error: " + a.status};
                    k.responseStatusErrorHandler && k.responseStatusErrorHandler(
                        a.status,
                        b.isSilentError
                    );
                    if (b.onError)b.onError(d.error_msg, null, a.status);
                    if (b.onComplete)b.onComplete(d)
                }
                else if (b.isTextResponse)
                {
                    d = {text: a.response || ""};
                    if (b.onSuccess)b.onSuccess(d);
                    if (b.onComplete)b.onComplete(d)
                }
                else
                {
                    try
                    {d = JSON.parse(a.response)} catch (c)
                    {d = {error_code: 27051983, error_msg: "Wrong server response."}}
                    if (d.error_code)
                    {
                        if (k.responseErrorHandler && k.responseErrorHandler(
                                d.error_msg,
                                d.error_code,
                                b.isSilentError
                            ), b.onError)b.onError(d.error_msg, d, a.status)
                    }
                    else if (b.onSuccess)b.onSuccess(
                        d ||
                        {}
                    );
                    if (b.onComplete)b.onComplete(d || {})
                }
            }
        )
    }
    
    var k                     = this, n = p || "ru", m = kango.getExtensionInfo().settings.port, q = kango.getExtensionInfo().version;
    this.responseErrorHandler = this.responseStatusErrorHandler = null;
    this.setUserLocale                = function (a) {n = a || "ru"};
    this.loadTranslations             = function (a, c, b)
    {
        e(
            g + lingualeo.config.ajax.getTranslations,
            {
                isSilentError: !1,
                params: {
                    word: a.replace(/&/g, "%26"),
                    include_media: 1,
                    add_word_forms: 1
                },
                onSuccess: c,
                onError: b
            }
        )
    };
    this.setWordTranslation           = function (a, c, b, f, d, h, k)
    {
        e(
            g + lingualeo.config.ajax.addWordToDict,
            {
                isSilentError: !1,
                params: {word: a, tword: c, context: b || "", context_url: f, context_title: d},
                onSuccess: h,
                onError: k
            }
        )
    };
    this.setWordTranslationMultiple   = function (
        a,
        c,
        b
    )
    {
        for (var f = [], d = 0, h; h = a[d]; d++)f["words[" + d + "][word]"] = h.word, f["words[" + d + "][tword]"] = h.tword, f["words[" + d + "][context]"] = h.context, f["words[" + d + "][context_url]"] = h.context_url, f["words[" + d + "][context_title]"] = h.context_title;
        e(g + lingualeo.config.ajax.addWordToDictMultiple, {isSilentError: !0, params: f, onSuccess: c, onError: b})
    };
    this.translateCustomText          =
        function (a, c, b, f)
        {
            a = {
                isSilentError: !0,
                params       : {q: encodeURIComponent(a), source: c, target: b},
                onComplete   : f
            };
            l("GET", g + lingualeo.config.ajax.translate, a)
        };
    this.checkAuthorization           = function (a, c, b)
    {
        e(
            g + lingualeo.config.ajax.isAuth,
            {
                isSilentError: a,
                onSuccess: function (a) {c && c(a.is_authorized)},
                onError: b
            }
        )
    };
    this.getUntrainedWordsCount       = function (a, c)
    {
        e(
            g + lingualeo.config.ajax.getUntrainedWordsCount,
            {isSilentError: !0, onSuccess: a, onError: c}
        )
    };
    this.setCookieWithServer          = function (a)
    {
        e(
            g + lingualeo.config.ajax.setChromeHideCookie,
            {isSilentError: !0, onSuccess: a}
        )
    };
    this.login                        = function (a, c, b)
    {
        e(
            g + lingualeo.config.ajax.login,
            {
                isSilentError: !0,
                params: {
                    email: encodeURIComponent(a),
                    password: encodeURIComponent(c)
                },
                onComplete: b
            }
        )
    };
    this.getUserData                  = function (a)
    {
        e(
            g + lingualeo.config.ajax.login,
            {isSilentError: !0, onComplete: a}
        )
    };
    this.checkSiteNotifications       = function (a, c)
    {
        var b = lingualeo.config.ajax.checkSiteNotifications.replace(
            "{user_id}",
            a
        );
        l("GET", b, {isSilentError: !0, onSuccess: c})
    };
    this.getYoutubeCaptionsInfo       = function (a, c)
    {
        e(
            a, {
                isTextResponse: !0,
                onComplete    : c
            }
        )
    };
    this.exportYoutubeContentToJungle = function (
        a,
        c,
        b
    )
    {
        e(
            lingualeo.config.domain + lingualeo.config.path.youtubeExport,
            {params: {contentEmbed: a, genreId: c}, onComplete: b}
        )
    }
};