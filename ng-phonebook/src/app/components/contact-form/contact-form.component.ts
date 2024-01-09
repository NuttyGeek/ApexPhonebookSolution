import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ContactService } from "../../services/contacts.service";
import { Contact } from "../contact-list/contact";

@Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit, OnChanges {
    model = <Contact> {};
    @Input() contact: Contact = {} as Contact;
    submitted = false;
    btnName = 'Submit';
    @Output() userAdded = new EventEmitter();
    id: number = -1;
    @Input() mode: 'create' | 'edit' = 'create';

    constructor(private contactService: ContactService) {
    }

    ngOnChanges() {
        if(this.contact) {
            this.model = {...this.contact};
        }
    }

    ngOnInit(): void {
        // this.contactService.selectedContact.subscribe((contact: Contact) => {
        //     if(contact) {
        //         this.model = {...contact};
        //         this.mode = 'edit';
        //     } else {
        //         this.mode = 'create';
        //         this.model = this.createNew();
        //     }
        // });
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
        debugger;
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
                // if(this.mode == 'edit') {
                //     // this.router.navigate(['/'])
                //     // this.contactService.selectedContact.next({} as Contact);
                //     // this.userAdded.emit();
                // }
                this.mode = 'create';
            });
            console.log('submitted');
        }
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}
