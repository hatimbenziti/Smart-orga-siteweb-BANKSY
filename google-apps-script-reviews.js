/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - SMART ORGA AVIS CLIENTS (REVIEWS)
 * =========================================================================
 * 
 * ⚠️ PROCÉDURE DE DÉPLOIEMENT OBLIGATOIRE (TRÈS IMPORTANT) :
 * 
 * Dans Google Apps Script, cliquer simplement sur "Enregistrer" (Ctrl+S) 
 * NE MET PAS À JOUR l'URL Web App /exec ! 
 * Vous devez obligatoirement publier une NOUVELLE VERSION :
 * 
 * 1. Dans Google Sheets, allez dans : Extensions > Apps Script.
 * 2. Remplacez TOUT le code existant par le code ci-dessous.
 * 3. Cliquez sur l'icône de disquette pour ENREGISTRER (Ctrl+S).
 * 4. Cliquez en haut à droite sur : DÉPLOYER > GÉRER LES DÉPLOIEMENTS.
 * 5. Dans la fenêtre qui s'ouvre, cliquez sur le CRAYON (Modifier) à côté de votre déploiement actif.
 * 6. Dans la liste déroulante "Version", choisissez impérativement : NOUVELLE VERSION.
 * 7. Vérifiez que "Qui a accès" est bien réglé sur : "Tout le monde" (Anyone).
 * 8. Cliquez sur le bouton bleu DÉPLOYER.
 * 
 * L'URL reste strictement la même :
 * https://script.google.com/macros/s/AKfycbwQ2WCjexaE9N3eX26qpKTSOb3f5mgnLXc-_cL0vpyDi-fA_qNCALINpNS5clY-uXQ9zw/exec
 */

/**
 * GET : 
 * 1. Si aucun paramètre d'ajout : Récupère les avis validés dont Published === true
 * 2. Si paramètres d'avis présents : Ajoute le nouvel avis avec Published = false (Fallback sécurisé)
 */
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Si des paramètres d'ajout d'avis sont reçus en GET
    if (e && e.parameter && (e.parameter.action === "addReview" || (e.parameter.Name && e.parameter.Comment))) {
      return handleAddReview(sheet, e.parameter);
    }

    // Sinon : Comportement normal -> Récupération des avis publiés
    var data = sheet.getDataRange().getValues();

    if (!data || data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var headers = data[0].map(function (h) {
      return String(h).trim();
    });

    var nameIdx = findHeaderIndex(headers, ["name", "nom"]);
    var cityIdx = findHeaderIndex(headers, ["city", "ville"]);
    var tripIdx = findHeaderIndex(headers, ["trip", "voyage", "sejour"]);
    var ratingIdx = findHeaderIndex(headers, ["rating", "note", "etoiles"]);
    var commentIdx = findHeaderIndex(headers, ["comment", "avis", "commentaire"]);
    var dateIdx = findHeaderIndex(headers, ["date"]);
    var publishedIdx = findHeaderIndex(headers, ["published", "publie", "publié", "actif"]);

    var reviews = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rawPublished = publishedIdx !== -1 ? row[publishedIdx] : false;

      // Filtrer STRICTEMENT les avis validés
      var isPublished = (
        rawPublished === true ||
        String(rawPublished).trim().toLowerCase() === "true" ||
        String(rawPublished).trim().toLowerCase() === "vrai" ||
        rawPublished === 1 ||
        String(rawPublished).trim() === "1"
      );

      if (isPublished) {
        var rawComment = commentIdx !== -1 ? String(row[commentIdx] || "").trim() : "";
        var rawName = nameIdx !== -1 ? String(row[nameIdx] || "").trim() : "";

        if (rawComment || rawName) {
          reviews.push({
            Name: rawName || "Voyageur Smart Orga",
            City: cityIdx !== -1 ? String(row[cityIdx] || "").trim() : "Maroc",
            Trip: tripIdx !== -1 ? String(row[tripIdx] || "").trim() : "Séjour Smart Orga",
            Rating: ratingIdx !== -1 && !isNaN(row[ratingIdx]) ? Number(row[ratingIdx]) : 5,
            Comment: rawComment,
            Date: dateIdx !== -1 ? formatDateValue(row[dateIdx]) : "",
            Published: true
          });
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify(reviews))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * POST : Reçoit un nouvel avis depuis le formulaire web et l'enregistre avec Published = false
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var postDataString = "";

    if (e && e.postData && e.postData.contents) {
      postDataString = e.postData.contents;
    } else if (e && e.parameter) {
      postDataString = JSON.stringify(e.parameter);
    }

    if (!postDataString) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Aucune donnée reçue."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = {};
    try {
      data = JSON.parse(postDataString);
    } catch (err) {
      data = e.parameter || {};
    }

    return handleAddReview(sheet, data);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Fonction centrale d'enregistrement d'un avis dans Google Sheets
 */
function handleAddReview(sheet, data) {
  // Extraction et validation des données
  var name = String(data.Name || data.name || "").trim();
  var city = String(data.City || data.city || "").trim();
  var trip = String(data.Trip || data.trip || "").trim();
  var comment = String(data.Comment || data.comment || "").trim();
  var ratingRaw = data.Rating !== undefined ? data.Rating : data.rating;
  var rating = parseInt(ratingRaw, 10);
  var date = data.Date || data.date || new Date().toISOString();

  if (!name) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Le nom est obligatoire."
    })).setMimeType(ContentService.MimeType.JSON);
  }
  if (!city) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "La ville est obligatoire."
    })).setMimeType(ContentService.MimeType.JSON);
  }
  if (!trip) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Le voyage effectué est obligatoire."
    })).setMimeType(ContentService.MimeType.JSON);
  }
  if (isNaN(rating) || rating < 1 || rating > 5) {
    rating = 5;
  }
  if (!comment || comment.length < 10) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Le commentaire doit contenir au moins 10 caractères."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // SÉCURITÉ ABSOLUE : Published est TOUJOURS false côté serveur
  var published = false;

  // Déterminer les colonnes existantes dans Google Sheets
  var lastCol = Math.max(1, sheet.getLastColumn());
  var headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var headers = headerRow.map(function (h) { return String(h).trim(); });

  var newRow = [];

  if (headers.length > 0 && headers[0] !== "") {
    for (var col = 0; col < headers.length; col++) {
      var colName = headers[col].toLowerCase();
      if (colName === "name" || colName === "nom") {
        newRow.push(name);
      } else if (colName === "city" || colName === "ville") {
        newRow.push(city);
      } else if (colName === "trip" || colName === "voyage" || colName === "sejour") {
        newRow.push(trip);
      } else if (colName === "rating" || colName === "note" || colName === "etoiles") {
        newRow.push(rating);
      } else if (colName === "comment" || colName === "avis" || colName === "commentaire") {
        newRow.push(comment);
      } else if (colName === "date") {
        newRow.push(date);
      } else if (colName === "published" || colName === "publie" || colName === "publié" || colName === "actif") {
        newRow.push(published);
      } else {
        newRow.push("");
      }
    }
  } else {
    // Si la feuille était vide
    sheet.appendRow(["Name", "City", "Trip", "Rating", "Comment", "Date", "Published"]);
    newRow = [name, city, trip, rating, comment, date, published];
  }

  // Ajout de la ligne dans la feuille
  sheet.appendRow(newRow);

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Merci pour votre avis ! Votre témoignage sera publié après validation par notre équipe Smart Orga."
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Utilitaires internes
 */
function findHeaderIndex(headers, possibleNames) {
  for (var i = 0; i < headers.length; i++) {
    var h = headers[i].toLowerCase();
    for (var j = 0; j < possibleNames.length; j++) {
      if (h === possibleNames[j].toLowerCase()) {
        return i;
      }
    }
  }
  return -1;
}

function formatDateValue(val) {
  if (!val) return "";
  if (val instanceof Date) {
    return val.toISOString();
  }
  return String(val);
}
