import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {Contact} from "../components/contact-list/contact";
import {Subject} from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()
export class ContactService {
    contacts: any[] = [];
    // selectedContact = new Subject<Contact>();

    constructor(private http: HttpClient) {
    }
    serverUrl = 'http://localhost:8080/api/contact';

    private static handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        return throwError(
            'Something bad happened; please try again later.');
    }

    postContact(contact: Contact) {
        return this.http.post<Contact>(this.serverUrl, contact, httpOptions)
            .pipe(catchError(ContactService.handleError));
    }

    putContact(contact: Contact) {
        return this.http.put<Contact>(this.serverUrl + '/' + contact.id, contact, httpOptions)
            .pipe(catchError(ContactService.handleError));
    }

    deleteContact(id: number) {
        return this.http.delete(this.serverUrl+'/'+id, httpOptions)
            .pipe(catchError(ContactService.handleError));
    }

    loadAll() {
        return this.http.get<Contact[]>(this.serverUrl, httpOptions)
            .pipe(
                tap((res: any) => {
                    this.contacts = res;
                }),
                catchError(ContactService.handleError),
                );
    }

    getById(id) {
        return this.http.get<Contact>(this.serverUrl + '/' + id, httpOptions)
            .pipe(catchError(ContactService.handleError));
    }

    hasContact(contact: Contact): boolean {
        const found = this.contacts.findIndex((c: Contact) => (c.firstName.toLowerCase() == contact?.firstName?.toLowerCase()) && (c.lastName.toLowerCase() == contact?.lastName?.toLowerCase()));
        return found > -1;
    }

}
