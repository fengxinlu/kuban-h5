var url_reset_password_token = getUrlParam('reset_password_token')
var origin_request = document.location.origin
var sharingUrl = origin_request + '/api/v2/passwords/reset'
var reg = /^\d{6,}$/

$(function(){
    var submitBtn = $('.submitBtn')
    var newPasswordInput = $('.newPassword')
    var confirmPasswordInput = $('.confirmPassword')
    var newPasswordError = $('.error_1')
    var confirmPasswordError = $('.error_2')
    var resetForm = $('.resetForm')
    var successContent = $('.successContent')

    submitBtn.on('click', function () {
        var newPasswordVal = newPasswordInput.val()
        var confirmPasswordVal = confirmPasswordInput.val()
        var isDisabled = submitBtn.attr('disabled')

        if(isDisabled){
            return
        }

        if(!newPasswordVal){
            newPasswordError.text('请输入密码')
            newPasswordError.css({display: 'block'})
            return
        }else{
            newPasswordError.text('')
            newPasswordError.css({display: 'none'})
        }

        if(!confirmPasswordVal){
            confirmPasswordError.text('请输入确认密码')
            confirmPasswordError.css({display: 'block'})
            return
        }else{
            confirmPasswordError.text('')
            confirmPasswordError.css({display: 'none'})
        }

        if(!reg.test(newPasswordVal)) {
            newPasswordError.text('请输入6位或6位以上位数密码')
            newPasswordError.css({display: 'block'})
            return
        }else{
            newPasswordError.text('')
            newPasswordError.css({display: 'none'})
        }

        if(newPasswordVal != confirmPasswordVal){
            confirmPasswordError.text('密码不匹配，请再次输入')
            confirmPasswordError.css({display: 'block'})
            return
        }else{
            confirmPasswordError.text('')
            confirmPasswordError.css({display: 'none'})
        }

        submitBtn.addClass('submitting')
        submitBtn.attr('disabled', 'true')
        submitAjax(sharingUrl,{password: newPasswordVal, password_confirmation : confirmPasswordVal, reset_password_token: url_reset_password_token})
    })

    function showError(text) {
        confirmPasswordError.text(text)
        confirmPasswordError.css({display: 'block'})
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
            success: function(){
                submitBtn.removeClass('submitting')
                submitBtn.removeAttr('disabled')
                resetForm.css({display: 'none'})
                successContent.css({display: 'flex'})
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
})

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}