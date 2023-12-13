// Function to attach event listeners to a Video.js player
  function attachListenersToPlayer(player) {
    // Define the list of events you want to track
    var eventsToTrack = ['play', 'pause', 'ended', 'timeupdate', 'volumechange', 'fullscreenchange', 'error'];

    // Attach event listeners for each event
    eventsToTrack.forEach(function(event) {
      player.on(event, function() {
        // Get the aria-label attribute as the video label
        var videoLabel = player.el_.getAttribute('aria-label') || 'Unknown Video';
        var currentTime = player.currentTime();
        var duration = player.duration();
        var videoPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

        // Set video title to be the same as video label if data-video-title is not set
        var videoTitle = player.el_.getAttribute('data-video-title') || videoLabel;

        // Prepare the data to be sent based on the event
        var eventData = {
          'event': 'videojsEvent',
          'videoEvent': event,
          'videoLabel': videoLabel,
          'video_current_time': currentTime,
          'video_duration': duration,
          'video_percent': videoPercent,
          'video_provider': 'Video.js',
          'video_title': videoTitle,
          'video_url': player.currentSrc()
        };

        switch(event) {
          case 'play':
          case 'pause':
          case 'ended':
            break;
          case 'timeupdate':
            break;
          case 'volumechange':
            eventData['volume'] = player.volume();
            eventData['muted'] = player.muted();
            break;
          case 'fullscreenchange':
            eventData['isFullscreen'] = player.isFullscreen();
            break;
          case 'error':
            var error = player.error();
            eventData['errorCode'] = error && error.code;
            eventData['errorMessage'] = error && error.message;
            break;
        }

        // Send event data to the data layer
        sendDataToDataLayer(eventData);
      });
    });
  }

  // Function to send data to the data layer
  function sendDataToDataLayer(data) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  }

  // Check if Video.js is loaded
  if (typeof videojs !== 'undefined') {
    // Attach listeners to all Video.js instances on the page
    videojs.getAllPlayers().forEach(attachListenersToPlayer);
  } else {
    // Log an error if Video.js is not found
    console.error('Video.js not found');
  }
