// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Confirm broadcast sending
    const broadcastForm = document.querySelector('.broadcast-form');
    if (broadcastForm) {
        broadcastForm.addEventListener('submit', function(e) {
            const message = document.getElementById('message').value.trim();
            const audience = document.getElementById('target_audience').value;
            
            let audienceText = '';
            switch(audience) {
                case 'all':
                    audienceText = 'всем пользователям';
                    break;
                case 'male':
                    audienceText = 'всем мужчинам';
                    break;
                case 'female':
                    audienceText = 'всем женщинам';
                    break;
                case 'complete':
                    audienceText = 'пользователям с полными профилями';
                    break;
            }
            
            if (!confirm(`Вы уверены, что хотите отправить сообщение ${audienceText}?\n\nТекст: "${message}"`)) {
                e.preventDefault();
            }
        });
    }

    // Character counter for message textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const maxLength = 4096; // Telegram message limit
        const counterElement = document.createElement('div');
        counterElement.className = 'form-text text-end';
        counterElement.innerHTML = `<span id="char-count">0</span>/${maxLength} символов`;
        messageTextarea.parentNode.appendChild(counterElement);
        
        const charCount = document.getElementById('char-count');
        
        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength > maxLength * 0.9) {
                charCount.style.color = '#ff6b6b';
            } else if (currentLength > maxLength * 0.7) {
                charCount.style.color = '#ffa726';
            } else {
                charCount.style.color = '#8b949e';
            }
        });
    }

    // Settings form validation
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            const textareas = this.querySelectorAll('textarea');
            let hasEmptyFields = false;
            
            textareas.forEach(textarea => {
                if (!textarea.value.trim()) {
                    hasEmptyFields = true;
                    textarea.style.borderColor = '#da3633';
                } else {
                    textarea.style.borderColor = '#30363d';
                }
            });
            
            if (hasEmptyFields) {
                e.preventDefault();
                alert('Пожалуйста, заполните все поля настроек!');
            }
        });
    }

    // Search functionality enhancement
    const searchInput = document.querySelector('input[name="search"]');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            // Add loading state
            this.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%23666\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\'/%3E%3Cpath d=\'M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z\'/%3E%3C/svg%3E")';
            this.style.backgroundRepeat = 'no-repeat';
            this.style.backgroundPosition = 'right 12px center';
            
            // Clear loading state after timeout
            searchTimeout = setTimeout(() => {
                this.style.backgroundImage = 'none';
            }, 1000);
        });
    }

    // Table row hover effects
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#21262d';
            this.style.transform = 'scale(1.01)';
            this.style.transition = 'all 0.2s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.transform = '';
        });
    });

    // Sidebar collapse for mobile
    const sidebarToggle = document.createElement('button');
    sidebarToggle.className = 'btn btn-outline-secondary d-md-none position-fixed';
    sidebarToggle.style.top = '1rem';
    sidebarToggle.style.left = '1rem';
    sidebarToggle.style.zIndex = '1001';
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    document.body.appendChild(sidebarToggle);
    
    sidebarToggle.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('show');
    });

    // Live statistics update (placeholder for future WebSocket implementation)
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add pulse animation
            this.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
});

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .sidebar.show {
        transform: translateX(0);
    }
    
    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }
    }
`;
document.head.appendChild(style);
