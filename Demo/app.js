// Constants
const STORAGE_KEY = 'complaints_data';

// Helper: Get data from localStorage
function getComplaints() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Helper: Save data to localStorage
function saveComplaint(complaint) {
    const complaints = getComplaints();
    // Add new complaint to the beginning of the array
    complaints.unshift(complaint);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

// Format Date
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// --- Logic for index.html (Listing Complaints) ---
function renderComplaints() {
    const container = document.getElementById('complaints-list');
    const emptyState = document.getElementById('empty-state');
    
    // Only run if we are on the homepage
    if (!container) return;

    const complaints = getComplaints();

    if (complaints.length === 0) {
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    container.classList.remove('hidden');
    emptyState.classList.add('hidden');
    container.innerHTML = '';

    complaints.forEach(complaint => {
        const card = document.createElement('div');
        card.className = 'complaint-card';
        
        // Icons for UI
        const cityIcon = `<svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`;
        const phoneIcon = `<svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>`;

        card.innerHTML = `
            <div class="card-header">
                <div class="complaint-author">${escapeHTML(complaint.name)}</div>
                <div class="complaint-date">${formatDate(complaint.timestamp)}</div>
            </div>
            <div class="complaint-meta">
                <div class="meta-item">
                    ${cityIcon} ${escapeHTML(complaint.city)}
                </div>
                <div class="meta-item">
                    ${phoneIcon} ${escapeHTML(complaint.mobile)}
                </div>
            </div>
            <div class="complaint-body">${escapeHTML(complaint.complaintText)}</div>
        `;
        
        container.appendChild(card);
    });
}

// --- Logic for add-complaint.html (Submitting Form) ---
function handleFormSubmit() {
    const form = document.getElementById('complaint-form');
    const successMessage = document.getElementById('success-message');
    
    // Only run if we are on the form page
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get values
        const name = document.getElementById('name').value.trim();
        const city = document.getElementById('city').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const complaintText = document.getElementById('complaint').value.trim();

        // Basic validation (though HTML5 'required' handles most of it)
        if (!name || !city || !mobile || !complaintText) return;

        // Create complaint object
        const newComplaint = {
            id: Date.now().toString(),
            name,
            city,
            mobile,
            complaintText,
            timestamp: new Date().toISOString()
        };

        // Save to local storage
        saveComplaint(newComplaint);

        // Show success state
        successMessage.classList.remove('hidden');
        
        // Redirect after a short delay to show the success message
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// Initialize based on which page is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderComplaints();
    handleFormSubmit();
});
