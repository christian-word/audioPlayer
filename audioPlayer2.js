class AudioPlayer2 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    this.shadowRoot.innerHTML = `
      <style>
        .player-container {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 15px;
          width: 100%;
        }
        .play-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #007bff;
          color: white;
          cursor: pointer;
          border: none;
        }
        .play-button svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }
        .progress-bar {
          flex-grow: 1;
          height: 6px;
          -webkit-appearance: none;
          appearance: none;
          background: #ddd;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }
        .progress-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #007bff;
          cursor: pointer;
        }
        .volume-control {
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
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: #ddd;
          border-radius: 2px;
          outline: none;
        }
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #007bff;
          cursor: pointer;
        }
      </style>
      <div class="player-container">
        <button class="play-button" id="playPauseBtn">
          <svg viewBox="0 0 24 24" id="playIcon">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
          <svg viewBox="0 0 24 24" id="pauseIcon" style="display: none;">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        </button>
        <input type="range" class="progress-bar" id="progressBar" min="0" max="100" value="0">
        <div class="volume-control">
          <div class="volume-icon">
            <svg viewBox="0 0 24 24">
              <path d="M3 10v4h4l5 5V5L7 10H3z"/>
            </svg>
          </div>
          <input type="range" class="volume-slider" id="volumeSlider" min="0" max="1" step="0.01" value="0.5">
        </div>
        <audio id="audio"></audio>
      </div>
    `;

    // Получаем элементы
    this.audio = this.shadowRoot.getElementById('audio');
    this.playPauseBtn = this.shadowRoot.getElementById('playPauseBtn');
    this.playIcon = this.shadowRoot.getElementById('playIcon');
    this.pauseIcon = this.shadowRoot.getElementById('pauseIcon');
    this.progressBar = this.shadowRoot.getElementById('progressBar');
    this.volumeSlider = this.shadowRoot.getElementById('volumeSlider');
  }

  connectedCallback() {
    // Устанавливаем источник аудио
    const src = this.getAttribute('src');
    if (src) {
      this.audio.src = src;
    }

    // Обработчики событий
    this.playPauseBtn.addEventListener('click', this.togglePlay.bind(this));
    this.progressBar.addEventListener('input', this.seek.bind(this));
    this.volumeSlider.addEventListener('input', this.setVolume.bind(this));
    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audio.addEventListener('ended', this.resetPlayState.bind(this));
  }

  disconnectedCallback() {
    // Очистка обработчиков
    this.playPauseBtn.removeEventListener('click', this.togglePlay);
    this.progressBar.removeEventListener('input', this.seek);
    this.volumeSlider.removeEventListener('input', this.setVolume);
    this.audio.removeEventListener('timeupdate', this.updateProgress);
    this.audio.removeEventListener('ended', this.resetPlayState);
  }

  togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
      this.playIcon.style.display = 'none';
      this.pauseIcon.style.display = 'block';
    } else {
      this.audio.pause();
      this.playIcon.style.display = 'block';
      this.pauseIcon.style.display = 'none';
    }
  }

  updateProgress() {
    if (this.audio.duration) {
      const percent = (this.audio.currentTime / this.audio.duration) * 100;
      this.progressBar.value = percent;
    }
  }

  seek() {
    this.audio.currentTime = (this.progressBar.value / 100) * this.audio.duration;
  }

  setVolume() {
    this.audio.volume = this.volumeSlider.value;
  }

  resetPlayState() {
    this.playIcon.style.display = 'block';
    this.pauseIcon.style.display = 'none';
    this.progressBar.value = 0;
  }

  // Геттер/сеттер для src
  get src() {
    return this.getAttribute('src');
  }

  set src(value) {
    this.setAttribute('src', value);
    this.audio.src = value;
  }

  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src' && this.audio) {
      this.audio.src = newValue;
    }
  }
}

customElements.define('audio-player2', AudioPlayer2);
