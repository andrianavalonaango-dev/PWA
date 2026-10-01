
console.log("app.js chargé");
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(() => {
      console.log("Service Worker enregistré");
    })
    .catch(error => {
      console.error("Erreur Service Worker :", error);
    });
}


const taskInput = document.getElementById("task");
const addButton = document.getElementById("add");
const taskList = document.getElementById("tasks");

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});


const DB_NAME = "TodoDB";
const DB_VERSION = 1;
const STORE_NAME = "todos";

let db;
console.log("Tentative d'ouverture IndexedDB...");
const request = indexedDB.open(DB_NAME, DB_VERSION);

// Création de la base
request.onupgradeneeded = (event) => {

  db = event.target.result;

  if (!db.objectStoreNames.contains(STORE_NAME)) {

    const store = db.createObjectStore(STORE_NAME, {
      keyPath: "id",
      autoIncrement: true
    });

    store.createIndex("completed", "completed", {
      unique: false
    });
  }
};


// Base ouverte
request.onsuccess = (event) => {

  db = event.target.result;

  console.log("IndexedDB ouverte avec succès");

  // Charger les tâches existantes
  afficherTaches();
  
};


// Erreur
request.onerror = (event) => {

  console.error(
    "Erreur IndexedDB :",
    event.target.error
  );
};


function addTask() {

  const taskText = taskInput.value.trim();

  if (taskText === "") {
    return;
  }

  if (!db) {
    console.error("IndexedDB n'est pas encore prête");
    return;
  }

  ajouterTache(taskText);

  taskInput.value = "";
  taskInput.focus();
}
//ajouter
function ajouterTache(text) {

  const transaction =
    db.transaction(STORE_NAME, "readwrite");

  const store =
    transaction.objectStore(STORE_NAME);

  const tache = {
    text: text,
    completed: false
  };

  store.add(tache);

  transaction.oncomplete = () => {

    console.log("Tâche ajoutée");

    afficherTaches();
  };

  transaction.onerror = () => {

    console.error(
      "Erreur lors de l'ajout"
    );
  };
}

//afficher
function afficherTaches() {

  const transaction =
    db.transaction(STORE_NAME, "readonly");

  const store =
    transaction.objectStore(STORE_NAME);

  const request =
    store.getAll();

  request.onsuccess = () => {

    const taches = request.result;

  
    taskList.innerHTML = "";

   
    taches.forEach(tache => {

      const li =
        document.createElement("li");

      li.textContent =
        tache.text;

      li.addEventListener("click", () => {

        supprimerTache(tache.id);

      });

      taskList.appendChild(li);
    });
  };
}

//supprimer
function supprimerTache(id) {

  const transaction =
    db.transaction(STORE_NAME, "readwrite");

  const store =
    transaction.objectStore(STORE_NAME);

  store.delete(id);

  transaction.oncomplete = () => {

    console.log("Tâche supprimée");

    afficherTaches();
  };
}

