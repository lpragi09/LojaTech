const API_URL = 'https://dummyjson.com/products';
const list = document.getElementById('prodList');
const form = document.getElementById('prodForm');
const modal = document.getElementById('modalOverlay');

// ÍCONES SVG
const SVG_EDIT = `<svg viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>`;
const SVG_TRASH = `<svg viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`;

// --- DICIONÁRIO DE TRADUÇÃO (O TRUQUE) ---
// Traduzimos os IDs específicos que a API retorna
const TRANSLATIONS = {
    1: { title: "Rímel Essence Lash", desc: "Rímel para volume e definição. Efeito de cílios postiços durante todo o dia." },
    2: { title: "Paleta de Sombras", desc: "Paleta com espelho e cores vibrantes para maquiagem profissional." },
    3: { title: "Pó Compacto", desc: "Pó facial para acabamento matte e controle de oleosidade." },
    4: { title: "Batom Vermelho", desc: "Batom vermelho clássico com acabamento cremoso e longa duração." },
    5: { title: "Esmalte Nail Art", desc: "Esmalte de secagem rápida e brilho intenso para unhas." },
    6: { title: "Perfume CK One", desc: "Fragrância unissex cítrica e refrescante para o dia a dia." }
};

// Lógica do Modal
document.getElementById('btnNew').onclick = () => modal.classList.add('active');
document.getElementById('btnCloseModal').onclick = () => modal.classList.remove('active');
modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

// Carregar da API
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch(API_URL + '?limit=6');
        const data = await res.json();
        // Renderiza cada produto vindo da API
        data.products.forEach(renderProduct);
    } catch(err) { console.error(err); }
});

function renderProduct(prod) {
    const card = document.createElement('div');
    card.className = 'card';

    const img = prod.thumbnail || 'https://via.placeholder.com/150';

    // VERIFICA SE EXISTE TRADUÇÃO PARA ESTE ITEM
    let finalTitle = prod.title;
    let finalDesc = prod.description;

    // Se o ID do produto estiver no nosso dicionário, usa o texto em PT-BR
    if (TRANSLATIONS[prod.id]) {
        finalTitle = TRANSLATIONS[prod.id].title;
        finalDesc = TRANSLATIONS[prod.id].desc;
    }

    card.innerHTML = `
        <img src="${img}" class="card-img">
        <h3>${finalTitle}</h3>
        <p class="price">R$ ${Number(prod.price).toFixed(2)}</p>
        <p><strong>Marca:</strong> ${prod.brand || 'Genérica'}</p>
        <p class="card-desc">${finalDesc}</p>
    `;

    // Botões de Ação
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    // Botão Editar
    const btnEdit = document.createElement('button');
    btnEdit.className = 'action-btn btn-edit';
    btnEdit.innerHTML = SVG_EDIT;
    btnEdit.title = "Editar";
    btnEdit.onclick = function() {
        const descEl = card.querySelector('.card-desc');
        const imgEl = card.querySelector('.card-img');

        // Pergunta em Português
        const newDesc = prompt("Editar Descrição:", descEl.innerText);
        if(newDesc && newDesc.trim() !== "") {
            descEl.innerText = newDesc;

            const newImg = prompt("Nova URL da Imagem (opcional):");
            if(newImg && newImg.trim() !== "") imgEl.src = newImg;
        }
    };

    // Botão Excluir
    const btnDel = document.createElement('button');
    btnDel.className = 'action-btn btn-delete';
    btnDel.innerHTML = SVG_TRASH;
    btnDel.title = "Excluir";
    btnDel.onclick = function() {
        if(confirm("Tem certeza que deseja excluir este produto?")) {
            card.remove();
        }
    };

    actions.appendChild(btnEdit);
    actions.appendChild(btnDel);
    card.prepend(actions);
    list.prepend(card);
}

// Formulário de Adição
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;

    if(title.length < 3) { alert("Título muito curto."); return; }
    if(Number(price) <= 0) { alert("Preço deve ser maior que zero."); return; }

    // Cria um objeto de produto novo (aqui não precisa de tradução pois você digita em PT)
    renderProduct({
        id: 9999, // ID fictício
        title: title,
        price: price,
        brand: document.getElementById('brand').value,
        description: document.getElementById('desc').value,
        thumbnail: document.getElementById('thumb').value
    });

    form.reset();
    modal.classList.remove('active');
    alert("Produto cadastrado com sucesso!");
});