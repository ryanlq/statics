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
  positions:"&book,noteid,chapterid",
});


db.deathmask.count().then(count=>{
  if(count==0){
    db.deathmask.bulkPut(NOTES_DB).catch(err => {alert("Ouch... " + err);});
    db.positions.bulkPut([{book:'deathmask',noteid:'',chapterid:''}]).catch(err => {alert("Ouch... " + err);});
  }

}).catch(e=>console.error(e))


db.deathmask_chapters.count().then(count=>{
  if(count==0){
    db.deathmask_chapters.bulkPut(CHAPTERS_DB.map(chapter=>{return {chapter:chapter}})).catch(err => {alert("Ouch... " + err);});
  }

}).catch(e=>console.error(e))

async function db_change(tablename,where,changes,key="id"){

  await db.transaction("rw", db[tablename], async () => {


    // Mark bigfoots:
    await db[tablename].where(key).equals(key=="id"?parseInt(where):where).modify(changes);
    console.log("modified!");

  }).catch (Dexie.ModifyError, error => {
      // ModifyError did occur
      console.error(error.failures.length + " items failed to modify");

  }).catch (error => {
      console.error("Generic error: " + error);
  });
}
function downloadFileByBlob(blobUrl, filename) {
  const eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'
  eleLink.href = blobUrl
  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()
  // 然后移除
  document.body.removeChild(eleLink)
}
async function get_db_url(){
  let tables = {},promises=[],tablenames=[];
  db.tables.forEach(async table=>{
    tablenames.push(table.name)
    promises.push(table.toArray())
  })

  return Promise.all(promises).then(datas=>{
    tablenames.forEach((tname,i)=>tables[tname] = datas[i])
    const blobContent = new Blob(
      [JSON.stringify(tables, null, 2)],
      {type : 'application/octet-stream'}
    );
    const blobUrl = window.URL.createObjectURL(blobContent)
    return blobUrl
  })
}
async function backup_download(){
  const url = await get_db_url()
  downloadFileByBlob(url, 'kindle_notes_indexdb.json')
    
}
function backup_to_dropbox(){


  var options = {
    files: [ ],
        success: function () {
            alert("Success! Files saved to your Dropbox.");
        },
        progress: function (progress) {},
        cancel: function () {},
        error: function (errorMessage) {}
  };
  let url_promise = get_db_url()
  url_promise.then(url=>{
    options.files.push({url,filename:'kindle_notes_indexdb.json'})
    Dropbox.save(url, 'kindle_notes_indexdb.json', options)
  })
}

// function create_table_from_json_data(tablename,data){
//   if(data.length>0){
//     const keys = Object.keys(data[0])
    
//   }
// }

function importdb(tables){
  const dbtables = JSON.parse(tables)
  const keys = Object.keys(dbtables)
  keys.forEach(key=>{
      if(!db[key]){
        // create_table_from_json_data(key,dbtables[key])
      } else {
        db[key].clear()
        db[key].bulkPut(dbtables[key]).then(r=>alert('导入成功')).catch(err => {alert("Ouch... " + err);});
      }
  })
}