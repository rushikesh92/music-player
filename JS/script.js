console.log("Script attached")

async function getSongs() {
    
    let a = await fetch("http://127.0.0.1:5500/SONGS/")

    let response = await a.text();
    // console.log(response)

    let div = document.createElement("div");
    div.innerHTML = response;

    let allA = div.getElementsByTagName("a")
    let songs = []
    let songNames = []

    for( let i=0; i< allA.length ; i++){
        const element = allA[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href)
            songNames.push(element.href.split("/SONGS/")[1])
        }

    }
    // console.log(songNames)

    let songUl= document.querySelector(".songList").getElementsByTagName("ul")[0];
    // console.log(songUl)
    for (let song of songNames) {
        song = song.replace("_" , " ")
        songUl.innerHTML +=` <li>${song}</li>` ;
    }
    return songs;
}
async function main() {
    let songs  = await getSongs()
    console.log(songs)

    //playing song
    var audio = new Audio(songs[0]); 
    audio.play();  
}



main();