console.log("Script attached")
//global current song
var currentSong = new Audio();
let songNames = []
let callcount = 0;//to track if its default playlist or user selected playlist

let currentFolder = "";
function playSong(track, pause = false) {
    currentSong.src = track;
    if (!pause) {
        currentSong.play();
        play.src = "IMG/pause.svg"
    }
    let rawName = track.split("/").pop(); 
    let cleanName = rawName.replaceAll("_", " ").replace(".mp3", "");
    document.querySelector(".songName").innerHTML = cleanName;

    console.log("playing - ", track)
}

//converting seconds to timestamp
function secondsToTimestamp(seconds) {
    let timestamp = "00:00"
    if (seconds <= 0 || isNaN(seconds)) {
        return timestamp;
    }
    let mins = Math.floor((seconds / 60));
    let secs = Math.floor(seconds % 60);

    if (mins < 10) {
        mins = "0" + mins;
    }
    if (secs < 10) {
        secs = "0" + secs;
    }
    timestamp = mins + ":" + secs;
    return timestamp;


}

//call like getSongs("folder/")
async function getSongs(folder) {

    callcount++;
    currentFolder=folder;
    let a = await fetch(`${folder}info.json`);
    let info = await a.json();
    songNames =info.songs;
    
    // console.log(songNames)


    //adding song names to library
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = "";


    for (let song of songNames) {
        song = song.replaceAll("_", " ")
        song = song.slice(0, song.length - 4);  //removing .mp3
        let html = `<li>
        <img src="IMG/music.svg" class="invert" alt="">
        <div class="songInfo">
        <div>${song}</div>
        <div class="artist"></div>
        </div>
        <div class="playNow">
        <span>Play Now</span>
        <img src="IMG/play.svg" class="invert" alt="">
        </div>
        </li>`

        songUl.innerHTML += html;;
    }

    //playing functionality
    //getting all li's in songList
    let allLi = Array.from(document.querySelector(".songList").getElementsByTagName("li"))
    allLi.forEach((li) => {

        //adding eventListner on each li

        li.addEventListener("click", () => {
            //extracting song name
            let sName = `${currentFolder}` + li.querySelector("div").firstElementChild.innerHTML.replaceAll(" ", "_") + ".mp3";
            playSong(sName);

        })

    })


    //load first song at playbar automatically
    if (callcount <= 1) {//if function is called by default then pause loded song
        playSong(`${folder}` + songNames[0], true);
    }
    else {//for manual clicking on playlist play loaded song
        playSong(`${folder}` + songNames[0], false);

    }


}

async function loadAlbums() {
    let a = await fetch("SONGS/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a");


    let cardContainer = document.querySelector(".cardContainer");

    let arr = Array.from(anchors);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].href.includes("SONGS/")) {
            let folder = arr[i].title;
            let a = await fetch(`SONGS/${folder}/info.json`);
            let info = await a.json();
            cardContainer.innerHTML += `<div class="card" data-folder="${folder}">
                        <img src="SONGS/${arr[i].title}/cover.jpg" alt="cover">
                        <h2>${info.title}</h2>
                        <p>${info.desc}</p>
                        <img src="IMG/greenplay.svg" alt="" class="playButton">
                    </div>`;

        }
    }


}

async function main() {
    //default song in library
    await loadAlbums();
    await getSongs("SONGS/Chill Mood/");


    //attaching event listner to buttons in playbar
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "IMG/pause.svg"

        }
        else {
            currentSong.pause();
            play.src = "IMG/play.svg"
        }
    })

    //creating eventlistner to update duration of song

    currentSong.addEventListener("timeupdate", () => {

        //if song ends change to next song 
        if (currentSong.currentTime == currentSong.duration) {
            let i = songNames.indexOf(currentSong.src.split("/").pop());
            playSong(`${currentFolder}` + songNames[(i + 1) % songNames.length]);
        }
        document.querySelector(".songTime").innerHTML = secondsToTimestamp(currentSong.currentTime) + "/" + secondsToTimestamp(currentSong.duration);

        //updating seekbar circle
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //creating eventlistner on  seekbar to change song's current time based on user click
    document.querySelector(".seekbar").addEventListener("click", (e) => {

        let domRect = e.target.getBoundingClientRect() //return DOM Rectangle which  includes width height etc
        // console.log(e.offsetX, domRect.width);//width of seekbar depending on device width
        //offset gives the position of click on seekbar

        let percent = (e.offsetX / domRect.width) * 100;
        //update current time accordingly
        currentSong.currentTime = currentSong.duration * percent / 100;
    })


    // for responsive page

    //in tabs/mobiles on clicking hamburger left side bar will open
    document.querySelector(".hamburger").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = 0;
    })
    //on clicking close it will close
    document.querySelector(".close").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "-120%";
    })

    //play next song  functionality
    next.addEventListener("click", () => {
        console.log("next clicked")
        let i = songNames.indexOf(currentSong.src.split("/").pop());
        playSong(`${currentFolder}` + songNames[(i + 1) % songNames.length]);

    })
    //play previous song functionality
    previous.addEventListener("click", () => {
        console.log("prev clicked")
        let i = songNames.indexOf(currentSong.src.split("/").pop());
        if ((i - 1) >= 0) {
            playSong(`${currentFolder}` + songNames[(i - 1)]);
        } else {
            playSong(`${currentFolder}` + songNames[(songNames.length - 1)]);

        }
    })

    //volume mute / unmutw]e
    volume.addEventListener("click", () => {
        if (currentSong.volume != 0) {
            currentSong.volume = "0";
            volume.src = "IMG/mute.svg";
            volume.classList.add("invert")

            document.querySelector(".range").value = 0;
        }
        else {
            currentSong.volume = "1";
            volume.src = "IMG/volume.svg";
            volume.classList.remove("invert")
            document.querySelector(".range").value = 100;

        }
    })

    //volume increase decrease
    document.querySelector(".range").addEventListener("change", (e) => {
        console.log("setting volume to:", e.target.value, "/ 100");
        currentSong.volume = e.target.value / 100;
        if (e.target.value == 0) {
            volume.src = "IMG/mute.svg";
            volume.classList.add("invert")

        }
        else {
            volume.src = "IMG/volume.svg";
            volume.classList.remove("invert")


        }
    })

    //load  songs of clicked folder in library
    Array.from(document.getElementsByClassName("card")).forEach((card) => {
        card.addEventListener("click", async (e) => {
            console.log("Folder : ", e.currentTarget.dataset.folder);
            getSongs("SONGS/" + e.currentTarget.dataset.folder + "/");
        })
    })

}




main();


