let localStream;
let currentCall;

// Get video elements from your HTML
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

// Create a new Peer
const peer = new Peer();

// Get user media (camera and mic)
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localStream = stream;
    localVideo.srcObject = stream;
  })
  .catch(err => {
    console.error('Failed to get local stream', err);
  });

// When your peer is ready, display your ID
peer.on('open', id => {
  document.getElementById('myPeerId').textContent = id;
});

// Answer incoming calls
peer.on('call', call => {
  call.answer(localStream);
  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream;
  });
  currentCall = call;
});

// Make a call to another peer
function callPeer() {
  const remoteId = document.getElementById('remotePeerId').value;
  const call = peer.call(remoteId, localStream);
  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream;
  });
  currentCall = call;
}

// Optionally, add a hangup function
function hangUp() {
  if (currentCall) {
    currentCall.close();
  }
  window.close(); // Close the browser window
}

// Get the toggle buttons
const toggleMicBtn = document.getElementById('toggleMicBtn');
const toggleVideoBtn = document.getElementById('toggleVideoBtn');

// Add event listeners to the toggle buttons
toggleMicBtn.addEventListener('click', () => {
  const audioTrack = localStream.getAudioTracks()[0];
  if (audioTrack.enabled) {
    audioTrack.enabled = false;
    toggleMicBtn.innerHTML = '<i class="bi bi-mic-mute-fill"></i> Unmute Mic';
  } else {
    audioTrack.enabled = true;
    toggleMicBtn.innerHTML = '<i class="bi bi-mic-fill"></i> Mute Mic';
  }
});

toggleVideoBtn.addEventListener('click', () => {
  const videoTrack = localStream.getVideoTracks()[0];
  if (videoTrack.enabled) {
    videoTrack.enabled = false;
    toggleVideoBtn.innerHTML = '<i class="bi bi-camera-video-off-fill"></i> Enable Video';
  } else {
    videoTrack.enabled = true;
    toggleVideoBtn.innerHTML = '<i class="bi bi-camera-video-fill"></i> Disable Video';
  }
});
