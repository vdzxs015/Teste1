document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const formContainer = document.querySelector('.contact-form-wrapper');

    // Criar os elementos de overlay e mensagens apenas uma vez
    // Adicionar a overlay de loading ao HTML
    let loadingOverlay = document.querySelector('.loading-overlay');
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="spinner"></div>
            <p>Enviando mensagem...</p>
        `;
        formContainer.appendChild(loadingOverlay);
    }
    
    // Adicionar mensagem de sucesso ao HTML
    let successMessage = document.querySelector('.success-message');
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4BABFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3>Mensagem Enviada!</h3>
            <p>Obrigado pelo seu contato. Retornaremos em breve.</p>
            <button id="newMessageBtn" class="btn-primary">Enviar Nova Mensagem</button>
        `;
        formContainer.appendChild(successMessage);
    }
    
    // Adicionar mensagem de erro ao HTML
    let errorMessage = document.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF4B4B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>Erro ao Enviar</h3>
            <p>Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.</p>
            <button id="tryAgainBtn" class="btn-primary">Tentar Novamente</button>
        `;
        formContainer.appendChild(errorMessage);
    }
    
    // Adicionar event listener para o formulário
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const company = document.getElementById('company');
        const message = document.getElementById('message');

        // Validar inputs
        if (checkInputs()) {
            // Mostrar overlay de loading (alterar visibilidade em vez de criar)
            loadingOverlay.style.display = 'flex';
            
            const urlWebhook = 'http://host.docker.internal:5678/webhook/sla';        
            const dados = {
                username: username.value,
                email: email.value,
                phone: phone.value,
                company: company.value,
                message: message.value
            };

            // Adicionar atraso mínimo para garantir que o loading seja exibido
            const startTime = new Date().getTime();
            
            // Enviar dados para webhook
            enviarWebhook(urlWebhook, dados)
                .then(response => {
                    // Calcular quanto tempo se passou desde o início
                    const endTime = new Date().getTime();
                    const elapsedTime = endTime - startTime;
                    
                    // Se passou menos de 1 segundo, aguardar para mostrar o loading
                    const remainingTime = Math.max(0, 1000 - elapsedTime);
                    
                    setTimeout(() => {
                        // Esconder loading e mostrar mensagem de sucesso
                        loadingOverlay.style.display = 'none';
                        form.style.display = 'none';
                        errorMessage.style.display = 'none';
                        successMessage.style.display = 'flex';
                        
                        // Resetar campos do formulário
                        form.reset();
                        
                        // Limpar classes de validação
                        const formGroups = form.querySelectorAll('.form-group');
                        formGroups.forEach(group => {
                            group.className = 'form-group';
                        });
                    }, remainingTime);
                })
                .catch(error => {
                    // Calcular quanto tempo se passou desde o início
                    const endTime = new Date().getTime();
                    const elapsedTime = endTime - startTime;
                    
                    // Se passou menos de 1 segundo, aguardar para mostrar o loading
                    const remainingTime = Math.max(0, 1000 - elapsedTime);
                    
                    setTimeout(() => {
                        // Esconder loading e mostrar mensagem de erro
                        loadingOverlay.style.display = 'none';
                        form.style.display = 'none';
                        successMessage.style.display = 'none';
                        errorMessage.style.display = 'flex';
                        
                        console.error('Erro durante a solicitação:', error);
                    }, remainingTime);
                });
        }
    });
    
    // Adicionar event listeners para os botões de "nova mensagem" e "tentar novamente"
    document.addEventListener('click', function(event) {
        // Botão de nova mensagem após sucesso
        if (event.target && event.target.id === 'newMessageBtn') {
            successMessage.style.display = 'none';
            form.style.display = 'block';
        }
        
        // Botão de tentar novamente após erro
        if (event.target && event.target.id === 'tryAgainBtn') {
            errorMessage.style.display = 'none';
            form.style.display = 'block';
        }
    });

    function checkInputs() {
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const company = document.getElementById('company');
        const message = document.getElementById('message');

        const usernameValue = username.value.trim();
        const emailValue = email.value.trim();
        const phoneValue = phone.value.trim();
        const companyValue = company.value.trim();
        const messageValue = message.value.trim();
        
        let isValid = true;

        if (usernameValue === '') {
            setError(username, 'Nome é obrigatório');
            isValid = false;
        } else {
            setSuccess(username);
        }

        if (emailValue === '') {
            setError(email, 'Email é obrigatório');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            setError(email, 'Por favor, insira um email válido');
            isValid = false;
        } else {
            setSuccess(email);
        }
        
        if (phoneValue === '') {
            setError(phone, 'Telefone é obrigatório');
            isValid = false;
        } else if (!isValidPhone(phoneValue)) {
            setError(phone, 'Por favor, insira um telefone válido');
            isValid = false;
        } else {
            setSuccess(phone);
        }

        if (companyValue === '') {
            setError(company, 'Empresa é obrigatória');
            isValid = false;
        } else {
            setSuccess(company);
        }

        if (messageValue === '') {
            setError(message, 'Mensagem é obrigatória');
            isValid = false;
        } else {
            setSuccess(message);
        }

        return isValid;
    }

    function setError(input, message) {
        const formGroup = input.parentElement;
        const small = formGroup.querySelector('small');

        // Adiciona mensagem de erro
        small.innerText = message;

        // Adiciona classe de erro
        formGroup.className = 'form-group error';
    }

    function setSuccess(input) {
        const formGroup = input.parentElement;

        // Adiciona classe de sucesso
        formGroup.className = 'form-group success';
    }

    function isValidEmail(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }
    
    function isValidPhone(phone) {
        // Aceita formatos: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX ou XX XXXXX-XXXX ou XXXXXXXXXXX
        return /^(\(\d{2}\)\s?)?\d{4,5}-?\d{4}$|^\d{10,11}$/.test(phone);
    }

    async function enviarWebhook(url, data) {
        try {
            console.log('Tentando enviar dados para webhook:', url);
            console.log('Dados a serem enviados:', data);
            
            const resposta = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            console.log('Resposta recebida do servidor, status:', resposta.status);
            
            // Mesmo que o status não seja 200, vamos tentar processar a resposta
            try {
                const dadosResposta = await resposta.json();
                console.log('Resposta do webhook:', dadosResposta);
                return dadosResposta;
            } catch (jsonError) {
                console.log('Não foi possível obter JSON da resposta, mas o envio foi concluído');
                // Retornamos um objeto simples para indicar sucesso
                return { success: true };
            }
        } catch (erro) {
            console.error('Erro durante a solicitação:', erro);
            throw erro;
        }
    }
});