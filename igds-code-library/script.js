/**
 * Daycare Registration Form - Validation Script
 * טופס הרשמה למעונות יום
 * Based on IGDS accessibility and UX patterns
 */

(function () {
    'use strict';

    const form = document.getElementById('daycare-form');
    if (!form) return;

    const validationRules = {
        'parent-first-name': {
            required: true,
            errorMessage: 'נא להזין שם פרטי'
        },
        'parent-last-name': {
            required: true,
            errorMessage: 'נא להזין שם משפחה'
        },
        'parent-id': {
            required: true,
            pattern: /^\d{9}$/,
            errorMessage: 'נא להזין מספר תעודת זהות תקין (9 ספרות)'
        },
        'parent-email': {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: 'נא להזין כתובת דואר אלקטרוני תקינה'
        },
        'parent-phone': {
            required: true,
            pattern: /^0\d{1,2}-?\d{7}$/,
            errorMessage: 'נא להזין מספר טלפון תקין'
        },
        'parent-address': {
            required: true,
            errorMessage: 'נא להזין כתובת מגורים'
        },
        'child-first-name': {
            required: true,
            errorMessage: 'נא להזין שם פרטי של הילד/ה'
        },
        'child-id': {
            required: true,
            pattern: /^\d{9}$/,
            errorMessage: 'נא להזין מספר תעודת זהות תקין (9 ספרות)'
        },
        'child-birth-date': {
            required: true,
            errorMessage: 'נא להזין תאריך לידה'
        },
        'daycare-area': {
            required: true,
            errorMessage: 'נא לבחור אזור מגורים'
        },
        'framework-type': {
            required: true,
            errorMessage: 'נא לבחור סוג מסגרת'
        },
        'start-date': {
            required: true,
            errorMessage: 'נא להזין תאריך תחילה'
        },
        'terms': {
            required: true,
            errorMessage: 'יש לאשר את תקנון ההרשמה'
        }
    };

    // Radio groups validated by name (errors anchored to the fieldset error element)
    const radioGroupRules = {
        'childGender': {
            required: true,
            errorElementId: 'child-gender-error',
            firstInputId: 'gender-female',
            errorMessage: 'נא לבחור מין'
        }
    };

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        clearErrors();

        const errors = validateForm();

        if (errors.length > 0) {
            showErrorSummary(errors);
            showFieldErrors(errors);
            const summary = document.querySelector('.gov-error-summary');
            if (summary) {
                summary.focus();
            }
        } else {
            showSuccess();
        }
    });

    function validateForm() {
        const errors = [];

        for (const [fieldId, rules] of Object.entries(validationRules)) {
            const field = document.getElementById(fieldId);
            if (!field) continue;

            const value = field.type === 'checkbox' ? field.checked : field.value.trim();

            if (rules.required && !value) {
                errors.push({ fieldId, message: rules.errorMessage });
                continue;
            }

            if (rules.pattern && value && !rules.pattern.test(value)) {
                errors.push({ fieldId, message: rules.errorMessage });
            }
        }

        // Radio groups
        for (const [groupName, rules] of Object.entries(radioGroupRules)) {
            if (!rules.required) continue;
            const checked = form.querySelector('input[name="' + groupName + '"]:checked');
            if (!checked) {
                errors.push({
                    fieldId: rules.firstInputId,
                    errorElementId: rules.errorElementId,
                    message: rules.errorMessage,
                    isRadioGroup: true
                });
            }
        }

        return errors;
    }

    function clearErrors() {
        const existingSummary = document.querySelector('.gov-error-summary');
        if (existingSummary) {
            existingSummary.remove();
        }

        const existingSuccess = document.querySelector('.gov-success-panel');
        if (existingSuccess) {
            existingSuccess.remove();
        }

        document.querySelectorAll('.gov-error-message').forEach(function (el) {
            el.hidden = true;
        });

        document.querySelectorAll('.gov-form-group--error').forEach(function (el) {
            el.classList.remove('gov-form-group--error');
        });

        document.querySelectorAll('.gov-input--error, .gov-select--error').forEach(function (el) {
            el.classList.remove('gov-input--error');
            el.classList.remove('gov-select--error');
        });

        document.querySelectorAll('[aria-invalid="true"]').forEach(function (el) {
            el.removeAttribute('aria-invalid');
        });
    }

    function showErrorSummary(errors) {
        const summary = document.createElement('div');
        summary.className = 'gov-error-summary';
        summary.setAttribute('role', 'alert');
        summary.setAttribute('tabindex', '-1');

        const title = document.createElement('h2');
        title.className = 'gov-error-summary__title';
        title.textContent = 'יש לתקן את השגיאות הבאות';

        const list = document.createElement('ul');
        list.className = 'gov-error-summary__list';

        errors.forEach(function (error) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#' + error.fieldId;
            link.textContent = error.message;
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.getElementById(error.fieldId);
                if (target) {
                    target.focus();
                }
            });
            li.appendChild(link);
            list.appendChild(li);
        });

        summary.appendChild(title);
        summary.appendChild(list);

        form.insertBefore(summary, form.firstChild);
    }

    function showFieldErrors(errors) {
        errors.forEach(function (error) {
            const field = document.getElementById(error.fieldId);
            if (!field) return;

            const formGroup = field.closest('.gov-form-group');
            if (formGroup) {
                formGroup.classList.add('gov-form-group--error');
            }

            if (field.classList.contains('gov-input')) {
                field.classList.add('gov-input--error');
            }
            if (field.classList.contains('gov-select')) {
                field.classList.add('gov-select--error');
            }

            field.setAttribute('aria-invalid', 'true');

            // Error message element: explicit for radio groups, convention for others
            const errorEl = document.getElementById(
                error.errorElementId || (error.fieldId + '-error')
            );
            if (errorEl) {
                errorEl.hidden = false;
                field.setAttribute('aria-describedby',
                    (field.getAttribute('aria-describedby') || '') + ' ' + errorEl.id);
            }
        });
    }

    function showSuccess() {
        form.style.display = 'none';

        const panel = document.createElement('div');
        panel.className = 'gov-success-panel';
        panel.setAttribute('role', 'status');
        panel.setAttribute('tabindex', '-1');

        panel.innerHTML = `
            <h2 class="gov-success-panel__title">ההרשמה התקבלה בהצלחה!</h2>
            <p class="gov-success-panel__body">
                בקשת ההרשמה למעון יום נקלטה. אישור מפורט יישלח לכתובת הדואר האלקטרוני שהזנת.<br>
                מספר בקשה: <strong>DAYCARE-${Date.now().toString().slice(-6)}</strong>
            </p>
        `;

        form.parentNode.insertBefore(panel, form);
        panel.focus();
    }
})();
