const isMobie = navigator.userAgent.match(/(iPad)|(iPhone)|(Android)/g)?true:false
window.frame = document.querySelector('#frame_wrapper')
window.dict_frame = document.querySelector('#external_dict')
document.querySelector('#frame_closer').addEventListener('click',function(e){
    frame.classList.remove('dict_show')
})