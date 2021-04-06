let pw = document.querySelector('#password');
let pwToggle = document.querySelector('.pw-toggle');
function passwordToggleDown(){
        pwToggle.classList.add('fa-eye');
        pwToggle.classList.remove('fa-eye-slash');
        pw.type = 'text';    
}
function passwordToggleUp(){
    pw.type = 'password';
    pwToggle.classList.remove('fa-eye');
    pwToggle.classList.add('fa-eye-slash'); 
}
function passwordToggle(){
    if (pw.type == 'password'){
        pwToggle.classList.add('fa-eye');
        pwToggle.classList.remove('fa-eye-slash');
        pw.type = 'text';  
    } else {
        pw.type = 'password';
        pwToggle.classList.remove('fa-eye');
        pwToggle.classList.add('fa-eye-slash');
    }   
}