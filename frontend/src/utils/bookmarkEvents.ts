// Bookmark buttons and the saved-posts list live in unrelated parts of the
// tree, so a successful bookmark change is broadcast as a window event.
export const BOOKMARKS_CHANGED = "shiba:bookmarks-changed";

export function notifyBookmarksChanged() {
  window.dispatchEvent(new Event(BOOKMARKS_CHANGED));
}
