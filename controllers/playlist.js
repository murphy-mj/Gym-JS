'use strict';

const logger = require('../utils/logger');
const playlistStore = require('../models/playlist-store.js');

const playlist = {
  index(request, response) {
    const playlistID = request.params.id;
    logger.debug('Playlist id = ',playlistID);
    const viewData = {
      title: 'Playlist',
      playlist: playlistStore.getPlaylist(playlistID),
    };
    response.render('playlist', viewData);
  },
  
  deleteSong(request, response) {
    const playlistId = request.params.id;
    const songId = request.params.songid;
    logger.debug(`Deleting Song ${songId} from Playlist ${playlistId}`);
    playlistStore.removeSong(playlistId, songId);
    response.redirect('/playlist/' + playlistId);
  },
  
  
};

module.exports = playlist;