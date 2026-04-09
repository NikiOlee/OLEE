import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const commentsConfig = {
  apiKey: "AIzaSyC_PDnKHsYiHlATENt1twFQdcHd0m6Ib_U",
  authDomain: "olee-comments.firebaseapp.com",
  projectId: "olee-comments",
  storageBucket: "olee-comments.firebasestorage.app",
  messagingSenderId: "750724736928",
  appId: "1:750724736928:web:fe812a21573c85d2a1a6c5",
  measurementId: "G-Q51P9SN1B4",
};

const clubNewsConfig = {
  apiKey: "AIzaSyAwkpFwUaI9ODiH39WzEcpnRxODTVRWCbk",
  authDomain: "olee-news.firebaseapp.com",
  projectId: "olee-news",
  storageBucket: "olee-news.firebasestorage.app",
  messagingSenderId: "983990542162",
  appId: "1:983990542162:web:7c506b4a89c51d2c85248b",
  measurementId: "G-DRE0VYDCYT",
};

const siteNewsConfig = {
  apiKey: "AIzaSyDHlQXwjcJCJJmFYdvbUOxWg2D-jUX8SVI",
  authDomain: "olee-develop-news.firebaseapp.com",
  projectId: "olee-develop-news",
  storageBucket: "olee-develop-news.firebasestorage.app",
  messagingSenderId: "29848889533",
  appId: "1:29848889533:web:d967fe922c8fc890f62fd4",
  measurementId: "G-25TFCFQEZQ",
};

const commentsApp = initializeApp(commentsConfig);
const db = getFirestore(commentsApp);

const clubApp = initializeApp(clubNewsConfig, "clubApp");
const clubDb = getFirestore(clubApp);

const siteApp = initializeApp(siteNewsConfig, "siteApp");
const siteDb = getFirestore(siteApp);

const commentsCol = collection(db, "comments");
let lastDoc = null;

async function loadComments(isMore = false) {
  let q;
  if (isMore && lastDoc) {
    q = query(
      commentsCol,
      orderBy("date", "desc"),
      startAfter(lastDoc),
      limit(5),
    );
  } else {
    const listElement = document.getElementById("comments-list");
    if (listElement) listElement.innerHTML = "";
    q = query(commentsCol, orderBy("date", "desc"), limit(5));
  }
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    document.getElementById("load-more-btn").style.display = "none";
    return;
  }
  lastDoc = snapshot.docs[snapshot.docs.length - 1];
  const list = document.getElementById("comments-list");
  snapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "comment";
    const dateString = new Date(data.date).toLocaleString();
    div.innerHTML = `<strong>${data.name}:</strong> <small style="color: gray; margin-left: 10px;">${dateString}</small><br>${data.text}`;
    list.appendChild(div);
  });
  document.getElementById("load-more-btn").style.display =
    snapshot.docs.length < 5 ? "none" : "block";
}

window.loadMoreComments = () => loadComments(true);

window.addComment = async function () {
  const name = document.getElementById("name").value;
  const text = document.getElementById("comment").value;
  if (!name || !text) {
    alert("Trebate nešto da napišete!");
    return;
  }
  await addDoc(commentsCol, { name: name, text: text, date: Date.now() });
  document.getElementById("name").value = "";
  document.getElementById("comment").value = "";
  lastDoc = null;
  loadComments();
};

async function displayClubNews() {
  const container = document.getElementById("list");
  try {
    const q = query(
      collection(clubDb, "news"),
      orderBy("date", "desc"),
      limit(3),
    );
    const snapshot = await getDocs(q);

    container.innerHTML = "";
    if (snapshot.empty) {
      container.innerHTML = "<p>Nema vesti.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Пробуем преобразовать дату, если она в строке или числе
      const dateValue = isNaN(data.date) ? data.date : Number(data.date);
      const d = new Date(dateValue).toLocaleDateString("sr-RS");

      const videoContent = data.videoHtml
        ? `<div class="video-container" style="margin-top:10px;">${data.videoHtml}</div>`
        : "";

      const newsDiv = document.createElement("div");
      newsDiv.className = "news-item";
      newsDiv.innerHTML = `
        <div class="date" style="font-size: 11px; color: #666;">${d}</div>
        <div class="news-title">${data.title}</div>
        <p>${data.text}</p>
        ${videoContent}
      `;
      container.appendChild(newsDiv);
    });

    // Оживляем Instagram
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  } catch (e) {
    console.error(e);
    container.innerHTML = "<p>Greška.</p>";
  }
}

async function displaySiteNews() {
  const container = document.getElementById("news-container");
  try {
    const q = query(collection(siteDb, "news"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    container.innerHTML = "";
    if (snapshot.empty) {
      container.innerHTML = "<p>Nema vesti o sajtu.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const dateValue = isNaN(data.date) ? data.date : Number(data.date);
      const d = new Date(dateValue).toLocaleDateString("sr-RS");

      const videoContent = data.videoHtml
        ? `<div class="video-container" style="margin-top:10px;">${data.videoHtml}</div>`
        : "";

      const newsDiv = document.createElement("div");
      newsDiv.className = "news-item";
      newsDiv.innerHTML = `
        <div class="date" style="font-size: 11px; color: #666;">${d}</div>
        <div class="news-title">${data.title}</div>
        <p>${data.text}</p>
        ${videoContent} 
      `;
      container.appendChild(newsDiv);
    });

    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  } catch (e) {
    console.error("Ошибка Firebase:", e);
    container.innerHTML = "<p>Greška pri učitavanju vesti sajta.</p>";
  }
}
loadComments();
displayClubNews();
displaySiteNews();
