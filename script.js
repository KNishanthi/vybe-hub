const SUPABASE_URL = "https://zzglfgzvminzrshtcfxc.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ww3D7LYFR5NxCgLTv_pXvQ_Yqsz2Yk5";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let songs = [];
let currentIndex = 0;


// LOAD SONGS

async function loadSongs() {

    const { data, error } = await db
        .from("songs")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Supabase Error:", error);
        return;
    }

    songs = data;

    displaySongs();
}


// DISPLAY SONGS

function displaySongs() {

    const container = document.getElementById("songsContainer");

    container.innerHTML = "";

    songs.forEach((song, index) => {

        const card = document.createElement("div");

        card.className = "song-card";
        const favoriteButton = document.createElement("button");

favoriteButton.innerHTML = "♡";
favoriteButton.className = "favorite-button";

card.appendChild(favoriteButton);

       card.innerHTML = `
    <div class="cover-wrapper">
        <img src="${song.cover_url}" alt="${song.title}">
        <button class="play-button">▶</button>
    </div>

    <h3>${song.title}</h3>
    <p>${song.artist}</p>
`;

        card.addEventListener("click", () => {
            playSong(index);
        });

        container.appendChild(card);
    });
}


// PLAY SONG

function playSong(index) {

    if (songs.length === 0) {
        return;
    }

    currentIndex = index;
    
    localStorage.setItem(
    "lastPlayedSong",
    songs[index].title
);

    const song = songs[currentIndex];

    const audioPlayer = document.getElementById("audioPlayer");

    audioPlayer.src = song.audio_url;

    document.getElementById("currentTitle").textContent =
        `${song.title} - ${song.artist}`;

    audioPlayer.play();
}


// NEXT BUTTON

document.getElementById("nextBtn").addEventListener("click", () => {

    if (songs.length === 0) {
        return;
    }

    currentIndex++;

    if (currentIndex >= songs.length) {
        currentIndex = 0;
    }

    playSong(currentIndex);
});


// PREVIOUS BUTTON

document.getElementById("prevBtn").addEventListener("click", () => {

    if (songs.length === 0) {
        return;
    }

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = songs.length - 1;
    }

    playSong(currentIndex);
});


// START

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {

    const searchText = searchInput.value.toLowerCase();

    const cards = document.querySelectorAll(".song-card");

    cards.forEach(card => {

        const songText = card.textContent.toLowerCase();

        if (songText.includes(searchText)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });
});

loadSongs();
showRecentlyPlayed();

function showRecentlyPlayed() {

    const recentSong = localStorage.getItem("lastPlayedSong");

    const recentElement = document.getElementById("recentSong");

    if (recentSong) {
        recentElement.textContent = recentSong;
    }

}