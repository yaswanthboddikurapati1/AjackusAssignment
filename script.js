const API_URL = "https://jsonplaceholder.typicode.com/users";
let userModal = new bootstrap.Modal(document.getElementById('userModal'));

// Fetch and display users
async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch users");
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        alert(error.message);
    }
}

// Display users in a table
function displayUsers(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(user => `
          <tr>
            <td>${user.id}</td>
            <td>${user.name.split(' ')[0]}</td>
            <td>${user.name.split(' ')[1] || ''}</td>
            <td>${user.email}</td>
            <td>${user.company.name}</td>
            <td>
              <button class="btn btn-sm btn-warning" onclick="editUser(${user.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Open modal for adding a new user
function openAddUserModal() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    userModal.show();
}

// Save user (add or edit)
async function saveUser() {
    const userId = document.getElementById('userId').value;
    const user = {
        name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
        email: document.getElementById('email').value,
        company: {
            name: document.getElementById('department').value
        }
    };

    try {
        const url = userId ? `${API_URL}/${userId}` : API_URL;
        const method = userId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error("Failed to save user");
        userModal.hide();
        fetchUsers();
    } catch (error) {
        alert(error.message);
    }
}

// Edit user
async function editUser(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const user = await response.json();
        const [firstName, lastName] = user.name.split(' ');
        document.getElementById('userId').value = user.id;
        document.getElementById('firstName').value = firstName;
        document.getElementById('lastName').value = lastName || '';
        document.getElementById('email').value = user.email;
        document.getElementById('department').value = user.company.name;
        userModal.show();
    } catch (error) {
        alert(error.message);
    }
}

// Delete user
async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Failed to delete user");
        fetchUsers();
    } catch (error) {
        alert(error.message);
    }
}

// Initialize
fetchUsers();