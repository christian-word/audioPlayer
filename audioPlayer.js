class AudioPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Шаблон компонента
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
        }
        .player {
          background: white;
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 15px;
          width: 350px;
        }
        .play-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #007bff;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          flex-shrink: 0;
        }
        .play-btn svg {
          width: 24px;
          height: 24px;
          fill: white;
        }
        .progress {
          flex: 1;
          height: 8px;
          background: #ddd;
          border-radius: 10px;
          cursor: pointer;
          position: relative;
        }
        .progress-bar {
          height: 100%;
          background: #007bff;
          width: 0;
          border-radius: 10px;
          position: absolute;
          top: 0;
          left: 0;
        }
        .progress-thumb {
          width: 12px;
          height: 12px;
          background: #007bff;
          border-radius: 50%;
          position: absolute;
          top: -2px;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .volume-container {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .volume-icon svg {
          width: 20px;
          height: 20px;
          fill: #333;
        }
        .volume-slider {
          width: 80px;
        }
        .hidden {
          display: none !important;
        }
      </style>
      <div class="player">
        <div class="play-btn" id="playPauseBtn">
          <svg id="playIcon" viewBox="0 0 24 24">
            <polygon points="6,4 20,12 6,20"></polygon>
          </svg>
          <svg id="pauseIcon" viewBox="0 0 24 24" class="hidden">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        </div>
        <div class="progress" id="progress">
          <div class="progress-bar" id="progressBar"></div>
          <div class="progress-thumb" id="progressThumb"></div>
        </div>
        <div class="volume-container">
          <div class="volume-icon">
            <svg viewBox="0 0 24 24">
              <path d="M3,9V15H7L12,20V4L7,9H3Z"></path>
            </svg>
          </div>
          <input type="range" class="volume-slider" id="volumeSlider" min="0" max="1" step="0.01" value="1">
        </div>
        <audio id="audio"></audio>
      </div>
    `;
    
    // Элементы DOM
    this.audio = this.shadowRoot.getElementById('audio');
    this.playPauseBtn = this.shadowRoot.getElementById('playPauseBtn');
    this.playIcon = this.shadowRoot.getElementById('playIcon');
    this.pauseIcon = this.shadowRoot.getElementById('pauseIcon');
    this.progress = this.shadowRoot.getElementById('progress');
    this.progressBar = this.shadowRoot.getElementById('progressBar');
    this.progressThumb = this.shadowRoot.getElementById('progressThumb');
    this.volumeSlider = this.shadowRoot.getElementById('volumeSlider');
  }

  connectedCallback() {
    // Установка источника аудио из атрибута src
    const src = this.getAttribute('src');
    if (src) {
      this.audio.src = src;
    }

    // Обработчики событий
    this.playPauseBtn.addEventListener('click', this.togglePlay.bind(this));
    this.progress.addEventListener('click', this.seek.bind(this));
    this.volumeSlider.addEventListener('input', this.setVolume.bind(this));
    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audio.addEventListener('ended', this.onAudioEnded.bind(this));
  }

  disconnectedCallback() {
    // Очистка обработчиков событий при удалении компонента
    this.playPauseBtn.removeEventListener('click', this.togglePlay);
    this.progress.removeEventListener('click', this.seek);
    this.volumeSlider.removeEventListener('input', this.setVolume);
    this.audio.removeEventListener('timeupdate', this.updateProgress);
    this.audio.removeEventListener('ended', this.onAudioEnded);
  }

  togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
      this.playIcon.classList.add('hidden');
      this.pauseIcon.classList.remove('hidden');
    } else {
      this.audio.pause();
      this.playIcon.classList.remove('hidden');
      this.pauseIcon.classList.add('hidden');
    }
  }

  updateProgress() {
    if (this.audio.duration) {
      const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
      this.progressBar.style.width = `${progressPercent}%`;
      this.progressThumb.style.left = `${progressPercent}%`;
    }
  }

  seek(e) {
    const clickX = e.offsetX;
    const width = this.progress.clientWidth;
    this.audio.currentTime = (clickX / width) * this.audio.duration;
  }

  setVolume() {
    this.audio.volume = this.volumeSlider.value;
  }

  onAudioEnded() {
    this.playIcon.classList.remove('hidden');
    this.pauseIcon.classList.add('hidden');
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
customElements.define('audio-player', AudioPlayer);
