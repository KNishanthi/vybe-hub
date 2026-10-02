const SUPABASE_URL = "https://zzglfgzvminzrshtcfxc.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Ww3D7LYFR5NxCgLTv_pXvQ_Yqsz2Yk5";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


const form =
    document.getElementById("addSongForm");


form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const title =
        document.getElementById("songTitle").value.trim();

    const artist =
        document.getElementById("songArtist").value.trim();

    const album =
        document.getElementById("songAlbum").value.trim();

    const cover_url =
        document.getElementById("songCover").value.trim();

    const audio_url =
        document.getElementById("songAudio").value.trim();


    const { error } = await db
        .from("songs")
        .insert([
            {
                title: title,
                artist: artist,
                album: album,
                cover_url: cover_url,
                audio_url: audio_url
            }
        ]);


    if (error) {

        console.error(error);

        alert("Failed to add song.");

        return;
    }


    alert("Song added successfully!");

    form.reset();

});