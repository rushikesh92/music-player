console.log("Script attached")

//global current song
var currentSong = new Audio();
let songNames = []


function playSong(track, pause = false) {
    currentSong.src = track;
    if (!pause) {
        currentSong.play();
        play.src = "IMG/pause.svg"
    }
    document.querySelector(".songName").innerHTML = track.replaceAll("_", " ").slice(7, track.length - 4);
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


async function getSongs() {

    let a = await fetch("http://127.0.0.1:5500/SONGS/")

    let response = await a.text();
    // console.log(response)

    let div = document.createElement("div");
    div.innerHTML = response;

    let allA = div.getElementsByTagName("a")
    let songs = []

    for (let i = 0; i < allA.length; i++) {
        const element = allA[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
            songNames.push(element.href.split("/SONGS/")[1])//splitting  http://127.0.0.1:5500  split /SONGS/name 
        }

    }

    // console.log(songNames)


    //adding song names to library

    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    // console.log(songUl)
    for (let song of songNames) {
        song = song.replaceAll("_", " ")
        song = song.slice(0, song.length - 4);  //removing .mp3
        let html = `<li>
        <img src="IMG/music.svg" class="invert" alt="">
        <div class="songInfo">
        <div>${song}</div>
        <div class="artist">One Direction</div>
        </div>
        <div class="playNow">
        <span>Play Now</span>
        <img src="IMG/play.svg" class="invert" alt="">
        </div>
        </li>`

        songUl.innerHTML += html;;
    }

    //load first song at playbar automatically

    playSong("/SONGS/" + songNames[0], true);

    return songs;
}


async function main() {
    let songs = await getSongs()
    // console.log(songs)

    //playing song
    // var audio = new Audio(songs[0]);
    // audio.play();  



    //playing functionality

    //getting all li's in songList
    let allLi = Array.from(document.querySelector(".songList").getElementsByTagName("li"))
    allLi.forEach((li) => {

        //adding eventListner on each li

        li.addEventListener("click", () => {

            //extracting song name
            let sName = "/SONGS/" + li.querySelector("div").firstElementChild.innerHTML.replaceAll(" ", "_") + ".mp3";
            // console.log(sName)
            playSong(sName);

        })

    })


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

        //if song ends change pause button to play
        if (currentSong.currentTime == currentSong.duration) {
            play.src = "IMG/play.svg";
        }
        document.querySelector(".songTime").innerHTML = secondsToTimestamp(currentSong.currentTime) + "/" + secondsToTimestamp(currentSong.duration);

        //updating seekbar circle
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //creating eventlistner on  seekbar to change song's current time based on user click
    document.querySelector(".seekbar").addEventListener("click", (e) => {

        let domRect = e.target.getBoundingClientRect() //return DOM Rectangle which  includes width height etc
        console.log(e.offsetX, domRect.width);//width of seekbar depending on device width
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
        console.log(e)
        document.querySelector(".left").style.left = "-120%";
    })

    // console.log(songNames);
    // console.log(currentSong.src.split("/")[4])

    //play next song  functionality
    next.addEventListener("click", () => {
        console.log("next clicked")
        let i = songNames.indexOf(currentSong.src.split("/")[4]);
        playSong("/SONGS/" + songNames[(i + 1) % songNames.length]);

    })
    //play previous song functionality
    previous.addEventListener("click", () => {
        console.log("prev clicked")
        let i = songNames.indexOf(currentSong.src.split("/")[4]);
        if ((i - 1) >= 0) {
            playSong("/SONGS/" + songNames[(i - 1)]);
        } else {
            playSong("/SONGS/" + songNames[(songNames.length - 1)]);

        }
    })

    //volume mute / unmutw]e
    volume.addEventListener("click", () => {
        if (currentSong.volume != 0) {
            currentSong.volume = "0";
            volume.src = "IMG/mute.svg";
            volume.classList.add("invert")

            document.querySelector(".range").value=0;
        }
        else {
            currentSong.volume = "1";
            volume.src = "IMG/volume.svg";
            volume.classList.remove("invert")
            document.querySelector(".range").value=100;

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


}




main();


