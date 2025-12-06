# Ügy3 tovább gomb letiltása

## Változtatások

Az ügy3 pálya befejezése után a tovább gomb az ügy4-re letiltva van.

## Részletek

- **Fájl**: `src/pages/UgyView.jsx`
- **Változtatás**: Az ügy3 befejezése után a "Következő ügy" gomb disabled állapotban jelenik meg
- **Stílus**: Ugyanaz, mint az ügy2-nél a zárolt gomb (átlátszó, szürke szín)

## Implementáció

Az ügy3 esetén (`levelNum === 3`) a `Link` komponens helyett egy `disabled` `button` jelenik meg, amely:
- Nem kattintható
- Szürke, átlátszó megjelenésű
- Ugyanazt a stílust használja, mint az ügy2 zárolt gombja

## Helyek

A változtatás három helyen van alkalmazva:
1. Dinamikus feladatok befejezése után (ügy2, ügy3)
2. Statikus feladatok befejezése után MatchTable esetén (ügy1, ügy3)
3. Statikus feladatok befejezése után ChallengeInput esetén (ügy1, ügy3)

