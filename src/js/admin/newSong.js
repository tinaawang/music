{
    let view = {
        el:'aside >.newSong',
        template:`
<span>新建歌曲</span><svg class="icon" aria-hidden="true">
    <use xlink:href="#icon-xinjian"></use>
</svg>
       `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model= {}
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.active(); /*一开始就选择新建歌曲*/
            window.eventHub.on('upload',(data) => {
                this.active()
                
            })
            window.eventHub.on('select',(data) => {

                this.deactive();
            })
            window.eventHub.on('new',(data) => {
                this.active();
            })
            $(this.view.el).on('click', ()=>{
                window.eventHub.emit('new')
            })
        },
        active(){
            $(this.view.el).addClass('active');
        },
        deactive(){
            $(this.view.el).removeClass('active');
        }
    }
    controller.init(view,model)
}