if (function(c, i, a) {
        "use strict";
        var o = {
            YT: null,
            init: function() {
                var t = {
                    "jet-blog-smart-listing.default": o.initSmartListing,
                    "jet-blog-smart-tiles.default": o.initSmartTiles,
                    "jet-blog-text-ticker.default": o.initTextTicker,
                    "jet-blog-video-playlist.default": o.initPlayList
                };
                c.each(t, function(t, e) {
                    i.hooks.addAction("frontend/element_ready/" + t, e)
                })
            },
            initPlayList: function(i) {
                void 0 !== YT.Player ? o.initPlayListCb(i, YT) : c(document).on("JetYouTubeIframeAPIReady", function(t, e) {
                    o.initPlayListCb(i, e)
                })
            },
            initPlayListCb: function(t, e) {
                null === o.YT && (o.YT = e), t.hasClass("players-initialized") || (t.addClass("players-initialized"), o.switchVideo(t.find(".jet-blog-playlist__item.jet-blog-active")), t.on("click.JetBlog", ".jet-blog-playlist__item", function() {
                    t.find(".jet-blog-playlist__canvas").addClass("jet-blog-canvas-active"), o.switchVideo(c(this))
                }), t.on("click.JetBlog", ".jet-blog-playlist__canvas-overlay", o.stopVideo))
            },
            initTextTicker: function(t) {
                var r = null,
                    d = t.find(".jet-text-ticker__posts"),
                    e = d.data("typing"),
                    i = d.data("slider-atts");

                function o(t) {
                    var e = 0,
                        i = t.closest(".jet-text-ticker__item-typed"),
                        a = t.data("typing-text"),
                        s = a.length;
                    i.addClass("jet-text-typing"), t.text(a.substr(0, e++)), r = setInterval(function() {
                        e <= s ? t.text(a.substr(0, e++)) : (clearInterval(r), i.removeClass("jet-text-typing"))
                    }, 40)
                }
                e && (d.on("init", function(t, e) {
                    o(c('[data-slick-index="' + e.currentSlide + '"] .jet-text-ticker__item-typed-inner', d))
                }), d.on("beforeChange", function(t, e, i, a) {
                    var s = c('[data-slick-index="' + i + '"] .jet-text-ticker__item-typed', d),
                        n = c('[data-slick-index="' + i + '"] .jet-text-ticker__item-typed-inner', d),
                        l = c('[data-slick-index="' + a + '"] .jet-text-ticker__item-typed-inner', d);
                    clearInterval(r), s.removeClass("jet-text-typing"), n.text(""), o(l)
                })), d.slick(i)
            },
            initSmartListing: function(t) {
                t.on("click.JetBlog", ".jet-smart-listing__filter-item a", o.handleSmartListingFilter), t.on("click.JetBlog", ".jet-smart-listing__arrow", o.handleSmartListingPager);
                var e = t.find(".jet-smart-listing__filter");
                e.data("rollup") && e.JetBlogMore(), c(document).trigger("jet-blog-smart-list/init", [t, o])
            },
            initSmartTiles: function(t) {
                var e = t.find(".jet-smart-tiles-carousel");
                if (0 === e.length) return !1;
                var i = e.data("slider-atts");
                e.slick(i)
            },
            stopVideo: function(t) {
                var e = c(t.currentTarget).closest(".jet-blog-playlist__canvas"),
                    i = e.data("player"),
                    a = e.data("provider");
                e.hasClass("jet-blog-canvas-active") && (e.removeClass("jet-blog-canvas-active"), o.pauseCurrentPlayer(i, a))
            },
            switchVideo: function(t) {
                var e = t.closest(".jet-blog-playlist").find(".jet-blog-playlist__canvas"),
                    i = t.closest(".jet-blog-playlist").find(".jet-blog-playlist__counter-val"),
                    a = t.data("id"),
                    s = e.find("#embed_wrap_" + a),
                    n = t.data("player"),
                    l = t.data("provider"),
                    r = e.data("player"),
                    d = e.data("provider");
                if (n && (o.startNewPlayer(n, l), e.data("provider", l), e.data("player", n)), r && o.pauseCurrentPlayer(r, d), i.length && i.html(t.data("video_index")), t.siblings().removeClass("jet-blog-active"), t.hasClass("jet-blog-active") || t.addClass("jet-blog-active"), !s.length) {
                    switch (s = c('<div id="embed_wrap_' + a + '"></div>').appendTo(e), l) {
                        case "youtube":
                            o.intYouTubePlayer(t, {
                                id: a,
                                canvas: e,
                                currentPlayer: r,
                                playerTarget: s,
                                height: t.data("height"),
                                videoId: t.data("video_id")
                            });
                            break;
                        case "vimeo":
                            o.intVimeoPlayer(t, {
                                id: a,
                                canvas: e,
                                currentPlayer: r,
                                playerTarget: s,
                                html: c.parseJSON(t.data("html"))
                            })
                    }
                    s.addClass("jet-blog-playlist__embed-wrap")
                }
                s.addClass("jet-blog-active").siblings().removeClass("jet-blog-active")
            },
            intYouTubePlayer: function(i, a) {
                var t = c('<div id="embed_' + a.id + '"></div>').appendTo(a.playerTarget);
                new o.YT.Player(t[0], {
                    height: a.height,
                    width: "100%",
                    videoId: a.videoId,
                    playerVars: {
                        showinfo: 0,
                        rel: 0
                    },
                    events: {
                        onReady: function(t) {
                            i.data("player", t.target), a.currentPlayer && t.target.playVideo(), a.canvas.data("provider", "youtube"), a.canvas.data("player", t.target)
                        },
                        onStateChange: function(t) {
                            var e = i.find(".jet-blog-playlist__item-index");
                            if (e.length) switch (t.data) {
                                case 1:
                                    e.removeClass("jet-is-paused").addClass("jet-is-playing"), a.canvas.hasClass("jet-blog-canvas-active") || a.canvas.addClass("jet-blog-canvas-active");
                                    break;
                                case 2:
                                    e.removeClass("jet-is-playing").addClass("jet-is-paused")
                            }
                        }
                    }
                })
            },
            intVimeoPlayer: function(e, i) {
                var t = c(i.html).appendTo(i.playerTarget),
                    a = new Vimeo.Player(t[0]),
                    s = e.find(".jet-blog-playlist__item-index");
                a.on("loaded", function(t) {
                    e.data("player", this), i.currentPlayer && this.play(), i.canvas.data("provider", "vimeo"), i.canvas.data("player", this)
                }), a.on("play", function() {
                    s.length && (s.removeClass("jet-is-paused").addClass("jet-is-playing"), i.canvas.hasClass("jet-blog-canvas-active") || i.canvas.addClass("jet-blog-canvas-active"))
                }), a.on("pause", function() {
                    s.length && s.removeClass("jet-is-playing").addClass("jet-is-paused")
                })
            },
            pauseCurrentPlayer: function(t, e) {
                switch (e) {
                    case "youtube":
                        t.pauseVideo();
                        break;
                    case "vimeo":
                        t.pause()
                }
            },
            startNewPlayer: function(t, e) {
                switch (e) {
                    case "youtube":
                        setTimeout(function() {
                            t.playVideo()
                        }, 300);
                        break;
                    case "vimeo":
                        t.play()
                }
            },
            handleSmartListingFilter: function(t) {
                var e = c(this),
                    i = e.closest(".jet-smart-listing__filter-item"),
                    a = e.data("term");
                t.preventDefault(), i.closest(".jet-smart-listing__filter").find(".jet-active-item").removeClass("jet-active-item"), i.addClass("jet-active-item"), o.requestPosts(e, {
                    term: a,
                    paged: 1
                })
            },
            handleSmartListingPager: function() {
                var t = c(this),
                    e = t.closest(".jet-smart-listing-wrap"),
                    i = parseInt(e.data("page"), 10),
                    a = 1,
                    s = parseInt(e.data("term"), 10),
                    n = t.data("dir");
                t.hasClass("jet-arrow-disabled") || ("next" === n && (a = i + 1), "prev" === n && (a = i - 1), o.requestPosts(t, {
                    term: s,
                    paged: a
                }))
            },
            requestPosts: function(t, e) {
                var i = t.closest(".jet-smart-listing-wrap");
                i.next(".jet-smart-listing-loading");
                i.hasClass("jet-processing") || (i.addClass("jet-processing"), c.ajax({
                    url: a.ajaxurl,
                    type: "POST",
                    dataType: "json",
                    data: {
                        action: "jet_blog_smart_listing_get_posts",
                        jet_request_data: e,
                        jet_widget_settings: i.data("settings")
                    }
                }).done(function(t) {
                    var e = i.find(".jet-smart-listing__arrows");
                    i.removeClass("jet-processing").find(".jet-smart-listing").html(t.data.posts), e.length && e.replaceWith(t.data.arrows)
                }).fail(function() {
                    i.removeClass("jet-processing")
                }), void 0 !== e.paged && i.data("page", e.paged), void 0 !== e.term && i.data("term", e.term))
            }
        };
        c(window).on("elementor/frontend/init", o.init);

        function t(t) {
            this.$el = c(t), this.$container = this.$el.closest(".jet-smart-listing__heading"), this.$container.find(".jet-smart-listing__title").length ? this.$heading = this.$container.find(".jet-smart-listing__title") : this.$heading = this.$container.find(".jet-smart-listing__title-placeholder"), this.settings = c.extend({
                icon: "fa fa-ellipsis-h",
                tag: "i",
                className: "jet-smart-listing__filter-item jet-smart-listing__filter-more"
            }, this.$el.data("more")), this.containerWidth = 0, this.itemsWidth = 0, this.heading = 0, this.init()
        }
        t.prototype = {
            constructor: t,
            init: function() {
                var t = this;
                this.containerWidth = this.$container.width(), this.heading = this.$heading.outerWidth(), this.$hiddenWrap = c('<div class="' + this.settings.className + '" hidden="hidden"><' + this.settings.tag + ' class="' + this.settings.icon + '"></' + this.settings.tag + "></div>").appendTo(this.$el), this.$hidden = c('<div class="jet-smart-listing__filter-hidden-items"></div>').appendTo(this.$hiddenWrap), this.iter = 0, this.rebuildItems(), setTimeout(function() {
                    t.watch(), t.rebuildItems()
                }, 300)
            },
            watch: function() {
                c(window).on("resize.JetBlogMore orientationchange.JetBlogMore", this.debounce(100, this.watcher.bind(this)))
            },
            watcher: function(t) {
                this.containerWidth = this.$container.width(), this.itemsWidth = 0, this.$hidden.html(""), this.$hiddenWrap.attr("hidden", "hidden"), this.$el.find("> div[hidden]:not(.jet-smart-listing__filter-more)").each(function() {
                    c(this).removeAttr("hidden")
                }), this.rebuildItems()
            },
            rebuildItems: function() {
                var i = this,
                    t = this.$el.find("> div:not(.jet-smart-listing__filter-more):not([hidden])"),
                    a = 0,
                    s = parseInt(this.$hiddenWrap.outerWidth(), 10);
                this.itemsWidth = 0, t.each(function() {
                    var t = c(this),
                        e = null;
                    i.itemsWidth += t.outerWidth(), a = i.$heading.outerWidth() + s + i.itemsWidth, i.containerWidth - a < 0 && t.is(":visible") && (e = t.clone(), t.attr({
                        hidden: "hidden"
                    }), i.$hidden.append(e), i.$hiddenWrap.removeAttr("hidden"))
                })
            },
            debounce: function(e, i) {
                var a;
                return function(t) {
                    a && clearTimeout(a), a = setTimeout(function() {
                        i.call(this, t), a = null
                    }, e)
                }
            }
        }, c.fn.JetBlogMore = function() {
            return this.each(function() {
                new t(this)
            })
        }
    }(jQuery, window.elementorFrontend, window.JetBlogSettings), 1 === window.hasJetBlogPlaylist)
function onYouTubeIframeAPIReady() {
    jQuery(document).trigger("JetYouTubeIframeAPIReady", [YT])
}