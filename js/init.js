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
