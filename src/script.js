class User {
    #data = {};

    constructor (dataContact) {
        if (!dataContact) return;
        if (!dataContact.name && !dataContact.lastname && !dataContact.email && !dataContact.address && !dataContact.phone) return;
        this.#data = dataContact;
    };
    
    edit(newData) {
        if (!newData) return;
        if (newData.name !== undefined && newData.email !== undefined && newData.address !== undefined && newData.phone.length == 0 && newData.name.length == 0 && newData.email.length == 0 && newData.address.length == 0 && newData.phone.length == 0) return;

        this.#data = {...this.#data, ...newData};
    };
    
    get() {
        return this.#data;
    };
};

class Contacts {

    #lastId = 0;
    #data = [];

    add(contactData) {
        if (!contactData) return;

        const user = new User(contactData);
        const contactKey = Object.keys(user.get());
        if (contactKey.length == 0) return;
        this.#lastId++;
        user.id = this.#lastId;

        this.#data.push(user);
    };

    edit(id, newData) {
        if(!id) return;

        const contact = this.#data.find(item => item.id == id);
        if (!contact) return;
        
        contact.edit(newData);
    };

    remove(id){
        if(!id) return;

        const newData = this.#data.filter(item => item.id !== id)
        this.#data = newData;
    };

    get(id) {
        if (id > 0) {
            const contact = this.#data.find(item => item.id == id);
            return contact.get();
        } 
        return this.#data;
    };
};

class ContactsApp extends Contacts {

    #data = [];
    #contactsBox = null;
    #inputName  = null;
    #inputLastName  = null;
    #inputEmail  = null;
    #inputAddress  = null;
    #inputPhone  = null;
    
    constructor(idElem) {
        super();
        this.createUIApp(idElem);
    };
    
    update = () => {
        this.#data = this.get();
        this.#contactsBox.innerHTML = '';

        this.#data.forEach(elem => {
            let id = elem.id;
            elem = elem.get();

            const contactElem = document.createElement('li');
            const contactElemShort = document.createElement('div');
            contactElemShort.classList.add('contact__short');

            switch (true) {
                case elem.name != '':
                case elem.lastname != '':
                    contactElemShort.innerHTML = `${elem.name} ${elem.lastname}`;
                break;
                case elem.email != '':
                    contactElemShort.innerHTML = `${elem.email}`;
                break;
                case elem.phone != '':
                    contactElemShort.innerHTML = `${elem.phone}`;
                    break;
                default:
                    contactElemShort.innerHTML = `No name`;
                break;
            }

            const contactElemFull = document.createElement('div');
            contactElemFull.classList.add('contact__full');
            if (elem.name) contactElemFull.innerHTML = `<div class="contact__name"><span>Имя</span><span>${elem.name}</span></div>`;
            if (elem.lastname) contactElemFull.innerHTML += `<div class="contact__lastname"><span>Фамилия</span><span>${elem.lastname}</span></div>`;
            if (elem.email) contactElemFull.innerHTML += `<div class="contact__email"><span>Эл.почта</span><span>${elem.email}</span></div>`;
            if (elem.address) contactElemFull.innerHTML += `<div class="contact__address"><span>Адрес</span> <span>${elem.address}</span></div>`;
            if (elem.phone) contactElemFull.innerHTML += `<div class="contact__phone"><span>Телефон</span><span>${elem.phone}</span></div>`;
    
            const btnsShow = document.createElement('div');
            btnsShow.classList.add('contacts__show__btns');

            const btnEdit = document.createElement('button');
            btnEdit.classList.add('contacts__show__btn');
            btnEdit.classList.add('edit_contact');
            btnEdit.innerHTML = '<div>&#9998;</div>';
            
            const btnDelete = document.createElement('button');
            btnDelete.classList.add('contacts__show__btn');
            btnDelete.classList.add('delete_contact');
            btnDelete.innerHTML = 'Del'; 
    
            const btnBack = document.createElement('button');
            btnBack.classList.add('contacts__show__btn');
            btnBack.classList.add('back_contact');
            btnBack.innerHTML = '<'; 
    
            btnsShow.append(btnBack, btnDelete, btnEdit);
            contactElemFull.append(btnsShow);

            contactElem.append(contactElemShort, contactElemFull);
            this.#contactsBox.append(contactElem);

            contactElemFull.removeAttribute('style'); 

            contactElemShort.addEventListener('click', () => {
                contactElemFull.style.animation = 'toleft 1s ease 0s forwards';
            });

            btnBack.addEventListener('click', function(){
                contactElemFull.style.animation = 'toright 1s ease 0s forwards';
                });

            btnDelete.addEventListener('click', ()=>{
                this.onRemove(id);
                contactElemFull.remove();
            });
            
            btnEdit.addEventListener('click', () => {
                this.onEdit(id);
            });
        })
        // this.setStorage();
        this.storage = this.#data;
    }

    onRemove = (id) => {
        if(!id) return;
        this.remove(id);
        this.update();
    };

    onEdit = (id) => {
        if(!id) return;
        const elem = this.get(id);

        const listContacts = document.querySelector('.contacts__show');

        if (!listContacts) return;

        const formEdit = document.createElement('div');
        formEdit.classList.add('contacts__edit');

        const pName = document.createElement('p');
        pName.innerHTML = 'Name:';
        const pLastname  = document.createElement('p');
        pLastname.innerHTML = 'Last name:';
        let pEmail = document.createElement('p');
        pEmail.innerHTML = 'Email:';
        const pAddress = document.createElement('p');
        pAddress.innerHTML = 'Address:';
        const pPhone = document.createElement('p');
        pPhone.innerHTML = 'Phone:';
        
        const itemName = document.createElement('div');
        const inputName = document.createElement('input');
        inputName.classList.add('contacts__item');
        inputName.classList.add('name');
        inputName.type = 'text';
        inputName.name = 'name';
        inputName.placeholder = 'Input name';
        if (elem.name && elem.name.length > 0) inputName.value = elem.name;
        itemName.append(pName, inputName);

        const itemLastName = document.createElement('div');
        const inputLastName = document.createElement('input');
        inputLastName.classList.add('contacts__item');
        inputLastName.classList.add('lastName');
        inputLastName.type = 'text';
        inputLastName.name = 'lastName';
        inputLastName.placeholder = 'Input lastname';
        if (elem.lastname && elem.lastname.length > 0) inputLastName.value = elem.lastname;
        itemLastName.append(pLastname,inputLastName);

        const itemEmail = document.createElement('div');
        const inputEmail = document.createElement('input');
        inputEmail.classList.add('contacts__item');
        inputEmail.classList.add('email');
        this.#inputEmail.type = 'email';
        inputEmail.name = 'email';
        inputEmail.placeholder = 'name@mail.com';
        if (elem.email && elem.email.length > 0) inputEmail.value = elem.email;
        itemEmail.append(pEmail, inputEmail);

        const itemAddress = document.createElement('div');
        const inputAddress = document.createElement('input');
        inputAddress.classList.add('contacts__item');
        inputAddress.classList.add('address');
        inputAddress.type = 'text';
        inputAddress.name = 'address';
        inputAddress.placeholder = 'Input address';
        if (elem.address && elem.address.length > 0) inputAddress.value  = elem.address;
        itemAddress.append(pAddress, inputAddress);

        const itemPhone = document.createElement('div');
        const inputPhone = document.createElement('input');
        inputPhone.classList.add('contacts__item');
        inputPhone.classList.add('phone');
        inputPhone.type ='tel';
        inputPhone.name ='phone';
        inputPhone.placeholder ='+375 XX XXX-XX-XX';
        if (elem.phone && elem.phone.length > 0) inputPhone.value  = elem.phone;
        itemPhone.append(pPhone, inputPhone);

        const btnFormAdd = document.createElement('div');
        
        const btnEdit = document.createElement('button');
        btnEdit.classList.add('contacts__add__btn');
        btnEdit.classList.add('add_contact');
        btnEdit.innerHTML = 'Done';

        const btnClose = document.createElement('button');
        btnClose.classList.add('contacts__add__btn');
        btnClose.classList.add('show_contacts');
        btnClose.innerHTML = 'Cancel';
        btnFormAdd.append(btnEdit, btnClose);

        formEdit.append(itemName,itemLastName, itemEmail, itemAddress, itemPhone, btnFormAdd);
        listContacts.append(formEdit);

        btnEdit.addEventListener('click', () => {
            const name = inputName.value;
            const lastname = inputLastName.value;
            const email = inputEmail.value;
            const address = inputAddress.value;
            const phone = inputPhone.value;
            
            const newData = {
                name: name,
                lastname: lastname,
                address: address,
                phone: phone
            };

            let regExp  = /^\D[a-zA-Z0-9_-]{2,}@[\w-]{2,11}\.[\w]{2,11}$/gi;
            if (regExp.test(inputEmail.value) == true || inputEmail.value == '') {
                let elemPopUp = document.querySelector('.popup__incorrect');
                if (elemPopUp) elemPopUp.remove();
                newData.email = email;
            } else {
                this.popupIncorrectEmail();
                return;
            }

            this.edit(id, newData);
            this.update();
            formEdit.remove();
        });
        
        btnClose.addEventListener('click', () => {
            formEdit.remove();
            let elemPopUp = document.querySelector('.popup__incorrect');
            if (elemPopUp) elemPopUp.remove();
        });
    
        this.update();
        
    };

    popupIncorrectEmail = () => {
        
        let editMail = document.querySelectorAll('.email')[0];
    
        let elemPopUp = document.createElement('div');
        elemPopUp.classList.add('popup__incorrect');

        let elemPopUpContent = document.createElement('span');
        elemPopUpContent.classList.add('popup__content');
        elemPopUpContent.innerHTML = 'Incorrect input of email';
        elemPopUp.append(elemPopUpContent);

        if (this.#inputEmail && this.#inputEmail.value.length > 0) {

            elemPopUp.style.display="block";
            this.#inputEmail.after(elemPopUp);
            
            this.#inputEmail.addEventListener('input', function(event) {
                let regExp  = /^\D[a-zA-Z0-9_-]{2,}@[\w-]{2,11}\.[\w]{2,11}$/gi;

                if (event.target.value == '' || regExp.test(event.target.value) == true) {
                    elemPopUp.style.display="none";
                    elemPopUp.remove();
                }
            });
        } else if (editMail && editMail.value.length > 0) {

            elemPopUp.style.display="block";
            editMail.after(elemPopUp);
            
            editMail.addEventListener('input', function(event) {
                let regExp  = /^\D[a-zA-Z0-9_-]{2,}@[\w-]{2,11}\.[\w]{2,11}$/gi;

                if (event.target.value == '' || regExp.test(event.target.value) == true) {
                    elemPopUp.style.display="none";
                    elemPopUp.remove();
                }
            });
        }
    };

    // setStorage = () => {
    set storage (data){

        let dataTmp = data.map(item => {
            return {...{ id: item.id }, ...item.get()};
        });
        let dataJson = JSON.stringify(dataTmp);

        if (!dataJson) return;

        localStorage.setItem('dataContacts', dataJson);

        if (dataJson || dataJson != '[]') this.setCookie('dataContactsExpire', 1, {secure: true, 'max-age': 86400 })
    };

    // getStorage = ()=> {
    get storage (){

        let dataContactsJson = localStorage.getItem('dataContacts');
        dataContactsJson = JSON.parse(dataContactsJson);

        if (!dataContactsJson) return;

        dataContactsJson.forEach((elem) =>{
            delete elem.id;
            this.add(elem);
        })
    };


    getCookie = (name) => { let matches = document.cookie.match(new RegExp( "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)" )); return matches ? decodeURIComponent(matches[1]) : undefined; };

    setCookie(name, value, options = {}) { options = { path: '/', ...options }; if (options.expires instanceof Date) { options.expires = options.expires.toUTCString(); } let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value); for (let optionKey in options) { updatedCookie += "; " + optionKey; let optionValue = options[optionKey]; if (optionValue !== true) { updatedCookie += "=" + optionValue; } } document.cookie = updatedCookie; };

    getData = async () => {
        await fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => {
            if (response.ok && response.status == 200) return response.json();
        })
        .then(dataJson => {
            if (dataJson && dataJson.length > 0) {
                let newDataContacts = dataJson.map(item => {
                    return { name: item.name,
                        lastname: '',
                        email: item.email,
                        address: item.address.city,
                        phone: item.phone};
                    });
                
                newDataContacts.forEach(elem => {
                    this.add(elem);
                });
            }
            this.update();
        });
    };

    onAdd = () => {
        if (!this.#inputName && !this.#inputLastName && !this.#inputEmail && !this.#inputAddress && !this.#inputPhone) return;
        
        const name = this.#inputName.value;
        const lastname = this.#inputLastName.value;
        const email = this.#inputEmail.value;
        const address = this.#inputAddress.value;
        const phone = this.#inputPhone.value;
        
        this.add({
            name: name,
            lastname: lastname,
            email: email,
            address: address,
            phone: phone
        });
        
        this.update();
        
        this.#inputName.value  = '';
        this.#inputLastName.value  = '';
        this.#inputEmail.value  = '';
        this.#inputAddress.value  = '';
        this.#inputPhone.value  = '';
    };

    createUIApp = (idElem) => {

        const storageContactDel = this.getCookie('dataContactsExpire');
        
        if (!storageContactDel) localStorage.removeItem('dataContacts');

        // this.getStorage();
        this.storage;

        if (this.get().length == 0) this.getData();``
        
        const rootElem = document.querySelector('#' + idElem);

        if (!rootElem) return;

        const addForm = document.querySelector('.contacts__add');
        const listContacts = document.querySelector('.contacts__show');

        if (!listContacts || !addForm) return;

        //  create contact presentation 

        const h3Show = document.createElement('h3');
        h3Show.innerHTML = 'Contacts';
        this.#contactsBox = document.createElement('ul');
        this.#contactsBox.classList.add('contacts__show_list');

        const btnNewAdd = document.createElement('button');
        btnNewAdd.classList.add('contacts__btn');
        btnNewAdd.classList.add('add_newContact');
        btnNewAdd.innerHTML = 'Add new contact';

        listContacts.append(btnNewAdd, h3Show, this.#contactsBox);
        
        //  create contact enter 

        const pName = document.createElement('p');
        pName.innerHTML = 'Name:';
        const pLastname  = document.createElement('p');
        pLastname.innerHTML = 'Last name:';
        let pEmail = document.createElement('p');
        pEmail.innerHTML = 'Email:';
        const pAddress = document.createElement('p');
        pAddress.innerHTML = 'Address:';
        const pPhone = document.createElement('p');
        pPhone.innerHTML = 'Phone:';
        
        const itemName = document.createElement('div');
        this.#inputName = document.createElement('input');
        this.#inputName.classList.add('contacts__item');
        this.#inputName.classList.add('name');
        this.#inputName.type = 'text';
        this.#inputName.name = 'name';
        this.#inputName.autocomplete = 'on';
        this.#inputName.placeholder = 'Input name';
        itemName.append(pName, this.#inputName);

        const itemLastName = document.createElement('div');
        this.#inputLastName = document.createElement('input');
        this.#inputLastName.classList.add('contacts__item');
        this.#inputLastName.classList.add('lastName');
        this.#inputLastName.type = 'text';
        this.#inputLastName.name = 'lastName';
        this.#inputLastName.placeholder = 'Input lastname';
        itemLastName.append(pLastname, this.#inputLastName);

        const itemEmail = document.createElement('div');
        this.#inputEmail = document.createElement('input');
        this.#inputEmail.classList.add('contacts__item');
        this.#inputEmail.classList.add('email');
        this.#inputEmail.type = 'email';
        this.#inputEmail.name = 'email';
        this.#inputEmail.placeholder = 'name@mail.com';
        itemEmail.append(pEmail, this.#inputEmail);

        const itemAddress = document.createElement('div');
        this.#inputAddress = document.createElement('input');
        this.#inputAddress.classList.add('contacts__item');
        this.#inputAddress.classList.add('address');
        this.#inputAddress.type = 'text';
        this.#inputAddress.name = 'address';
        this.#inputAddress.placeholder = 'Input address';
        itemAddress.append(pAddress, this.#inputAddress);

        const itemPhone = document.createElement('div');
        this.#inputPhone = document.createElement('input');
        this.#inputPhone.classList.add('contacts__item');
        this.#inputPhone.classList.add('phone');
        this.#inputPhone.type ='tel';
        this.#inputPhone.name ='phone';
        this.#inputPhone.placeholder ='+375 XX XXX-XX-XX';
        itemPhone.append(pPhone, this.#inputPhone);

        const btnFormAdd = document.createElement('div');
        const btnAdd = document.createElement('button');
        btnAdd.classList.add('contacts__add__btn');
        btnAdd.classList.add('add_contact');
        btnAdd.innerHTML = 'Done';

        const btnShow = document.createElement('button');
        btnShow.classList.add('contacts__add__btn');
        btnShow.classList.add('show_contacts');
        btnShow.innerHTML = 'Cancel';
        btnFormAdd.append(btnAdd, btnShow);

        addForm.append(itemName,itemLastName, itemEmail, itemAddress, itemPhone, btnFormAdd);
        
        btnAdd.addEventListener('click', () => {

            let regExp  = /^\D[a-zA-Z0-9_-]{2,}@[\w-]{2,11}\.[\w]{2,11}$/gi;
            if (regExp.test(this.#inputEmail.value) == true || this.#inputEmail.value == '') {
                this.onAdd();
                listContacts.style.display = 'block';
                addForm.style.display = 'none';
                let elemPopUp = document.querySelector('.popup__incorrect');
                if (elemPopUp) elemPopUp.remove();
            } else {
                this.popupIncorrectEmail();
            }
        });

        btnShow.addEventListener('click', () => {
            listContacts.style.display = 'block';
            addForm.style.display = 'none';

            this.#inputName.value  = '';
            this.#inputLastName.value  = '';
            this.#inputEmail.value  = '';
            this.#inputAddress.value  = '';
            this.#inputPhone.value  = '';

            let contactElemFull = document.querySelector('.contact__full');
            if (contactElemFull) contactElemFull.removeAttribute('style'); 

            let elemPopUp = document.querySelector('.popup__incorrect');
            if (elemPopUp) elemPopUp.remove();
        });

        btnNewAdd.addEventListener('click', () =>{
            listContacts.style.display = 'none';
            addForm.style.display = 'block';
        });
        this.update();
    };
};

window.addEventListener('load', () => {

    new ContactsApp('root');
});