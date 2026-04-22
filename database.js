/* Database Functions with Supabase */

// Fetch all records from a table
async function fetchFromTable(tableName) {
  try {
    const { data, error } = await window.supabaseClient
      .from(tableName)
      .select('*');
    
    if (error) throw error;
    console.log(`Fetched from ${tableName}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`Fetch error from ${tableName}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Insert a record into a table
async function insertIntoTable(tableName, record) {
  try {
    const { data, error } = await window.supabaseClient
      .from(tableName)
      .insert([record])
      .select();
    
    if (error) throw error;
    console.log(`Inserted into ${tableName}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`Insert error in ${tableName}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Update a record in a table
async function updateTable(tableName, id, updates) {
  try {
    const { data, error } = await window.supabaseClient
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    console.log(`Updated in ${tableName}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`Update error in ${tableName}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Delete a record from a table
async function deleteFromTable(tableName, id) {
  try {
    const { data, error } = await window.supabaseClient
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    console.log(`Deleted from ${tableName}`);
    return { success: true };
  } catch (error) {
    console.error(`Delete error in ${tableName}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Fetch with condition
async function fetchWithWhere(tableName, column, value) {
  try {
    const { data, error } = await window.supabaseClient
      .from(tableName)
      .select('*')
      .eq(column, value);
    
    if (error) throw error;
    console.log(`Fetched from ${tableName} where ${column}=${value}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`Fetch error:`, error.message);
    return { success: false, error: error.message };
  }
}
