// Add phone number masking for all input[type="tel"] fields
var input_tel_list = document.querySelectorAll('input[type="tel"]');
var maskOptions = { mask: '(000) 000-0000' };

input_tel_list.forEach(function(input) {
    IMask(input, maskOptions);
});


var add_issue_button = document.querySelector('#btn-add-issue');

if (add_issue_button) {
    add_issue_button.addEventListener('click', function() {
        AddIssuePage();
    });
}


function SetupFormListeners() {
    if ($('[data-form-submit-target]').length) {
        $('[data-form-submit-target]').each(function() {
            let form_submit_button = $('[data-form-submit-target]');
            let form = $('#' + $(form_submit_button).attr('data-form-submit-target'));
            let form_inputs = $('#' + form.attr('id') + ' input, ' + '#' + form.attr('id') + ' textarea');

            SetupInputListeners(form_inputs);

            $(this).on('click', function(event) {
                EvaluateFormSubmit(form, form_inputs);
            });
        });
    }
    else {
		return;
	}
}

function SetupInputListeners(form_inputs) {
    $(form_inputs).each(function() {
        if ($(this.parentElement).hasClass('form-set-required')) {
            $(this).on('change', function(event) {
                if (this.value !== '') {
                    $(this.parentElement).removeClass('form-set-failed');
                }
            });
        }
    });
}

function EvaluateFormSubmit(form, form_inputs) {
    let form_inputs_evaluated = ValidateFormFields(form_inputs);

    ProcessFormFields(form_inputs_evaluated[0], form_inputs_evaluated[1]);

    if (form_inputs_evaluated[0].length === 0) {
        let form_submit_json_string = BuildFormSubmitJson(form_inputs);
        ProcessFormSubmit(form, form_submit_json_string);
    }
}

function ValidateFormFields(form_inputs) {
    let failed_inputs = [];
    let passed_inputs = [];

    $(form_inputs).each(function() {
        if ($(this.parentElement).hasClass('form-set-required')) {
            if (this.value !== '') {
                if (this.hasAttribute('data-regex-check')) {
                    if (CheckFieldValueFormat(this)) {
                        passed_inputs.push(this);
                    }
                    else {
                        failed_inputs.push(this);
                    }
                }
                else {
                    passed_inputs.push(this);
                }
            }
            else {
                failed_inputs.push(this);
            }
        }
    });

    return [failed_inputs, passed_inputs];
}

function CheckFieldValueFormat(field) {
    let regex_email_check = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    let regex_phone_check = RegExp(/^.{14}$/);

    switch (field.getAttribute('data-regex-check')) {
        case 'email':
            if (regex_email_check.test(field.value)) {
                return true;
            }
            else {
                return false;
            }
            break;

        case 'tel':
            if (regex_phone_check.test(field.value)) {
                return true;
            }
            else {
                return false;
            }
            break;
    
        default:
            return true;
            break;
    }
    
}

function ProcessFormFields(failed_inputs, passed_inputs) {
    if (failed_inputs.length > 0) {
        failed_inputs[0].focus();
    }

    $(failed_inputs).each(function() {
        $(this.parentElement).addClass('form-set-failed');
    });

    $(passed_inputs).each(function() {
        $(this.parentElement).removeClass('form-set-failed');
    });
}

function BuildFormSubmitJson(form_inputs) {
    let form_value_json = {};

    $(form_inputs).each(function() {
        if (this.id !== 'recaptcha-token' && this.id !== 'g-recaptcha-response') { // Add check for Google reCaptcha hidden input
            if (this.type === 'checkbox') {
                form_value_json[this.getAttribute('data-db-field-name')] = this.checked;
            }
            else {
                form_value_json[this.getAttribute('data-db-field-name')] = ReplaceBadUrlParamCharacters(this.value);
            }
        }
    });

    return JSON.stringify(form_value_json);
}

function ReplaceBadUrlParamCharacters(fix_string) {
    let bad_chars = ['&'];
    let char_rep_with = ['and'];

    bad_chars.forEach((char, index) => {
        var char_all = new RegExp(char, 'g');
        fix_string = fix_string.replace(char_all, char_rep_with[index])
    });

    return fix_string;
}

function ProcessFormSubmit(form, form_submit_json_string) {
    let url = 'https://dev-webapi.wda.state.mi.us/SixtyBy30/SaveJsonLog?JsonLogData=' + encodeURI(form_submit_json_string);

    UpdateFormDisplay(form, 'loading');

    $.ajax({
        type: "POST",
        url: url
    })
    .done(function() {
        UpdateFormDisplay(form, 'success');
    })
    .fail(function() {
        UpdateFormDisplay(form, 'error');
    })
    .always(function() {
        console.log("finished");
    });
}

function UpdateFormDisplay(form, request_status_code) {
    if (request_status_code === 'loading') {
        $('[data-form-loading-target=' + form.attr('id') + ']').addClass('form-spinner-show');

        var elements_to_hide = document.querySelectorAll('[data-hide-on-submit]');

        elements_to_hide.forEach(function(element) {
            $(element).hide();
        });
    }
    else {
        $('[data-form-loading-target=' + form.attr('id') + ']').removeClass('form-spinner-show');

        form.hide();

        if (request_status_code === 'success') {
            $('[data-form-results-target=' + form.attr('id') + ']').addClass('form-results-success');
            $('[data-form-results-target=' + form.attr('id') + '] .results-success').focus();
        }
        else {
            $('[data-form-results-target=' + form.attr('id') + ']').addClass('form-results-fail');
            $('[data-form-results-target=' + form.attr('id') + '] .results-fail').focus();
        }
    }
}


function AddIssuePage() {
    var src_list = document.querySelectorAll("[data-form-page-source]");
    var src_copy = src_list[0].cloneNode(true);

    src_copy.removeAttribute('hidden');

    src_copy.querySelector('.form-page-number').innerHTML = src_list.length;

    var form_pages = document.querySelectorAll('[data-form-page-source]');

    var last_form_page = form_pages[form_pages.length-1];

    last_form_page.parentNode.insertBefore(src_copy, last_form_page.nextSibling);
}