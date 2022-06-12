
const test = document.querySelector('#test')
const frame = document.querySelector('#frame_wrapper')
const dict_frame = document.querySelector('#external_dict')
document.querySelector('#frame_closer').addEventListener('click',function(e){
    frame.classList.remove('dict_show')
})