// Reference to the original collection
var originalRef = db.collection("old");

// Reference to the new collection
var copyRef = db.collection("new");

async function copyCollection(db, originalRef, copyRef) {
    // Get all documents in the original collection
    let querySnapshot = await originalRef.get();

    // Add all documents to the new collection
    let batch = db.batch();
    querySnapshot.forEach(doc => {
        let newDocRef = copyRef.doc(doc.id);
        batch.set(newDocRef, doc.data());
    });
    await batch.commit();

    // Get all subcollections in the original collection
    let subcollections = await originalRef.listCollections();

    // Recursively copy all subcollections
    for (let subcollection of subcollections) {
        let newSubRef = copyRef.doc(subcollection.id);
        copyCollection(db, subcollection.ref, newSubRef);
    }
}

copyCollection(db, originalRef, copyRef);
