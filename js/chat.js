const messageList = document.getElementById('message-list');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message');
let currentSession = null;

function renderMessage(content, direction) {
  const article = document.createElement('article');
  article.className = `message ${direction}`;
  const p = document.createElement('p');
  p.textContent = content;
  article.appendChild(p);
  messageList.appendChild(article);
  messageList.scrollTop = messageList.scrollHeight;
}

async function loadMessages(userId) {
  const { data, error } = await sbClient
    .from('Messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error || !data) return;
  data.forEach(msg => renderMessage(msg.content, msg.direction));
}

async function sendMessage(content) {
  renderMessage(content, 'outgoing');

  const { error } = await sbClient.from('Messages').insert({
    user_id: currentSession.user.id,
    content,
    direction: 'outgoing'
  });

  if (error) console.error('Message save failed:', error.message);
  messageInput.value = '';
}

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = messageInput.value.trim();
  if (!content) return;
  sendMessage(content);
});

// Ping back buttons
document.getElementById('ping-1').addEventListener('click', () => {
  const label = localStorage.getItem('pb_ping1') || 'Response 1';
  sendMessage(`[${label}]`);
});
document.getElementById('ping-2').addEventListener('click', () => {
  const label = localStorage.getItem('pb_ping2') || 'Response 2';
  sendMessage(`[${label}]`);
});
document.getElementById('ping-3').addEventListener('click', () => {
  const label = localStorage.getItem('pb_ping3') || 'Response 3';
  sendMessage(`[${label}]`);
});

function subscribeToMessages(userId) {
  sbClient
    .channel('messages')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'Messages'
    }, (payload) => {
      if (payload.new.user_id === userId && payload.new.direction === 'incoming') {
        renderMessage(payload.new.content, 'incoming');
      }
    })
    .subscribe();
}

// Init
(async () => {
  const session = await requireAuth();
  currentSession = session;

  const isPaid = localStorage.getItem('pb_paid') === 'true';
  if (isPaid) await loadMessages(session.user.id);

  subscribeToMessages(session.user.id);
})();
