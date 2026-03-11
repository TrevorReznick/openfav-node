#!/usr/bin/env node

/**
 * Script per creare sessione completa che il frontend può usare
 */

console.log('🔧 Creazione sessione completa per frontend...\n');

// 1. Crea sessione su Redis
const sessionResponse = await fetch('https://openfav-node.fly.dev/api/set-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    session: {
      id: '9446217e-49e8-49f9-84dc-822ed8df969b',
      email: 'joseph.k@openfav.mock',
      fullName: 'Joseph K.',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isAuthenticated: true,
      provider: 'production',
      tokens: {
        accessToken: 'prod-access-token-123',
        refreshToken: 'prod-refresh-token-456',
        expiresAt: 0
      }
    }
  })
});

const sessionResult = await sessionResponse.json();
console.log('✅ Sessione creata:', sessionResult);

// 2. Verifica sessione
const verifyResponse = await fetch('https://openfav-node.fly.dev/api/session/9446217e-49e8-49f9-84dc-822ed8df969b');
const verifyResult = await verifyResponse.json();
console.log('✅ Sessione verificata:', verifyResult.isAuthenticated);

console.log('\n🎯 Istruzioni per il frontend:');
console.log('1. Assicurati che localStorage contenga: openfav-userId = 9446217e-49e8-49f9-84dc-822ed8df969b');
console.log('2. Il frontend ora potrà recuperare la sessione da Redis');
console.log('3. Le pagine AI verranno generate con il contesto utente corretto');

console.log('\n✨ Sessione completa pronta!');
