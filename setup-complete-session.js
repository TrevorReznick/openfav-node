#!/usr/bin/env node

/**
 * Script per creare sessione locale funzionante
 */

console.log('🔧 Creazione sessione locale per frontend...\n');

// 1. Crea sessione su Redis produzione
const sessionData = {
  id: '9446217e-49e8-49f9-84dc-822ed8df969b',
  email: 'joseph.k@openfav.mock',
  fullName: 'Joseph K.',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  isAuthenticated: true,
  provider: 'local',
  tokens: {
    accessToken: 'local-access-token-123',
    refreshToken: 'local-refresh-token-456',
    expiresAt: 0
  }
};

// Salva su produzione
const prodResponse = await fetch('https://openfav-node.fly.dev/api/set-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ session: sessionData })
});

const prodResult = await prodResponse.json();
console.log('✅ Sessione produzione:', prodResult);

// 2. Crea anche sessione locale se necessario
try {
  const localResponse = await fetch('http://localhost:4321/api/session/set', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessionData)
  });
  
  if (localResponse.ok) {
    const localResult = await localResponse.json();
    console.log('✅ Sessione locale:', localResult);
  } else {
    console.log('⚠️ Sessione locale non disponibile (ok)');
  }
} catch (e) {
  console.log('⚠️ Server locale non attivo (ok)');
}

console.log('\n🎯 Istruzioni per il frontend:');
console.log('1. Apri http://localhost:4321');
console.log('2. Apri console F12');
console.log('3. Esegui:');
console.log('   localStorage.setItem("openfav-userId", "9446217e-49e8-49f9-84dc-822ed8df969b");');
console.log('4. Ricarica la pagina');
console.log('5. Genera pagina AI');

console.log('\n✨ Sessioni pronte!');
