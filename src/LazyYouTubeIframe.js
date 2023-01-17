class LazyLoadYouTubeIframe {
    constructor(options) {

        const defaultOptions = {
            selector: ".lazy-yt",
            thumbSize: "mqdefault",
            includeYouTubeScript: true,
            imageClass: null,
            iframeClass: null,
            beforeLoadingEvent: null,
            afterLoadingEvent: null,
        }

        options = Object.assign({}, defaultOptions, options);

        const vm = this;

        vm.Videos = [];

        vm.IncludeYouTubeScript = () => {
            if (options.includeYouTubeScript) {

                let ytScriptNode = document.getElementById('LazyLoadYouTubeIframe');

                if (ytScriptNode == null) {
                    let tag = document.createElement('script');
                    tag.id = "LazyLoadYouTubeIframe";
                    tag.src = "https://www.youtube.com/iframe_api";
                    let firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                }
            }
        }

        vm.GetVideos = () => {
            let videosNodes = document.querySelectorAll(options.selector);

            let videos = [];

            for (let videoNode of videosNodes) {

                let id = videoNode.getAttribute('data-yt-id');
                let thumbSize = videoNode.getAttribute('data-yt-thumb-size');
                let thumbSizeSrc = videoNode.getAttribute('data-yt-thumb-src');
                let alt = videoNode.getAttribute('data-yt-alt');

                let videoInfo = new Video(id, thumbSize || options.thumbSize, thumbSizeSrc, alt, videoNode);

                vm.Videos.push(videoInfo);
            }
        }

        vm.SetDOMImages = () => {
            for (var video of vm.Videos) {

                let thumbElm = document.createElement("img");
                thumbElm.src = video.ThumbSrc || "https://img.youtube.com/vi/" + video.Id + "/" + video.ThumbSize + ".jpg";

                if (video.Alt) {
                    thumbElm.alt = video.Alt;
                }

                let dataImageClass = video.DOMNode.getAttribute('data-yt-image-class');
                thumbElm.className += options.imageClass ? options.imageClass : "";
                thumbElm.className += dataImageClass ? " " + dataImageClass : "";

                video.DOMNode.append(thumbElm);
            }
        }
        vm.SetClickEvent = () => {
            vm.Videos.forEach(video => {
                video.DOMNode.addEventListener('click', function (e) {
                    vm.LoadVideo(video);
                });
            });
        }

        vm.LoadVideo = (video) => {
            if (options.beforeLoadingEvent) {
                options.beforeLoadingEvent();
            }

            let dataIframeClass = video.DOMNode.getAttribute('data-yt-iframe-class');
            video.DOMNode.className += options.iframeClass ? " " + options.iframeClass : "";
            video.DOMNode.className += dataIframeClass ? " " + dataIframeClass : "";

            let player;
            player = new YT.Player(video.DOMNode, {
                videoId: video.Id,
                events: {
                    'onReady': onPlayerReady
                }
            });

            function onPlayerReady(event) {
                event.target.playVideo();
            }

            if (options.afterLoadingEvent) {
                options.afterLoadingEvent();
            }
        }

        vm.init = () => {
            vm.IncludeYouTubeScript();
            vm.GetVideos();
            vm.SetDOMImages();
            vm.SetClickEvent();
        }

        vm.init();
    }
}

class Video {
    constructor(id, thumbSize, thumbSrc, alt, domNode) {
        this.Id = id;
        this.ThumbSize = thumbSize;
        this.ThumbSrc = thumbSrc;
        this.Alt = alt;
        this.DOMNode = domNode;
    }
}




/*
sddefault,
mqdefault,
hqdefault,
maxresdefault
*/