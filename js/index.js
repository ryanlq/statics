const tips = document.querySelector('#tips');
const eudic_url = "https://dict.eudic.net/mdicts/en/"
const youdao_url = "https://m.youdao.com/dict?le=eng&q="
const translate_url = "https://www.bing.com/dict/search?q="
let tips_event_handler = null;

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
        padding-bottom:50px;
        height:100%;
    }
    #menu{
        overflow-x: hidden;
        overflow-y: scroll;
        height:100%;
    }
    #main{
        overflow-x: hidden;
        overflow-y: scroll;
        height:100%;
        padding-bottom: 100px;
    }
    .pure-u-1 {
        padding-top:40px;
        padding-bottom:100px;
    }
    .show{
        display: block;
    }
    .word-item{
        display: none;
    }
    .block{
        position:relative;
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
        cursor:pointer;
    }
    .block:hover #word-btns{
        visibility: visible;
    }
    .
    .block.backside {
        cursor: pointer;
    }
    .block.backside .word{
        visibility: hidden;
    }
    .block.backside .color-wraper{
        
        position: absolute;
        margin-top:20px;
        z-index:22;
    }
    .block.backside .note{
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
    .pure-menu-item{
        color:aquamarine;
    }
    .pure-menu-item:hover{
        color:#111;
    }
    .pure-menu-item.selected{
        background: #7b0d0d;
        color: #ccc;
    }
    #word-btns{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin: auto;
        visibility: hidden;
        position: absolute;
        right: 0;
        padding-top: 20px;
        cursor:pointer;
        
    }
    #word-query:hover,#word-copy:hover{
        font-weight:bolder;

    }
    #word-query{
        color: red;
    }
    #word-copy{
        color: blue;
    }
    @media (max-width: 800px) {
        #menu-button{
            display: flex;
        }

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
main.onscroll = "get_scroll_y()"

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
        <div class="pure-u-14-24 word" id="word-front" tabindex="0">${word}</div>
        <div class="pure-u-14-24 note" id="word-back"  tabindex="0" >${note_br(note)||word}</div>
        ` 
        wordDiv.innerHTML = html
        //长按单词正面
        const front = wordDiv.querySelector('#word-front')
        const backside = wordDiv.querySelector('#word-back')
        
        let x1 = x2 = 0;

        function mousedown_handler(e){
            if(isMobie){
                const backsideElement = chapterDiv.querySelector('.backside')
                backsideElement && backsideElement.classList.remove('backside')
            }
            x1 = e.x || e.touches[0].clientX
            
        }
        function mouseup_handler(e){
            x2 = e.x || e.changedTouches[0].clientX
            return (x2 - x1) 

        }
        if(isMobie){
            front.addEventListener('touchstart',(e)=>mousedown_handler(e))
            front.addEventListener('touchend',(e)=>{ (mouseup_handler(e)>150) && wordDiv.classList.add('backside')})
            backside.addEventListener('touchstart',(e)=>mousedown_handler(e))
            backside.addEventListener('touchend',(e)=>{ (mouseup_handler(e)<-150) && wordDiv.classList.remove('backside')})
    
        } else {
            front.addEventListener('click',(e)=> wordDiv.classList.add('backside'))
            backside.addEventListener('click',(e)=> wordDiv.classList.remove('backside'))
            backside.addEventListener('mouseleave',function(e){
                wordDiv.classList.remove('backside')
            })
        }

        const buttons = document.createElement('div');
        buttons.id = "word-btns"
        buttons.classList.add('pure-u-6-24')
        const querybtn = document.createElement('div');
        querybtn.id = "word-query"
        querybtn.innerText = "查询"
        querybtn.addEventListener('click',function(e){
            const words = word.split(' ')
            words && (words.length>1)
            dict_frame.src = words && (words.length>1)?(translate_url+words.join('+')):(eudic_url + word)
            if(!frame.classList.contains('dict_show')){
                frame.classList.add('dict_show')
            }
        })


        const copybtn = document.createElement('div');
        copybtn.id = "word-copy"
        copybtn.innerText = "复制"
        copybtn.addEventListener('click',function(e){
            navigator.clipboard.writeText(word)
            tips.style['display'] = 'block'
            setTimeout(() => {
                tips.style['display'] = 'none';
                tips_event_handler= null
            },'1500')
        })
        buttons.appendChild(copybtn)
        buttons.appendChild(querybtn)

        wordDiv.appendChild(buttons)
        chapterDiv.appendChild(wordDiv)
    })
    main.appendChild(chapterDiv)
})


chapters.forEach((chapter,i)=>{
    const _chapter = chapter.replace(/ /g,'_')
    const pure_menu_item = document.createElement('li');
    
    pure_menu_item.classList.add('pure-menu-item', 'pure-menu-link','link')
    pure_menu_item.setAttribute('for',_chapter)
    
    pure_menu_item.innerText = chapter.match(/CHAPTER[ ]?\d+/)[0]
    if(i == 0){
        main.querySelector('#'+_chapter).classList.replace('word-item','show')
        pure_menu_item.classList.add('selected')
    }
    
    pure_menu_item.addEventListener("click", function( event ) {
        const _show = main.querySelector('.show')
        const parent = event.target.parent;
        pure_menu_list.querySelector('.selected').classList.remove('selected')
        event.target.classList.add('selected')

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

