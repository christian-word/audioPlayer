<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Аудиоплеер</title>
    <style>
        .player-container {
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
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
        }
        
        .progress-bar-container:hover .progress-bar-handle {
            transform: translate(-50%, -50%) scale(1.2);
        }

        /* Стили для регулятора громкости (полностью восстановленные) */
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
</head>
<body>
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

    <audio id="audioPlayer" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"></audio>

    <script>
        const audio = document.getElementById('audioPlayer');
        const playButton = document.getElementById('playButton');
        const playIcon = document.getElementById('playIcon');
        const progressBar = document.getElementById('progressBar');
        const progressBarFill = document.getElementById('progressBarFill');
        const progressHandle = document.getElementById('progressHandle');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeSliderFill = document.getElementById('volumeSliderFill');
        const volumeHandle = document.getElementById('volumeHandle');
        const currentTime = document.getElementById('currentTime');
        const duration = document.getElementById('duration');

        // Управление воспроизведением
        playButton.addEventListener('click', togglePlay);
        
        function togglePlay() {
            if (audio.paused) {
                audio.play();
                playIcon.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
            } else {
                audio.pause();
                playIcon.setAttribute('d', 'M8 5v14l11-7z');
            }
        }

        // Прогресс трека
        audio.addEventListener('timeupdate', updateProgress);
        
        function updateProgress() {
            const percent = (audio.currentTime / audio.duration) * 100 || 0;
            progressBar.value = percent;
            progressBarFill.style.width = `${percent}%`;
            progressHandle.style.left = `${percent}%`;
            currentTime.textContent = formatTime(audio.currentTime);
        }

        // Перемотка
        progressBar.addEventListener('input', () => {
            audio.currentTime = (progressBar.value / 100) * audio.duration;
        });

        // Громкость
        volumeSlider.addEventListener('input', updateVolume);
        
        function updateVolume() {
            const volume = volumeSlider.value / 100;
            audio.volume = volume;
            volumeSliderFill.style.width = `${volume * 100}%`;
            volumeHandle.style.left = `${volume * 100}%`;
        }

        // Форматирование времени
        function formatTime(seconds) {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        }

        // Инициализация
        audio.addEventListener('loadedmetadata', () => {
            duration.textContent = formatTime(audio.duration);
            audio.volume = 0.5;
            volumeSliderFill.style.width = '50%';
            volumeHandle.style.left = '50%';
        });
    </script>
</body>
</html>
