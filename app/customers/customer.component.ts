import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';

import { Customer } from './customer';

// Customer validator function
// It takes control object as a parameter and returns an object
// if invalid, return name of control for error collection
// If valid, returns null (meaning that there is no error)
function validateRating(c: AbstractControl) : { [key: string] : boolean } | null {
    if (c.value != undefined && (isNaN(c.value) || c.value < 1 || c.value >5))
        return {'range': true};
    return null;
}

// Customer validator function (with parameter)
// It is factory function that returns validator function
// In this way, custom validator function can use more parameters than default AbstractControl
function validateRatingWithParam(minVal: number, maxVal: number) : ValidatorFn {
    // wrapped anonymous function
    return (c: AbstractControl) : { [key: string] : boolean } | null => {
        if (c.value != undefined && (isNaN(c.value) || c.value < minVal || c.value > maxVal))
            return {'range': true};
        return null;
    }
}

function compareEmail(c: AbstractControl) : {[key: string]: boolean} | null {
    let email = c.get('email');
    let confirmEmail = c.get('confirmEmail');
    if (email.pristine || confirmEmail.pristine)
        return null;
    if (email.value === confirmEmail.value)
        return null;
    return {'emailMatch' : true};
}

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    customer: Customer= new Customer();
    customerForm: FormGroup;
    emailMessage: string;

    private validationMessages = {
        required: 'Please enter your email address.',
        pattern: 'Please enter a valid email address.'
    };

    constructor(private formBuilder: FormBuilder){
    }

    ngOnInit(): void {
        this.customerForm = this.formBuilder.group({ 
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.minLength(50)]],
            emailGroup : this.formBuilder.group({
                email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+")]],
                confirmEmail: ['', Validators.required ],
            }, {validator: compareEmail }),
            phone: '',
            notification: 'email',
            rating: ['', validateRatingWithParam(1, 5)], // ['', validateRating] <- without parameters
            sendCatalog: true
        });

        // Watch Observables for any changes
        this.customerForm.get('notification').valueChanges.subscribe(value => this.updateNotifiation(value));
        const emailControl = this.customerForm.get('emailGroup.email');
        emailControl.valueChanges.subscribe(value => this.setMessage(emailControl));
    }

    setMessage(c: AbstractControl): void {
        this.emailMessage = '';
        if ((c.touched || c.dirty) && c.invalid){
            this.emailMessage = Object.keys(c.errors)
                .map(key => this.validationMessages[key]).join(' ');
        }
    }

    updateNotifiation(type: string): void {
        const phoneControl = this.customerForm.get('phone');
        if (type === 'text')
            phoneControl.setValidators(Validators.required);
        else
            phoneControl.clearValidators();
        phoneControl.updateValueAndValidity();
    }

    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }
 }
