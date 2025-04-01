class AudioPlayer extends HTMLElement {
  constructor() {
    super();
    this.audio = new Audio(this.getAttribute("src"));
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        .player-container {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 15px;
          width: 300px; /* Ограничиваем ширину */
          max-width: 100%; /* Чтобы не выходило за экран */
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
        .progress-bar {
          flex-grow: 1;
          width: 100px; /* Длина ползунка */
        }
        .volume-bar {
          width: 60px; /* Размер громкости */
        }
      </style>
      <div class="player-container">
        <button class="play-button">▶</button>
        <input type="range" class="progress-bar" min="0" max="100" value="0">
        <input type="range" class="volume-bar" min="0" max="100" value="100">
      </div>
    `;

    this.playButton = this.shadowRoot.querySelector(".play-button");
    this.progressBar = this.shadowRoot.querySelector(".progress-bar");
    this.volumeBar = this.shadowRoot.querySelector(".volume-bar");

    this.playButton.addEventListener("click", () => this.togglePlay());
    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.progressBar.addEventListener("input", (e) => this.seekAudio(e));
    this.volumeBar.addEventListener("input", (e) => this.changeVolume(e));

    // Устанавливаем начальную громкость
    this.audio.volume = 1;
  }

  togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
      this.playButton.textContent = "⏸";
    } else {
      this.audio.pause();
      this.playButton.textContent = "▶";
    }
  }

  updateProgress() {
    if (this.audio
