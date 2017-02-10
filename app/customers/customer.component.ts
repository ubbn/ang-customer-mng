import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { Customer } from './customer';

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
