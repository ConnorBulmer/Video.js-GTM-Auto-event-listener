// Check if Video.js is loaded
  if (typeof videojs !== 'undefined') {
    
    // Function to attach event listeners to a Video.js player
    function attachListenersToPlayer(player) {
      // Define the list of events you want to track
      var eventsToTrack = ['play', 'pause', 'ended', 'timeupdate', 'volumechange', 'fullscreenchange', 'error'];

      // Attach event listeners for each event
      eventsToTrack.forEach(function(event) {
        player.on(event, function() {
          // Get the aria-label attribute as the video label
          var videoLabel = player.el_.getAttribute('aria-label') || 'Unknown Video';

          // Prepare the data to be sent based on the event
          var eventData = {
            'event': 'videojsEvent',
            'videoEvent': event,
            'videoLabel': videoLabel
          };

          switch(event) {
            case 'play':
            case 'pause':
            case 'ended':
              eventData['currentTime'] = player.currentTime();
              eventData['duration'] = player.duration();
              break;
            case 'timeupdate':
              eventData['currentTime'] = player.currentTime();
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

    // Attach listeners to all Video.js instances on the page
    videojs.getAllPlayers().forEach(attachListenersToPlayer);

  } else {
    // Log an error if Video.js is not found
    console.error('Video.js not found');
  }
