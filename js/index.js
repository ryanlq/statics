
const shadowHost = document.querySelector('#host');
const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = './styles/pure-min.css'
shadowRoot.appendChild(link)
const responsive_link = document.createElement('link')
responsive_link.rel = 'stylesheet'
responsive_link.href = './styles/grids-responsive-min.css'
shadowRoot.appendChild(link)

const menu_link = document.createElement('link')
menu_link.rel = 'stylesheet'
menu_link.href = './styles/menus.css'
shadowRoot.appendChild(menu_link)

// const script = document.createElement('script')
// script.src = './js/ui.js'
// shadowRoot.appendChild(script)



var style = document.createElement('style');
style.textContent = `
    #layout{
        overflow: hidden;
        padding-top:40px;
    }
    .show{
        display: block;
    }
    .word-item{
        display: none;
    }
    .block .word{
        padding:20px;
    }
    .block .word{
        padding:20px;
    }
    .block .note{
        display:none;
    }
    .block:hover .word{
        background: #d1d67c;
        border-radius: 10px;
        font-size:22px;
        color:#000;
    }

    .block:active {
        cursor: pointer;
    }
    .block:active .word{
        visibility: hidden;
    }
    .block:active .color-wraper{
        
        position: absolute;
        margin-top:20px;
        z-index:22;
    }
    .block:active .note{
        color:#000;
        display: block;
        padding:20px;
        margin-left:20px;
        padding-left: 20px;
        position: absolute;
        background: #dce53e;
        border-radius:5px;
        font-size:22px;
    }
    .color-wraper{
        height:20px;
        width:20px;
        border-radius:10px;
        margin-right:10px;
        margin:auto 0;
    }
    .highlight_pink{
        background-color:pink;
    }
    .highlight_blue{
        
        background-color:blue;
    }
    .highlight_yellow{
        background-color:yellow;
        
    }
    .highlight_orange{
        background-color:orange;
        
    }
    .link{
        cursor:pointer;
    }
    #menu-button{
        background-color:#df7373;
        position:fixed;
        width:60px;
        height:60px;
        border-radius:30px;
        z-index:33;
        cursor:pointer;
        right:50px;
        display:none;
        justify-content: center;
        align-items: center;
        color: black;
        
    }
    .open{
        margin-left:0px !important;
    }

    @media (max-width: 800px) {
        #menu-button{
            display: flex;
        }
        #menu:
    }
`

shadowRoot.appendChild(style)




var DATAS = {}
NOTES.forEach(note=>{
    if(!DATAS[note['section']]){
        DATAS[note['section']] = [note]
    } else {
        DATAS[note['section']].push(note)
    }
})

const chapters = Object.keys(DATAS) 

function note_br(note){
    if(!note) return false;
    else return note.replace(/\n/g,'<br/>')
}
const layout = document.createElement('div');
const menu = document.createElement('div');
const main = document.createElement('div');
layout.id="layout"
menu.id="menu"
main.id="main"


const pure_menu = document.createElement('div');
const pure_menu_list = document.createElement('ul');
pure_menu.classList.add('pure-menu')
pure_menu_list.classList.add('pure-menu-list')

chapters.forEach(chapter=>{
    const _chapter = chapter.replace(/ /g,'_')



    const chapterDiv = document.createElement('div');
    chapterDiv.id=_chapter
    chapterDiv.classList.add('pure-u-1','word-item')
    DATAS[chapter].forEach(c=>{
        const {word,color,note} = c
        const wordDiv = document.createElement('div');
        wordDiv.classList.add("pure-g",'block')
        const html = `
        <div class="pure-u-2-24 ${color} color-wraper"></div>
        <div class="pure-u-18-24 word">${word}</div>
        <div class="pure-u-18-24 note">${note_br(note)||word}</div>
        ` 
        wordDiv.innerHTML = html
        chapterDiv.appendChild(wordDiv)
    })
    main.appendChild(chapterDiv)



})

chapters.forEach((chapter,i)=>{
    const _chapter = chapter.replace(/ /g,'_')
    const pure_menu_item = document.createElement('li');
    
    pure_menu_item.classList.add('pure-menu-item', 'pure-menu-link','link')
    pure_menu_item.setAttribute('for',_chapter)
    
    pure_menu_item.innerText = chapter.match(/CHAPTER \d+/)[0]
    i == 0 &&  main.querySelector('#'+_chapter).classList.replace('word-item','show')
    pure_menu_item.addEventListener("click", function( event ) {
        const _show = main.querySelector('.show')
        _show&&_show.classList.replace('show','word-item')

        main.querySelector('#'+event.target.attributes['for'].value).classList.replace('word-item','show')
        window.scrollTo(0,0) 
        menu.classList.contains('open') && menu.classList.remove('open')
      }, false);
    pure_menu_list.appendChild(pure_menu_item)
})


var menubtn = document.createElement('div');
menubtn.id = "menu-button"
menubtn.innerText = 'W';
menubtn.addEventListener("click",function(e){
    menu.classList.contains('open')?menu.classList.remove('open'):menu.classList.add('open')
})

shadowRoot.appendChild(menubtn)

pure_menu.appendChild(pure_menu_list)
menu.appendChild(pure_menu)
layout.appendChild(menu)
layout.appendChild(main)
shadowRoot.appendChild(layout)
