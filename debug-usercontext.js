// Debug immediato di UserContext
// Esegui nella console del browser su http://localhost:4321

console.log('🧪 Debug UserContext - Step by Step\n');

// 1. Verifica localStorage
console.log('1️⃣ localStorage attuale:');
console.log('   openfav-userId:', localStorage.getItem('openfav-userId'));
console.log('   demo-user-id:', localStorage.getItem('demo-user-id'));
console.log('   userId:', localStorage.getItem('userId'));

// 2. Verifica document.cookie
console.log('2️⃣ document.cookie attuale:');
console.log('   ', document.cookie);

// 3. Simula UserContext.getUserIdFromStorage()
const safeLocalStorageGet = (key) => {
    try { 
        return localStorage.getItem(key); 
    } catch { 
        return null; 
    }
};

const testUserId = safeLocalStorageGet('openfav-userId');
console.log('3️⃣ Test getUserIdFromStorage():');
console.log('   Risultato:', testUserId);

// 4. Simula UserContext.getCurrentUserId()
const mockContext = {}; // Simula context vuoto
const effectiveUserId = testUserId || null;

console.log('4️⃣ Test getCurrentUserId():');
console.log('   effectiveUserId:', effectiveUserId);
console.log('   typeof effectiveUserId:', typeof effectiveUserId);
console.log('   Boolean(effectiveUserId):', Boolean(effectiveUserId));

// 5. Test finale
if (effectiveUserId) {
    console.log('✅ UserContext TROVEREBBEbbe la sessione!');
} else {
    console.log('❌ UserContext NON TROVEREBBEbbe la sessione!');
    console.log('   Questo è il problema da risolvere!');
}

console.log('\n🎯 Se vedi "NON TROVEREBBE", il problema è:');
console.log('   - UserContext non legge correttamente dal localStorage');
console.log('   - Oppure c\'è un problema con la logica di fallback');

console.log('\n✨ Debug completato!');
