// Variables globales
let generatedPoints = [];
let player1Info = null;
let player2Info = null;
let currentMatchScore = null;

function validatePlayerInputs() {
    // Vérification des noms
    const player1Name = document.getElementById('player1Name').value;
    const player2Name = document.getElementById('player2Name').value;

    // Message d'erreur si le ou les noms des joueurs ne sont pas renseignés
    if (!player1Name || !player2Name) {
        alert("Veuillez renseigner les noms des deux joueurs !");
        return false;
    }

    // Vérification des niveaux
    const player1Level = document.getElementById('player1Level').value;
    const player2Level = document.getElementById('player2Level').value;

    // Message d'erreur si le ou les niveaux des joueurs ne sont pas renseignés
    if (!player1Level || !player2Level) {
        alert("Veuillez renseigner les niveaux des deux joueurs !");
        return false;
    }

    return true;
}

function disablePlayerInputs() {
    // Réinitialisation des inputs
    document.getElementById('player1Name').disabled = true;
    document.getElementById('player2Name').disabled = true;
    document.getElementById('player1Level').disabled = true;
    document.getElementById('player2Level').disabled = true;
}

function enablePlayerInputs() {
    // Réactivation des inputs 
    document.getElementById('player1Name').disabled = false;
    document.getElementById('player2Name').disabled = false;
    document.getElementById('player1Level').disabled = false;
    document.getElementById('player2Level').disabled = false;
}

function initializePlayers() {
    // Initialisation des joueurs et de leurs informations
    player1Info = {
        name: document.getElementById('player1Name').value,
        level: parseInt(document.getElementById('player1Level').value),
        totalPoints: 0
    };
    player2Info = {
        name: document.getElementById('player2Name').value,
        level: parseInt(document.getElementById('player2Level').value),
        totalPoints: 0
    };
}

function generatePoints() {
    if (!validatePlayerInputs()) {
        return;
    }

    if (!player1Info || !player2Info) {
        initializePlayers();
        disablePlayerInputs();
    }

    // Si un match est en cours et complet, on empêche de générer plus de points
    if (currentMatchScore && currentMatchScore.isComplete) {
        alert("Le match est déjà terminé ! Veuillez commencer un nouveau match.");
        return;
    }

    document.getElementById('points-section').style.display = 'block';

    // Récupération du dernier numéro de point
    const lastPointNumber = generatedPoints.length > 0 ? generatedPoints[generatedPoints.length - 1].pointNumber : 0;

    // Création des points générés avec probabilité de gagner en fonction des niveaux des joueurs
    const newPoints = Array(150).fill(null).map((_, index) => {
        const totalLevel = player1Info.level + player2Info.level;
        const player1Probability = player1Info.level / totalLevel;
        const winner = Math.random() < player1Probability ? player1Info.name : player2Info.name;

        winner === player1Info.name ? player1Info.totalPoints++ : player2Info.totalPoints++;

        return {
            pointNumber: lastPointNumber + index + 1,
            winner: winner,
        };
    });

    // Ajout des nouveaux points aux points existants
    generatedPoints = [...generatedPoints, ...newPoints];

    updatePointsDisplay();
}

function updatePointsDisplay() {
    // Affichage des points générés côté client
    document.getElementById('pointsDisplay').textContent =
        generatedPoints.map(p => `Point ${p.pointNumber}: ${p.winner}`).join('\n');

    document.getElementById('totalPlayerPoints').textContent =
        `Points remportés par ${player1Info.name}: ${player1Info.totalPoints}\nPoints remportés par ${player2Info.name}: ${player2Info.totalPoints}`;

    document.getElementById('totalPoints').textContent =
        `Nombre total de points générés : ${player1Info.totalPoints + player2Info.totalPoints}`;
}

function getCurrentPlayerPoints(playerName) {
    return generatedPoints.filter(point => point.winner === playerName).length;
}

function updateScoreTable(score) {
    // Afficher le tableau des scores lorsque updateScoreTable est appelée
    document.getElementById('score-section').style.display = 'block';
    const table = document.getElementById('scoreTable');
    table.style.display = 'table';

    // Mise à jour des noms en fonction des inputs
    document.getElementById('player1Name_display').textContent = player1Info.name;
    document.getElementById('player2Name_display').textContent = player2Info.name;

    const player1Row = document.getElementById('player1Row').children;
    const player2Row = document.getElementById('player2Row').children;

    // Mise à jour des sets terminés
    for (let i = 0; i < Math.max(score.player1.sets.length, score.player2.sets.length); i++) {
        player1Row[i + 1].textContent = score.player1.sets[i]?.games || 0;
        player2Row[i + 1].textContent = score.player2.sets[i]?.games || 0;
    }

    // Mise à jour du set en cours
    const currentSetIndex = score.player1.sets.length + 1;
    if (!score.isComplete) {
        player1Row[currentSetIndex].textContent = score.player1.currentSet.games;
        player2Row[currentSetIndex].textContent = score.player2.currentSet.games;
    }

    // Mise à jour du jeu en cours
    player1Row[6].textContent = score.player1.currentSet.points.currentGame;
    player2Row[6].textContent = score.player2.currentSet.points.currentGame;

    // Affichage du statut du match
    const statusDiv = document.getElementById('matchStatus');
    if (score.isComplete) {
        statusDiv.textContent = `Match terminé ! ${score.winner} a gagné !`;
    } else {
        const currentSetNumber = score.player1.sets.length + 1;
        const currentGameInSetNumber = (score.player1.currentSet.games) + (score.player2.currentSet.games) + 1
        statusDiv.textContent = `Match non terminé, jeu numéro ${currentGameInSetNumber} du set ${currentSetNumber} en cours, Générez plus de points pour continuer.`;
    }
}

function resetMatch() {
    generatedPoints = [];
    currentMatchScore = null;
    player1Info = null;
    player2Info = null;

    // Réactivation des inputs
    enablePlayerInputs();

    // Cacher les sections
    document.getElementById('points-section').style.display = 'none';
    document.getElementById('score-section').style.display = 'none';

    // Réinitialissation des contenus
    document.getElementById('pointsDisplay').textContent = '';
    document.getElementById('totalPoints').textContent = '';
    document.getElementById('matchStatus').textContent = 'Nouveau match';

    // Réinitialisation des inputs
    document.getElementById('player1Name').value = null;
    document.getElementById('player2Name').value = null;
    document.getElementById('player1Level').value = null;
    document.getElementById('player2Level').value = null;


    // Réinitialisation du tableau des scores
    const player1Row = document.getElementById('player1Row').children;
    const player2Row = document.getElementById('player2Row').children;
    for (let i = 1; i < player1Row.length; i++) {
        player1Row[i].textContent = '0';
        player2Row[i].textContent = '0';
    }
}

function calculateScore() {
    // Vérifie si des points ont été générés avant de procéder au calcul du score
    if (generatedPoints.length === 0) {
        alert("Veuillez d'abord générer des points!");
        return;
    }

    // Prépare les données à envoyer au serveur
    const data = {
        player1: player1Info,
        player2: player2Info,
        points: generatedPoints
    };

    // Envoi une requête POST au serveur pour calculer le score
    fetch('/api/tennis/calculate-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        // Convertit la réponse en JSON
        .then(response => response.json())
        // Traite la réponse du serveur
        .then(score => {
            currentMatchScore = score;
            updateScoreTable(score);
            console.log(data);
            console.log(score);
        })
        // Gestion des erreurs
        .catch(error => {
            console.error('Error:', error);
            alert('Erreur lors du calcul du score');
        });
}