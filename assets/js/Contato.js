 // Form submission handling
 document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const company = document.getElementById('company').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send the data to your server
    console.log('Form data:', { name, email, company, message });
    
    // Show success message
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    
    // Reset the form
    this.reset();
});