{
    let view = {
        el: '#app',
        render(data){
           let song = data.song

            $(this.el).css('background-image',`url(${song.cover})`)
            $(this.el).find('img.cover').attr('src',song.cover)
            if( $(this.el).find('audio').attr('src') !== song.url){
                $(this.el).find('audio').attr('src',song.url)
                let  audio  =  $(this.el).find('audio').attr('src',song.url).get(0)
                audio.onended = () => {
                    window.eventHub.emit('songEnd')
                }
                audio.ontimeupdate = () => {
                    this.show(audio.currentTime)

                }
            }

            let lyrics =song.lyrics;
            if(lyrics){
                lyrics.split('\n').map((string) => {
                    let  p = document.createElement('p')
                    let  regex = /\[([\d:.]+)\](.+)/
                    let matches = string.match(regex)
                    if(matches){
                        p.textContent = matches[2]
                        let time = matches[1]

                        let parts = time.split(':')

                        let minutes = parts[0]
                        let seconds = parts[1]

                        let newTime = parseInt(minutes,10)*60 + parseFloat(seconds,10)

                        p.setAttribute('data-time',newTime)
                    }
                    else{ p.textContent = string}

                    $(this.el).find('.lyric>.lines').append(p)

                });
            }
            else{}



            $(this.el).find('.song-description>h1').text(song.name)


            if(data.status === 'playing'){

                $(this.el).find('.disc-container').addClass('playing')

            }else{

                $(this.el).find('.disc-container').removeClass('playing')

            }
        },
        show(time){
           let allP = $(this.el).find('.lyric>.lines>p')
            for(let i =0;i<allP.length;i++){
               if(i === allP.length -1){
                 //  console.log(allP[i])
               }
               else{
                   let currentTime = allP.eq(i).attr('data-time')
                   let nextTime = allP.eq(i+1).attr('data-time')

                   if(currentTime <= time && time <nextTime){

                       let height = allP.eq(i).offset().top- $(this.el).find('.lyric>.lines>p').offset().top
                       $(this.el).find('.lyric>.lines').css('transform',`translateY(${-height}px)`)
                       allP.eq(i).addClass('active').siblings('.active').removeClass('active')
                       break

                   }
               }

            }
        },
        play(){

            $(this.el).find('audio')[0].play()
        },
        pause(){
            $(this.el).find('audio')[0].pause()
        }

    }
    let model = {
        data: {
          song:{  id: '',
              singer: '',
              name: '',
              url: ''
          },
            status:'pause'
        },

        get(id) {   //获取数据库中的歌曲信息

            var query = new AV.Query('Song');

            return query.get(id).then((song) => {
                Object.assign(this.data.song,{id:song.id,...song.attributes})
                return song
            })

        }
    }

    let controller = {
        init(view, model) {
            this.view = view;

            this.model = model;
            let id = this.getSongId()

            this.model.get(id).then(() => {

             this.view.render(this.model.data)
            })
            this.bindEvents();
        }
        ,
        bindEvents(){
         $(this.view.el).on('click','.icon-play',() => {

             this.model.data.status = 'playing'

             this.view.render(this.model.data)

              this.view.play()

          })
            $(this.view.el).on('click','.icon-pause',() => {

                this.model.data.status = 'pause'

                this.view.render(this.model.data)

                this.view.pause()

            })
            window.eventHub.on('songEnd',() => {

                this.model.data.status = 'pause'

                this.view.render(this.model.data)
            })
        },
        getSongId() {
            let searchId = window.location.search
            /*获取查询参数*/
            let id = '';
            if (searchId.indexOf('?') === 0) {
                searchId = searchId.slice(1)
            }
            let array = searchId.split('&').filter((v => v))
            /*过滤空字符串*/
            for (let i = 0; i < array.length; i++) {
                let hash = array[i].split('=')
                let key = hash[0]
                let value = hash[1]
                if (key === 'id') {
                    id = value;
                    break;
                }
            }
            return id ;
        }
    }
    controller.init(view,model)
}







