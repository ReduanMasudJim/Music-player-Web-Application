let currentSong = new Audio();
let songs;
let currentFolder;
const port=window.location.port;
console.log(port);


async function getSongs(folder) {
    currentFolder = folder;
    console.log(folder);
    
    let a = await fetch(`http://127.0.0.1:${port}/Spotify_Clone/${currentFolder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${currentFolder}/`)[1])
        }
    }
    //  document.querySelector(".songinfo").innerHTML = decodeURI(track);
    // document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML="";
    
    for (const song of songs) {
        console.log(songs);
        
        
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="imgs/music.svg" alt="">
                        <div class="info">
                            <div> ${song.replaceAll("%20", " ")}</div>
                            
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="imgs/play.svg" alt="">
                        </div> </li>`;
    }
    //  document.querySelector(".songinfo").innerHTML = decodeURI(track);
    // document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach(element => {
        element.addEventListener("click", e => {
            console.log(element.querySelector(".info").firstElementChild.innerHTML);
            playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim());

        })



    })
    //  document.querySelector(".songinfo").innerHTML = decodeURI(track);
    // document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    return songs; 
}

const playMusic = (track, pause = false) => {
    if(track===undefined){
        document.querySelector(".songinfo").innerHTML= "Not Playing anything";

    }else{
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    currentSong.src = `http://127.0.0.1:${port}/Spotify_Clone/${currentFolder}/` + track;

    if (!pause) {
        currentSong.play();
        play.src = "imgs/pause.svg"
    }

    }
  


}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayAlbums(){
let a = await fetch(`http://127.0.0.1:${port}/Spotify_Clone/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let cardcontainer=document.querySelector(".cardcontainer");
    let anchors=div.getElementsByTagName("a");
    let array= Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0]
            // Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:${port}/Spotify_Clone/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card bdr-blue">
              <div class="play bdr-red">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                  
                  <!-- Content -->
                  <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" fill="#000000" stroke="none" />
              </svg>
              
                </svg>
              </div>
              <img
                src="http://127.0.0.1:${port}/Spotify_Clone/songs/${folder}/cover.jpg"
                alt="Image"
              />
              <h2>${response.title}</h2>
              <p>${response.description}r</p>
            </div>`; 
            


        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })

}



async function main() {
    // Get the list of all the songs

    await getSongs("songs/");

    playMusic(songs[0], true);

    //Display all the albums on the page
    displayAlbums();

   


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "imgs/pause.svg"
        } else {
            currentSong.pause();
            play.src = "imgs/play.svg"
        }
    })
    //listen for time upudate
    currentSong.addEventListener("timeupdate", () => {
       
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })
    
    //add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let moveSeekbar = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = moveSeekbar + "%";
        currentSong.currentTime = ((currentSong.duration) * moveSeekbar) / 100;
    })
    document.querySelector(".hamburger").addEventListener("click", e => {

        document.querySelector(".left").style.left = "0";
    })

    // add event listener for close
    document.querySelector(".close").addEventListener("click", e => {

        document.querySelector(".left").style.left = "-130% ";

    })

    // Add an event listener to previous
    pre.addEventListener("click", () => {
        currentSong.pause()

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()


        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //add event on volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })

     // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
             document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
           
            currentSong.volume = .50;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        }

    })





}

main() 
