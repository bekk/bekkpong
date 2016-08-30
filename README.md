# BEKKPong

BEKKPong er et spill som kan brukes til rekrutteringsprosjekter og lignende. 

## Oppsett

BEKKPong lar deg spille pong med eksterne NES-kontrollere. Da spillet må oppdateres for å kunne støtte nye kontrollere anbefales det å bruke [disse](https://www.kjell.com/se/sortiment/ljud-bild/tv-spel-gaming/nintendo-nes-snes/handkontroll-med-usb-anslutning-nes-p93804) fra Kjell & Co. 200 kroner/stk.

1. Klon dette repoet.
2. Åpne `index.html` i Chrome.
3. Koble til kontrollere
4. Du er nå klar til å kjøre BEKKPong!

Merk: Den første kontrolleren som kobles til vil bli "Hovedkontrolleren".

## Kontrollere
Spillerne kontrollerer hver sin pad med `opp` og `ned` på d-paden.

Ved å trykke `start` på en av kontrollerene starter et nytt spill.
Trykker man `select` på kontrolleren som er "Hovedkontroller", starter man et enspiller-spill. (Å trykke på `select` på den andre kontrolleren har ingen effekt.)

### Demo
Trykk `A` på "Hovedkontrolleren" for å starte en demo hvor spillet spiller mot seg selv. Denne går til en av spillerene har `9999` poeng.

Trykk `B` på "Hovedkontrolleren" for å skru av demo. Det er også mulig å avbryte demoen ved å trykke `esc` på tastaturet.

### Bruk av tastatur
 
Dersom man ønsker å spille uten kontrollere kan man trykke `1` for en spiller, og `2` for to spillere. Spiller 1 styrer med `Q` og `A`, spiller 2 styrer med `P` og `L`.

Spillet går til en spiller når 5 poeng.

## Highscore

For å holde det enkelt registreres vinnerne i et Google Form.

En mal for skjema finner du [her](https://docs.google.com/forms/d/1395thOBXGILizqrWOAiFp-iLi_5sl-XYPkKapNl0vjg/edit?usp=sharing). Velg `Make a copy...` i menyen, og lagre en kopi på din egen Google Drive. 

![](https://cloud.githubusercontent.com/assets/1413264/18079142/708e206e-6e8f-11e6-886a-6f260d4f7758.png)

Du vil finne resultatene i et regneark som opprettes sammen med skjemaet. Klikk på `Responses` og deretter `View responses`. 

![](https://cloud.githubusercontent.com/assets/1413264/18079178/9beb7694-6e8f-11e6-9c50-b82dc83ea344.png)

## Kjente feil/bugs

### Bruk av kun en kontroller

Dersom kun en kontroller er koblet til, og man trykker `start` (noe som indikerer at man ønsker et 2spiller-spill), så vil den ene kontrolleren styre begge spillerene.

### Skjermstørrelse

Spillet støtter for tiden ikke oppløsning under `900x750`.

Spillet er ikke testet på oppløsning over `1680x900`.