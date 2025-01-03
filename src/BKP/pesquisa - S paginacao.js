document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-btn");
    const resultsContainer = document.getElementById("results-container");
    const detailsModal = document.getElementById("details-modal");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    
    
    
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

    searchButton.addEventListener("click", () => {
        // Desativa o botão
        searchButton.disabled = true;
    
        // Reativa o botão após 8 segundos
        setTimeout(() => {
            searchButton.disabled = false;
        }, 8000);
    
        //GET na API
        fetch("http://localhost:3000/comandos")  
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                displayCommands(data); // Exibe os comandos
            })
            .catch(error => {
                console.error("Erro ao buscar comandos: ", error);
                showPopup(`Erro ao buscar comandos: ${error.message}`, "error");
            });
    });

    function displayCommands(commands) {
        resultsContainer.innerHTML = ""; // Limpa os resultados anteriores

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
    }

    function showDetails(command) {
        const detailsContainer = document.getElementById("command-details");
    
        // Inicializa a variável com o valor de execute, caso exista
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
        // const detailsModal = document.getElementById("details-modal");
        detailsModal.classList.add("active");
        
        // const modalBackdrop = document.querySelector(".modal-backdrop");
        modalBackdrop.classList.add("active");
    }

    // Função para fechar o modal
    detailsModal.querySelector(".close-btn").addEventListener("click", () => {
        detailsModal.classList.remove("active");
        modalBackdrop.classList.remove("active");
    });
});
