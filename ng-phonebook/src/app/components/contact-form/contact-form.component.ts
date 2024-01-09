import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ContactService} from "../../services/contacts.service";
import {NgForm} from "@angular/forms";
import {Contact} from "../contact-list/contact";
import {ActivatedRoute, Router} from '@angular/router';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';

@Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
    model = <Contact> {};
    submitted = false;
    btnName = 'Submit';
    @Output() userAdded = new EventEmitter();
    id: number = -1;
    mode: 'create' | 'edit' = 'create';

    constructor(private contactService: ContactService) {
    }

    ngOnInit(): void {
        this.contactService.selectedContact.subscribe((contact: Contact) => {
            if(contact) {
                this.model = {...contact};
                this.mode = 'edit';
            } else {
                this.mode = 'create';
                this.model = this.createNew();
            }
        });
    }

    createNew() {
        return  {} as Contact;
    }

    getContact(id: number) {
        if(id > 0) {
            this.contactService.getById(id).subscribe((contact: Contact) => {
                this.model = {...contact};
            });
        }
    }

    onSubmit(contactForm: NgForm) {
        if(contactForm.valid) {
            this.submitted = true;
            const hasContact = this.contactService.hasContact({...this.model});
            if(hasContact) {
                alert('Already has this user');
                this.submitted = false;
                return;
            }
            let obs = this.mode == 'create' ? this.contactService.postContact(this.model) : this.contactService.putContact(this.model);
            obs.subscribe((contact) => {
                console.log('object saved', contact);
                this.model = this.createNew();
                this.submitted = false;
                contactForm.resetForm();
                this.userAdded.emit();
                if(this.mode == 'edit') {
                    // this.router.navigate(['/'])
                    this.contactService.selectedContact.next({} as Contact);
                }
                this.mode = 'create';
            });
            console.log('submitted');
        }
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}
