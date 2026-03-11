// Script per forzare impostazione sessione utente nel frontend
// Esegui nella console del browser su http://localhost:4321

console.log('🔧 Forzando sessione utente nel frontend...\n');

// 1. Pulisci tutto
localStorage.clear();
sessionStorage.clear();

console.log('🗑️ Storage pulito');

// 2. Imposta userId in tutti i modi possibili
localStorage.setItem('openfav-userId', '9446217e-49e8-49f9-84dc-822ed8df969b');
localStorage.setItem('demo-user-id', '9446217e-49e8-49f9-84dc-822ed8df969b');
localStorage.setItem('userId', '9446217e-49e8-49f9-84dc-822ed8df969b');

// 3. Imposta anche cookie via document (fallback)
document.cookie = 'openfav-userId=9446217e-49e8-49f9-84dc-822ed8df969b; path=/; SameSite=Lax';

console.log('✅ userId impostato in tutti gli storage:');
console.log('   localStorage:', localStorage.getItem('openfav-userId'));
console.log('   demo-user-id:', localStorage.getItem('demo-user-id'));
console.log('   userId:', localStorage.getItem('userId'));
console.log('   document.cookie:', document.cookie);

// 4. Test recupero UserContext
console.log('\n🧪 Test recupero UserContext...');

// Simula la logica di UserContext
const testUserId = localStorage.getItem('openfav-userId');
if (testUserId) {
  console.log('✅ UserContext troverebbe userId:', testUserId);
} else {
  console.log('❌ UserContext NON troverebbe userId');
}

// 5. Ricarica pagina per applicare tutto
console.log('\n🔄 Ricarica pagina tra 2 secondi...');
setTimeout(() => {
  console.log('🔄 Ricarico ora...');
  window.location.reload();
}, 2000);

console.log('\n✨ Sessione forzata con successo!');
