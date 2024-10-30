export function setTitleText(title) {
  if (document.getElementById("appBarText")) {
    document.getElementById("appBarText").textContent = title;
  }
  return null;
}
