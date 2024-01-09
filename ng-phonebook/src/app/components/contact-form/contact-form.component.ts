import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ContactService} from "../../services/contacts.service";
import {NgForm} from "@angular/forms";
import {Contact} from "../contact-list/contact";
import {ActivatedRoute, Router} from '@angular/router';

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

    constructor(private contactService: ContactService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit(): void {
        this.route.url.subscribe((res) => {
            console.log(':: url', res);
            this.mode = res.map((r) => r.path).includes('edit') ? 'edit' : 'create';
            console.log(':: mode',this.mode);
        })
        this.route.params.subscribe((res) => {
            console.log(':: params', res, window.location.href);
            this.id = Number(res?.id);
            this.getContact(this.id);
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
            let obs = this.mode == 'create' ? this.contactService.postContact(this.model) : this.contactService.putContact(this.model);
            obs.subscribe((contact) => {
                console.log('object saved', contact);
                this.model = this.createNew();
                this.submitted = false;
                contactForm.resetForm();
                this.userAdded.emit();
                if(this.mode == 'edit') {
                    this.router.navigate(['/'])
                }
            });

            /*
            if(this.mode == 'create') {
                this.contactService.postContact(this.model)
                .subscribe(contact => {
                    console.log('object saved', contact);
                    this.model = this.createNew();
                    this.submitted = false;
                    contactForm.resetForm();
                    this.userAdded.emit();
                });
            } else if(this.mode == 'edit'){
                this.contactService.putContact(this.model)
                .subscribe(contact => {
                    console.log('object saved', contact);
                    this.model = this.createNew();
                    this.submitted = false;
                    contactForm.resetForm();
                    this.userAdded.emit();
                });
            }*/

            console.log('submitted');
            
        }
        
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}
