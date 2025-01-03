document.addEventListener("DOMContentLoaded", () => {
    const deleteForm = document.getElementById("deleteForm");

    const searchBtn = document.getElementById("search-btn");
    const searchResults = document.getElementById("search-results");
    const idInput = document.getElementById("id");
    const nameInput = document.getElementById("name");
    
    const deleteButton = document.getElementById("btn-delete");

    const detailsModal = document.getElementById("details-modal");

    function showPopup(message, type = "") {
        const popupMessage = document.getElementById("popup-message");
        const popupText = document.getElementById("popup-text");

        popupMessage.className = `popup-message ${type}`; // Adiciona a classe (erro ou sucesso)
        popupText.textContent = message;
        popupMessage.style.display = "block";
        popupMessage.style.opacity = "1";

        setTimeout(() => {
            popupMessage.style.opacity = "0";
            setTimeout(() => (popupMessage.style.display = "none"), 300);
        }, 3000);
    }

     // Evento de clique no botão de pesquisa
    searchBtn.addEventListener("click", () => {
        const busca = document.getElementById("search-input").value.trim();
    
        if (!busca) {
            showPopup("Informe o nome para realizar a pesquisa.", "alert");
            return;
        }
    
        fetch(`http://localhost:3000/comandos/getName/?name=${encodeURIComponent(busca)}`)
            .then(response => {
                console.log("Resposta recebida:", response); // Log adicional para debugging
                if (!response.ok) {
                    if(response.status == 404) {
                        throw new Error("404")
                    }
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Dados retornados da API:", data); // Log dos dados retornados
    
                // Limpa os resultados anteriores
                searchResults.innerHTML = '<option value="">Selecione um comando</option>';
    
                // Verifica se existem comandos na estrutura esperada
                if (!data.comandos || !Array.isArray(data.comandos) || data.comandos.length === 0) {
                    console.log("Nenhum comando encontrado.");
                    showPopup("Nenhum comando encontrado.", "alert");
                    return;
                }
    
                // Adiciona os comandos encontrados ao select
                data.comandos.forEach(comando => {
                    const option = document.createElement("option");
                    option.value = comando.id;
                    option.textContent = `${comando.data.name} - ${comando.data.description}`;
                    searchResults.appendChild(option);
                });
            })
            .catch(error => {
                if(error.message == 404 || error.message == "404") {
                    showPopup(`Não foi encontrado resultados para: ${busca}`, "alert")
                } else {
                    showPopup("Erro ao buscar comandos: " + error.message, "error");
                    console.error("Erro ao buscar comandos:", error);
                }
            });
    });

    // Evento de mudança na seleção do select
    searchResults.addEventListener("change", (event) => {
        const selectedId = event.target.value;
        const selectedDescription = event.target.options[event.target.selectedIndex].textContent;
        if (selectedId) {
            idInput.value = selectedId;
            nameInput.value = selectedDescription
        }
    });

    deleteForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const id = document.getElementById("id").value;

        if (!id) {
            showPopup("Informe o ID para exclusão.", "alert");
            return;
        }

        fetch(`http://localhost:3000/comandos/${id}`, { 
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                console.log(`Erro ${response.status}: ${response.statusText}`); // Log detalhada com o res da API
                throw new Error(`Erro ${response.status}: ${response.statusText}`); // Captura o erro e envia para o catch
            }
            return response.json();
        })
        .then(data => {
            showPopup("Exclusão realizada com sucesso!", "sucess");
            console.log(`Comando com o ID ${id} foi deletado`)
            deleteForm.reset(); // Limpa os campos do formulário
        })
        .catch(error => {
            showPopup("Erro interno: " + error.message, "error");
            console.log(`Erro interno: ${error.message}`);
        });
    });
});
