{

    let view = {
        el:'.page-1',
        init(){
            this.$el = $(this.el)
        },
        show(){
            this.$el.addClass('active')
        }
        ,hide(){
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view,model) {
            this.view = view;
            this.view.init();
            this.model = model;
            this.bindEventHub();
            this.loadModules1();
            this.loadModules2();
        }

        ,
        bindEventHub(){
            window.eventHub.on('selectTab',(tabName) => {
                if( tabName === 'page-1'){
                    this.view.show();
                }
                else{
                    this.view.hide();
                }
            })
        },
        loadModules1(){
            let script1 = document.createElement('script')
            script1.src = './js/index/page-1-1.js'
            script1.onload = () => {

            }
            document.body.appendChild(script1)
        },
        loadModules2(){
            let script2 = document.createElement('script')
            script2.src = './js/index/page-1-2.js'
            script2.onload = () => {

            }
            document.body.appendChild(script2)
        }

    }
    controller.init(view,model);
}