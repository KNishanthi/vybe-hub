const SUPABASE_URL = "https://zzglfgzvminzrshtcfxc.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ww3D7LYFR5NxCgLTv_pXvQ_Yqsz2Yk5";


const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


async function loadAdminSongs() {

    const { data, error } = await db
        .from("songs")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {

        console.error("Supabase Error:", error);

        return;
    }

    const container = document.getElementById("adminSongs");

    container.innerHTML = "";

    data.forEach(song => {

        const songItem = document.createElement("div");

        songItem.className = "admin-song";

        songItem.innerHTML = `
            <img src="${song.cover_url}" alt="${song.title}">

            <div>
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <small>${song.album}</small>
            </div>
        `;

        container.appendChild(songItem);

    });

}


loadAdminSongs();