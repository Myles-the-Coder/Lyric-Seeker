const form = document.getElementById("form");
const searchEl = document.getElementById("search");
const moreEl = document.getElementById("more");
const resultEl = document.getElementById("result");

const apiURL = "https://api.lyrics.ovh";

//Get API data
async function getJSON(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

//Search by song or artist
async function searchSongs(term) {
  const data = await getJSON(`${apiURL}/suggest/${term}`);

  showData(data);
}

//Get more songs
async function getMoreSongs(url) {
  const data = await getJSON(`https://cors-anywhere.herokuapp.com/${url}`);

  showData(data);
}

//Show song and artist in DOM
function showData(data) {
  resultEl.innerHTML = `
      <ul class="songs">
        ${data.data
          .map(
            (song) => ` 
        <li>
        <span>
          <strong>${song.artist.name}</strong> - ${song.title}
       </span>
          <button class="btn" data-artist="${song.artist.name}" data-songTitle="${song.title}">Get Lyrics</button>
         </li>`
          )
          .join("")}
      </ul>
    `;
  if (data.prev || data.next) {
    moreEl.innerHTML = `
      ${
        data.prev
          ? `<button class="btn" onClick="getMoreSongs('${data.prev}')">Prev</button>`
          : ""
      }
      ${
        data.next
          ? `<button class="btn" onClick="getMoreSongs('${data.next}')">Next</button>`
          : ""
      }
    `;
  } else {
    moreEl.innerHTML = "";
  }
}

async function getLyrics(artist, songTitle) {
  const data = await getJSON(`${apiURL}/v1/${artist}/${songTitle}`)
  
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

  resultEl.innerHTML = `
    <h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>
  `
  moreEl.innerHTML =''
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = searchEl.value.trim();

  if (!searchTerm) return;

  searchSongs(searchTerm);
});

//Get lyrics button click
resultEl.addEventListener('click', e => {
  const button = e.target.closest('.btn')
  const artist = button.getAttribute('data-artist')
  const songTitle = button.getAttribute('data-songTitle')

  getLyrics(artist, songTitle)
})