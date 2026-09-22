/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - SMART ORGA AVIS CLIENTS AVEC GESTION PHOTO GOOGLE DRIVE
 * =========================================================================
 * 
 * ⚠️ PROCÉDURE DE DÉPLOIEMENT OBLIGATOIRE DANS GOOGLE APPS SCRIPT :
 * 
 * 1. Ouvrez votre Google Sheets Smart Orga.
 * 2. Allez dans : Extensions > Apps Script.
 * 3. Remplacez TOUT le code du fichier Code.gs par le code ci-dessous.
 * 4. Cliquez sur l'icône de disquette pour ENREGISTRER (Ctrl + S).
 * 5. Cliquez en haut à droite sur : DÉPLOYER > GÉRER LES DÉPLOIEMENTS.
 * 6. Dans la fenêtre, cliquez sur le CRAYON (Modifier) à côté de votre déploiement actif.
 * 7. Dans la liste déroulante "Version", choisissez impérativement : « NOUVELLE VERSION ».
 * 8. Vérifiez que "Qui a accès" est bien configuré sur : « Tout le monde » (Anyone).
 * 9. Cliquez sur le bouton bleu DÉPLOYER (acceptez les autorisations Drive si Google le demande).
 * 
 * URL DU DÉPLOIEMENT :
 * https://script.google.com/macros/s/AKfycbwQ2WCjexaE9N3eX26qpKTSOb3f5mgnLXc-_cL0vpyDi-fA_qNCALINpNS5clY-uXQ9zw/exec
 */

/**
 * GET : 
 * 1. Récupère les avis validés dont Published === true (avec leur photo si présente).
 * 2. Fallback de sécurité si un ajout est envoyé en GET.
 */
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Si des paramètres d'ajout d'avis sont reçus
    if (e && e.parameter && (e.parameter.action === "addReview" || (e.parameter.Name && e.parameter.Comment))) {
      return handleAddReview(sheet, e.parameter);
    }

    // Récupération des avis publiés
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
    var photoIdx = findHeaderIndex(headers, ["photo", "image", "photourl", "imageurl"]);

    var reviews = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rawPublished = publishedIdx !== -1 ? row[publishedIdx] : false;

      // Filtrer STRICTEMENT les avis validés (Published === true)
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
        var rawPhoto = photoIdx !== -1 ? String(row[photoIdx] || "").trim() : "";

        if (rawComment || rawName) {
          reviews.push({
            Name: rawName || "Voyageur Smart Orga",
            City: cityIdx !== -1 ? String(row[cityIdx] || "").trim() : "Maroc",
            Trip: tripIdx !== -1 ? String(row[tripIdx] || "").trim() : "Séjour Smart Orga",
            Rating: ratingIdx !== -1 && !isNaN(row[ratingIdx]) ? Number(row[ratingIdx]) : 5,
            Comment: rawComment,
            Date: dateIdx !== -1 ? formatDateValue(row[dateIdx]) : "",
            Published: true,
            Photo: rawPhoto
          });
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify(reviews))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * POST : Reçoit un nouvel avis depuis le formulaire web et l'enregistre avec Published = false
 * Gère également l'enregistrement optionnel de la photo dans Google Drive.
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
        success: false,
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
      success: false,
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Fonction centrale d'enregistrement d'un avis dans Google Sheets et Google Drive
 */
function handleAddReview(sheet, data) {
  try {
    // 1. Extraction et validation des champs obligatoires
    var name = String(data.Name || data.name || "").trim();
    var city = String(data.City || data.city || "").trim();
    var trip = String(data.Trip || data.trip || "").trim();
    var comment = String(data.Comment || data.comment || "").trim();
    var ratingRaw = data.Rating !== undefined ? data.Rating : data.rating;
    var rating = parseInt(ratingRaw, 10);
    var date = data.Date || data.date || new Date().toISOString();

    if (!name) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Le nom est obligatoire."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    if (!city) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "La ville est obligatoire."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    if (!trip) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Le voyage effectué est obligatoire."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    if (isNaN(rating) || rating < 1 || rating > 5) {
      rating = 5;
    }
    if (!comment || comment.length < 10) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Le commentaire doit contenir au moins 10 caractères."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Traitement de la photo optionnelle (Google Drive)
    var photoUrl = "";
    var photoRaw = data.Photo || data.photo || "";

    if (photoRaw && typeof photoRaw === "string" && photoRaw.length > 20) {
      try {
        var photoBase64 = "";
        var mimeType = "image/jpeg";
        var ext = "jpg";

        // Détection format Base64 (Data URI ou brut)
        if (photoRaw.indexOf("data:") === 0) {
          var parts = photoRaw.split(",");
          var header = parts[0];
          photoBase64 = parts[1] || "";
          var mimeMatch = header.match(/:(.*?);/);
          if (mimeMatch && mimeMatch[1]) {
            mimeType = mimeMatch[1].toLowerCase();
          }
        } else {
          photoBase64 = photoRaw;
        }

        // Extension selon MIME
        if (mimeType.indexOf("png") !== -1) {
          ext = "png";
        } else if (mimeType.indexOf("webp") !== -1) {
          ext = "webp";
        } else {
          ext = "jpg";
          mimeType = "image/jpeg";
        }

        // Décodage Base64
        var decodedBytes = Utilities.base64Decode(photoBase64);

        // Vérification de la taille (5 Mo max = 5 * 1024 * 1024 octets)
        if (decodedBytes.length > 5 * 1024 * 1024) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            message: "La photo dépasse la taille maximale autorisée de 5 Mo."
          })).setMimeType(ContentService.MimeType.JSON);
        }

        // Nom du fichier propre : avis_Nom_Date.jpg
        var cleanName = name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase().slice(0, 20);
        var dateFormatted = Utilities.formatDate(new Date(), "GMT", "yyyyMMdd_HHmmss");
        var fileName = "avis_" + cleanName + "_" + dateFormatted + "." + ext;

        var blob = Utilities.newBlob(decodedBytes, mimeType, fileName);

        // Dossier dédié Google Drive : « Smart Orga - Avis Clients »
        var folderName = "Smart Orga - Avis Clients";
        var folders = DriveApp.getFoldersByName(folderName);
        var folder;
        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder(folderName);
        }

        // Création du fichier dans le dossier
        var file = folder.createFile(blob);

        // Rendre le fichier accessible en lecture publique
        try {
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (permErr) {
          // Ignore si restreint par les règles du domaine
        }

        // Génération de l'URL publique directe (haute performance, adaptée au web)
        var fileId = file.getId();
        photoUrl = "https://lh3.googleusercontent.com/d/" + fileId;

      } catch (photoErr) {
        // En cas d'erreur sur l'image, on enregistre quand même l'avis sans photo
        Logger.log("Erreur traitement photo: " + photoErr.toString());
        photoUrl = "";
      }
    }

    // 3. SÉCURITÉ ABSOLUE : Published est TOUJOURS strictement false côté serveur
    var published = false;

    // 4. Enregistrement dans Google Sheets
    var lastCol = Math.max(1, sheet.getLastColumn());
    var headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var headers = headerRow.map(function (h) { return String(h).trim(); });

    // Si la colonne "Photo" n'existe pas encore dans la feuille, on l'ajoute automatiquement
    var photoColIdx = findHeaderIndex(headers, ["photo", "image", "photourl", "imageurl"]);
    if (photoColIdx === -1 && headers.length > 0 && headers[0] !== "") {
      sheet.getRange(1, headers.length + 1).setValue("Photo");
      headers.push("Photo");
      photoColIdx = headers.length - 1;
    }

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
        } else if (colName === "photo" || colName === "image" || colName === "photourl" || colName === "imageurl") {
          newRow.push(photoUrl);
        } else {
          newRow.push("");
        }
      }
    } else {
      // Si la feuille était complètement vide
      sheet.appendRow(["Name", "City", "Trip", "Rating", "Comment", "Date", "Published", "Photo"]);
      newRow = [name, city, trip, rating, comment, date, published, photoUrl];
    }

    sheet.appendRow(newRow);

    // 5. Réponse JSON finale
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      status: "success",
      message: "Avis reçu avec succès.",
      photoUrl: photoUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
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
