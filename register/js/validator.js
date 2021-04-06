function Validator(options){

    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {}

    function validate(inputElement, rule){
        // var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;
        // Lấy ra các rule của selector
        var rules = selectorRules[rule.selector];
        // Lặp qua từng rule và kiểm tra tồn tại lỗi
        for (var i = 0; i < rules.length; i++) {
            switch(inputElement.type){
                case 'radio':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                case 'checkbox':
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if(errorMessage) break;
        }

        if (errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }

        return !errorMessage;
    }
    var formElement = document.querySelector(options.form);
    if(formElement){
        //Khi submit form
        formElement.onsubmit = function(e){
            e.preventDefault();
            var isFormValid = true;
            //Lặp qua từng rule và validate
            options.rules.forEach(function (rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isvalid = validate(inputElement, rule);
                if (!isvalid){
                    isFormValid = false;
                }
            });
            
            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                    var formValues = Array.from(enableInputs).reduce(function(values, input){
                        switch(input.type){
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name='+input.name+']:checked').value;
                            break;
                            case 'checkbox':
                                if(input.value.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(value[input.name]))
                                values[input.name] = [];
                                values[input.name].push(input.value);
                            break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        
                        return values;
                    },{});
                    options.onSubmit(formValues);
                } else formElement.submit();
            }
        }
        //Lặp qua mỗi rule và xử lý (lắng nghe blur, focus, input, ....)
        options.rules.forEach(function (rule){
            //Lưu lại các rules cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else{
                selectorRules[rule.selector] = [rule.test];
            }
            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach(function(inputElement){
                
                    inputElement.onblur = function(){
                        validate(inputElement, rule);
                    }
                    inputElement.onfocus = function(){
                        inputElement.parentElement.querySelector(options.errorSelector).innerText = '';
                    }
                
            })
            
        });
    }
}
Validator.isRequired = function(selector, message){
    return {
        selector : selector,
        test : function (value){
            // if (value){
            //     return value.trim() ? undefined : message || 'Vui lòng nhập họ tên!';
            // }else{
                return value ? undefined : message || 'Vui lòng nhập họ tên!';
            // }
            
        }
    }
}
Validator.isEmail = function(selector, message){
    return {
        selector : selector,
        test : function (value){
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : message || 'Bạn nhập sai email!';
        }
    }
}
Validator.minLength = function(selector, message){
    return {
        selector : selector,
        test : function (value){
            return value.length>=6 ? undefined : message || 'Mật khẩu tối thiểu 6 kí tự!';
        }
    }
}
Validator.confirmPass = function(selector, getPasswordValue, message){
    return {
        selector : selector,
        test : function (value){
            return value === getPasswordValue() ? undefined : message || 'Nhập lại mật khẩu không trùng khớp!';
        }
    }
}