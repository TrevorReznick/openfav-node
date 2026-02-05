# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---
## [0.0.4] - 2026-02-05 (Client Compatibility & Type System Enhancement)

### Obiettivo
Implementazione completa compatibilità con tipi complessi del client OpenFav e miglioramento del sistema di tipi.

### Modifiche Principali

#### 🔗 Client Type Compatibility
- **Client-Compatible Types** - Creato `app/types/client-compatible.ts` con tutti i tipi del client
- **UserSession Nullability Support** - Server ora accetta campi nullable (`id: string | null`)
- **Complex Page Structure** - Full support per discovery system pages con policy, features, sections
- **Type Guards Implementation** - Runtime validation per compatibilità tipi
- **Adapter Classes** - `TypeAdapter` per conversione tra formati client/legacy

#### 📡 API Response Standardization
- **ApiResponse<T> Format** - Tutti gli endpoint restituiscono formato consistente
- **JSON Responses** - Sostituito `.send()` con `.json()` per type safety
- **Error Handling** - Standardizzato gestione errori con format unificato
- **Success Indicators** - Campi `success`, `data`, `error`, `id`, `active` consistenti

#### 🧪 Testing & Validation
- **Type Compatibility Suite** - Test completi per validazione compatibilità client-server
- **Runtime Validation** - Type guards per UserSession e Page structures
- **Integration Tests** - Test end-to-end per flussi completi

### Files Modificati

#### ✅ **NEW FILES**
- `app/types/client-compatible.ts` - Tipi compatibili client (UserSession, Page, PagePolicy, etc.)
- `test/type-compatibility.test.ts` - Suite test compatibilità

#### ✅ **UPDATED FILES**
- `app/types/types.ts` - Export tipi client + mantenimento legacy types
- `app/controllers/upstash_redis.ts` - Response standard e supporto tipi client

### API Endpoints Aggiornati

#### Session Management
- `POST /api/set-session` - Supporta UserSession nullable
- `GET /api/session/:userId` - Restituisce formato ApiResponse<UserSession>

#### AI Pages Management  
- `POST /api/ai-pages/save` - Supporta pagine complesse del client
- `GET /api/ai-pages/get` - Restituisce PageSessionResponse completo
- `DELETE /api/ai-pages/delete` - Response format standardizzato
- `GET /api/ai-pages/user/:userId` - Recupero pagine utente

### Breaking Changes
- **Nessuno** - Full backward compatibility mantenuta
- Legacy types disponibili come `LegacyUserSession`, `LegacyPage`

### Bug Fixes
- **Fixed** UserSession nullability incompatibility
- **Fixed** Page structure divergence client-server  
- **Fixed** Inconsistent response formats across endpoints
- **Fixed** Missing type validation for complex structures

### Technical Improvements
- **Type Safety** - Runtime validation e type guards
- **Error Handling** - Standardized error responses
- **Documentation** - Complete type definitions and examples
- **Testing** - Comprehensive test coverage for compatibility

### Dependencies
- Nessuna dipendenza aggiunta
- TypeScript types migliorati internamente

---

## [0.0.3] - Previous Version

### Previous Features
- Basic Redis operations
- Simple session management
- AI page generation (basic types)
- Email functionality
- File upload support
