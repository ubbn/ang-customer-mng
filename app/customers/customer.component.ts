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

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    customer: Customer= new Customer();
    customerForm: FormGroup;

    constructor(private formBuilder: FormBuilder){
    }

    ngOnInit(): void {
        this.customerForm = this.formBuilder.group({ 
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.minLength(50)]],
            email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+")]],
            phone: '',
            notification: 'email',
            rating: ['', validateRatingWithParam(1, 5)], // ['', validateRating] <- without parameters
            sendCatalog: true
        });
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
