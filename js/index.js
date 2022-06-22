//全局变量
let mune_selected = ''

//固定节点
//---tips---
const tips = document.querySelector('#tips'); 
let tips_event_handler = null; //事件句柄

const shadowHost = document.querySelector('#host');
const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });

//常量
const eudic_url = "https://dict.eudic.net/mdicts/en/"
const youdao_url = "https://m.youdao.com/dict?le=eng&q="
const translate_url = "https://www.bing.com/dict/search?q="

function create_element(option){
    const element = document.createElement(option['tag'] || 'div')
    option['id'] && (element.id = option['id'] );
    option['classes']&&option['classes'].length>0 && option['classes'].forEach(_class=>element.classList.add(_class))
    option['inner'] && (element.innerHTML = option['inner'])
    return element
}

function createlink(rel,href){
    const link = document.createElement('link')
    link.rel = rel
    link.href = href
    return link;
}

function note_br(note){
    if(!note) return false;
    else return note.replace(/\n/g,'<br/>')
}

function create_menubtn(menu){

    var menubtn = document.createElement('div');
    menubtn.id = "menu-button"
    menubtn.innerText = 'W';
    menubtn.addEventListener("click",function(e){
        menu.classList.contains('open')?menu.classList.remove('open'):menu.classList.add('open')
    })
    return menubtn;
}



shadowRoot.appendChild(createlink('stylesheet','./styles/pure-min.css'))
shadowRoot.appendChild(createlink('stylesheet','./styles/grids-responsive-min.css'))
shadowRoot.appendChild(createlink('stylesheet','./styles/menus.css'))

var style = document.createElement('style');
style.textContent = STYLES
shadowRoot.appendChild(style)




// var DATAS = {}
// NOTES.forEach(note=>{
//     if(!DATAS[note['section']]){
//         DATAS[note['section']] = [note]
//     } else {
//         DATAS[note['section']].push(note)
//     }
// })

// const chapters = Object.keys(DATAS) 
// console.log(DATAS)

async function create_menu_lists(selected_callback,callback){
    
    const pure_menu_list = document.createElement('ul');
    pure_menu_list.classList.add('pure-menu-list')

    //top area start
    const pure_menu_item_top = document.createElement('li');
    pure_menu_item_top.classList.add('pure-menu-item', 'pure-menu-link','link')
    pure_menu_item_top.setAttribute('for',"top_area")
    pure_menu_item_top.innerText = "生词本"
    pure_menu_item_top.addEventListener("click", function( event ) {
        pure_menu_list.querySelector('.selected').classList.remove('selected')
        event.target.classList.add('selected')        
        selected_callback('top_area')
        window.scrollTo(0,0) 
        callback()
    }, false);
    pure_menu_list.appendChild(pure_menu_item_top)

    //top area end

    
    await db.deathmask_chapters.toArray(chapters=>{
        chapters.forEach((chapter,i)=>{
            const _chapter = 'CHAPTER_'+chapter['chapter']
            const pure_menu_item = document.createElement('li');
            
            pure_menu_item.classList.add('pure-menu-item', 'pure-menu-link','link')
            pure_menu_item.setAttribute('for',_chapter)
            
            pure_menu_item.innerText = _chapter
            if(i == 0){
                selected_callback(_chapter)
                pure_menu_item.classList.add('selected')
            }
            
            pure_menu_item.addEventListener("click", function( event ) {
                pure_menu_list.querySelector('.selected').classList.remove('selected')
                event.target.classList.add('selected')

                
                selected_callback(event.target.attributes['for'].value)
                window.scrollTo(0,0) 
                callback()
            }, false);
            pure_menu_list.appendChild(pure_menu_item)
        })
    })
    return pure_menu_list;
}
async function create_menus(selected_callback){
    const menu = document.createElement('div');
    menu.id="menu"
    const pure_menu = document.createElement('div');
    pure_menu.classList.add('pure-menu')    
    const menu_lists = await create_menu_lists(selected_callback,()=>{
        menu.classList.contains('open') && menu.classList.remove('open')
    })

    pure_menu.appendChild(menu_lists)

    menu.appendChild(pure_menu)
    return menu;

}

function query(word){
    const words = word.split(' ')
    if(words && (words.length>1)){
        dict_frame.src = translate_url+words.join('+')
    } else {
        dict_frame.src =eudic_url + word.replace(/[\.,"]/g,'')
    }
    if(!frame.classList.contains('dict_show')){
        frame.classList.add('dict_show')
    }
}

function card_buttons(wordDiv,word){
    const buttons = document.createElement('div');
    buttons.id = "word-btns"
    buttons.classList.add('pure-u-6-24')

    const buttons_row1 = document.createElement('div');
    buttons_row1.id = "word-btns-row1"
    const buttons_row2 = document.createElement('div');
    buttons_row2.id = "word-btns-row2"

    const markbtn = document.createElement('div');
    markbtn.id = "word-mark"
    markbtn.innerText = wordDiv.getAttribute('ismarked') == 'true'?"-":"+"
    markbtn.classList.add(wordDiv.getAttribute('ismarked') == 'true'?"remove":"add")

    markbtn.addEventListener('click',async function(e){
        const ismarked = wordDiv.getAttribute('ismarked')
        const id = wordDiv.id.replace('word_','')
        if(ismarked == 'true'){
            // 取消标记
            await db_change('deathmask',id,{'ismarked':'false'})
            markbtn.innerText = "+"
            markbtn.classList.remove('remove')
            markbtn.classList.add('add')
            wordDiv.setAttribute('ismarked','false')
        } else {
            //添加标记
            await db_change('deathmask',id,{'ismarked':'true'})
            markbtn.innerText = "-"
            markbtn.classList.remove('add')
            markbtn.classList.add('remove')
            wordDiv.setAttribute('ismarked','true')
        }
    })

    const turnoverbtn = document.createElement('div');
    turnoverbtn.id = "word-turnover"
    turnoverbtn.innerText = "反转"
    turnoverbtn.addEventListener('click',function(e){
        
        if(wordDiv.classList.contains('backside')){
            wordDiv.classList.remove('backside')
        }else {
            wordDiv.classList.add('backside')
        }
    })


    const querybtn = document.createElement('div');
    querybtn.id = "word-query"
    querybtn.innerText = "查询"
    querybtn.addEventListener('click',function(e){
        const words = word.split(' ')
        if(words && (words.length>1)){
            dict_frame.src = translate_url+words.join('+')
        } else {
            dict_frame.src =eudic_url + word.replace(/[\.,"]/g,'')
        }
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
    //buttons.appendChild(turnoverbtn)
    
    buttons_row1.appendChild(turnoverbtn)
    buttons_row1.appendChild(markbtn)
    buttons_row2.appendChild(copybtn)
    buttons_row2.appendChild(querybtn)
    buttons.appendChild(buttons_row1)
    buttons.appendChild(buttons_row2)

    return buttons

}
async function create_main_contents(selected_menu_id,where='groupby',equals=false){
    const _chapter = selected_menu_id
    const chapterDiv = document.createElement('div');
    chapterDiv.id=_chapter
    chapterDiv.classList.add('pure-u-1','word-item')
    await db.deathmask.where(where).equals(!equals?selected_menu_id.replace('CHAPTER_',''):equals).toArray(async cards=>{
        cards.forEach(c=>{
            const {id,word,color,note,ismarked} = c
            const wordDiv = document.createElement('div');
            // TODO：id = bookneme + id
            wordDiv.id="word_"+id
            wordDiv.setAttribute('ismarked',(ismarked=="true")?true:false)
            //
            wordDiv.classList.add("pure-g",'block',color)
            const word_group = word.split(' ')
            let ietls_icon = null
            let bang =null

            if(word_group ){
                if(word_group.length==1){
                    if(ielts_words.includes(word.replace(/[\.,"]/g,''))){
                        ietls_icon = create_element('div','',['ielts-icon'])
                    }
                } else {
                    const slices = word.replace(/["\']/g,'').split(/[ ,\.]/g)
                    const matchs = slices.filter(s=>s.length>3&&ielts_words.includes(s));
                    if(matchs.length>0){
                        ietls_icon = create_element({tag:"img",classes:["ielts-icon"]})
                        ietls_icon.src="#"
                        ietls_icon.title="雅思3900词汇"
                        bang = create_element({classes:["bang"]})
                        matchs.forEach(ielt_word=>{
                            ielt = create_element({classes:["cell"],inner:ielt_word})
                            ielt.addEventListener('click',(e)=>query(ielt_word))
                            bang.appendChild(ielt)
                        })
                    }
                }

            } 
            const word_card = create_element({classes:["pure-u-14-24","word","word-front"],inner:word})

            const note_card_html = `
            <div>${note_br(note)||word}</div>
            <div id="back-editor" for="${id}">编辑</div>
            `
            const note_card = create_element({classes:["pure-u-14-24","note","word-front"],inner:note_card_html})

            ietls_icon && wordDiv.appendChild(ietls_icon)
            bang && wordDiv.appendChild(bang)
            bang&&console.log(bang.innerHTML)
            wordDiv.appendChild(word_card) 
            wordDiv.appendChild(note_card) 

            wordDiv.querySelector('#back-editor').addEventListener('click',function(e){
                const popup_content = `
                    <div class="word" contenteditable="true">${word}</div>
                    <div class="note" contenteditable="true">${note_br(note)||''}</div>
                    <div class="buttons">
                        <button class="cancle" type="button" >取消</button>
                        <button class="save" type="button" >保存</button>
                    </div>
                `
                POPUP.innerHTML = popup_content;
                POPUP.querySelector('.save').addEventListener('click',async function(e){
                    const word = POPUP.querySelector('.word').innerText
                    const note = POPUP.querySelector('.note').innerText
                    await db_change('deathmask',id,{word,note})
                    POPUP_COVER.classList.add('hide')
                })
                
                POPUP.querySelector('.cancle').addEventListener('click',async function(e){
                    
                    POPUP_COVER.classList.add('hide')
                })
                POPUP_COVER.classList.toggle('hide')
            })
            wordDiv.addEventListener('click',async function(e){
                const backsideElem = chapterDiv.querySelector('.backside')
                if(backsideElem && (backsideElem.id !== wordDiv.id)){
                    backsideElem.classList.remove('backside')
                }
                await db_change('positions','deathmask',{'noteid':wordDiv.id.replace('word_','')},'book')
                return false;
                
            })

            const buttons = card_buttons(wordDiv,word)
            wordDiv.appendChild(buttons)
            chapterDiv.appendChild(wordDiv)
            

        })
    })
    return chapterDiv
}

async function create_top_area(show_action){

    let items = await create_main_contents("top_area",'ismarked','true') 
    return items
}

function caches_switcher(){
    const functions = create_element({classes:['functions','pure-u-1-5']}),
    switcher = create_element({classes:['pure-button'],inner:"清缓存"});
    switcher.addEventListener('click',async function(e){
        const target = e.target
        if(!navigator.serviceWorker) return ;
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
            } 
        }).then(r=>{
            target.innerText = "成功！"
            setTimeout(()=>target.innerText = "清缓存",2000)
        }).catch(r=>{
            target.innerText = "错误！"
            setTimeout(()=>target.innerText = "清缓存",2000)
        });
    })
    functions.appendChild(switcher);
    return functions
    
}

async function create_layout(){
    const layout = create_element({id:"layout"}),
         main_wraper = create_element({id:"main_wrapper"}),
         main = create_element({id:"main"}),
         title_aera  = create_element({classes:["title-area",'pure-g']}),
         title = create_element({id:"note_title",classes:['pure-u-4-5']});


    //let main_content = await create_main_contents(id)
    let show_action = async (selectorid)=>{
        const selectElm = main.querySelector("#"+selectorid)
        const _show = main.querySelector('.show')
        _show&&_show.classList.replace('show','word-item')
        
        if(selectElm ){
            selectElm.classList.replace('word-item','show')
        } else {
            if(selectorid!=="top_area") {
                let new_main_content = await create_main_contents(selectorid)
                new_main_content.classList.replace('word-item','show')
                main.appendChild(new_main_content)
            } 
        }
    }

    let topArea = await create_top_area((selector)=>show_action(selector))
    main.appendChild(topArea)
    let menu = await create_menus((selector)=>{show_action(selector);title.innerText=selector;})
    //main.appendChild(main_content)

    
    title_aera.appendChild(title)
    title_aera.appendChild(caches_switcher())
    main_wraper.appendChild(title_aera)
    layout.appendChild(menu);
    main_wraper.appendChild(main)
    layout.appendChild(main_wraper);
    shadowRoot.appendChild(create_menubtn(menu));
    shadowRoot.appendChild(layout);

}

async function set_position(){
    const count = await db.positions.count()
    if(count > 0){
        let pos = await db.positions.where('book').equals('deathmask').toArray()
        let note = await db.deathmask.where(':id').equals(parseInt(pos[0]['noteid'])).toArray()
        return note.length>0?note[0]:false;
    } else{
        return false
    }
}

db.deathmask.count().then(async count=>{
    if(count==0){
        setTimeout(create_layout(), 5000 )
    }else{
        const location = await set_position()
        if(location){
            const {id,groupby} = location
            
            await create_layout()
            try{

                setTimeout(() => {
                    groupby&&shadowRoot.querySelector('[for=CHAPTER_'+groupby+']').click()
                }, 300);
                
                setTimeout(() => {
                    const card = shadowRoot.querySelector('#word_'+id)
                    shadowRoot.querySelector('#main_wrapper').scrollTo(0,card.offsetTop-40)
                }, 1000);
            } catch(e){
                alert(e)
            }
            
        }
    }
}).catch(e=>console.error(e))



