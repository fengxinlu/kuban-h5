var url_reset_password_token = getUrlParam('reset_password_token')
var origin_request = document.location.origin
var sharingUrl = origin_request + '/managements/v2/passwords/reset'



$(function(){
    var newPasswordInput = $('.new-password')
    var confirmPasswordInput = $('.confirm-password')
    var newPasswordError = $('.new-password-error')
    var confirmPasswordError = $('.confirm-password-error')
    var formContainer = $('.form-container')
    var kbError = $('.kb-error')
    var kbErrorText = $('.kb-error-text')
    var closeError = $('.close-error')
    var kbSuccess = $('.kb-success')
    var submitBtn = $('.submit-btn')

    submitBtn.on('click', function() {
        var newPasswordVal = newPasswordInput.val()
        var confirmPasswordVal = confirmPasswordInput.val()
        var errorTextStyle = { display: 'block' }
        var errorInputStyle = { borderColor: '#ff5a5f' }
        var isDisabled = submitBtn.attr('disabled')

        if(isDisabled){
            return
        }

        if(!newPasswordVal){
            return showError('Please enter a new password')
        }

        if(!confirmPasswordVal){
            return showError('Please enter a confirmation password')
        }

        if(newPasswordVal.length < 8 || confirmPasswordVal.length < 8){
            return showError('Your password must contain at least 8 characters')
        }

        if(confirmPasswordVal != newPasswordVal){
            return showError('Inconsistent entry password')
        }

        submitBtn.addClass('submitting')
        submitBtn.attr('disabled', 'true')
        submitAjax(sharingUrl,{password: newPasswordVal, password_confirmation : confirmPasswordVal, reset_password_token: url_reset_password_token})

    })

    closeError.on('click', function() {
        kbErrorText.text('')
        kbError.css({display: 'none'})
    })

    function showError(text) {
        kbErrorText.text(text)
        kbError.css({display: 'flex'})
    }

    function submitAjax(url,params){
        $.ajax({
            type: 'put',
            url: url,
            data : params,
            ContentType: 'application/json',
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    'Accept' , 'application/json'
                )
            },
            success: function(data){
                submitBtn.removeClass('submitting')
                submitBtn.removeAttr('disabled')
                kbError.css({display: 'none'})
                formContainer.css({display: 'none'})
                kbSuccess.css({display: 'block'})
            },
            error: function(xhr){
                submitBtn.removeClass('submitting')
                submitBtn.removeAttr('disabled')
                var errorRes = xhr.response && JSON.parse(xhr.response)
                var errorMessage = errorRes && errorRes.message

                if(xhr.status == 422 && errorMessage){
                    return showError(errorMessage)
                }
                return showError('Server error, please try again later')
            }
        })
    }

    function resetFormStyle() {
        var initTextStyle = { display: 'none' }
        var initInputStyle = { borderColor: '#aaa' }

        newPasswordError.text('').css(initTextStyle)
        confirmPasswordError.text('').css(initTextStyle)

        newPasswordInput.css(initInputStyle)
        confirmPasswordInput.css(initInputStyle)
    }
})

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}