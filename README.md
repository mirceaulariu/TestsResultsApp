                  TEST RESULTS VIEWER - v1.0
===================================================================

EN:
[ 1. PREREQUISITES ]
To run this application, you must have Java installed on your computer.
To check if you have Java, open Command Prompt (cmd) and type:
   java -version

If you see a version number (e.g., "openjdk version 17..."), you are good to go.
If you see an error, please install the Java Runtime Environment (JRE).

-------------------------------------------------------------------

[ 2. HOW TO RUN ]
1. Unzip this folder to a location on your computer (e.g., Desktop).
   *IMPORTANT: Do not run the app directly from inside the ZIP file.*

2. Double-click the file named:
   TestsResults.jar (or just TestsResults if extensions are hidden)

3. The application will start, and your default web browser should open automatically
   to http://localhost:8080

-------------------------------------------------------------------

[ 3. TROUBLESHOOTING ]

>> "I double-clicked, but nothing happened"
   Open this folder in a terminal (Command Prompt) and run:
   java -jar TestResultsViewer.jar


>> "Port 8080 is already in use"
   This happens if you closed the browser but didn't stop the previous session.
   To fix this, you have two options:

	I. Reopen the browser in which this app opened the first time and type "http://localhost:8080/" - the page should open.
	
	II. You must stop the background Java process:
   
   		Method A (Command Line):
   		1. Open cmd.
   		2. Type: netstat -ano | find "8080" (Note the PID number at the end).
   		3. Type: taskkill /F /PID <your_pid_number>

   		Method B: Restart your computer.


>> "The app opens but says 'Invalid response' or buttons don't work"
   Ensure the 'button-config.json' file is in the SAME folder as the .jar file.
-------------------------------------------------------------------

[ 4. CUSTOMIZATION ]
You can add your own buttons or change existing ones without recompiling the code.

1. Open 'button-config.json' in any text editor (Notepad, VS Code).
2. Add a new entry following this format:
   {
     "label": "My New Button",
     "executable": "script.cmd"(the path to the .cmd file that you want to run),
     "description": "Description of what this does"
   }
3. Save the file and restart the application.

===================================================================


RO:
===================================================================
                  VIZUALIZATOR REZULTATE TESTE - v1.0
===================================================================

[ 1. CERINȚE PREALABILE ]
Pentru a rula această aplicație, trebuie să aveți Java instalat pe calculator.
Pentru a verifica dacă aveți Java, deschideți Command Prompt (cmd) și tastați:
   java -version

Dacă vedeți un număr de versiune (de ex., "openjdk version 17..."), sunteți pregătit.
Dacă primiți o eroare, vă rugăm să instalați Java Runtime Environment (JRE).

-------------------------------------------------------------------

[ 2. CUM SE RULEAZĂ ]
1. Dezarhivați acest folder într-o locație pe calculator (de ex., pe Desktop).
   *IMPORTANT: Nu rulați aplicația direct din interiorul arhivei ZIP.*

2. Dați dublu-click pe fișierul numit:
   TestsResults.jar (sau doar TestsResults dacă extensiile sunt ascunse)

3. Aplicația va porni, iar browserul dvs. implicit ar trebui să se deschidă automat
   la adresa http://localhost:8080

-------------------------------------------------------------------

[ 3. DEPANARE (PROBLEME FRECVENTE) ]

>> "Am dat dublu-click, dar nu s-a întâmplat nimic"
   Deschideți acest folder într-un terminal (Command Prompt) și rulați comanda:
   java -jar TestResultsViewer.jar


>> "Port 8080 is already in use" (Portul 8080 este deja utilizat)
   Acest lucru se întâmplă dacă ați închis browserul, dar nu ați oprit sesiunea anterioară.
   Pentru a rezolva acest lucru, aveți două opțiuni:

    I. Redeschideți browserul în care s-a deschis aplicația prima dată și accesați "http://localhost:8080/" - pagina ar trebui să se încarce.

    II. Trebuie să opriți procesul Java care rulează în fundal:
   
        Metoda A (Linia de comandă):
        1. Deschideți cmd.
        2. Tastați: netstat -ano | find "8080" (Rețineți numărul PID de la finalul rândului).
        3. Tastați: taskkill /F /PID <numărul_vostru_pid>

        Metoda B: Reporniți calculatorul.


>> "Aplicația se deschide dar afișează 'Invalid response' sau butoanele nu funcționează"
   Asigurați-vă că fișierul 'button-config.json' se află în ACELAȘI folder cu fișierul .jar.
-------------------------------------------------------------------

[ 4. PERSONALIZARE ]
Puteți adăuga propriile butoane sau le puteți modifica pe cele existente fără a recompila codul.

1. Deschideți 'button-config.json' în orice editor de text (Notepad, VS Code).
2. Adăugați o intrare nouă urmând acest format:
   {
     "label": "Numele butonului nou",
     "executable": "script.cmd" (calea către fișierul .cmd pe care doriți să-l rulați),
     "description": "Descrierea acțiunii pe care o face"
   }
3. Salvați fișierul și reporniți aplicația.

===================================================================
