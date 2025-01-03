document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-btn");
    const resultsContainer = document.getElementById("results-container");
    const detailsModal = document.getElementById("details-modal");
    const modalBackdrop = document.querySelector(".modal-backdrop");

    let currentPage = 1; // Página atual
    const itemsPerPage = 10; // Número de comandos por página
    let totalPages = 1; // Total de páginas
    
    
    
    // Função para exibir o popup
    function showPopup(message, type = "") {
        const popupMessage = document.getElementById("popup-message");
        const popupText = document.getElementById("popup-text");
        
        popupMessage.className = `popup-message ${type}`; // Adiciona a classe (erro ou sucesso)
        popupText.textContent = message;
        popupMessage.style.display = "block";
        
        setTimeout(() => {
            popupMessage.style.display = "none";
        }, 3000);
    }

    //Realizar o ge na rota Get All
    function fetchCommands() {
        fetch(`http://localhost:3000/comandos?page=${currentPage}&limit=${itemsPerPage}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
            .then(data => {
                displayCommands(data); // Exibe os comandos recebidos
            })
            .catch(error => {
                console.error("Erro ao buscar comandos: ", error);
                showPopup(`Erro ao buscar comandos: ${error.message}`, "error");
            });
    }
    
    searchButton.addEventListener("click", () => {
        searchButton.disabled = true;
    
        setTimeout(() => {
            searchButton.disabled = false;
        }, 8000);
    
        fetchCommands();
    });

    //Exibir os comandos na tela
    function displayCommands(response) {
        console.log("Dados recebidos:", response);
        resultsContainer.innerHTML = ""; // Limpa os resultados anteriores
        
        const commands = response.comandos; // Array de comandos
        totalPages = response.totalPages; // Total de páginas da API
    
        if (!commands || commands.length === 0) {
            resultsContainer.innerHTML = "<p class='no-results'>Nenhum comando encontrado.</p>";
            return;
        }
    
        const table = document.createElement("table");
        table.className = "results-table";
    
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th class="coluna-detalhe">Detalhar</th>
                <th>Nome do Comando</th>
            </tr>
        `;
        table.appendChild(thead);
    
        const tbody = document.createElement("tbody");
    
        commands.forEach(command => {
            const row = document.createElement("tr");
    
            const actionCell = document.createElement("td");
            actionCell.classList.add("coluna-detalhe");
    
            const detailsButton = document.createElement("button");
            detailsButton.className = "details-btn";
            const img = document.createElement("img");
            img.src = "../Images/Detail - white.png";
            img.alt = "Detalhar";
            detailsButton.appendChild(img);
            detailsButton.addEventListener("click", () => {
                showDetails(command);
            });
            actionCell.appendChild(detailsButton);
    
            const nameCell = document.createElement("td");
            nameCell.textContent = `/${command.data.name}`;
    
            row.appendChild(actionCell);
            row.appendChild(nameCell);
    
            tbody.appendChild(row);
        });
    
        table.appendChild(tbody);
        resultsContainer.appendChild(table);
    
        displayPaginationButtons();
    }
    
    //Botões para alterar a paginação
    function displayPaginationButtons() {
        const paginationContainer = document.getElementById("pagination-container");
        paginationContainer.innerHTML = ""; // Limpa os botões anteriores
    
        if (totalPages <= 1) return; // Não exibe paginação se houver apenas uma página
    
        console.log("Total de Páginas:", totalPages); // Verificação
    
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.className = "pagination-btn";
    
            
    
            button.addEventListener("click", () => {
                currentPage = i;
                console.log(`Mudando para página: ${currentPage}`); // Debug
                fetchCommands(); // Chama a API para buscar a nova página
            });

            if (i === currentPage) {
                button.classList.add("active");
            }
            paginationContainer.appendChild(button);
        }
    }

    //Abrir modal ao clicar nos detalhes do comando
    function showDetails(command) {
        const detailsContainer = document.getElementById("command-details");
    
        let executeDetails = command.execute;
        
        if (command.execute2) {
            executeDetails += `<br><br><strong>Executar 2:</strong> ${command.execute2}`;
        }
        
        if (command.execute3) {
            executeDetails += `<br><br><strong>Executar 3:</strong> ${command.execute3}`;
        }
    
        // Exibe os detalhes no container
        detailsContainer.innerHTML = `
            <h2>Detalhes do Comando</h2>
            <p><strong>ID:</strong> ${command.id}</p>
            <p><strong>Nome:</strong> ${command.data.name}</p>
            <p><strong>Descrição:</strong> ${command.data.description}</p>
            <p><strong>Executar:</strong> ${executeDetails}</p>
        `;
        
        // Abre o modal
        detailsModal.classList.add("active");
        modalBackdrop.classList.add("active");
    }

    // Função para fechar o modal
    detailsModal.querySelector(".close-btn").addEventListener("click", () => {
        detailsModal.classList.remove("active");
        modalBackdrop.classList.remove("active");
    });
});
