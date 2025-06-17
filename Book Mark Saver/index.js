const addBookmarkBtn = document.getElementById("add-bookmark");
const bookmarkList = document.getElementById("bookmark-list");
const bookmarkNameInput = document.getElementById("bookmark-name");
const bookmarkUrlInput = document.getElementById("bookmark-url");

document.addEventListener("DOMContentLoaded", loadBookmarks);

addBookmarkBtn.addEventListener("click", function () {
  const name = bookmarkNameInput.value.trim();
  const url = bookmarkUrlInput.value.trim();

  if (!name || !url) {
    alert("Please enter a name and URL for the bookmark");
    return;
  } else {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      alert("Please enter a valid URL");
      return;
    }
  }

  addBookmark(name, url);
  saveBookmark(name, url);
  bookmarkNameInput.value = "";
  bookmarkUrlInput.value = "";
});

function addBookmark(name, url) {
  const li = document.createElement("li");
  const link = document.createElement("a");
  link.href = url;
  link.textContent = name;
  link.target = "_blank";

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", function () {
    bookmarkList.removeChild(li);
    removeBookmarkFromLocalStorage(name, url);
  });

  li.appendChild(link);
  li.appendChild(removeButton);
  bookmarkList.appendChild(li);
}

function getBookmarksFromLocalStorage() {
  const bookmarks = localStorage.getItem("bookmarks");
  return bookmarks ? JSON.parse(bookmarks) : [];
}

function saveBookmark(name, url) {
  const bookmarks = getBookmarksFromLocalStorage();
  bookmarks.push({ name, url });
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function loadBookmarks() {
  const bookmarks = getBookmarksFromLocalStorage();
  bookmarks.forEach((bookmark) => {
    addBookmark(bookmark.name, bookmark.url);
  });
}

function removeBookmarkFromLocalStorage(name, url) {
  let bookmarks = getBookmarksFromLocalStorage();
  bookmarks = bookmarks.filter(
    (bookmark) => bookmark.name !== name || bookmark.url !== url
  );
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
