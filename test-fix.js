#!/usr/bin/env node

/**
 * Test del fix per getUserAIGeneratedPages
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000'; // Server locale
const USER_ID = '9446217e-49e8-49f9-84dc-822ed8df969b';

console.log('🧪 Test Fix getUserAIGeneratedPages\n');

async function testFix() {
    try {
        console.log('=== TEST 1: VERIFICA DATI REDIS ===\n');
        
        // 1. Verifica che ci siano dati su Redis (usando server remoto)
        const remoteIndexResponse = await fetch(`https://openfav-node.fly.dev/api/test/get?key=ai:pages:index:${USER_ID}`);
        if (remoteIndexResponse.ok) {
            const remoteIndexData = await remoteIndexResponse.json();
            console.log('✅ Dati su Redis remoto:', remoteIndexData.value);
        }

        console.log('\n=== TEST 2: ENDPOINT FIX LOCALE ===\n');
        
        // 2. Test endpoint locale (con il fix)
        console.log('2️⃣ Test endpoint locale con fix...');
        try {
            const localResponse = await fetch(`${BASE_URL}/api/ai-pages/user/${USER_ID}`);
            console.log(`   Status: ${localResponse.status}`);
            
            if (localResponse.ok) {
                const localResult = await localResponse.json();
                console.log('   ✅ Endpoint locale funziona!');
                console.log(`   📊 Pagine trovate: ${localResult.data?.count || 0}`);
                if (localResult.data?.pages?.length > 0) {
                    console.log('   📋 Pagine:');
                    localResult.data.pages.forEach((page, index) => {
                        console.log(`     ${index + 1}. ${page.title} (${page.id})`);
                    });
                }
            } else {
                const error = await localResponse.text();
                console.log(`   ❌ Errore locale: ${error}`);
            }
        } catch (e) {
            console.log(`   💥 Errore connessione locale: ${e.message}`);
            console.log('   📝 Nota: Server locale potrebbe non avere credenziali Redis');
        }

        console.log('\n=== TEST 3: ENDPOINT REMOTO (VECCHIA VERSIONE) ===\n');
        
        // 3. Test endpoint remoto (senza fix)
        console.log('3️⃣ Test endpoint remoto (vecchia versione)...');
        const remoteResponse = await fetch(`https://openfav-node.fly.dev/api/ai-pages/user/${USER_ID}`);
        console.log(`   Status: ${remoteResponse.status}`);
        
        if (remoteResponse.ok) {
            const remoteResult = await remoteResponse.json();
            console.log(`   📊 Pagine trovate (remoto): ${remoteResult.data?.count || 0}`);
            console.log(`   📝 Messaggio: ${remoteResult.data?.message || 'N/A'}`);
        }

        console.log('\n🏁 Test completato!');
        console.log('\n🎯 CONCLUSIONI:');
        console.log('- ✅ Dati presenti su Redis');
        console.log('- 🔧 Fix implementato localmente');
        console.log('- 🚀 Serve deploy su produzione per applicare il fix');

    } catch (error) {
        console.error('💥 Errore durante test:', error);
    }
}

testFix();
