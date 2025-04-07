const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const uploadInput = document.getElementById('uploadImage');
const cameraSelect = document.getElementById('cameraSelect');

let currentStream;
let objectImage = new Image();
let objectX = 50, objectY = 50;
let objectWidth = 100, objectHeight = 100;
let isDragging = false;

// Get available cameras
navigator.mediaDevices.enumerateDevices().then(devices => {
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    videoDevices.forEach((device, index) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Camera ${index + 1}`;
        cameraSelect.appendChild(option);
    });

    // Automatically start with the first camera
    if (videoDevices.length > 0) {
        startCamera(videoDevices[0].deviceId);
    }
});

// Start selected camera
function startCamera(deviceId) {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } } })
        .then(stream => {
            currentStream = stream;
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            });
        })
        .catch(err => console.error("Camera access denied", err));
}

// Handle camera change
cameraSelect.addEventListener('change', (e) => {
    startCamera(e.target.value);
});
requestAnimationFrame(draw);
