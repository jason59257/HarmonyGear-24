// Modal Component for Admin Panel

// Create and show modal
function showModal(options) {
    const {
        title,
        content,
        onSubmit,
        onCancel,
        submitText = 'Save',
        cancelText = 'Cancel',
        size = 'medium'
    } = options;

    // Remove existing modal if any
    const existingModal = document.getElementById('adminModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'adminModal';
    overlay.className = 'admin-modal-overlay';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = `admin-modal admin-modal-${size}`;
    
    // Modal header
    const header = document.createElement('div');
    header.className = 'admin-modal-header';
    header.innerHTML = `
        <h2>${title}</h2>
        <button class="admin-modal-close" onclick="closeModal()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    `;
    
    // Modal body
    const body = document.createElement('div');
    body.className = 'admin-modal-body';
    body.innerHTML = content;
    
    // Modal footer
    const footer = document.createElement('div');
    footer.className = 'admin-modal-footer';
    footer.innerHTML = `
        <button class="admin-btn" onclick="closeModal()">${cancelText}</button>
        <button class="admin-btn admin-btn-primary" id="modalSubmitBtn">${submitText}</button>
    `;
    
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Add event listeners
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    const submitBtn = document.getElementById('modalSubmitBtn');
    if (submitBtn && onSubmit) {
        submitBtn.addEventListener('click', function() {
            if (onSubmit()) {
                closeModal();
            }
        });
    }
    
    // Show modal with animation
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Create form field
function createFormField(label, name, type = 'text', value = '', options = {}) {
    const { placeholder = '', required = false, options: selectOptions = [] } = options;
    
    let input = '';
    
    if (type === 'textarea') {
        input = `<textarea name="${name}" id="${name}" placeholder="${placeholder}" ${required ? 'required' : ''} class="admin-form-input">${value}</textarea>`;
    } else if (type === 'select') {
        const optionsHtml = selectOptions.map(opt => {
            const optValue = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const selected = optValue === value ? 'selected' : '';
            return `<option value="${optValue}" ${selected}>${optLabel}</option>`;
        }).join('');
        input = `<select name="${name}" id="${name}" ${required ? 'required' : ''} class="admin-form-input">${optionsHtml}</select>`;
    } else if (type === 'file') {
        input = `<input type="file" name="${name}" id="${name}" ${required ? 'required' : ''} accept="image/*" class="admin-form-input">`;
    } else {
        input = `<input type="${type}" name="${name}" id="${name}" value="${value}" placeholder="${placeholder}" ${required ? 'required' : ''} class="admin-form-input">`;
    }
    
    return `
        <div class="admin-form-group">
            <label for="${name}" class="admin-form-label">${label} ${required ? '<span style="color: var(--admin-danger);">*</span>' : ''}</label>
            ${input}
        </div>
    `;
}

// Get form data
function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return null;
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

// Validate form
function validateForm(formId, rules = {}) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const errors = [];
    
    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            errors.push(`${field.name || field.id} is required`);
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    // Check custom rules
    Object.keys(rules).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            const rule = rules[fieldName];
            if (rule.required && !field.value.trim()) {
                errors.push(`${fieldName} is required`);
                field.classList.add('error');
            } else if (rule.pattern && !rule.pattern.test(field.value)) {
                errors.push(rule.message || `${fieldName} is invalid`);
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        }
    });
    
    if (errors.length > 0) {
        showAdminNotification(errors.join(', '), 'error');
        return false;
    }
    
    return true;
}

// Export functions to global scope
window.showModal = showModal;
window.closeModal = closeModal;
window.createFormField = createFormField;
window.getFormData = getFormData;
window.validateForm = validateForm;
