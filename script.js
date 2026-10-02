const SUPABASE_URL = "https://zzglfgzvminzrshtcfxc.supabase.co"
const SUPABASE_KEY = "sb_publishable_Ww3D7LYFR5NxCgLTv_pXvQ_Yqsz2Yk5"

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
    displayNewReleases();
}


// DISPLAY SONGS
function displaySongs() {

    const container =
        document.getElementById("songsContainer");

    container.innerHTML = "";

    songs.forEach((song, index) => {

        const card = document.createElement("div");

        card.className = "song-card";

        card.innerHTML = `
            <div class="cover-wrapper">

                <img
                    src="${song.cover_url}"
                    alt="${song.title}"
                >

                <button class="play-button">
                    ▶
                </button>

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


// NEW RELEASES
function displayNewReleases() {

    const container =
        document.getElementById("newReleasesContainer");

    if (!container) return;

    container.innerHTML = "";

    const newSongs =
        songs.slice(-4).reverse();

    newSongs.forEach((song) => {

        const card =
            document.createElement("div");

        card.className = "song-card";

        card.innerHTML = `
            <div class="cover-wrapper">

                <img
                    src="${song.cover_url}"
                    alt="${song.title}"
                >

                <button class="play-button">
                    ▶
                </button>

            </div>

            <h3>${song.title}</h3>

            <p>${song.artist}</p>
        `;

        card.addEventListener("click", () => {

            const index =
                songs.indexOf(song);

            playSong(index);
        });

        container.appendChild(card);
    });
}


// PLAY SONG
function playSong(index) {

    if (songs.length === 0) return;

    currentIndex = index;

    const song = songs[currentIndex];

    localStorage.setItem(
        "lastPlayedSong",
        song.title
    );

    const audioPlayer =
        document.getElementById("audioPlayer");

    audioPlayer.src =
        song.audio_url;


    // BOTTOM PLAYER

    document.getElementById(
        "currentTitle"
    ).textContent =
        `${song.title} - ${song.artist}`;


    // NOW PLAYING TITLE

    const nowTitle =
        document.getElementById(
            "nowPlayingTitle"
        );

    if (nowTitle) {
        nowTitle.textContent =
            song.title;
    }


    // NOW PLAYING ARTIST

    const nowArtist =
        document.getElementById(
            "nowPlayingArtist"
        );

    if (nowArtist) {
        nowArtist.textContent =
            song.artist;
    }


    // NOW PLAYING COVER

    const nowCover =
        document.getElementById(
            "nowPlayingCover"
        );

    if (nowCover) {
        nowCover.src =
            song.cover_url;
    }


    audioPlayer.play();
}


// NEXT
document
    .getElementById("nextBtn")
    .addEventListener("click", () => {

        if (songs.length === 0) return;

        currentIndex++;

        if (currentIndex >= songs.length) {
            currentIndex = 0;
        }

        playSong(currentIndex);
    });


// PREVIOUS
document
    .getElementById("prevBtn")
    .addEventListener("click", () => {

        if (songs.length === 0) return;

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = songs.length - 1;
        }

        playSong(currentIndex);
    });


// SEARCH
const searchInput =
    document.getElementById("searchInput");

searchInput.addEventListener(
    "input",
    () => {

        const searchText =
            searchInput.value.toLowerCase();

        const cards =
            document.querySelectorAll(
                ".song-card"
            );

        cards.forEach(card => {

            const songText =
                card.textContent.toLowerCase();

            card.style.display =
                songText.includes(searchText)
                    ? "block"
                    : "none";
        });
    }
);


// RECENTLY PLAYED
function showRecentlyPlayed() {

    const recentSong =
        localStorage.getItem(
            "lastPlayedSong"
        );

    const recentElement =
        document.getElementById(
            "recentSong"
        );

    if (recentSong) {
        recentElement.textContent =
            recentSong;
    }
}


// VYBE AI MOOD
function selectMood(mood) {

    const message =
        document.getElementById(
            "moodMessage"
        );

    if (message) {

        message.textContent =
            `VYBE AI is creating a ${mood.toLowerCase()} vibe for you...`;
    }
}


// START APP
loadSongs();

showRecentlyPlayed();
// NOW PLAYING PLAY / PAUSE BUTTON

const npPlayButton = document.querySelector(".np-play");

if (npPlayButton) {
    npPlayButton.addEventListener("click", () => {

        const audioPlayer =
            document.getElementById("audioPlayer");

        if (!audioPlayer.src) return;

        if (audioPlayer.paused) {
            audioPlayer.play();
            npPlayButton.textContent = "❚❚";
        } else {
            audioPlayer.pause();
            npPlayButton.textContent = "▶";
        }
    });
}
// NOW PLAYING PREVIOUS / NEXT

const npPrevButton = document.getElementById("prevBtn");
const npNextButton = document.getElementById("nextBtn");

if (npPrevButton) {
    npPrevButton.onclick = () => {

        if (songs.length === 0) return;

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = songs.length - 1;
        }

        playSong(currentIndex);
    };
}

if (npNextButton) {
    npNextButton.onclick = () => {

        if (songs.length === 0) return;

        currentIndex++;

        if (currentIndex >= songs.length) {
            currentIndex = 0;
        }

        playSong(currentIndex);
    };
}
// VYBE VISUALIZER PLAY STATE

const visualizer =
    document.querySelector(".music-visualizer");

const audioPlayer =
    document.getElementById("audioPlayer");

if (visualizer && audioPlayer) {

    audioPlayer.addEventListener("play", () => {
        visualizer.classList.add("playing");
    });

    audioPlayer.addEventListener("pause", () => {
        visualizer.classList.remove("playing");
    });

    audioPlayer.addEventListener("ended", () => {
        visualizer.classList.remove("playing");
    });
}