const API_BASE = "/.netlify/functions";

async function loadPosts() {
  const res = await fetch(`${API_BASE}/getPosts`);
  const posts = await res.json();
  const list = document.getElementById("posts");
  list.innerHTML = "";
  posts.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${p.title}</b> - ${p.content}
    `;
    list.appendChild(li);
  });
}

document.getElementById("postForm").addEventListener("submit", async e => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  await fetch(`${API_BASE}/createPost`, {
    method: "POST",
    body: JSON.stringify({ title, content }),
  });
  loadPosts();
});

loadPosts();
