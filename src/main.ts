import WebTorrent from "webtorrent";

const torrentId = "magnet:?xt=urn:btih:aac1a937501dbf6b2a8a1b4dc6650571b1f2655d&dn=bobbyd_ep1&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&xs=https%3A%2F%2Fbobbydigitales.github.io%2Faudiostream_content%2Fbobbyd_ep1.torrent&ws=https%3A%2F%2Fbobbydigitales.github.io%2Faudiostream_content%2F";
const client = new WebTorrent()

client.on('error', function (err) {
    if (err instanceof Error) {
        console.error('ERROR: ' + err.message)
    }
})

client.add(torrentId, onTorrent)

function onTorrent(torrent:WebTorrent.Torrent) {
    log(`<h2>${torrent.name}</h2>`, '#album_title');
    log('Got torrent metadata!')
    log(
        'Torrent info hash: ' + torrent.infoHash + ' ' +
        '<a href="' + torrent.magnetURI + '" target="_blank">[Magnet URI]</a> ' +
        '<a href="' + torrent.torrentFileBlobURL + '" target="_blank" download="' + torrent.name + '.torrent">[Download .torrent]</a>'
    )

    // Print out progress every 5 seconds
    const interval = setInterval(function () {
        log(`${torrent.name} - Progress: ${(torrent.progress * 100).toFixed(1)}%`, "#progress", true)
    }, 100)

    torrent.on('done', function () {
        log(`${torrent.name} -  Progress: 100%`, "#progress", true)
        clearInterval(interval);
    })

    // Render all files into to the page
    let autoplay = true;
    torrent.files.forEach(function (file:WebTorrent.TorrentFile) {

        log(file.name, ".content")
        if (file.name.includes('folder.jpg')) {
            file.getBlobURL(function (err, url) {

                if (!url) {
                    return;
                }

                if (err instanceof Error){
                    return log(err.message)
                }

                let albumArtElement = document.getElementById('album_art');
                
                if (albumArtElement === null) {
                    return;
                }

                let image = document.createElement('img');

                if (!image) {
                    return;
                }

                image.src = url;
                albumArtElement.appendChild(image);
                // log(`File done: ${file.name}`)
                // log('<a href="' + url + '">Download full file: ' + file.name + '</a>')
            })
            return;
        }
        file.appendTo('.content', { autoplay: autoplay })
        autoplay = false;
        //   log('(Blob URLs only work if the file is loaded from a server. "http//localhost" works. "file://" does not.)')
        //   file.getBlobURL(function (err, url) {
        //     if (err) return log(err.message)
        //     log(`File done: ${file.name}`)
        //     log('<a href="' + url + '">Download full file: ' + file.name + '</a>')
        //   })
    })
}

function log(str:string, id?:string, replace?:boolean) {
    if (!id) { id = '#log' }

    let element = document.querySelector(id);

    if (!element) {
        throw new Error();
    }

    if (replace) {
        element.innerHTML = str;
        return;
    }

    const p = document.createElement('p')
    p.innerHTML = str
    element.appendChild(p);
}