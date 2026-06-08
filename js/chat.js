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

let lastMessageTime = new Date().toISOString();

async function pollIncoming(userId) {
  const { data } = await sbClient
    .from('Messages')
    .select('*')
    .eq('user_id', userId)
    .eq('direction', 'incoming')
    .gt('created_at', lastMessageTime)
    .order('created_at', { ascending: true });

  if (data && data.length > 0) {
    data.forEach(msg => renderMessage(msg.content, 'incoming'));
    lastMessageTime = data[data.length - 1].created_at;
    if ('vibrate' in navigator) {
      const last = data[data.length - 1].content || '';
      navigator.vibrate(getSenderPattern(last));
    }
  }
}

function getSenderPattern(content) {
  const c = content.toLowerCase();
  if (c.startsWith('[sage]') || c.includes('sage'))   return [150, 100, 150, 100, 400]; // two short, one long
  if (c.startsWith('[lumen]') || c.includes('lumen')) return [400, 500];                // one long, silence
  if (c.startsWith('[isaiah]'))                        return [200, 100, 200, 100, 200]; // three even pulses
  if (c.startsWith('[callan]'))                        return [100, 300, 400];           // tap, pause, hold
  return [100, 50, 200]; // generic
}

// Prime vibration on first tap so the poller can fire it from a timer
document.addEventListener('click', () => {
  if ('vibrate' in navigator) navigator.vibrate(0);
}, { once: true });

// Init
(async () => {
  const session = await requireAuth();
  currentSession = session;

  await loadMessages(session.user.id);

  setInterval(() => pollIncoming(session.user.id), 3000);
})();
