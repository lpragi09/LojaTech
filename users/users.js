const API_URL = 'https://dummyjson.com/users';
const list = document.getElementById('usersList');
const form = document.getElementById('userForm');
const modal = document.getElementById('modalOverlay');

// ÍCONES SVG DO SISTEMA (Editar / Lixeira)
const SVG_EDIT = `<svg viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>`;
const SVG_TRASH = `<svg viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`;

// --- LÓGICA DO MODAL ---
document.getElementById('btnNew').onclick = () => modal.classList.add('active');
document.getElementById('btnCloseModal').onclick = () => modal.classList.remove('active');
modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

// --- CARREGAR API ---
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch(API_URL + '?limit=6');
        const data = await res.json();
        data.users.forEach(renderCard);
    } catch (err) { console.error("Erro API:", err); }
});

function renderCard(user) {
    const card = document.createElement('div');
    card.className = 'card';

    // --- LÓGICA DAS PESSOINHAS (DiceBear API) ---
    // 1. Gera um avatar baseado no nome (assim a pessoa "Joao" sempre tem a mesma cara)
    const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.firstName + user.lastName}`;

    // 2. Decide qual imagem usar:
    // Se a imagem vier da API 'dummyjson', ignoramos ela e usamos o Avatar.
    // Se o campo estiver vazio, usamos o Avatar.
    // Só usamos user.image se NÃO for da dummyjson (ou seja, se você colou um link manual).
    let finalImg = avatarUrl;

    if (user.image && !user.image.includes('dummyjson.com')) {
        finalImg = user.image; // Usa a imagem que você colou manualmente
    }

    // HTML do Card
    card.innerHTML = `
        <img src="${finalImg}" class="card-img" style="background: transparent;">
        <h3 class="card-name">${user.firstName} ${user.lastName}</h3>
        <p>📧 ${user.email}</p>
        <p>🎂 ${user.age} anos</p>
    `;

    // --- BOTÕES DE AÇÃO ---
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    // Editar
    const btnEdit = document.createElement('button');
    btnEdit.className = 'action-btn btn-edit';
    btnEdit.innerHTML = SVG_EDIT;
    btnEdit.title = "Editar";
    btnEdit.onclick = function() {
        const nameEl = card.querySelector('.card-name');
        const imgEl = card.querySelector('.card-img');

        const newName = prompt("Editar Nome:", nameEl.innerText);
        if(newName && newName.trim() !== "") {
            nameEl.innerText = newName;

            // Recalcula o avatar com o novo nome
            const newAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${newName.replace(" ", "")}`;

            const newImg = prompt("Nova URL da foto (deixe vazio para gerar novo avatar):");
            if(newImg && newImg.trim() !== "") {
                imgEl.src = newImg; // Usa URL manual
            } else {
                imgEl.src = newAvatar; // Usa novo avatar gerado
            }
        }
    };

    // Excluir
    const btnDel = document.createElement('button');
    btnDel.className = 'action-btn btn-delete';
    btnDel.innerHTML = SVG_TRASH;
    btnDel.title = "Excluir";
    btnDel.onclick = function() {
        if(confirm("Excluir este usuário?")) {
            card.remove();
        }
    };

    actions.appendChild(btnEdit);
    actions.appendChild(btnDel);
    card.prepend(actions);
    list.prepend(card);
}

// --- FORMULÁRIO ---
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    if(firstName.length < 3) {
        alert("Nome muito curto.");
        return;
    }

    renderCard({
        firstName: firstName,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
        image: document.getElementById('image').value // Se vazio, vira avatar no renderCard
    });

    form.reset();
    modal.classList.remove('active');
    alert("Usuário adicionado!");
});