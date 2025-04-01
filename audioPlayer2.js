class AudioPlayer2 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Шаблон компонента с улучшенными стилями
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          max-width: 400px;
          width: 100%;
        }
        
        .player-container {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }
        
        .play-button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e9ecef;
          color: #007bff;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }
        
        .play-button:hover { background: #dee2e6; }
        
        .play-button svg, .volume-icon {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }
        
        .progress-container {
          flex-grow: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .progress-bar-container {
          position: relative;
          height: 4px;
          background: #e9ecef;
          border-radius: 2px;
          flex-grow: 1;
        }
        
        .progress-bar-fill {
          position: absolute;
          height: 100%;
          width: 0;
          background: #007bff;
          border-radius: 2px;
        }
        
        .progress-bar {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        
        .progress-bar-handle {
          position: absolute;
          top: 50%;
          width: 12px;
          height: 12px;
          background: #007bff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: transform 0.1s;
          pointer-events: none;
        }
        
        .progress-bar-container:hover .progress-bar-handle {
          transform: translate(-50%, -50%) scale(1.2);
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .volume-slider-container {
          position: relative;
          width: 70px;
          height: 4px;
          background: #e9ecef;
          border-radius: 2px;
        }
        
        .volume-slider-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 50%;
          background: #007bff;
          border-radius: 2px;
          pointer-events: none;
        }
        
        .volume-slider {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          margin: 0;
        }
        
        .volume-slider-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          background: #007bff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          transition: transform 0.1s;
        }
        
        .volume-slider-container:hover .volume-slider-handle {
          transform: translate(-50%, -50%) scale(1.2);
        }
        
        .time-info {
          font-size: 11px;
          color: #6c757d;
          min-width: 40px;
          text-align: center;
        }
      </style>
      
      <div class="player-container">
        <button class="play-button" id="playButton">
          <svg viewBox="0 0 24 24"><path id="playIcon" d="M8 5v14l11-7z"/></svg>
        </button>
        
        <div class="progress-container">
          <span class="time-info" id="currentTime">0:00</span>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" id="progressBarFill"></div>
            <input type="range" class="progress-bar" id="progressBar" min="0" max="100" value="0">
            <div class="progress-bar-handle" id="progressHandle"></div>
          </div>
          <span class="time-info" id="duration">0:00</span>
        </div>
        
        <div class="volume-control">
          <svg class="volume-icon" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          <div class="volume-slider-container">
            <div class="volume-slider-fill" id="volumeSliderFill"></div>
            <input type="range" class="volume-slider" id="volumeSlider" min="0" max="100" value="50">
            <div class="volume-slider-handle" id="volumeHandle"></div>
          </div>
        </div>
      </div>
      
      <audio id="audio"></audio>
    `;
    
    // Получаем элементы DOM
    this.audio = this.shadowRoot.getElementById('audio');
    this.playButton = this.shadowRoot.getElementById('playButton');
    this.playIcon = this.shadowRoot.getElementById('playIcon');
    this.progressBar = this.shadowRoot.getElementById('progressBar');
    this.progressBarFill = this.shadowRoot.getElementById('progressBarFill');
    this.progressHandle = this.shadowRoot.getElementById('progressHandle');
    this.volumeSlider = this.shadowRoot.getElementById('volumeSlider');
    this.volumeSliderFill = this.shadowRoot.getElementById('volumeSliderFill');
    this.volumeHandle = this.shadowRoot.getElementById('volumeHandle');
    this.currentTime = this.shadowRoot.getElementById('currentTime');
    this.duration = this.shadowRoot.getElementById('duration');
  }

  connectedCallback() {
    // Устанавливаем источник аудио из атрибута src
    const src = this.getAttribute('src');
    if (src) {
      this.audio.src = src;
    }

    // Добавляем обработчики событий
    this.playButton.addEventListener('click', this.togglePlay.bind(this));
    this.progressBar.addEventListener('input', this.seek.bind(this));
    this.volumeSlider.addEventListener('input', this.setVolume.bind(this));
    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audio.addEventListener('loadedmetadata', this.initPlayer.bind(this));
    this.audio.addEventListener('ended', this.resetPlayButton.bind(this));
  }

  disconnectedCallback() {
    // Удаляем обработчики событий при отключении компонента
    this.playButton.removeEventListener('click', this.togglePlay);
    this.progressBar.removeEventListener('input', this.seek);
    this.volumeSlider.removeEventListener('input', this.setVolume);
    this.audio.removeEventListener('timeupdate', this.updateProgress);
    this.audio.removeEventListener('loadedmetadata', this.initPlayer);
    this.audio.removeEventListener('ended', this.resetPlayButton);
  }

  togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
      this.playIcon.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
    } else {
      this.audio.pause();
      this.playIcon.setAttribute('d', 'M8 5v14l11-7z');
    }
  }

  updateProgress() {
    const percent = (this.audio.currentTime / this.audio.duration) * 100 || 0;
    this.progressBar.value = percent;
    this.progressBarFill.style.width = `${percent}%`;
    this.progressHandle.style.left = `${percent}%`;
    this.currentTime.textContent = this.formatTime(this.audio.currentTime);
  }

  seek() {
    this.audio.currentTime = (this.progressBar.value / 100) * this.audio.duration;
  }

  setVolume() {
    const volume = this.volumeSlider.value / 100;
    this.audio.volume = volume;
    this.volumeSliderFill.style.width = `${volume * 100}%`;
    this.volumeHandle.style.left = `${volume * 100}%`;
  }

  initPlayer() {
    this.duration.textContent = this.formatTime(this.audio.duration);
    this.audio.volume = 0.5;
    this.volumeSliderFill.style.width = '50%';
    this.volumeHandle.style.left = '50%';
  }

  resetPlayButton() {
    this.playIcon.setAttribute('d', 'M8 5v14l11-7z');
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Геттер/сеттер для атрибута src
  get src() {
    return this.getAttribute('src');
  }

  set src(value) {
    this.setAttribute('src', value);
    if (this.audio) {
      this.audio.src = value;
    }
  }

  // Наблюдаем за изменениями атрибута src
  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src' && this.audio) {
      this.audio.src = newValue;
    }
  }
}

// Регистрируем кастомный элемент
customElements.define('audio-player2', AudioPlayer2);
