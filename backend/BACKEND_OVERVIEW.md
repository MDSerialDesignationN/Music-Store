# Music Store Backend - Übersicht

## Architektur

Das Backend folgt einer **MVC (Model-View-Controller)** Architektur mit Feature-Driven Design:

### Hauptkomponenten

#### 1. **Hauptapplikation (app.js)**
- Express.js Server-Konfiguration
- MongoDB-Datenbankverbindung
- CORS-Konfiguration für Frontend-Kommunikation
- Session-Management für Benutzerauthentifizierung
- Middleware-Integration

#### 2. **DatabaseManager (database/DatabaseManager.js)**
- Zentralisierte Datenbankoperationen
- Singleton-Pattern für konsistente DB-Verbindung
- Generische CRUD-Operationen für alle Entitäten
- Einheitliche Fehlerbehandlung

#### 3. **Authentication Middleware (middleware/auth.js)**
- `requireAuth`: Schutz authentifizierungspflichtiger Routen
- `requireGuest`: Verhindert Zugriff bereits angemeldeter Benutzer
- `addUserInfo`: Fügt Benutzerinformationen zu allen Requests hinzu

#### 4. **Routing (routes/index.js)**
- Zentrale Router-Konfiguration
- Modulare Aufteilung nach Entitäten
- API-Endpunkte unter `/api` Präfix

## Entitäten (src/entities/)

### **User (Benutzer)**
- **Model**: Benutzerdaten mit bcrypt-Passwort-Verschlüsselung
- **Controller**: Benutzerregistrierung mit automatischer Cart-Erstellung
- **Features**: Eindeutige Username/Email, sichere Passwort-Speicherung

### **Auth (Authentifizierung)**
- **Controller**: Login, Logout, Session-Verwaltung
- **Features**: Username/Email-Login, Session-Erstellung, Cart-Kompatibilität

### **Cart (Warenkorb)**
- **Model**: Benutzer-spezifische Warenkörbe mit Album-Referenzen
- **Controller**: Cart-Verwaltung mit vollständigen Album-Daten
- **Features**: Mengen-Verwaltung, Album-Population, Bestandsvalidierung

### **Album**
- **Model**: Album-Katalog mit Künstler- und Genre-Referenzen
- **Features**: Preis-Management, Veröffentlichungsjahr, Datenbeziehungen

### **Artist (Künstler)**
- **Model**: Künstler-Daten mit Name und Herkunftsland
- **Controller**: Künstler-Übersicht und detaillierte Künstler-Seiten mit Alben
- **Features**: Album-Filterung (nur Alben mit Tracks), Population von Genre-Daten

### **Track (Titel)**
- **Model**: Einzelne Musikstücke mit Dauer und Album-Referenz
- **Controller**: Track-Listen pro Album, vollständige Track-Übersicht
- **Features**: Dauer in Sekunden, Album-Population, Vollständigkeits-Validierung

### **Order (Bestellungen)**
- **Model**: Abgeschlossene Bestellungen mit Zeitstempel
- **Controller**: Bestellhistorie, einfache und detaillierte Bestellansichten
- **Features**: Warenkorb-zu-Bestellung-Konvertierung, Population von Album/Künstler-Daten

### **Genre**
- **Model**: Musik-Genre-Kategorien
- **Features**: Einfache Genre-Klassifizierung für Alben

## Wichtige Features

### **Sicherheit**
- bcrypt Passwort-Hashing (10 Salt-Runden)
- Express-Session für Authentifizierung
- Passwort-Ausschluss aus API-Responses
- CORS-Konfiguration für Frontend-Sicherheit

### **Datenbank**
- MongoDB mit Mongoose ODM
- Referentielle Integrität durch ObjectId-Referenzen
- Automatische Population für verwandte Daten
- Eindeutigkeits-Constraints für kritische Felder

### **Error Handling**
- Zentrale Fehlerbehandlung in DatabaseManager
- HTTP-Status-Code-konforme Responses
- Benutzerfreundliche Fehlermeldungen
- Console-Logging für Debugging

### **API Design**
- RESTful API-Struktur
- JSON Request/Response Format
- Session-basierte Authentifizierung
- Modulare Router-Organisation

## Entwicklungstools

### **Seeding (src/entities/seeding/)**
- Datenbank-Seeding für Entwicklung
- Test-Daten für alle Entitäten
- Schnelle Entwicklungsumgebung-Setup

### **Environment Variables**
- `MONGO_URI`: MongoDB-Verbindungsstring
- `SESSION_SECRET`: Session-Verschlüsselungsschlüssel
- `PORT`: Server-Port (Default: 9080)

## Deployment-Hinweise

### **Produktion**
- Session-Cookie `secure: true` für HTTPS setzen
- Starke SESSION_SECRET verwenden
- MongoDB Atlas oder dedizierte DB-Server
- Session-Store (Redis) für Skalierbarkeit erwägen

### **Skalierung**
- DatabaseManager unterstützt Connection-Pooling
- Stateless Design ermöglicht horizontale Skalierung
- Session-Store für Multi-Instance-Deployments notwendig

## API-Endpunkte Übersicht

### **Öffentliche Endpunkte (keine Authentifizierung)**
```
GET /api/album          - Alle Alben mit Künstler/Genre-Daten
GET /api/album/:id      - Spezifisches Album mit Track-Details
GET /api/artist         - Alle Künstler (Name, Land)
GET /api/artist/:id     - Künstler-Details mit Alben
GET /api/track          - Alle Tracks mit Album-Daten
GET /api/track/:id      - Spezifischer Track
GET /api/track/album/:albumId - Alle Tracks eines Albums
```

### **Authentifizierte Endpunkte**
```
POST /api/auth/login    - Benutzer-Login (nur Gäste)
GET  /api/auth/session  - Session-Informationen
POST /api/auth/logout   - Benutzer-Logout (nur authentifiziert)

POST /api/user          - Benutzer-Registrierung

GET  /api/cart          - Warenkorb mit populierten Album-Daten
POST /api/cart          - Warenkorb erstellen (manuell)
PUT  /api/cart/add      - Artikel zum Warenkorb hinzufügen
PUT  /api/cart/remove   - Artikel aus Warenkorb entfernen

GET  /api/order         - Basis-Bestellungen des Benutzers
GET  /api/order/history - Detaillierte Bestellhistorie
POST /api/order         - Neue Bestellung aus Warenkorb erstellen
```

### **Entwicklungs-Endpunkte**
```
POST /api/seeding/artist - Künstler-Testdaten erstellen
POST /api/seeding/genre  - Genre-Testdaten erstellen
POST /api/seeding/album  - Album-Testdaten erstellen
POST /api/seeding/track  - Track-Testdaten erstellen
```

## Abhängigkeiten

### **Core**
- express: Web-Framework
- mongoose: MongoDB ODM
- express-session: Session-Management
- cors: Cross-Origin Resource Sharing

### **Sicherheit**
- bcryptjs: Passwort-Hashing
- dotenv: Environment-Variablen

### **Development**
- nodemon: Auto-Restart für Entwicklung
- @faker-js/faker: Test-Daten-Generierung für Seeding

## Wichtige Geschäftslogik

### **Benutzer-Workflow**
1. **Registrierung**: Automatische Warenkorb-Erstellung bei Benutzer-Registrierung
2. **Login**: Flexible Anmeldung mit Username oder E-Mail
3. **Warenkorb**: Mengen-Management mit Bestandsvalidierung
4. **Bestellung**: Warenkorb-zu-Bestellung-Konvertierung mit Zeitstempel

### **Datenintegrität**
- **Album-Filterung**: Nur Alben mit Tracks werden angezeigt
- **Population**: Automatisches Laden verwandter Daten (Künstler, Genre)
- **Duplikats-Schutz**: Eindeutige E-Mail/Username-Validierung
- **Passwort-Sicherheit**: Bcrypt-Hashing mit automatischer Verarbeitung

### **Performance-Optimierungen**
- **Singleton DatabaseManager**: Einheitliche DB-Verbindung
- **Conditional Population**: Nur bei Bedarf verwandte Daten laden
- **Index-Module**: Zentrale Komponenten-Exports für bessere Struktur
- **Middleware-Kaskade**: Effiziente Request-Verarbeitung

## Fehlerbehandlung & Logging

### **HTTP-Status-Codes**
- `200`: Erfolgreiche Operationen
- `201`: Erfolgreich erstellt (Benutzer, Bestellungen)
- `400`: Client-Fehler (fehlende Felder, bereits angemeldet)
- `401`: Authentifizierung erforderlich
- `404`: Ressource nicht gefunden
- `500`: Server-Fehler mit Details

### **Logging-Strategie**
- Console-Logging für alle Datenbankoperationen
- Fehler-Details für Debugging
- Session-Erstellung/Löschung-Tracking
- Warenkorb-Erstellung für bestehende Benutzer