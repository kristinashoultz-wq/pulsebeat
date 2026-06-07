// Redirect to chat if already signed in
async function requireGuest() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) window.location.href = 'chat.html';
}

// Redirect to signin if not signed in
async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) window.location.href = 'signin.html';
  return session;
}

// Sign in
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { data };
}

// Sign up
async function signUp(name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: name } }
  });
  if (error) return { error: error.message };
  return { data };
}

// Sign out
async function signOut() {
  await supabase.auth.signOut();
  window.location.href = 'signin.html';
}
