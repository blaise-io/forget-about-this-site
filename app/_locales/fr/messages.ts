// tslint:disable max-line-length
module.exports = JSON.stringify(
  {
    extensionName: { message: `Oubliez ce site` },
    extensionDescription: {
      message: `Bouton d'action de la page qui supprime les cookies, le stockage local, l'historique de navigation et l'historique de téléchargement du site Web que vous visitez.`, },
    successNotificationText: { message: `Données supprimées avec succès` },
    successNotificationBody: { message: `Supprimé $1 pour $2` },
    deleteItems: {
      message: `Lorsque vous cliquez sur le bouton d'action de page,<br> Supprimez les éléments suivants pour le site Web actuel:`, },
    cookies: { message: `Cookies` },
    localStorage: { message: `Stockage local` },
    history: { message: `Historique de navigation` },
    downloads: { message: `Historique des téléchargements` },
    beforeDeleting: { message: `Avant de supprimer:` },
    askConfirmation: { message: `Demandez confirmation` },
    confirmationPrompt: { message: `Êtes-vous sûr de vouloir supprimer $1?` },
    closeTab: { message: `Close tab` },
    closeTabHelp: {
      message: `Cela empêche le site Web d'écrire des éléments supplémentaires après la suppression`,
    },
    closeSameDomainTabs: {
      message: `Fermer tous les onglets avec le même domaine`,
    },
    afterDeleting: { message: `Après avoir supprimé les éléments:` },
    showConfirmation: { message: `Afficher une confirmation` },
    reloadWebsite: { message: `Recharger le site web` },
    lastSaved: { message: `Dernier enregistre: $1` },
  },
  null,
  2
);
