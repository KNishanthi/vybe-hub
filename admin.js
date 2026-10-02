const SUPABASE_URL = "https://zzglfgzvminzrshtcfxc.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ww3D7LYFR5NxCgLTv_pXvQ_Yqsz2Yk5";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// LOAD DASHBOARD
async function loadAdminDashboard() {

    const { data: songs, error } = await db
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Admin Supabase Error:", error);
        return;
    }

    displayAdminSongs(songs);
    updateStats(songs);
    updateLibraryCount(songs);
}


// DISPLAY SONGS
function displayAdminSongs(songs) {

    const container =
        document.getElementById("adminSongs");

    if (!container) return;

    if (!songs || songs.length === 0) {
        container.innerHTML = "<p>No songs found.</p>";
        return;
    }

    container.innerHTML = "";

    songs.forEach(song => {

        const row =
            document.createElement("div");

        row.className = "admin-song";

        row.innerHTML = `
            <img
                src="${song.cover_url}"
                alt="${song.title}"
            >

            <div class="admin-song-info">
                <strong>${song.title}</strong>
                <span>${song.artist}</span>
            </div>

            <span class="admin-song-status">
                <i></i>
                LIVE
            </span>
        `;

        container.appendChild(row);
    });
}


// UPDATE STATISTICS
function updateStats(songs) {

    const totalSongs =
        songs.length;

    const artists =
        new Set(
            songs.map(song => song.artist)
        ).size;

    const albums =
        new Set(
            songs
                .map(song => song.album)
                .filter(Boolean)
        ).size;

    const statCards =
        document.querySelectorAll(
            ".stat-card strong"
        );

    if (statCards[0]) {
        statCards[0].textContent =
            totalSongs;
    }

    if (statCards[1]) {
        statCards[1].textContent =
            artists;
    }

    if (statCards[2]) {
        statCards[2].textContent =
            albums;
    }
}


// LIBRARY COUNT
function updateLibraryCount(songs) {

    const countElement =
        document.getElementById("libraryCount");

    if (countElement) {

        countElement.textContent =
            `${songs.length} songs`;
    }
}


// START
loadAdminDashboard();


// ADMIN SEARCH
const adminSearch =
    document.getElementById("adminSearch");

if (adminSearch) {

    adminSearch.addEventListener("input", () => {

        const searchText =
            adminSearch.value
                .toLowerCase()
                .trim();

        const rows =
            document.querySelectorAll(
                ".admin-song"
            );

        rows.forEach(row => {

            const songText =
                row.textContent.toLowerCase();

            row.style.display =
                songText.includes(searchText)
                    ? "flex"
                    : "none";
        });
    });
}