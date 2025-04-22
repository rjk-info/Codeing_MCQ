// Temporary solution using localStorage instead of Firebase
// This will allow you to continue working on your app while you set up Firebase later

// Mock Firebase auth functions
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      auth.currentUser = JSON.parse(currentUser);
      callback(auth.currentUser);
    } else {
      callback(null);
    }
    return () => {}; // Return unsubscribe function
  },
  signOut: () => {
    localStorage.removeItem('currentUser');
    auth.currentUser = null;
    return Promise.resolve();
  },
  _getRecaptchaConfig: () => {
    return Promise.resolve(null);
  }
};

// Mock Firestore functions
export const db = {
  collection: (collectionName) => ({
    doc: (docId) => ({
      get: () => {
        const data = localStorage.getItem(`${collectionName}_${docId}`);
        return Promise.resolve({
          exists: !!data,
          data: () => data ? JSON.parse(data) : null
        });
      },
      set: (data) => {
        localStorage.setItem(`${collectionName}_${docId}`, JSON.stringify(data));
        return Promise.resolve();
      }
    })
  })
};

// Mock Firebase auth functions
export const createUserWithEmailAndPassword = (auth, email, password) => {
  return new Promise((resolve, reject) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === email)) {
      reject({ code: 'auth/email-already-in-use', message: 'Email already exists' });
      return;
    }
    
    const uid = 'user_' + Date.now();
    const user = {
      uid,
      email,
      username: email.split('@')[0] // Use email username as default username
    };
    
    users.push({ ...user, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    auth.currentUser = user;
    resolve({ user });
  });
};

export const signInWithEmailAndPassword = (auth, email, password) => {
  return new Promise((resolve, reject) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      auth.currentUser = userWithoutPassword;
      resolve({ user: userWithoutPassword });
    } else {
      reject({ code: 'auth/wrong-password', message: 'Invalid email or password' });
    }
  });
};

// Mock Firestore functions
export const doc = (db, path) => path;
export const getDoc = (docRef) => {
  const data = localStorage.getItem(docRef);
  return Promise.resolve({
    exists: () => !!data,
    data: () => data ? JSON.parse(data) : null
  });
};
export const setDoc = (docRef, data) => {
  localStorage.setItem(docRef, JSON.stringify(data));
  return Promise.resolve();
}; 