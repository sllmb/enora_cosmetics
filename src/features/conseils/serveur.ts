import "server-only";

export {
  lireArticle,
  lireArticleAdmin,
  listerArticles,
  listerArticlesAdmin,
  TAG_ARTICLES,
} from "./queries/conseils";
export {
  compterCommentairesEnAttente,
  estConnectee,
  listerCommentaires,
  listerCommentairesAdmin,
  TAG_COMMENTAIRES,
} from "./queries/commentaires";
