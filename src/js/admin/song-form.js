{
    let view = {
        el:  'main',
        init(){
            this.$el = $(this.el)
        },
        template: `
        <form class="form">
            <div class="row">
                <label>歌名</label> <input name="name" type="text" value="_name_" >
            </div>
            <div class="row">
                <label>歌手</label> <input type="text" name="singer"  value="_singer_">
            </div>
            <div class="row">
                <label>外链 </label><input name="url" type="text" value="_url_">
            </div>
             <div class="row">
                <label>封面 </label><input name="cover" type="text" value="_cover_"  placeholder="请上传比例为1：1的封面">
            </div>
             <div class="row">
                <label>歌词 </label><textarea name="lyrics" id="" cols="20" rows="15">_lyrics_</textarea>
            </div>
            <div class="row">
                <button type="submit">保存</button>
            </div>

        </form>
            <div class="uploadArea">
                <div id="uploadContainer" class="draggable">
                    <button id="uploadButton" class="clickable">+</button>
                    <p>点此或拖曳上传文件</p>
                </div>
            </div>`,

        render(data = {}) { /*如果data为空或undefin就初始化为{}*/
            let placeholders = ['name','url','singer','id','cover','lyrics'];
            let html = this.template;
            placeholders.map((string) => {
                html = html.replace(`_${string}_`,data[string] || '')
            })
           $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<p class="song-form-head"><label>编辑歌曲</label></p>')
            }else{
                $(this.el).prepend('<p class="song-form-head"><label>新建歌曲</label></p>')
            }
        },
        reset(){
            this.render({});
        }
    }





    let model = {
        data:{
            name:'',singer:'',url:'',id:'',cover:'',lyrics:''
        },
        update(data){
            var song = AV.Object.createWithoutData('Song', this.data.id)
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            song.set('cover', data.cover)
            song.set('lyrics', data.lyrics)
            return song.save().then((response)=>{
                Object.assign(this.data, data)
                return response
            })
        },
        create(data) {
// 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover);
            song.set('lyrics', data.lyrics);

            return song.save().then((newSong) => {
                let {id, attributes} = newSong;
                Object.assign(this.data, { id, ...attributes })

            },  (error) => {
                console.error(error);
            });



        }
    }

    let controller = {
        init(view, model) {

                this.view = view;
                this.view.init();
                this.model = model;
                this.view.render (this.model.data) ;
                this.bindEvents();
                window.eventHub.on('upload',(data) => {
                    this.model.data = data;
                    this.view.render(this.model.data)
                })
            window.eventHub.on('select',(data) => {
               this.model.data = data;
               this.view.render(this.model.data)
            })
            window.eventHub.on('new',(data) => {
                if(this.model.data.id){
                    this.model.data = {
                        name: '', url: '', id: '', singer: '',cover: '',lyrics: ''
                    }
                }else{
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
            },
        create(){
            let needs = 'name singer url cover lyrics'.split(' ');
            let data = {};
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data).then(() => {
                this.view.reset();
                let string = JSON.stringify(this.model.data);/*进行深拷贝*/
                let object = JSON.parse(string)
                window.eventHub.emit('create',object);

            });
        },
        update(){
            let needs = 'name singer url cover lyrics'.split(' ');
            let data = {};
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.update(data)
                .then(()=>{
                    window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
                })

        },

        bindEvents(){
            this.view.$el.on('submit','form',(e) => {
                e.preventDefault();
                if (this.model.data.id) {
                    this.update()
                }
                else {
                    this.create()
                }

                window.location.reload(true);
               
            })

        }


    }



    controller.init(view,model);

}

