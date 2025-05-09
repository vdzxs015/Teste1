// Function to change the active funnel step
function changeStep(element) {
    // Get all step buttons
    const stepButtons = document.querySelectorAll('[data-step]');
    
    // Reset all buttons to inactive state
    stepButtons.forEach(button => {
        button.classList.remove('bg-blue', 'text-white');
        button.classList.add('bg-gray-200', 'text-gray-600');
    });
    
    // Set clicked button to active state
    element.classList.remove('bg-gray-200', 'text-gray-600');
    element.classList.add('bg-blue', 'text-white');
    
    // Get data attributes
    const step = element.getAttribute('data-step');
    const name = element.getAttribute('data-name');
    const description = element.getAttribute('data-description');
    const color = element.getAttribute('data-color');
    
    // Update the title and description
    document.getElementById('step-title').textContent = name;
    document.getElementById('step-title').style.color = color;
    document.getElementById('step-description').textContent = description;
    
    // Update funnel visualization
    for (let i = 1; i <= 4; i++) {
        const funnelStep = document.getElementById(`funnel-step-${i}`);
        const stepColors = ['#002d3c', '#0d4152', '#1b5668', '#286b7e']; // Updated to blue tones
        
        if (i <= step) {
            funnelStep.setAttribute('fill', stepColors[i-1]);
            funnelStep.setAttribute('opacity', '1');
        } else {
            funnelStep.setAttribute('fill', '#D4D4D4');
            funnelStep.setAttribute('opacity', '0.3');
        }
    }
}