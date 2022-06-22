window.CHAPTERS_DB = []

window.NOTES_DB = NOTES.map(note=>{
    const groupby = note["section"].match(/CHAPTER[ ]?(\d+).*/)[1]
    note['groupby'] = groupby; 
    note['ismarked'] = '';
    if(!CHAPTERS_DB.includes(groupby)){
        CHAPTERS_DB.push(groupby)
    }
    return note;
})

window.UPLOADER = document.createElement('input')
window.UPLOADER.type = "file"
window.UPLOADER.addEventListener('change', (e) => {
    const file = e.target.files[0];
     if (file) {
         const reader = new FileReader();
         reader.readAsText(file);
         reader.onload = () => { 
            importdb(reader.result)
         }
         reader.onerror = (e) => {
             console.error(e, '文件或格式错误！')
         }
      }
})