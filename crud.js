const apiUrl = "https://6728ac5f270bd0b97556b69e.mockapi.io/user"; // JSON 서버 URL

// Bootstrap 모달 생성
const crudModal = new bootstrap.Modal(document.getElementById("crudModal"));

// 초기 데이터 가져오기 및 화면에 표시
async function fetchData() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  const dataList = document.getElementById("dataList");
  dataList.innerHTML = "";
  data.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} (${item.email}) 
            <button onclick="deleteData(${item.id})">Delete</button>
            <button onclick="editData(${item.id}, '${item.name}', '${item.email}')">Edit</button>`;
    dataList.appendChild(li);
  });
}

// Add 버튼 클릭 시 모달을 표시
document.getElementById("addButton").addEventListener("click", () => {
  document.getElementById("modalTitle").innerText = "Add New Item";
  document.getElementById("modalName").value = "";
  document.getElementById("modalEmail").value = "";
  crudModal.show();
});

// Save 버튼 클릭 시 새로운 항목 추가
document.getElementById("saveButton").addEventListener("click", async () => {
  const name = document.getElementById("modalName").value;
  const email = document.getElementById("modalEmail").value;
  if (name && email) {
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    fetchData();
    crudModal.hide();
  } else {
    alert("Please enter both name and email.");
  }
});

// 항목 삭제
async function deleteData(id) {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  fetchData();
}

// 항목 수정
function editData(id, currentName, currentEmail) {
  document.getElementById("modalTitle").innerText = "Edit Item";
  document.getElementById("modalName").value = currentName;
  document.getElementById("modalEmail").value = currentEmail;

  // Save 버튼 클릭 시 업데이트 요청
  document.getElementById("saveButton").onclick = async function () {
    const updatedName = document.getElementById("modalName").value;
    const updatedEmail = document.getElementById("modalEmail").value;
    if (updatedName && updatedEmail) {
      await updateData(id, { name: updatedName, email: updatedEmail });
      crudModal.hide();
    } else {
      alert("Please enter both name and email.");
    }
  };
  crudModal.show();
}

// 항목 업데이트
async function updateData(id, updatedData) {
  await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  fetchData();
}

// 페이지 로드 시 초기 데이터 로드
fetchData();
