document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
});

async function loadPosts() {
    try {
        const response = await fetch('/api/posts');
        
        if (!response.ok) {
            throw new Error('Chyba při načítání článků');
        }
        
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Error:', error);
        displayError('Nepodařilo se načíst články z databáze');
    }
}

function displayPosts(posts) {
    const container = document.getElementById('posts-container');
    
    if (posts.length === 0) {
        container.innerHTML = '<div class="post">Žádné články k zobrazení</div>';
        return;
    }
    
    // Seřadit články od nejnovějšího
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = posts.map(post => `
        <div class="post">
            <div class="post-meta">
                <span class="author">${escapeHtml(post.author || 'Redakce iDnes')}</span>
                <span class="date">${formatDate(post.date)}</span>
                <span class="category">${escapeHtml(post.category || 'zprávy')}</span>
            </div>
            
            <h2>${escapeHtml(post.title || 'Bez názvu')}</h2>
            
            <div class="content">${escapeHtml(post.content || 'Žádný obsah')}</div>
            
            <div class="post-stats">
                <span>👁️ ${post.views || 0} zhlédnutí</span>
                <span>💬 ${post.comments || 0} komentářů</span>
            </div>
            
            ${post.tags && post.tags.length > 0 ? `
                <div class="tags">
                    ${post.tags.map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function displayError(message) {
    const container = document.getElementById('posts-container');
    container.innerHTML = `<div class="error">${message}</div>`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
