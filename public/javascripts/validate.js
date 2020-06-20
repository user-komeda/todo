$(() => {
  console.error('test')
  $('.form').submit((event) => {
    const passform1 = $('#js_password1').val()
    const passform2 = $('#js_password2').val()
    console.log(passform1, passform2)
    const pattern = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,25}$/
    if (passform1 !== passform2) {
      console.log('test')
      event.preventDefault()
      alert('パスワードが一致しません')
    }
    if (!pattern.test(passform1) && !pattern.test(passform2)) {
      event.preventDefault()
      alert('パスワードには小文字と大文字を含め8文字以上にしてください')
    }
  })
})
