# Contact form → FormSubmit (+alias)

## Miért

A mailto megnyitotta a mail appot. A régi FormSubmit cím a `localhost`-hoz volt kötve, ezért az éles domainhez nem jött aktiváló.

## Most

- FormSubmit AJAX → `erikapappkovacs+iterali@gmail.com` (Gmail ugyanaz a postaláda)
- Nincs mail app nyitás

## Aktiválás

1. Deploy után: `https://iterali.com/teams#contact`
2. Küldj egy tesztet
3. Gmailben fogadd el a FormSubmit „action required” levelet

## Fájl

`src/pages/ForTeams.jsx`
