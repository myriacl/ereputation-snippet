import $ from 'jquery'

window.__ = function (txt) {
    return txt;
};

// window.app.ui.loadingFrame(this.$parent.$el, false)
window.app = {
    ui: {

        loading: function (onOff) {
            if (onOff) {
                //console.trace()
                $('body').addClass('loading');
            } else {
                $('body').removeClass('loading');
            }
        },
        loadingFrame: function (selector, onOff) {
            $(selector)[onOff ? 'addClass' : 'removeClass']('frame-loading');
        },
        confirm(msg) {
            return new Promise(resolve => {
                let response = window.confirm(msg);
                if (response) {
                    resolve();
                }
            });
        },
        error(msg) {
            alert('Error !' + String(msg))
        },
        success() {
            //alert('Success')
            let str = `<div class="toaster alert alert-success" role="alert" style="position: fixed; top: 0; left: 50%; margin-left: -50px;">
          Success
          </div>`
            var z = document.createElement('div'); // is a node
            z.innerHTML = str;
            document.body.appendChild(z);
            window.setTimeout(function () {
                $(".toaster.alert").fadeTo(200, 0).slideUp(200, function () {
                    $(this).remove();
                });
            }, 500);
        },
        prompt(title, value) {
            return new Promise(resolve => {
                let rep = window.prompt(title, value);
                if (rep) {
                    resolve(rep);
                }
            })
        }
    }
}
