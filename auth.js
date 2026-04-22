/* Authentication Functions with Supabase */

// Sign up with email, password, and name (saves to profiles table)
async function signUp(email, password, name = '') {
  try {
    if (!window.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }
    
    const { data, error } = await window.supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { name: name }  // Pass name as user metadata
      }
    });
    
    if (error) throw error;
    console.log('Sign up successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Sign up error:', error.message);
    return { success: false, error: error.message };
  }
}

// Login with email and password
async function signIn(email, password) {
  try {
    if (!window.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    if (error) throw error;
    console.log('Sign in successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Sign in error:', error.message);
    return { success: false, error: error.message };
  }
}

// Logout
async function signOut() {
  try {
    if (!window.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }
    const { error } = await window.supabaseClient.auth.signOut();
    
    if (error) throw error;
    console.log('Sign out successful');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error.message);
    return { success: false, error: error.message };
  }
}

// Get current user session + profile
async function getCurrentUser() {
  try {
    if (!window.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }
    const { data: sessionData, error: sessionError } = await window.supabaseClient.auth.getSession();
    
    if (sessionError) throw sessionError;
    
    const { data: profileData, error: profileError } = await window.supabaseClient
      .from('profiles')
      .select('name')
      .eq('id', sessionData.session?.user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') throw profileError;  // Ignore no rows
    
    return { 
      success: true, 
      user: sessionData.session?.user,
      profile: profileData
    };
  } catch (error) {
    console.error('Get user error:', error.message);
    return { success: false, error: error.message };
  }
}

// Listen to auth state changes
function onAuthStateChange(callback) {
  if (!window.supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }
  return window.supabaseClient.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

