window.db = new Dexie("Kindles");

// DB with single table "friends" with primary key "id" and
// indexes on properties "name" and "age"
db.version(1).stores({
  deathmask: `
    ++id,
    word,
    color,
    note,
    section,
    groupby,
    ismarked`,
  deathmask_chapters:"++id,chapter",

});


db.deathmask.count().then(count=>{
  if(count==0){
    db.deathmask.bulkPut(NOTES_DB).catch(err => {alert("Ouch... " + err);});
  }

}).catch(e=>console.error(e))


db.deathmask_chapters.count().then(count=>{
  if(count==0){
    db.deathmask_chapters.bulkPut(CHAPTERS_DB.map(chapter=>{return {chapter:chapter}})).catch(err => {alert("Ouch... " + err);});
  }

}).catch(e=>console.error(e))

async function db_change(tablename,id,changes){

  await db.transaction("rw", db[tablename], async () => {


    // Mark bigfoots:
    await db[tablename].where("id").equals(parseInt(id)).modify(changes);
    console.log("modified!");

  }).catch (Dexie.ModifyError, error => {
      // ModifyError did occur
      console.error(error.failures.length + " items failed to modify");

  }).catch (error => {
      console.error("Generic error: " + error);
  });
}