// Variable globale pour les points générés du match en cours
let generatedPoints = [];

// Fonction pour générer les points côté client
function generatePoints(nbrPoints) {

    // Récupération des informations des joueurs
    const player1 = {
        name: document.getElementById('player1Name').value,
        level: parseInt(document.getElementById('player1Level').value),
        totalPoints: 0
    };
    const player2 = {
        name: document.getElementById('player2Name').value,
        level: parseInt(document.getElementById('player2Level').value),
        totalPoints: 0
    };

    // Création des points générés avec probabilité de gagner en fonction des niveaux des joueurs
    generatedPoints = Array(nbrPoints).fill(null).map((_, index) => {
        const totalLevel = player1.level + player2.level;
        const player1Probability = player1.level / totalLevel;
        const winner = Math.random() < player1Probability ? player1.name : player2.name;
        winner === player1.name ? player1.totalPoints++ : player2.totalPoints++;

        return {
            pointNumber: index + 1,
            winner: winner,
        };
    });

    // Affichage des points générés côté client
    document.getElementById('pointsDisplay').textContent =
        generatedPoints.map(p => `Point ${p.pointNumber}: ${p.winner}`).join('\n');

    document.getElementById('totalPoints').textContent =
        `Points remportés par ${player1.name}: ${player1.totalPoints}\nPoints remportés par ${player2.name}: ${player2.totalPoints}`;
}

// Fonction mettant à jour les éléments du tableau des scores
function updateScoreTable(score) {
    const table = document.getElementById('scoreTable');
    table.style.display = 'table';

    // Mise à jour des noms en fonction des inputs
    document.getElementById('player1Name_display').textContent = document.getElementById('player1Name').value;
    document.getElementById('player2Name_display').textContent = document.getElementById('player2Name').value;

    const player1Row = document.getElementById('player1Row').children;
    const player2Row = document.getElementById('player2Row').children;

    // Mise à jour des sets terminés
    for (let i = 0; i < Math.max(score.player1.sets.length, score.player2.sets.length); i++) {
        player1Row[i + 1].textContent = score.player1.sets[i]?.games || 0;
        player2Row[i + 1].textContent = score.player2.sets[i]?.games || 0;
    }

    // Mise à jour du jeu en cours
    player1Row[6].textContent = score.player1.currentSet.points.currentGame;
    player2Row[6].textContent = score.player2.currentSet.points.currentGame;

    // Affichage du statut du match
    const statusDiv = document.getElementById('matchStatus');
    if (score.isComplete) {
        statusDiv.textContent = `Match terminé ! ${score.winner} a gagné !`;
    } else {
        statusDiv.textContent = 'Match en cours';
    }
}


// Fonction calculant le score du match en appelant la logique implémenter côté serveur
function calculateScore() {
    if (generatedPoints.length === 0) {
        alert("Veuillez d'abord générer des points!");
        return;
    }

    const data = {
        player1: {
            name: document.getElementById('player1Name').value,
            level: parseInt(document.getElementById('player1Level').value)
        },
        player2: {
            name: document.getElementById('player2Name').value,
            level: parseInt(document.getElementById('player2Level').value)
        },
        points: generatedPoints
    };

    fetch('/api/tennis/calculate-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(score => {
            updateScoreTable(score);
            console.log(data);
            console.log(score);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Erreur lors du calcul du score');
        });
}