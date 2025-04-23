// Função para alternar o menu móvel
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');
const header = document.getElementById('main-header');
const navLinks = document.querySelectorAll('#mobile-menu a');

let isOpen = false;

function toggleMenu() {
    isOpen = !isOpen;
    
    if (isOpen) {
        mobileMenu.classList.add('open');
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        mobileMenu.classList.remove('open');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}

menuToggle.addEventListener('click', toggleMenu);

// Fechar o menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// Alterar o estilo do header ao rolar a página
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.remove('bg-transparent');
        header.classList.add('bg-darkBrown', 'bg-opacity-95', 'shadow-md');
        
        // Alterar a cor dos links de navegação desktop
        const desktopLinks = document.querySelectorAll('nav.md\\:flex a');
        desktopLinks.forEach(link => {
            link.classList.remove('text-darkBrown');
            link.classList.add('text-snowWhite');
        });
    } else {
        header.classList.add('bg-transparent');
        header.classList.remove('bg-darkBrown', 'bg-opacity-95', 'shadow-md');
        
        // Restaurar a cor dos links de navegação desktop
        const desktopLinks = document.querySelectorAll('nav.md\\:flex a');
        desktopLinks.forEach(link => {
            link.classList.add('text-darkBrown');
            link.classList.remove('text-snowWhite');
        });
    }
}

window.addEventListener('scroll', handleScroll);

// Executar uma vez para definir o estado inicial correto
handleScroll();