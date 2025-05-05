document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const company = document.getElementById('company');
        const message = document.getElementById('message');

        checkInputs();

        const urlWebhook = 'http://host.docker.internal:5678/webhook-test/sla';        
        const dados = {
            username: username.value,
            email: email.value,
            company: company.value,
            message: message.value
        };

        enviarWebhook(urlWebhook, dados);
    });

    function checkInputs() {
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const company = document.getElementById('company');
        const message = document.getElementById('message');

        const usernameValue = username.value.trim();
        const emailValue = email.value.trim();
        const companyValue = company.value.trim();
        const messageValue = message.value.trim();

        if (usernameValue === '') {
            setError(username, 'Nome é obrigatório');
        } else {
            setSuccess(username);
        }

        if (emailValue === '') {
            setError(email, 'Email é obrigatório');
        } else if (!isValidEmail(emailValue)) {
            setError(email, 'Por favor, insira um email válido');
        } else {
            setSuccess(email);
        }

        if (companyValue === '') {
            setError(company, 'Empresa é obrigatória');
        } else {
            setSuccess(company);
        }

        if (messageValue === '') {
            setError(message, 'Mensagem é obrigatória');
        } else {
            setSuccess(message);
        }

        const formGroups = form.querySelectorAll('.form-group');

        const formIsValid = [...formGroups].every((formGroup) => {
            return formGroup.className === 'form-group success';
        });

        if (formIsValid) {
            console.log('Formulário enviado com sucesso!');
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

        function LimparCampos() {
            username.value = '';
            email.value = '';
            company.value = '';
            message.value = '';
        };
    }

    async function enviarWebhook(url, data) {
        try {
            const resposta = await fetch(url, {
                method: 'POST', // Make sure this is specified as POST
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (resposta.ok) {
                console.log('Webhook enviado com sucesso!');
                const dadosResposta = await resposta.json();
                console.log('Resposta do n8n:', dadosResposta);
            } else {
                console.error(`Erro ao enviar webhook: ${resposta.status} - ${resposta.statusText}`);
            }
        } catch (erro) {
            console.error('Erro durante a solicitação:', erro);
        }
    }
});