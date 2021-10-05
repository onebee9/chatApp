if (getInfo) {
  getInfo.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      localStorage.setItem("username",document.getElementById("username").value);
      localStorage.setItem("room", document.getElementById("room").value);
      
      window.location.href = 'chat.html';//redirect to main chat page

    } catch (error) {
      console.error("Error:", error);
    }
  });
}
