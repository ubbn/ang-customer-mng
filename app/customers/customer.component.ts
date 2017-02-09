import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

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
            firstName: '',
            lastName: '',
            email: '',
            sendCatalog: true
        });
    }

    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }
 }
