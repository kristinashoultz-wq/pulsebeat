// Load settings from localStorage and apply them
function loadSettings() {
  const theme = localStorage.getItem('pb_theme') || 'dark';
  const colorIncoming = localStorage.getItem('pb_color_incoming') || '#00b4a6';
  const colorOutgoing = localStorage.getItem('pb_color_outgoing') || '#1c6b65';
  const ping1 = localStorage.getItem('pb_ping1') || 'Response 1';
  const ping2 = localStorage.getItem('pb_ping2') || 'Response 2';
  const ping3 = localStorage.getItem('pb_ping3') || 'Response 3';

  // Apply theme
  document.documentElement.setAttribute('data-theme', theme);

  // Apply bubble colors
  document.documentElement.style.setProperty('--bubble-incoming', colorIncoming);
  document.documentElement.style.setProperty('--bubble-outgoing', colorOutgoing);

  // Apply ping back labels if buttons exist
  const p1 = document.getElementById('ping-1');
  const p2 = document.getElementById('ping-2');
  const p3 = document.getElementById('ping-3');
  if (p1) p1.textContent = ping1;
  if (p2) p2.textContent = ping2;
  if (p3) p3.textContent = ping3;
}

// Save settings to localStorage
function saveSettings() {
  const theme = document.querySelector('input[name="theme"]:checked')?.value || 'dark';
  const colorIncoming = document.getElementById('color-incoming')?.value || '#00b4a6';
  const colorOutgoing = document.getElementById('color-outgoing')?.value || '#1c6b65';
  const ping1 = document.getElementById('ping-1-input')?.value || 'Response 1';
  const ping2 = document.getElementById('ping-2-input')?.value || 'Response 2';
  const ping3 = document.getElementById('ping-3-input')?.value || 'Response 3';

  localStorage.setItem('pb_theme', theme);
  localStorage.setItem('pb_color_incoming', colorIncoming);
  localStorage.setItem('pb_color_outgoing', colorOutgoing);
  localStorage.setItem('pb_ping1', ping1);
  localStorage.setItem('pb_ping2', ping2);
  localStorage.setItem('pb_ping3', ping3);
}

loadSettings();
