#!/usr/bin/env node

/**
 * Test parsing indice pagine
 */

const testIndex = '["final-test-page-456"]';

console.log('🧪 Test Parsing Indice\n');

console.log('1️⃣ Indice originale:', testIndex);
console.log('   Type:', typeof testIndex);

// Test metodo 1: JSON.parse diretto
try {
  const parsed1 = JSON.parse(testIndex);
  console.log('2️⃣ JSON.parse diretto:', parsed1);
  console.log('   Type:', Array.isArray(parsed1) ? 'array' : typeof parsed1);
} catch (e) {
  console.log('2️⃣ ❌ JSON.parse fallito:', e.message);
}

// Test metodo 2: Rimozione quotes
try {
  const cleaned = testIndex.replace(/['\[\]]/g, '').trim();
  console.log('3️⃣ Indice pulito:', cleaned);
  console.log('   Type:', typeof cleaned);
  
  if (cleaned.includes(',')) {
    const parsed2 = cleaned.split(',').map(id => id.trim());
    console.log('4️⃣ Split per virgola:', parsed2);
  } else if (cleaned) {
    console.log('4️⃣ Single value:', [cleaned]);
  }
} catch (e) {
  console.log('4️⃣ ❌ Pulizia fallita:', e.message);
}

console.log('\n✅ Test completato!');
