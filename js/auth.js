const checkUser = () => {
  let username = localStorage.getItem('username').trim();

  if (!username) {
    document.body.classList.remove('authorized')
    document.getElementById('userIcon').setAttribute('src', '../../img/user_out.png')
    document.getElementById('profile').innerHTML = 'Log in to your account to save statistics'
  } else {
    document.body.classList.add('authorized')
    document.getElementById('userIcon').setAttribute('src', '../../img/user_in.png')
    document.getElementById('profile').innerHTML = username
  }
  return username;
}

// User buttons handlers
const userIcon = document.getElementById('userIcon')
const dropDown = document.getElementById('dropdown_user')

userIcon.addEventListener('click', function () {
  console.dir('');
  dropDown.style.display = dropDown.style.display === 'none' ? 'flex' : 'none'
  dropDown.style.height = dropDown.style.height === '0px' ? 'auto' : '0px'
})

// Popup header handler
const loginPopup = document.getElementById('loginPopup')

const headerRegister = document.getElementById('headerRegister')
const headerSignIn = document.getElementById('headerSignIn')
const popupHeaderButtons = Array.from(document.getElementsByClassName('popup_header__button'))

const popupForms = Array.from(document.getElementsByClassName('popupForm'))
const registerForm = document.getElementById('registerForm')
const signinForm = document.getElementById('signinForm')

popupHeaderButtons.forEach(btn => {
  btn.addEventListener('click', function (e) {
    popupHeaderButtons.map(item => {
      item === e.target ? item.classList.add('popup_button__active') : item.classList.remove('popup_button__active')
      headerRegister.classList.contains('popup_button__active') ? registerForm.classList.add('popupForm_active') : registerForm.classList.remove('popupForm_active')
      headerSignIn.classList.contains('popup_button__active') ? signinForm.classList.add('popupForm_active') : signinForm.classList.remove('popupForm_active')
    })
  })
})

// Overflow handler
const overflow = document.getElementById('overflow')
const closeOverflow = document.getElementById('closeOverflow')
const showOverflow = () => {
  overflow.style.display = 'flex'
}
overflow.addEventListener('click', function (e) {
  e.target === overflow || e.target === closeOverflow ? overflow.style.display = 'none' : overflow.style.display = 'flex'
})

document.addEventListener('DOMContentLoaded', function () {
  var local = localStorage.getItem('username');
  !local ? localStorage.setItem('username', '') : console.log('user in')
  checkUser()
});

var checkPass = function () {
  if (document.getElementById('newPass').value === document.getElementById('newPassRepeat').value) {
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').innerHTML = 'Passwords match';
    return true
  } else {
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = "Passwords don't match";
    console.log('not ok')
  }
}

var nameInput = document.getElementById('newName');

nameInput.addEventListener('keypress', function ( event ) {  
   var key = event.keyCode;
    if (key === 32) {
      event.preventDefault();
    }
});

const register = () => {
  var username = document.getElementById('newName').value.trim()
  var pass = document.getElementById('newPass').value.trim()
  var date = new Date();
  var current_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  var docRef = db.collection("users").doc(username);
  var passwordInput = document.getElementById('newPass').value
  var passwordRepeat = document.getElementById('newPassRepeat').value

  docRef.get().then((doc) => {
    if (doc.exists) {
      document.getElementById('message').style.color = 'red';
      document.getElementById('message').innerHTML = "Username is already taken";
      console.log("Username is taken");
    } else {
      if (passwordInput && passwordInput === passwordRepeat) {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerHTML = 'Passwords match';
        setTimeout(() => {
          localStorage.setItem('username', username);
        }, 500)
        db.collection('users').doc(username).set({
          username: username,
          password: pass,
          dateRegistered: `${current_date}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        })

          .then((docRef) => {

            setTimeout(() => {
              checkUser()
            }, 500)
            console.log("New user added");
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });

        overflow.style.display = 'none'
      } else if (!password) {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = "Password can not be empty";
        return false
      } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = "Passwords don't match";
        console.log('not ok')
        return false
      }

    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
}
const login = () => {
  var username = document.getElementById('getName').value.trim()
  var pass = document.getElementById('getPass').value.trim()

  var docRef = db.collection("users").doc(username);

  docRef.get().then((doc) => {
    if (doc.exists) {
      if (doc.data().password === pass) {
        document.body.classList.add('authorized')
        localStorage.getItem('username').trim() === '' ? localStorage.setItem('username', username) : ''
        overflow.style.display = 'none'
        document.getElementById('messageLogin').innerHTML = "";
        checkUser()
      } else {
        document.getElementById('messageLogin').style.color = 'red';
        document.getElementById('messageLogin').innerHTML = "User not found or wrong password";
      }

    } else {
      console.log("No such document!");
      document.getElementById('messageLogin').style.color = 'red';
      document.getElementById('messageLogin').innerHTML = "User not found or wrong password";
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
  dropDown.style.display = 'none'
  dropDown.style.height = '0px'
}

const logout = () => {
  localStorage.setItem('username', '');
  dropDown.style.display = 'none'
  dropDown.style.height = '0px'
  checkUser()
}
