// Generate beep sounds using Web Audio API
function generateBeepSound(duration, frequency, volume) {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.01);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
  
  return new Promise(resolve => {
    setTimeout(() => {
      const chunks = [];
      const dest = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(dest.stream);
      
      oscillator.connect(dest);
      
      mediaRecorder.ondataavailable = (evt) => chunks.push(evt.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        resolve(blob);
      };
      
      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), duration * 1000);
    }, 100);
  });
}

// Generate short beep
generateBeepSound(0.15, 880, 0.5).then(blob => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'short-beep.mp3';
  a.click();
});

// Generate long beep
generateBeepSound(0.5, 880, 0.5).then(blob => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'long-beep.mp3';
  a.click();
});
