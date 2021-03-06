var url_reset_password_token = getUrlParam('reset_password_token')
var origin_request = document.location.origin
var sharingUrl = origin_request + '/managements/v2/passwords/reset'
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/

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
    var googlePlay = $('.google-play')
    var appStore = $('.app-store')

    if(isAndroid){
        appStore.css({display: 'none'})
    }

    if(isiOS){
        googlePlay.css({display: 'none'})
	}
	
	newPasswordInput.on('keyup', function(e) {
		var newPasswordVal = e.target.value

		if(!newPasswordVal){
			newPasswordInput.addClass('form-input-error')
			newPasswordError.text('Please enter a new password')
			return
		} else {
			newPasswordInput.removeClass('form-input-error')
			newPasswordError.text('')
		}
		
		if(!reg.test(newPasswordVal)) {
			newPasswordInput.addClass('form-input-error')
			newPasswordError.text('Password must be at least 8 characters, include 1 uppercase, 1 lowercase and 1 number.')
			return
		} else {
			newPasswordInput.removeClass('form-input-error')
			newPasswordError.text('')
		}
	})
	
	confirmPasswordInput.on('keyup', function(e) {
		var confirmPasswordVal = e.target.value

		if(!confirmPasswordVal){
			confirmPasswordInput.addClass('form-input-error')
			confirmPasswordError.text('Please enter a confirmation password')
            return
        } else {
			confirmPasswordInput.removeClass('form-input-error')
			confirmPasswordError.text('')
		}
	})

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
			newPasswordInput.addClass('form-input-error')
			newPasswordError.text('Please enter a new password')
			return
		}

		if(!confirmPasswordVal){
			confirmPasswordInput.addClass('form-input-error')
			confirmPasswordError.text('Please enter a confirmation password')
            return
        }

        if(confirmPasswordVal != newPasswordVal){
			confirmPasswordInput.addClass('form-input-error')
			confirmPasswordError.text('Passwords do not match, please enter again')
            return
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