# Site coaching
1. Supabase : exécuter `supabase.sql` puis `supabase-contrat.sql`, puis Authentication > URL Configuration : ajouter l'URL Vercel du site.
2. Renseigner `config.js` (URL + clé anon).
3. `git init && git add . && git commit -m "init"`, pousser sur GitHub, importer le repo dans Vercel (Framework : Other, aucun build).
4. Ajouter un programme : Storage > bucket `programmes` > dossier `<id-du-client>/fichier.pdf`, puis une ligne dans la table `programmes`.
5. Déposer vos photos dans images/ : portrait.jpg, individuel.jpg, couple.jpg, vip.jpg, ado.jpg (un dégradé s'affiche si absentes).
