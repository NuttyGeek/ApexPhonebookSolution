import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../services/contacts.service';
import { Contact } from './contact';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  providers: [ContactService],
})
export class ContactsComponent implements OnInit {
  public contacts = [];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.readAll();
  }

  private readAll() {
    return this.contactService.loadAll().subscribe((list) => {
      this.contacts = list;
    });
  }

  handleUpdate() {
    console.log(':: handle update');
    this.readAll();
  }

  handleDelete(contact: Contact) {
    this.contactService.deleteContact(Number(contact?.id)).subscribe((res) => {
      console.log(':: delete contact', res);
      // this.readAll();
    });
  }

  handleEdit(contact: Contact) {
    // this.router.navigate([`edit/${contact.id}`]);
    this.contactService.selectedContact.next(contact);
  }
}
