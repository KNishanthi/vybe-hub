// Initialize Supabase
const supabaseUrl = 'https://iskblxyacfjpxrbbdyiw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza2JseHlhY2ZqcHhyYmJkeWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMTE3OTUsImV4cCI6MjEwNTg4Nzc5NX0.bfHAwJMpdG8zZ27-9mq8PZoKcGWBjPbUx_9jp3z5Olc';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// State
let allSongs = [];
let currentSongIndex = -1;
let isPlaying = false;

// DOM Elements
const songGrid = document.getElementById('songGrid');
const searchInput = document.getElementById('searchInput');
const audioPlayer = document.getElementById('audioPlayer');

// Player Elements
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const playerCover = document.getElementById('playerCover');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');

const progressWrapper = document.getElementById('progressWrapper');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');

const volumeWrapper = document.getElementById('volumeWrapper');
const volumeBar = document.getElementById('volumeBar');

// Initialize
async function init() {
  await fetchSongs();
  setupEventListeners();
  
  // Set default volume
  audioPlayer.volume = 1;
}

// Fetch songs from Supabase
async function fetchSongs() {
  try {
    const { data: songs, error } = await supabaseClient
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    allSongs = songs || [];
    renderSongs(allSongs);
  } catch (error) {
    console.error('Error fetching songs:', error);
  }
}

// Render songs to the grid
function renderSongs(songs) {
  songGrid.innerHTML = '';
  
  if (songs.length === 0) {
    songGrid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1;">No songs found.</p>';
    return;
  }

  songs.forEach((song, index) => {
    // Find real index in allSongs array for playback
    const realIndex = allSongs.findIndex(s => s.id === song.id);
    
    const card = document.createElement('div');
    card.className = 'song-card';
    card.onclick = () => playSong(realIndex);
    
    card.innerHTML = `
      <div class="song-cover-container">
        <img src="${song.cover_url}" alt="${song.title}" class="song-cover">
        <div class="play-overlay">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
      </div>
      <div class="song-info">
        <h3>${song.title}</h3>
        <p>${song.artist} • ${song.album}</p>
      </div>
    `;
    
    songGrid.appendChild(card);
  });
}

// Play a specific song
function playSong(index) {
  if (index < 0 || index >= allSongs.length) return;
  
  currentSongIndex = index;
  const song = allSongs[index];
  
  audioPlayer.src = song.audio_url;
  
  // Update UI
  playerCover.src = song.cover_url;
  playerCover.style.opacity = '1';
  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  
  play();
}

function play() {
  if (currentSongIndex === -1) return;
  audioPlayer.play();
  isPlaying = true;
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'block';
}

function pause() {
  audioPlayer.pause();
  isPlaying = false;
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';
}

function togglePlay() {
  if (isPlaying) {
    pause();
  } else {
    play();
  }
}

function playNext() {
  if (allSongs.length === 0) return;
  let nextIndex = currentSongIndex + 1;
  if (nextIndex >= allSongs.length) nextIndex = 0; // Loop back
  playSong(nextIndex);
}

function playPrev() {
  if (allSongs.length === 0) return;
  let prevIndex = currentSongIndex - 1;
  if (prevIndex < 0) prevIndex = allSongs.length - 1; // Loop to end
  playSong(prevIndex);
}

// Format time in seconds to M:SS
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Event Listeners
function setupEventListeners() {
  // Search
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allSongs.filter(song => 
      song.title.toLowerCase().includes(term) || 
      song.artist.toLowerCase().includes(term) ||
      song.album.toLowerCase().includes(term)
    );
    renderSongs(filtered);
  });

  // Controls
  playBtn.addEventListener('click', togglePlay);
  nextBtn.addEventListener('click', playNext);
  prevBtn.addEventListener('click', playPrev);

  // Audio Events
  audioPlayer.addEventListener('timeupdate', () => {
    const current = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    currentTimeEl.textContent = formatTime(current);
    if (duration) {
      durationTimeEl.textContent = formatTime(duration);
      const percent = (current / duration) * 100;
      progressBar.style.width = `${percent}%`;
    }
  });

  audioPlayer.addEventListener('ended', playNext);

  // Progress Bar click
  progressWrapper.addEventListener('click', (e) => {
    const rect = progressWrapper.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (audioPlayer.duration) {
      audioPlayer.currentTime = pos * audioPlayer.duration;
    }
  });

  // Volume control
  volumeWrapper.addEventListener('click', (e) => {
    const rect = volumeWrapper.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioPlayer.volume = pos;
    volumeBar.style.width = `${pos * 100}%`;
  });
  
  // Realtime updates from Supabase (optional but nice for automatic loading)
  const channels = supabaseClient.channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'songs' },
      (payload) => {
        fetchSongs(); // Re-fetch all songs to ensure correct ordering
      }
    )
    .subscribe();
}

// Run
init();
