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
      <button onclick="editPost('${p.id}', '${p.title}', '${p.content}')">수정</button>
      <button onclick="deletePost('${p.id}')">삭제</button>
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

async function editPost(id, oldTitle, oldContent) {
  const title = prompt("새 제목:", oldTitle);
  const content = prompt("새 내용:", oldContent);
  if (!title || !content) return;

  await fetch(`${API_BASE}/updatePost`, {
    method: "POST",
    body: JSON.stringify({ id, title, content }),
  });
  loadPosts();
}

async function deletePost(id) {
  if (!confirm("정말 삭제할까요?")) return;
  await fetch(`${API_BASE}/deletePost`, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
  loadPosts();
}

loadPosts();
