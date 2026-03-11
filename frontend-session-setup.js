// Script da eseguire nella console del browser per impostare sessione utente
// Copia e incolla questo codice nella console del frontend

console.log('🔧 Impostazione sessione utente per frontend...');

// 1. Imposta l'userId nel localStorage
localStorage.setItem('openfav-userId', '9446217e-49e8-49f9-84dc-822ed8df969b');
localStorage.setItem('demo-user-id', '9446217e-49e8-49f9-84dc-822ed8df969b');

// 2. Pulisci eventuali dati mock residui
localStorage.removeItem('supabase.auth.token');

console.log('✅ localStorage impostato:');
console.log('   openfav-userId:', localStorage.getItem('openfav-userId'));
console.log('   demo-user-id:', localStorage.getItem('demo-user-id'));

// 3. Ricarica la pagina per applicare le modifiche
console.log('🔄 Ricarica la pagina per applicare le modifiche...');
// window.location.reload();

console.log('\n🎯 Ora il frontend potrà:');
console.log('   ✅ Recuperare la sessione da Redis');
console.log('   ✅ Generare pagine AI con contesto utente');
console.log('   ✅ Salvare pagine con userId corretto');

console.log('\n✨ Sessione frontend pronta!');
