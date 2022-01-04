import { ISockContentElement } from "../models/default.model";
import { WriteElementIn } from "../models/sockets/in/element.in";

export function applyTextChanges(el: ISockContentElement, request: WriteElementIn): string {
  let content: string = "";
  //On part du dernier ID du packet recu jusqu'au dernière id du elument,
  for (let updateIndex = request.lastClientUpdateId + 1; updateIndex <= el.clientUpdateId; updateIndex++) {
    //On récupère chaque update depuis le dernière id du packet jusqu'au dernier id actuel
    const update = el.changes.get(updateIndex);
    let indexDiff = 0;
    //Pour chaque changement dans l'update
    for (const change of update) {
      switch (change[0]) {
        case 1://Si c'est un ajout :
          for (let newChange of request.changes) { //Pour chaque nouveau changement
            let newChangeIndex = newChange[1]; //on récupère l'index de l'ajout
            if (newChangeIndex >= change[1] - indexDiff) // Si l'index de l'ajout est supérieur à l'index actuel
              newChange[1] += change[2].length;
            //On ajoute la taille de l'ancien ajout au nouvel index
          }
          indexDiff += change[2].length;  //On ajoute à l'index la taille du changement
          break;
        case -1://Si c'est une suppression
          for (let newChange of request.changes) { //Pour chaque changement
            let newChangeIndex = newChange[1]; //On récupère l'index du nouvel l'ajout
            if (newChangeIndex >= change[1] - indexDiff) //Si on est apprès dans le texte
              newChange[1] -= change[2].length;
            //On enlève la taille de la suppression
          }
          indexDiff -= change[2].length;  //On enlève à l'index à la taille du changement
        default:
          break;
      }
    }
  }
  content = el.content;
  let stepIndex: number = 0;
  //Pour chaque nouveau changement on fait la mise à jour à partir du packet modifié par l'agorithme ci-dessus
  for (const change of request.changes) {
    switch (change[0]) {
      case 1:
        content = content.insert(change[1] + stepIndex, change[2]);
        break;
      case -1:
        content = content.delete(change[1] + stepIndex, change[2].length);
        stepIndex -= change[2].length;
        break;
      case 2:
        content = change[2];
        stepIndex = change[2].length;
      default: break;
    }
  }
  return content;
}