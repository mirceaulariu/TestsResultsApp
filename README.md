# TEST RESULTS VIEWER - v1.0

[🇬🇧 English](#-english) | [🇷🇴 Română](#-română)

---

## 🇬🇧 English


### [ OVERVIEW ]
**Test Results Viewer** is a tool designed to easily view text-based test result files. It features a smart **"Upload from XML"** button that automatically locates and loads files based on paths found in your XML reports, alongside customizable buttons for executing batch scripts directly from the interface.


### [ 1. PREREQUISITES ]
To run this application, you must have **Java** installed on your computer.
To check if you have Java, open Command Prompt (`cmd`) and type:

```cmd
java -version
```
If you see a version number (e.g., "openjdk version 17..."), you are good to go.

If you see an error, please install the Java Runtime Environment (JRE).

### [ 2. HOW TO RUN ]
Unzip this folder to a location on your computer (e.g., Desktop).

IMPORTANT: Do not run the app directly from inside the ZIP file.

Double-click the file named: TestResultsViewer.jar (or just TestResultsViewer if extensions are hidden).

The application will start, and your default web browser should open automatically to: http://localhost:8080


### [ 3. HOW TO USE]
Press the "Upload from XML" button on the down side of the page and then paste your XML's filepath (ex.: `"C:\Users\user1\Desktop\yourXMLFile.xml"`), and then press OK.

The app will show all the text files specified in that XML file under the field "Comparer_OutputFile".

You can then click on a file to review its content.

One can also remove from the list the files that have no test result errors by clicking the "Keep files > 15B" button on the upper side of the page.


### [ 4. TROUBLESHOOTING ]
 "I double-clicked, but nothing happened" Open this folder in a terminal (Command Prompt) and run:

```cmd
java -jar TestResultsViewer.jar
```
 "Port 8080 is already in use" This happens if you closed the browser but didn't stop the previous session. To fix this, you have two options:

Option I: Reopen the browser where the app opened the first time and go to http://localhost:8080/ — the page should open.

Option II: You must stop the background Java process.

Method A (Command Line):

Open cmd.

Type the following to find the PID (Process ID):

```cmd
netstat -ano | find "8080"
```
Type the following to kill the process (replace <your_pid_number> with the number found above):

```cmd
taskkill /F /PID <your_pid_number>
```
Method B: Restart your computer.

 "The app opens but says 'Invalid response' or buttons don't work" Ensure the button-config.json file is in the SAME folder as the .jar file.

### [ 5. CUSTOMIZATION ]
You can add your own buttons or change existing ones without recompiling the code.

Open button-config.json in any text editor (Notepad, VS Code).

Add a new entry following this format:
```cmd
JSON

{
    "label": "My New Button",
    "executable": "batch_files/script.cmd",
    "description": "Description of what this does"
}
```
Save the file and restart the application.

---

## 🇷🇴 Română


### [ PREZENTARE GENERALĂ ]
Test Results Viewer este un instrument conceput pentru a vizualiza ușor fișierele text cu rezultatele testelor. Dispune de un buton inteligent "Upload from XML" care localizează și încarcă automat fișierele pe baza căilor găsite în rapoartele XML, alături de butoane personalizabile pentru executarea scripturilor batch direct din interfață.

### [ 1. Cerințe prealabile ]
Pentru a rula această aplicație, trebuie să aveți Java instalat pe calculator. Pentru a verifica dacă aveți Java, deschideți Command Prompt (cmd) și tastați:

```cmd
java -version
```
Dacă vedeți un număr de versiune (de ex., "openjdk version 17..."), sunteți pregătit.

Dacă primiți o eroare, vă rugăm să instalați Java Runtime Environment (JRE).

### [ 2. CUM SE RULEAZĂ ]
Dezarhivați acest folder într-o locație pe calculator (de ex., pe Desktop).

IMPORTANT: Nu rulați aplicația direct din interiorul arhivei ZIP.

Dați dublu-click pe fișierul numit: TestResultsViewer.jar (sau doar TestResultsViewer dacă extensiile sunt ascunse).

Aplicația va porni, iar browserul dvs. implicit ar trebui să se deschidă automat la adresa: http://localhost:8080


### [ 3. CUM SE FOLOSEȘTE]

Faceți click pe butonul "Upload from XML" din partea de jos a paginii și apoi lipiți adresa fișierului XML (ex.: `"C:\Users\user1\Desktop\yourXMLFile.xml"`), apăsați OK.

Aplicația va afișa toate fișierele text ale căror adrese sunt specificate in fișierul XML, la câmpul "Comparer_OutputFile".

Poți afișa conținutul unui fișier printr-un click pe fișier.

Se pot elimina din listă fișierele ale căror conținut este aproape gol (testele nu prezintă erori), prin apăsarea butonului "Keep files > 15B".


### [ 4. DEPANARE (PROBLEME FRECVENTE) ]
 "Am dat dublu-click, dar nu s-a întâmplat nimic" Deschideți acest folder într-un terminal (Command Prompt) și rulați comanda:

```cmd
java -jar TestResultsViewer.jar
```
 "Port 8080 is already in use" (Portul 8080 este deja utilizat) Acest lucru se întâmplă dacă ați închis browserul, dar nu ați oprit sesiunea anterioară. Pentru a rezolva acest lucru, aveți două opțiuni:

Opțiunea I: Redeschideți browserul în care s-a deschis aplicația prima dată și accesați http://localhost:8080/ — pagina ar trebui să se încarce.

Opțiunea II: Trebuie să opriți procesul Java care rulează în fundal.

Metoda A (Linia de comandă):

Deschideți cmd.

Tastați următoarea comandă pentru a găsi PID-ul:

```cmd
netstat -ano | find "8080"
```
Tastați următoarea comandă pentru a opri procesul (înlocuiți <numărul_vostru_pid> cu numărul găsit mai sus):

```cmd
taskkill /F /PID <numărul_vostru_pid>
```
Metoda B: Reporniți calculatorul.

 "Aplicația se deschide dar afișează 'Invalid response' sau butoanele nu funcționează" Asigurați-vă că fișierul button-config.json se află în ACELAȘI folder cu fișierul .jar.

### [ 5. PERSONALIZARE ]
Puteți adăuga propriile butoane sau le puteți modifica pe cele existente fără a recompila codul.

Deschideți button-config.json în orice editor de text (Notepad, VS Code).

Adăugați o intrare nouă urmând acest format:
```cmd
JSON

{
  "label": "Numele butonului nou",
  "executable": "batch_files/script.cmd",
  "description": "Descrierea acțiunii pe care o face"
}
```
(Notă: la executable treceți calea către fișierul .cmd pe care doriți să-l rulați)

Salvați fișierul și reporniți aplicația.
