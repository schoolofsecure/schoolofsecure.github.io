# Task Preview - 3. pálya integráció

## Változtatások

Az `index-bakk.jsx` tartalma átkerült az `index.jsx`-be, így a task preview oldal most tartalmazza a 3. pálya feladatainak előnézetét is.

## Hozzáadott funkciók

1. **3. pálya feladatainak generálása**: A `useEffect`-ben hozzáadva a 3. pálya 5 feladatának (ICON_MEMORY, NETWORK_ANOMALY, EMAIL_HEADER, URL_TRUST, RISKY_PERMISSION) generálása, minden típushoz 3 variációval.

2. **Új state változók**:
   - `ugy3Tasks`: A generált 3. pálya feladatok tárolása
   - `selectedUgy3Task`: Kiválasztott feladattípus
   - `selectedUgy3Variation`: Kiválasztott variáció

3. **UI elemek**: Új kártya a 3. pálya feladatainak előnézetéhez, feladattípus és variáció választóval.

4. **Import frissítés**: `LevelGenerator` hozzáadva az importokhoz (bár jelenleg nem használják).

## Dátum

2024

